import fs from 'fs';
import path from 'path';

/**
 * API pour les notifications
 * GET: Récupérer les notifications d'un utilisateur
 * POST: Créer une notification
 * PATCH: Marquer comme lu
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
      reviews: [],
      notifications: []
    }, null, 2));
  }

  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

  if (req.method === 'GET') {
    const { userId, unreadOnly = 'false' } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId requis' });
    }

    let notifications = db.notifications || [];

    // Filtrer par utilisateur
    notifications = notifications.filter(n => n.userId === userId);

    // Filtrer par statut
    if (unreadOnly === 'true') {
      notifications = notifications.filter(n => !n.read);
    }

    // Tri par date (plus récent en premier)
    notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json(notifications);
  }

  if (req.method === 'POST') {
    const { userId, type, title, message, link } = req.body;

    if (!userId || !type || !title || !message) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }

    const id = Date.now().toString();
    const notification = {
      id,
      userId,
      type, // 'new_quote', 'request_accepted', 'payment_received', 'new_review', etc.
      title,
      message,
      link: link || null,
      read: false,
      createdAt: new Date().toISOString(),
    };

    if (!db.notifications) db.notifications = [];
    db.notifications.push(notification);

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    return res.status(201).json(notification);
  }

  if (req.method === 'PATCH') {
    const { id, userId, markAllAsRead } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId requis' });
    }

    if (markAllAsRead) {
      // Marquer toutes les notifications de l'utilisateur comme lues
      db.notifications = (db.notifications || []).map(n => {
        if (n.userId === userId) {
          n.read = true;
        }
        return n;
      });

      fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

      return res.status(200).json({ message: 'Toutes les notifications marquées comme lues' });
    }

    if (!id) {
      return res.status(400).json({ error: 'id ou markAllAsRead requis' });
    }

    // Marquer une notification spécifique comme lue
    const notifIndex = (db.notifications || []).findIndex(n => n.id === id && n.userId === userId);

    if (notifIndex === -1) {
      return res.status(404).json({ error: 'Notification introuvable' });
    }

    db.notifications[notifIndex].read = true;

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    return res.status(200).json(db.notifications[notifIndex]);
  }

  return res.status(405).json({ error: 'Méthode non autorisée' });
}

/**
 * Fonction helper pour créer des notifications automatiquement
 */
export function createNotification(db, userId, type, title, message, link = null) {
  const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
  const notification = {
    id,
    userId,
    type,
    title,
    message,
    link,
    read: false,
    createdAt: new Date().toISOString(),
  };

  if (!db.notifications) db.notifications = [];
  db.notifications.push(notification);

  return notification;
}