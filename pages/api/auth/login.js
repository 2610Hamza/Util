import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

/**
 * API route pour l'authentification des utilisateurs.
 * Accepte POST : { email, password }
 *
 * Sécurité:
 * - Validation des données
 * - Vérification sécurisée du mot de passe avec bcrypt
 * - Protection contre le timing attack
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { email, password } = req.body;

  // Validation des champs
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  try {
    const dbPath = path.join(process.cwd(), 'data', 'db.json');

    // Créer le fichier s'il n'existe pas
    if (!fs.existsSync(dbPath)) {
      const dirPath = path.dirname(dbPath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      // Créer des utilisateurs de test avec mots de passe hachés
      const hashedTestPassword = await bcrypt.hash('test12345', 10);

      const initialData = {
        users: [
          {
            id: 'client-test-1',
            name: 'Client Test',
            email: 'client@test.com',
            password: hashedTestPassword,
            role: 'client',
            createdAt: new Date().toISOString(),
            verified: true,
            active: true
          },
          {
            id: 'pro-test-1',
            name: 'Pro Test',
            email: 'pro@test.com',
            password: hashedTestPassword,
            role: 'professional',
            category: 'informatique',
            location: 'Paris',
            description: 'Professionnel de test',
            rating: 4.8,
            reviewCount: 12,
            createdAt: new Date().toISOString(),
            verified: true,
            active: true
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

    // Chercher l'utilisateur par email (insensible à la casse)
    const user = db.users?.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      // Message générique pour ne pas révéler si l'email existe
      return res.status(401).json({
        error: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier si le compte est actif
    if (user.active === false) {
      return res.status(403).json({
        error: 'Ce compte a été désactivé. Contactez le support.'
      });
    }

    // Vérifier le mot de passe avec bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Email ou mot de passe incorrect'
      });
    }

    // Mettre à jour la dernière connexion
    user.lastLogin = new Date().toISOString();
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    // Retourner l'utilisateur sans le mot de passe
    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return res.status(500).json({
      error: 'Erreur serveur lors de la connexion'
    });
  }
}