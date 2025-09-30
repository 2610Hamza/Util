// pages/api/ai/match.js
import { supabaseAdmin } from '../../../lib/supabaseAdmin';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// simple cosine similarity
function cosine(a, b) {
  const len = Math.min(a.length, b.length);
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}

async function embed(text) {
  const { data } = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text.slice(0, 8000)
  });
  return data[0].embedding;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OPENAI_API_KEY manquante dans Vercel' });
  }

  try {
    const { query = '', city = '', category = '' } = req.body || {};

    // 1) Embedding de la demande utilisateur
    const userText = [query, city, category].filter(Boolean).join(' • ');
    const userVec = await embed(userText);

    // 2) Récupère les pros (ils doivent avoir une colonne 'embedding' vectorielle stockée en JSON)
    const { data: pros, error } = await supabaseAdmin
      .from('professionals')
      .select('id, name, city, categories, bio, embedding');

    if (error) throw error;

    // 3) Score via cosine + un léger bonus sur la ville/catégorie
    const scored = (pros || []).map(p => {
      let score = 0;
      if (Array.isArray(p.embedding) && p.embedding.length) {
        score = cosine(userVec, p.embedding);
      } else {
        // fallback sans embedding : petit score si mots‑clés matchent
        const tx = [p.bio, p.name, (p.categories || []).join(' ')].join(' ').toLowerCase();
        const qx = userText.toLowerCase();
        score = tx.includes(qx) ? 0.35 : 0.0;
      }
      if (city && (p.city || '').toLowerCase().includes(city.toLowerCase())) score += 0.05;
      if (category && JSON.stringify(p.categories || []).toLowerCase().includes(category.toLowerCase())) score += 0.05;
      return { ...p, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return res.json({ ok: true, matches: scored.slice(0, 20) });
  } catch (e) {
    console.error('AI match error:', e);
    return res.status(500).json({ error: 'Erreur interne', details: String(e.message || e) });
  }
}
