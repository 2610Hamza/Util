import fs from 'fs';
import path from 'path';

/**
 * API route pour les devis (quotes).
 * GET: /api/quotes?requestId=... renvoie les devis pour une demande.
 * POST: créer un devis.
 */
export default function handler(req, res) {
  const dbPath = path.join(process.cwd(), 'data', 'db.json');
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  if (req.method === 'GET') {
    const { requestId } = req.query;
    let quotes = db.quotes;
    if (requestId) {
      quotes = quotes.filter((q) => q.requestId === requestId);
    }
    return res.status(200).json(quotes);
  }
  if (req.method === 'POST') {
    const { requestId, professionalId, professionalName, price, message } = req.body;
    if (!requestId || !professionalId || !price) {
      return res.status(400).json({ error: 'Champs manquants' });
    }
    const id = Date.now().toString();
    const quote = {
      id,
      requestId,
      professionalId,
      professionalName: professionalName || '',
      price,
      message: message || '',
      createdAt: new Date().toISOString(),
    };
    db.quotes.push(quote);
    // Update request status to indicate at least one quote exists
    const reqIdx = db.requests.findIndex((r) => r.id === requestId);
    if (reqIdx !== -1) {
      db.requests[reqIdx].status = 'quote_received';
    }
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    return res.status(201).json(quote);
  }
  return res.status(405).json({ error: 'Méthode non autorisée' });
}
