// pages/api/ai/match.js
import fs from 'fs';
import path from 'path';
import { haversineKm } from '../../../lib/geo';
import { textSimilarity, tokenize } from '../../../lib/text';

function loadPros() {
  try {
    const p = path.join(process.cwd(), 'data', 'db.json');
    const db = JSON.parse(fs.readFileSync(p, 'utf-8'));
    // On tolère plusieurs structures : db.professionals ou db.pros
    const pros = db.professionals || db.pros || [];
    return pros;
  } catch (e) {
    console.error('Failed to read data/db.json', e);
    return [];
  }
}

function scorePro({ pro, query, qTokens, userLoc, category, budgetMin, budgetMax, radiusKm }) {
  // Champs tolérés
  const name = pro.name || pro.title || '';
  const bio = pro.bio || pro.description || '';
  const tags = (pro.tags || []).join(' ');
  const cats = (pro.categories || pro.category || []).join(' ');
  const priceMin = Number(pro.priceMin ?? pro.minPrice ?? 0);
  const priceMax = Number(pro.priceMax ?? pro.maxPrice ?? 0);
  const rating = Number(pro.rating ?? 0);
  const verified = !!(pro.verified || pro.isVerified);

  // Distances
  const proLoc = { lat: Number(pro.lat || pro.latitude || 0), lng: Number(pro.lng || pro.longitude || 0) };
  const dist = haversineKm(userLoc, proLoc);
  const inRadius = isFinite(dist) && (Number(radiusKm) ? dist <= Number(radiusKm) : true);

  // Text matching : requête vs (name + bio + tags + categories)
  const doc = `${name} ${bio} ${tags} ${cats}`;
  const sim = textSimilarity(query, doc);

  // Cat boost : présence stricte de la catégorie
  const hasCat = category ? tokenize(cats).includes(category.toLowerCase()) : false;
  const catBoost = hasCat ? 0.15 : 0;

  // Price compatibility
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

  // Distance penalty (douce) : 0 => 0 bonus, à 5km −0.05, à 20km −0.2…
  const distPenalty = isFinite(dist) ? -Math.min(dist / 100, 0.3) : -0.3;
  const radiusPenalty = inRadius ? 0 : -0.5;

  // Rating & verification bonus
  const ratingBonus = Math.min(Math.max((rating - 3.5) / 10, 0), 0.15); // note>3.5 bonus max 0.15
  const verifyBonus = verified ? 0.1 : 0;

  // Score final (borné)
  let score =
    0.55 * sim +
    catBoost +
    priceScore +
    distPenalty +
    radiusPenalty +
    ratingBonus +
    verifyBonus;

  score = Math.max(-1, Math.min(1, score));

  return {
    id: pro.id,
    name,
    rating,
    verified,
    priceMin, priceMax,
    distanceKm: isFinite(dist) ? Number(dist.toFixed(1)) : null,
    categories: pro.categories || [],
    city: pro.city || '',
    bio,
    score: Number(score.toFixed(4)),
    // Justifs pour debugging UI
    explain: {
      sim: Number(sim.toFixed(3)),
      catBoost,
      priceScore,
      distPenalty: Number(distPenalty.toFixed(3)),
      radiusPenalty,
      ratingBonus: Number(ratingBonus.toFixed(3)),
      verifyBonus: Number(verifyBonus.toFixed(3)),
    },
  };
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const {
      query = '',
      category = '',
      location = { lat: null, lng: null },
      budgetMin = null,
      budgetMax = null,
      radiusKm = 25,
      limit = 20,
    } = req.body || {};

    const userLoc = {
      lat: Number(location?.lat ?? NaN),
      lng: Number(location?.lng ?? NaN),
    };

    const pros = loadPros();
    if (!pros.length) {
      return res.status(200).json({ items: [], reason: 'EMPTY_DB' });
    }

    const qTokens = tokenize(query);
    const results = pros
      .map((pro) =>
        scorePro({
          pro,
          query,
          qTokens,
          userLoc,
          category,
          budgetMin,
          budgetMax,
          radiusKm,
        })
      )
      .sort((a, b) => b.score - a.score)
      .slice(0, Number(limit));

    return res.status(200).json({ items: results });
  } catch (e) {
    console.error('[ai/match] error', e);
    return res.status(500).json({ error: 'Server error' });
  }
}
