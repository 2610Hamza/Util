import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

/**
 * API route pour l'inscription des utilisateurs.
 * Accepte POST : { name, email, password, role, category?, location?, description? }
 *
 * Sécurité:
 * - Validation des données
 * - Hachage sécurisé du mot de passe avec bcrypt
 * - Vérification de l'unicité de l'email
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { name, email, password, role, category, location, description } = req.body;

  // Validation des champs obligatoires
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Champs manquants' });
  }

  // Validation du format email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Format d\'email invalide' });
  }

  // Validation de la longueur du mot de passe
  if (password.length < 8) {
    return res.status(400).json({
      error: 'Le mot de passe doit contenir au moins 8 caractères'
    });
  }

  // Validation du rôle
  if (!['client', 'professional'].includes(role)) {
    return res.status(400).json({ error: 'Rôle invalide' });
  }

  try {
    const dbPath = path.join(process.cwd(), 'data', 'db.json');

    // Créer le répertoire et le fichier si nécessaire
    const dirPath = path.dirname(dbPath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, JSON.stringify({
        users: [],
        professionals: [],
        requests: [],
        quotes: [],
        reviews: [],
        notifications: [],
        messages: []
      }, null, 2));
    }

    const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

    // Vérifier si l'email existe déjà
    const exists = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return res.status(400).json({ error: 'Un compte avec cet email existe déjà' });
    }

    // Hacher le mot de passe avec bcrypt (10 rounds de salage)
    const hashedPassword = await bcrypt.hash(password, 10);

    const id = Date.now().toString();
    const user = {
      id,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      createdAt: new Date().toISOString(),
      verified: false,
      active: true
    };

    // Ajouter les champs spécifiques pour les professionnels
    if (role === 'professional') {
      user.category = category || '';
      user.location = location || '';
      user.description = description || '';
      user.rating = 0;
      user.reviewCount = 0;
    }

    db.users.push(user);
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    // Retourner l'utilisateur sans le mot de passe
    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json({
      success: true,
      message: 'Compte créé avec succès',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    return res.status(500).json({
      error: 'Erreur serveur lors de la création du compte'
    });
  }
}
