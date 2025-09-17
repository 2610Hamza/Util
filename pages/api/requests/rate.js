import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  const { requestId, rating, review } = req.body || {};
  if (!requestId || !rating) return res.status(400).json({ error: 'Champs requis' });

  const dbPath = path.join(process.cwd(), 'data', 'db.json');
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

  const r = db.requests.find(x => x.id === requestId);
  if (!r) return res.status(404).json({ error: 'Demande introuvable' });

  r.rating = Number(rating);
  r.review = review || '';

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  res.json({ ok: true });
}
