import { supabase } from '../../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { query, city, budget } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'La recherche est requise' });
  }

  try {
    // Appel à OpenAI pour analyser la demande
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Tu es un assistant qui analyse les demandes de services et extrait :
1. Les catégories de services pertinentes (plombier, electricien, menage, coiffure, informatique, bricolage, etc.)
2. Le niveau d'urgence (urgent, normal, flexible)
3. Les compétences spécifiques recherchées
4. Le type de prestation

Réponds UNIQUEMENT en JSON avec ce format :
{
  "categories": ["categorie1", "categorie2"],
  "urgency": "normal",
  "skills": ["compétence1", "compétence2"],
  "serviceType": "description courte"
}`
          },
          {
            role: 'user',
            content: query
          }
        ],
        temperature: 0.3,
        max_tokens: 300,
      }),
    });

    if (!openaiResponse.ok) {
      throw new Error('Erreur OpenAI : ' + await openaiResponse.text());
    }

    const aiData = await openaiResponse.json();
    const aiAnalysis = JSON.parse(aiData.choices[0].message.content);

    console.log('🤖 Analyse IA:', aiAnalysis);

    // Récupérer les professionnels de Supabase
    let query_db = supabase
      .from('professionals')
      .select('*')
      .eq('verified', true);

    // Filtrer par ville si spécifiée
    if (city) {
      query_db = query_db.ilike('city', `%${city}%`);
    }

    const { data: allPros, error } = await query_db;

    if (error) throw error;

    // Filtrer par catégories identifiées par l'IA
    let matchedPros = allPros.filter(pro => {
      if (!pro.categories || pro.categories.length === 0) return false;
      
      return aiAnalysis.categories.some(aiCat => 
        pro.categories.some(proCat => 
          proCat.toLowerCase().includes(aiCat.toLowerCase()) ||
          aiCat.toLowerCase().includes(proCat.toLowerCase())
        )
      );
    });

    // Filtrer par budget si spécifié
    if (budget) {
      matchedPros = matchedPros.filter(pro => {
        if (!pro.price_min) return true;
        return pro.price_min <= budget;
      });
    }

    // Calculer un score de pertinence pour chaque pro
    matchedPros = matchedPros.map(pro => {
      let score = 0;

      // Score basé sur le rating
      score += (pro.rating || 0) * 20;

      // Score basé sur le nombre d'avis
      score += Math.min(pro.rating_count || 0, 50);

      // Bonus si plusieurs catégories matchent
      const matchingCategories = aiAnalysis.categories.filter(aiCat =>
        pro.categories.some(proCat => 
          proCat.toLowerCase().includes(aiCat.toLowerCase())
        )
      );
      score += matchingCategories.length * 30;

      // Bonus si la bio contient des compétences recherchées
      if (pro.bio && aiAnalysis.skills) {
        aiAnalysis.skills.forEach(skill => {
          if (pro.bio.toLowerCase().includes(skill.toLowerCase())) {
            score += 15;
          }
        });
      }

      return { ...pro, aiScore: score };
    });

    // Trier par score décroissant
    matchedPros.sort((a, b) => b.aiScore - a.aiScore);

    return res.status(200).json({
      success: true,
      analysis: aiAnalysis,
      professionals: matchedPros.slice(0, 20), // Top 20
      total: matchedPros.length,
    });

  } catch (error) {
    console.error('❌ Erreur matching IA:', error);
    return res.status(500).json({ 
      error: 'Erreur lors de l\'analyse IA',
      details: error.message 
    });
  }
}