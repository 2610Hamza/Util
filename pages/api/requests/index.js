import fs from 'fs';
import path from 'path';

/**
 * API route pour les demandes (requests).
 * GET: Liste des demandes filtrées
 * POST: Créer une nouvelle demande
 */
export default function handler(req, res) {
  const dbPath = path.join(process.cwd(), 'data', 'db.json');
  
  // Créer le fichier DB s'il n'existe pas
  if (!fs.existsSync(dbPath)) {
    const dirPath = path.dirname(dbPath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(dbPath, JSON.stringify({ users: [], requests: [], quotes: [] }, null, 2));
  }

  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

  if (req.method === 'GET') {
    const { clientId, professionalId, id } = req.query;
    let requests = db.requests || [];

    // Filtrage
    if (id) {
      const request = requests.find((r) => r.id === id);
      return res.status(request ? 200 : 404).json(request || { error: 'Demande introuvable' });
    }

    if (clientId) {
      requests = requests.filter((r) => r.clientId === clientId);
    }

    if (professionalId) {
      requests = requests.filter((r) => r.professionalId === professionalId);
    }

    // Tri par date (plus récent en premier)
    requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json(requests);
  }

  if (req.method === 'POST') {
    const { title, description, budget, clientId, professionalId } = req.body;

    // Validation
    if (!title || !description || !clientId || !professionalId) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }

    // Vérifier que le client et le pro existent
    const client = db.users.find((u) => u.id === clientId && u.role === 'client');
    const professional = db.users.find((u) => u.id === professionalId && u.role === 'professional');

    if (!client) {
      return res.status(400).json({ error: 'Client invalide' });
    }

    if (!professional) {
      return res.status(400).json({ error: 'Professionnel invalide' });
    }

    // Créer la demande
    const id = Date.now().toString();
    const request = {
      id,
      title: title.trim(),
      description: description.trim(),
      budget: budget ? parseFloat(budget) : null,
      clientId,
      professionalId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.requests.push(request);
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    return res.status(201).json(request);
  }

  if (req.method === 'PATCH') {
    const { id, status, rating, review } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'ID requis' });
    }

    const requestIndex = db.requests.findIndex((r) => r.id === id);
    
    if (requestIndex === -1) {
      return res.status(404).json({ error: 'Demande introuvable' });
    }

    // Mise à jour
    if (status) db.requests[requestIndex].status = status;
    if (rating) db.requests[requestIndex].rating = Number(rating);
    if (review) db.requests[requestIndex].review = review;
    
    db.requests[requestIndex].updatedAt = new Date().toISOString();

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    return res.status(200).json(db.requests[requestIndex]);
  }

  return res.status(405).json({ error: 'Méthode non autorisée' });
}