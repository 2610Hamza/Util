import fs from 'fs';
import path from 'path';

/**
 * API pour les avis (reviews)
 * GET: Récupérer les avis d'un professionnel
 * POST: Créer un nouvel avis
 */
export default function handler(req, res) {
  const dbPath = path.join(process.cwd(), 'data', 'db.json');
  
  if (!fs.existsSync(dbPath)) {
    const dirPath = path.dirname(dbPath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(dbPath, JSON.stringify({ 
      users: [], 
      requests: [], 
      quotes: [],
      reviews: []
    }, null, 2));
  }

  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

  if (req.method === 'GET') {
    const { professionalId, clientId, limit = 50 } = req.query;
    let reviews = db.reviews || [];

    // Filtres
    if (professionalId) {
      reviews = reviews.filter(r => r.professionalId === professionalId);
    }

    if (clientId) {
      reviews = reviews.filter(r => r.clientId === clientId);
    }

    // Tri par date (plus récent en premier)
    reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Limite
    reviews = reviews.slice(0, Number(limit));

    return res.status(200).json(reviews);
  }

  if (req.method === 'POST') {
    const { requestId, clientId, professionalId, rating, comment } = req.body;

    // Validation
    if (!requestId || !clientId || !professionalId || !rating) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'La note doit être entre 1 et 5' });
    }

    // Vérifier que la demande existe et est terminée
    const request = db.requests.find(r => 
      r.id === requestId && 
      r.clientId === clientId && 
      r.professionalId === professionalId
    );

    if (!request) {
      return res.status(404).json({ error: 'Demande introuvable' });
    }

    // Vérifier qu'il n'y a pas déjà un avis pour cette demande
    const existingReview = (db.reviews || []).find(r => r.requestId === requestId);
    if (existingReview) {
      return res.status(400).json({ error: 'Vous avez déjà laissé un avis pour cette demande' });
    }

    // Créer l'avis
    const id = Date.now().toString();
    const review = {
      id,
      requestId,
      clientId,
      professionalId,
      rating: Number(rating),
      comment: comment?.trim() || '',
      createdAt: new Date().toISOString(),
    };

    if (!db.reviews) db.reviews = [];
    db.reviews.push(review);

    // Mettre à jour les statistiques du professionnel
    const proIndex = db.users.findIndex(u => u.id === professionalId);
    if (proIndex !== -1) {
      const proReviews = db.reviews.filter(r => r.professionalId === professionalId);
      const totalRating = proReviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = totalRating / proReviews.length;

      db.users[proIndex].ratingAvg = Number(avgRating.toFixed(1));
      db.users[proIndex].ratingCount = proReviews.length;
    }

    // Marquer la demande comme évaluée
    const requestIndex = db.requests.findIndex(r => r.id === requestId);
    if (requestIndex !== -1) {
      db.requests[requestIndex].reviewed = true;
      db.requests[requestIndex].reviewId = id;
      db.requests[requestIndex].status = 'completed';
      db.requests[requestIndex].updatedAt = new Date().toISOString();
    }

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    return res.status(201).json(review);
  }

  return res.status(405).json({ error: 'Méthode non autorisée' });
}