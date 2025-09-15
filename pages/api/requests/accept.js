import fs from 'fs';
import path from 'path';

/**
 * API route pour accepter un devis.
 * POST: { requestId, quoteId }
 */
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }
  const { requestId, quoteId } = req.body;
  if (!requestId || !quoteId) {
    return res.status(400).json({ error: 'Champs manquants' });
  }
  const dbPath = path.join(process.cwd(), 'data', 'db.json');
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  const request = db.requests.find((r) => r.id === requestId);
  if (!request) {
    return res.status(404).json({ error: 'Demande introuvable' });
  }
  const quote = db.quotes.find((q) => q.id === quoteId && q.requestId === requestId);
  if (!quote) {
    return res.status(404).json({ error: 'Devis introuvable pour cette demande' });
  }
  request.status = 'accepted';
  request.acceptedQuoteId = quoteId;
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  return res.status(200).json({ request });
}
