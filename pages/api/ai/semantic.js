// pages/api/ai/semantic.js
import { textSimilarity } from '../../../lib/text';
import { haversineKm } from '../../../lib/geo';

function loadPros() {
  try {
    const fs = require('fs');
    const path = require('path');
    const p = path.join(process.cwd(), 'data', 'db.json');
    if (!fs.existsSync(p)) return [];
    const db = JSON.parse(fs.readFileSync(p, 'utf-8'));
    return db.professionals || db.pros || [];
  } catch (e) {
    console.error('[semantic] read db error', e);
    return [];
  }
}

function proDoc(pro) {
  const name = pro.name || pro.title || '';
  const cats = Array.isArray(pro.categories) ? pro.categories.join(', ') : (pro.category || '');
  const tags = Array.isArray(pro.tags) ? pro.tags.join(', ') : '';
  const city = pro.city || '';
  const price = `${pro.priceMin ?? pro.minPrice ?? ''} - ${pro.priceMax ?? pro.maxPrice ?? ''}`;
  const rating = pro.rating ?? '';
  const bio = pro.bio || pro.description || '';
  return `Nom: ${name}\nCatégories: ${cats}\nTags: ${tags}\nVille: ${city}\nTarifs: ${price}\nNote: ${rating}\nBio: ${bio}`.trim();
}

async function embedTexts(texts) {
  const { default: OpenAI } = await import('openai');
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const res = await client.embeddings.create({
    model: 'text-embedding-3-small',
    input: texts,
  });
  return res.data.map(d => d.embedding);
}

// cosine entre 2 vecteurs
function dotSim(a=[], b=[]) {
  let s = 0, na = 0, nb = 0;
  for (let i=0; i<a.length; i++) {
    const x = a[i] || 0, y = b[i] || 0;
    s += x*y; na += x*x; nb += y*y;
  }
  const denom = Math.sqrt(na)*Math.sqrt(nb) || 1;
  return s/denom;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const {
      query = '',
      category = '',
      location = { lat: null, lng: null },
      budgetMin = null,
      budgetMax = null,
      radiusKm = 25,
      limit = 20,
    } = req.body || {};

    const userLoc = { lat: Number(location?.lat ?? NaN), lng: Number(location?.lng ?? NaN) };
    const pros = loadPros();
    if (!pros.length) return res.status(200).json({ items: [], reason: 'EMPTY_DB' });

    // Texte par pro
    const docs = pros.map(p => proDoc(p));
    // Embedding de la requête + des pros
    const [qEmb, ...pEmb] = await embedTexts([query, ...docs]);

    // Scoring (embed + signaux pratiques)
    const results = pros.map((pro, i) => {
      const name = pro.name || pro.title || '';
      const bio = pro.bio || pro.description || '';
      const tags = pro.tags || [];
      const cats = pro.categories || pro.category || [];
      const rating = Number(pro.rating ?? 0);
      const verified = !!(pro.verified || pro.isVerified);
      const priceMin = Number(pro.priceMin ?? pro.minPrice ?? 0);
      const priceMax = Number(pro.priceMax ?? pro.maxPrice ?? 0);
      const proLoc = { lat: Number(pro.lat ?? pro.latitude ?? NaN), lng: Number(pro.lng ?? pro.longitude ?? NaN) };
      const dist = haversineKm(userLoc, proLoc);
      const inRadius = isFinite(dist) && (Number(radiusKm) ? dist <= Number(radiusKm) : true);

      const sim = dotSim(qEmb, pEmb[i]);                       // 0..1
      const hasCat = category ? String(cats).toLowerCase().includes(String(category).toLowerCase()) : false;
      const catBoost = hasCat ? 0.15 : 0;

      let priceScore = 0.0;
      if (budgetMin || budgetMax) {
        const bm = Number(budgetMin || 0);
        const bM = Number(budgetMax || Infinity);
        const within =
          (priceMin >= bm && priceMin <= bM) ||
          (priceMax >= bm && priceMax <= bM) ||
          (bm >= priceMin && bm <= priceMax);
        priceScore = within ? 0.10 : -0.10;
      }

      const distPenalty = isFinite(dist) ? -Math.min(dist / 100, 0.3) : -0.3;
      const radiusPenalty = inRadius ? 0 : -0.5;
      const ratingBonus = Math.min(Math.max((rating - 3.5) / 10, 0), 0.15);
      const verifyBonus = verified ? 0.1 : 0;

      let score = 0.65*sim + catBoost + priceScore + distPenalty + radiusPenalty + ratingBonus + verifyBonus;
      score = Math.max(-1, Math.min(1, score));

      return {
        id: pro.id, name, bio, tags, categories: pro.categories || [],
        city: pro.city || '', rating, verified, priceMin, priceMax,
        distanceKm: isFinite(dist) ? Number(dist.toFixed(1)) : null,
        score: Number(score.toFixed(4)),
        explain: { sim: Number(sim.toFixed(3)), catBoost, priceScore,
          distPenalty: Number(distPenalty.toFixed(3)), radiusPenalty,
          ratingBonus: Number(ratingBonus.toFixed(3)), verifyBonus: Number(verifyBonus.toFixed(3)) }
      };
    })
    .sort((a,b)=> b.score - a.score)
    .slice(0, Number(limit));

    return res.status(200).json({ items: results });
  } catch (e) {
    console.error('[semantic] error', e);
    return res.status(500).json({ error: 'Server error' });
  }
}
