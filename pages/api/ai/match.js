 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/pages/api/ai/match.js b/pages/api/ai/match.js
index b5d39382d8dc7401811e251a295d4c85886ba0b4..a7cf58452abdcb5b6940a08388d64356a9a7467d 100644
--- a/pages/api/ai/match.js
+++ b/pages/api/ai/match.js
@@ -5,85 +5,86 @@ import { textSimilarity, tokenize } from '../../../lib/text';
 function loadPros() {
   try {
     const fs = require('fs');
     const path = require('path');
     const p = path.join(process.cwd(), 'data', 'db.json');
     if (!fs.existsSync(p)) return [];
     const db = JSON.parse(fs.readFileSync(p, 'utf-8'));
     return db.professionals || db.pros || [];
   } catch (e) {
     console.error('Failed to read data/db.json', e);
     return [];
   }
 }
 
 function scorePro({ pro, query, userLoc, category, budgetMin, budgetMax, radiusKm }) {
   const name = pro.name || pro.title || '';
   const bio = pro.bio || pro.description || '';
   const tags = Array.isArray(pro.tags) ? pro.tags.join(' ') : '';
   const cats = Array.isArray(pro.categories) ? pro.categories.join(' ') : (pro.category || '');
   const priceMin = Number(pro.priceMin ?? pro.minPrice ?? 0);
   const priceMax = Number(pro.priceMax ?? pro.maxPrice ?? 0);
   const rating = Number(pro.rating ?? 0);
   const verified = !!(pro.verified || pro.isVerified);
 
   const proLoc = { lat: Number(pro.lat ?? pro.latitude ?? NaN), lng: Number(pro.lng ?? pro.longitude ?? NaN) };
-  const dist = haversineKm(userLoc, proLoc);
-  const inRadius = isFinite(dist) && (Number(radiusKm) ? dist <= Number(radiusKm) : true);
+  const hasUserLoc = Number.isFinite(userLoc?.lat) && Number.isFinite(userLoc?.lng);
+  const dist = hasUserLoc ? haversineKm(userLoc, proLoc) : Infinity;
+  const inRadius = hasUserLoc && isFinite(dist) && (Number(radiusKm) ? dist <= Number(radiusKm) : true);
 
   const doc = `${name} ${bio} ${tags} ${cats}`;
   const sim = textSimilarity(query, doc);
 
   const hasCat = category ? tokenize(cats).includes(String(category).toLowerCase()) : false;
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
 
-  const distPenalty = isFinite(dist) ? -Math.min(dist / 100, 0.3) : -0.3;
-  const radiusPenalty = inRadius ? 0 : -0.5;
+  const distPenalty = hasUserLoc && isFinite(dist) ? -Math.min(dist / 100, 0.3) : 0;
+  const radiusPenalty = hasUserLoc ? (inRadius ? 0 : -0.5) : 0;
   const ratingBonus = Math.min(Math.max((rating - 3.5) / 10, 0), 0.15);
   const verifyBonus = verified ? 0.1 : 0;
 
   let score = 0.55 * sim + catBoost + priceScore + distPenalty + radiusPenalty + ratingBonus + verifyBonus;
   score = Math.max(-1, Math.min(1, score));
 
   return {
     id: pro.id,
     name,
     rating,
     verified,
     priceMin, priceMax,
-    distanceKm: isFinite(dist) ? Number(dist.toFixed(1)) : null,
+    distanceKm: hasUserLoc && isFinite(dist) ? Number(dist.toFixed(1)) : null,
     categories: pro.categories || [],
     city: pro.city || '',
     bio,
     score: Number(score.toFixed(4)),
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
     const body = req.body || {};
     const query = String(body.query || '');
     const category = body.category || '';
     const location = body.location || {};
 
EOF
)