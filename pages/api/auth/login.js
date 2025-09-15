import fs from 'fs';
import path from 'path';

/**
 * API route pour la connexion.
 * POST : { email, password }
 */
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Champs manquants' });
  }
  const dbPath = path.join(process.cwd(), 'data', 'db.json');
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  const user = db.users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
  }
  return res.status(200).json({ user });
}
