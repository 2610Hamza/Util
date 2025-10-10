import fs from 'fs';
import path from 'path';

/**
 * API route pour les devis (quotes).
 * GET: Liste des devis filtrés
 * POST: Créer un nouveau devis
 */
export default function handler(req, res) {
  const dbPath = path.join(process.cwd(), 'data', 'db.json');
  
  if (!fs.existsSync(dbPath)) {
    const dirPath = path.dirname(dbPath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(dbPath, JSON.stringify({ users: [], requests: [], quotes: [] }, null, 2));
  }

  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

  if (req.method === 'GET') {
    const { requestId, professionalId, id } = req.query;
    let quotes = db.quotes || [];

    // Filtrage
    if (id) {
      const quote = quotes.find((q) => q.id === id);
      return res.status(quote ? 200 : 404).json(quote || { error: 'Devis introuvable' });
    }

    if (requestId) {
      quotes = quotes.filter((q) => q.requestId === requestId);
    }

    if (professionalId) {
      quotes = quotes.filter((q) => q.professionalId === professionalId);
    }

    // Tri par date (plus récent en premier)
    quotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json(quotes);
  }

  if (req.method === 'POST') {
    const { requestId, professionalId, professionalName, price, message } = req.body;

    // Validation
    if (!requestId || !professionalId || !price) {
      return res.status(400).json({ error: 'Champs requis manquants (requestId, professionalId, price)' });
    }

    // Vérifier que la demande existe
    const request = db.requests.find((r) => r.id === requestId);
    if (!request) {
      return res.status(404).json({ error: 'Demande introuvable' });
    }

    // Vérifier que le pro est bien celui de la demande
    if (request.professionalId !== professionalId) {
      return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à envoyer un devis pour cette demande' });
    }

    // Vérifier qu'il n'y a pas déjà un devis du même pro
    const existingQuote = db.quotes.find(
      (q) => q.requestId === requestId && q.professionalId === professionalId
    );

    if (existingQuote) {
      return res.status(400).json({ error: 'Vous avez déjà envoyé un devis pour cette demande' });
    }

    // Créer le devis
    const id = Date.now().toString();
    const quote = {
      id,
      requestId,
      professionalId,
      professionalName: professionalName || 'Professionnel',
      price: parseFloat(price),
      message: message?.trim() || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    db.quotes.push(quote);

    // Mettre à jour le statut de la demande
    const requestIndex = db.requests.findIndex((r) => r.id === requestId);
    if (requestIndex !== -1) {
      db.requests[requestIndex].status = 'quote_received';
      db.requests[requestIndex].updatedAt = new Date().toISOString();
    }

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    return res.status(201).json(quote);
  }

  return res.status(405).json({ error: 'Méthode non autorisée' });
}