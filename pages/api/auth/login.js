import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  const dbPath = path.join(process.cwd(), 'data', 'db.json');
  
  // Créer le fichier s'il n'existe pas
  if (!fs.existsSync(dbPath)) {
    const dirPath = path.dirname(dbPath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    // Créer des utilisateurs de test
    const initialData = {
      users: [
        {
          id: 'client-test-1',
          name: 'Client Test',
          email: 'client@test.com',
          password: 'test123',
          role: 'client',
          createdAt: new Date().toISOString()
        },
        {
          id: 'pro-test-1',
          name: 'Pro Test',
          email: 'pro@test.com',
          password: 'test123',
          role: 'professional',
          createdAt: new Date().toISOString()
        }
      ],
      professionals: [],
      requests: [],
      quotes: [],
      reviews: [],
      notifications: [],
      messages: []
    };
    
    fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
  }

  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

  // Chercher l'utilisateur
  const user = db.users?.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
  }

  // Retourner l'utilisateur (sans le mot de passe)
  const { password: _, ...userWithoutPassword } = user;

  return res.status(200).json({
    success: true,
    user: userWithoutPassword
  });
}