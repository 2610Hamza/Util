import fs from 'fs';
import path from 'path';

/**
 * API route pour les demandes (requests).
 * GET: /api/requests?clientId=... ou ?professionalId=...
 * POST: créer une nouvelle demande.
 */
export default function handler(req, res) {
  const dbPath = path.join(process.cwd(), 'data', 'db.json');
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  if (req.method === 'GET') {
    const { clientId, professionalId } = req.query;
    let requests = db.requests;
    if (clientId) {
      requests = requests.filter((r) => r.clientId === clientId);
    }
    if (professionalId) {
      requests = requests.filter((r) => r.professionalId === professionalId);
    }
    return res.status(200).json(requests);
  }
  if (req.method === 'POST') {
    const { title, description, budget, clientId, professionalId } = req.body;
    if (!title || !description || !clientId || !professionalId) {
      return res.status(400).json({ error: 'Champs manquants' });
    }
    const id = Date.now().toString();
    const request = {
      id,
      title,
      description,
      budget: budget || null,
      clientId,
      professionalId,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    db.requests.push(request);
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    return res.status(201).json(request);
  }
  return res.status(405).json({ error: 'Méthode non autorisée' });
}
