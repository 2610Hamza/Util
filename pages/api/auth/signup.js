import fs from 'fs';
import path from 'path';

/**
 * API route pour l'inscription des utilisateurs.
 * Accepte POST : { name, email, password, role, category?, location?, description? }
 */
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }
  const { name, email, password, role, category, location, description } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Champs manquants' });
  }
  const dbPath = path.join(process.cwd(), 'data', 'db.json');
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  const exists = db.users.find((u) => u.email === email);
  if (exists) {
    return res.status(400).json({ error: 'Un compte avec cet email existe déjà' });
  }
  const id = Date.now().toString();
  const user = { id, name, email, password, role };
  if (role === 'professional') {
    user.category = category || '';
    user.location = location || '';
    user.description = description || '';
  }
  db.users.push(user);
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  return res.status(201).json({ user });
}
