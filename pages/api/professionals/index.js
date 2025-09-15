import fs from 'fs';
import path from 'path';

/**
 * API route pour récupérer ou créer des professionnels.
 * GET: liste des professionnels, option id pour un seul
 */
export default function handler(req, res) {
  const dbPath = path.join(process.cwd(), 'data', 'db.json');
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  if (req.method === 'GET') {
    const { id } = req.query;
    const pros = db.users.filter((u) => u.role === 'professional');
    if (id) {
      const pro = pros.find((p) => p.id === id);
      if (!pro) return res.status(404).json({ error: 'Professionnel introuvable' });
      return res.status(200).json(pro);
    }
    return res.status(200).json(pros);
  }
  return res.status(405).json({ error: 'Méthode non autorisée' });
}
