import fs from 'fs';
import path from 'path';

/**
 * API route pour les professionnels.
 * GET: Liste des professionnels ou un professionnel spécifique
 */
export default function handler(req, res) {
  const dbPath = path.join(process.cwd(), 'data', 'db.json');
  
  if (!fs.existsSync(dbPath)) {
    const dirPath = path.dirname(dbPath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(dbPath, JSON.stringify({ 
      users: [
        // Exemples de professionnels pour le développement
        {
          id: 'pro1',
          name: 'Jean Dupont',
          email: 'jean@exemple.com',
          password: 'demo123',
          role: 'professional',
          category: 'plomberie',
          location: 'Paris',
          description: 'Plombier professionnel avec 10 ans d\'expérience. Interventions rapides et soignées.',
          verified: true,
          ratingAvg: 4.8,
          ratingCount: 42
        },
        {
          id: 'pro2',
          name: 'Marie Martin',
          email: 'marie@exemple.com',
          password: 'demo123',
          role: 'professional',
          category: 'electricite',
          location: 'Lyon',
          description: 'Électricienne certifiée, spécialisée en domotique et rénovation.',
          verified: true,
          ratingAvg: 4.9,
          ratingCount: 38
        },
        {
          id: 'pro3',
          name: 'Thomas Bernard',
          email: 'thomas@exemple.com',
          password: 'demo123',
          role: 'professional',
          category: 'informatique',
          location: 'Paris',
          description: 'Expert en dépannage informatique et réseau. Intervention à domicile ou à distance.',
          verified: true,
          ratingAvg: 4.7,
          ratingCount: 55
        }
      ], 
      requests: [], 
      quotes: [] 
    }, null, 2));
  }

  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

  if (req.method === 'GET') {
    const { id, category, location, verified } = req.query;
    
    // Filtrer uniquement les professionnels
    let professionals = db.users.filter((u) => u.role === 'professional');

    // Recherche par ID
    if (id) {
      const pro = professionals.find((p) => p.id === id);
      if (!pro) {
        return res.status(404).json({ error: 'Professionnel introuvable' });
      }
      return res.status(200).json(pro);
    }

    // Filtres
    if (category) {
      const searchTerm = category.toLowerCase();
      professionals = professionals.filter((p) => 
        p.category && p.category.toLowerCase().includes(searchTerm)
      );
    }

    if (location) {
      const searchTerm = location.toLowerCase();
      professionals = professionals.filter((p) => 
        p.location && p.location.toLowerCase().includes(searchTerm)
      );
    }

    if (verified === 'true') {
      professionals = professionals.filter((p) => p.verified === true);
    }

    // Tri par note moyenne (meilleurs en premier)
    professionals.sort((a, b) => {
      const ratingA = a.ratingAvg || 0;
      const ratingB = b.ratingAvg || 0;
      return ratingB - ratingA;
    });

    return res.status(200).json(professionals);
  }

  if (req.method === 'POST') {
    // Créer un nouveau professionnel (depuis signup)
    const { name, email, password, category, location, description } = req.body;

    if (!name || !email || !password || !category) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }

    // Vérifier si l'email existe déjà
    const existingUser = db.users.find((u) => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    const id = Date.now().toString();
    const professional = {
      id,
      name: name.trim(),
      email: email.trim(),
      password, // En production: hasher le mot de passe!
      role: 'professional',
      category: category.trim(),
      location: location?.trim() || '',
      description: description?.trim() || '',
      verified: false,
      ratingAvg: 0,
      ratingCount: 0,
      createdAt: new Date().toISOString(),
    };

    db.users.push(professional);
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    // Ne pas retourner le mot de passe
    const { password: _, ...professionalWithoutPassword } = professional;
    return res.status(201).json(professionalWithoutPassword);
  }

  if (req.method === 'PATCH') {
    // Mettre à jour un professionnel
    const { id, ...updates } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'ID requis' });
    }

    const proIndex = db.users.findIndex((u) => u.id === id && u.role === 'professional');
    
    if (proIndex === -1) {
      return res.status(404).json({ error: 'Professionnel introuvable' });
    }

    // Mettre à jour les champs autorisés
    const allowedFields = ['name', 'category', 'location', 'description', 'verified'];
    
    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        db.users[proIndex][field] = updates[field];
      }
    });

    db.users[proIndex].updatedAt = new Date().toISOString();

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    const { password: _, ...professionalWithoutPassword } = db.users[proIndex];
    return res.status(200).json(professionalWithoutPassword);
  }

  return res.status(405).json({ error: 'Méthode non autorisée' });
}