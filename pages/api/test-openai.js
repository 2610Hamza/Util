export default async function handler(req, res) {
  // Vérifier si la clé existe
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ 
      error: 'Clé OpenAI manquante',
      solution: 'Ajoutez OPENAI_API_KEY dans Vercel'
    });
  }

  try {
    // Tester OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'user', content: 'Réponds juste "OK"' }
        ],
        max_tokens: 10,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ 
        error: 'OpenAI ne répond pas',
        details: data
      });
    }

    return res.status(200).json({ 
      success: true,
      message: 'OpenAI fonctionne !',
      reponse: data.choices[0].message.content
    });

  } catch (error) {
    return res.status(500).json({ 
      error: error.message 
    });
  }
}