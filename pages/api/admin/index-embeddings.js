// pages/api/admin/index-embeddings.js
import { supabaseAdmin } from '../../../lib/supabaseAdmin';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function embed(text) {
  const { data } = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text.slice(0, 8000)
  });
  return data[0].embedding;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  const auth = req.headers.authorization || '';
  const ok = auth === `Bearer ${process.env.ADMIN_SECRET}`;
  if (!ok) return res.status(401).json({ error: 'Unauthorized' });

  try {
    // Récupère les pros sans embedding
    const { data: pros, error } = await supabaseAdmin
      .from('professionals')
      .select('id, name, city, categories, bio, embedding')
      .is('embedding', null)
      .limit(200);
    if (error) throw error;

    let updated = 0;
    for (const p of pros || []) {
      const text = [p.name, p.city, (p.categories || []).join(' '), p.bio].filter(Boolean).join(' • ');
      const vec = await embed(text);
      const { error: upErr } = await supabaseAdmin
        .from('professionals')
        .update({ embedding: vec })
        .eq('id', p.id);
      if (upErr) throw upErr;
      updated++;
    }
    return res.json({ ok: true, updated });
  } catch (e) {
    console.error('index-embeddings error:', e);
    return res.status(500).json({ error: 'internal_error', details: String(e.message || e) });
  }
}
