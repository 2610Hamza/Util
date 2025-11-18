/**
 * Bibliothèque de validation pour l'application Util
 * Fournit des fonctions de validation réutilisables pour sécuriser toutes les entrées
 */

/**
 * Valide un email
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email requis' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { valid: false, error: 'Format d\'email invalide' };
  }

  return { valid: true };
}

/**
 * Valide un mot de passe
 */
export function validatePassword(password, minLength = 8) {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Mot de passe requis' };
  }

  if (password.length < minLength) {
    return {
      valid: false,
      error: `Le mot de passe doit contenir au moins ${minLength} caractères`
    };
  }

  // Optionnel: vérifier la complexité du mot de passe
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumber) {
    return {
      valid: false,
      error: 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'
    };
  }

  return { valid: true };
}

/**
 * Valide un nom (prénom ou nom de famille)
 */
export function validateName(name, fieldName = 'Nom') {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: `${fieldName} requis` };
  }

  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return {
      valid: false,
      error: `${fieldName} doit contenir au moins 2 caractères`
    };
  }

  if (trimmed.length > 50) {
    return {
      valid: false,
      error: `${fieldName} ne peut pas dépasser 50 caractères`
    };
  }

  // Autoriser seulement lettres, espaces, tirets et apostrophes
  const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
  if (!nameRegex.test(trimmed)) {
    return {
      valid: false,
      error: `${fieldName} contient des caractères invalides`
    };
  }

  return { valid: true };
}

/**
 * Valide un numéro de téléphone français
 */
export function validatePhone(phone) {
  if (!phone || typeof phone !== 'string') {
    return { valid: false, error: 'Numéro de téléphone requis' };
  }

  // Supprimer tous les espaces et caractères spéciaux
  const cleaned = phone.replace(/[\s\-\.\(\)]/g, '');

  // Vérifier le format français: 0XXXXXXXXX ou +33XXXXXXXXX
  const phoneRegex = /^(?:(?:\+|00)33|0)[1-9](?:\d{8})$/;
  if (!phoneRegex.test(cleaned)) {
    return {
      valid: false,
      error: 'Numéro de téléphone invalide (format attendu: 06 12 34 56 78)'
    };
  }

  return { valid: true };
}

/**
 * Valide un montant (prix, budget, etc.)
 */
export function validateAmount(amount, min = 0, max = 1000000) {
  const num = parseFloat(amount);

  if (isNaN(num)) {
    return { valid: false, error: 'Montant invalide' };
  }

  if (num < min) {
    return {
      valid: false,
      error: `Le montant doit être supérieur ou égal à ${min}€`
    };
  }

  if (num > max) {
    return {
      valid: false,
      error: `Le montant ne peut pas dépasser ${max}€`
    };
  }

  return { valid: true };
}

/**
 * Valide un texte (description, message, etc.)
 */
export function validateText(text, minLength = 10, maxLength = 5000, fieldName = 'Texte') {
  if (!text || typeof text !== 'string') {
    return { valid: false, error: `${fieldName} requis` };
  }

  const trimmed = text.trim();

  if (trimmed.length < minLength) {
    return {
      valid: false,
      error: `${fieldName} doit contenir au moins ${minLength} caractères`
    };
  }

  if (trimmed.length > maxLength) {
    return {
      valid: false,
      error: `${fieldName} ne peut pas dépasser ${maxLength} caractères`
    };
  }

  return { valid: true };
}

/**
 * Valide une catégorie de service
 */
export function validateCategory(category) {
  const validCategories = [
    'plomberie',
    'electricite',
    'informatique',
    'coiffure',
    'menage',
    'coaching',
    'sante',
    'jardinage'
  ];

  if (!category || typeof category !== 'string') {
    return { valid: false, error: 'Catégorie requise' };
  }

  if (!validCategories.includes(category.toLowerCase())) {
    return {
      valid: false,
      error: 'Catégorie invalide'
    };
  }

  return { valid: true };
}

/**
 * Valide un rôle utilisateur
 */
export function validateRole(role) {
  const validRoles = ['client', 'professional', 'admin'];

  if (!role || typeof role !== 'string') {
    return { valid: false, error: 'Rôle requis' };
  }

  if (!validRoles.includes(role.toLowerCase())) {
    return { valid: false, error: 'Rôle invalide' };
  }

  return { valid: true };
}

/**
 * Valide une ville
 */
export function validateCity(city) {
  if (!city || typeof city !== 'string') {
    return { valid: false, error: 'Ville requise' };
  }

  const trimmed = city.trim();
  if (trimmed.length < 2) {
    return {
      valid: false,
      error: 'Nom de ville invalide'
    };
  }

  if (trimmed.length > 100) {
    return {
      valid: false,
      error: 'Nom de ville trop long'
    };
  }

  return { valid: true };
}

/**
 * Valide un code postal français
 */
export function validatePostalCode(postalCode) {
  if (!postalCode || typeof postalCode !== 'string') {
    return { valid: false, error: 'Code postal requis' };
  }

  const postalRegex = /^[0-9]{5}$/;
  if (!postalRegex.test(postalCode.trim())) {
    return {
      valid: false,
      error: 'Code postal invalide (5 chiffres attendus)'
    };
  }

  return { valid: true };
}

/**
 * Valide un SIRET
 */
export function validateSIRET(siret) {
  if (!siret || typeof siret !== 'string') {
    return { valid: false, error: 'SIRET requis' };
  }

  const cleaned = siret.replace(/\s/g, '');

  if (!/^\d{14}$/.test(cleaned)) {
    return {
      valid: false,
      error: 'SIRET invalide (14 chiffres attendus)'
    };
  }

  // Algorithme de Luhn pour valider le SIRET
  let sum = 0;
  for (let i = 0; i < 14; i++) {
    let digit = parseInt(cleaned.charAt(i));
    if (i % 2 === 0) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }

  if (sum % 10 !== 0) {
    return {
      valid: false,
      error: 'SIRET invalide'
    };
  }

  return { valid: true };
}

/**
 * Valide un SIREN
 */
export function validateSIREN(siren) {
  if (!siren || typeof siren !== 'string') {
    return { valid: false, error: 'SIREN requis' };
  }

  const cleaned = siren.replace(/\s/g, '');

  if (!/^\d{9}$/.test(cleaned)) {
    return {
      valid: false,
      error: 'SIREN invalide (9 chiffres attendus)'
    };
  }

  // Algorithme de Luhn pour valider le SIREN
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let digit = parseInt(cleaned.charAt(i));
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }

  if (sum % 10 !== 0) {
    return {
      valid: false,
      error: 'SIREN invalide'
    };
  }

  return { valid: true };
}

/**
 * Valide une URL
 */
export function validateURL(url) {
  if (!url || typeof url !== 'string') {
    return { valid: false, error: 'URL requise' };
  }

  try {
    new URL(url);
    return { valid: true };
  } catch (e) {
    return { valid: false, error: 'URL invalide' };
  }
}

/**
 * Valide un ID (doit être une chaîne non vide)
 */
export function validateID(id, fieldName = 'ID') {
  if (!id || typeof id !== 'string') {
    return { valid: false, error: `${fieldName} requis` };
  }

  if (id.trim().length === 0) {
    return { valid: false, error: `${fieldName} invalide` };
  }

  return { valid: true };
}

/**
 * Sanitize une chaîne de caractères (protection XSS basique)
 */
export function sanitizeString(str) {
  if (typeof str !== 'string') return str;

  return str
    .replace(/[<>]/g, '') // Supprimer les balises HTML
    .trim();
}

/**
 * Valide un objet avec plusieurs champs
 * Usage: validateFields(data, { email: validateEmail, name: validateName })
 */
export function validateFields(data, validators) {
  const errors = {};

  for (const [field, validator] of Object.entries(validators)) {
    const result = validator(data[field]);
    if (!result.valid) {
      errors[field] = result.error;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Middleware de validation pour les routes API Next.js
 */
export function createValidator(schema) {
  return (handler) => async (req, res) => {
    const validation = validateFields(req.body, schema);

    if (!validation.valid) {
      return res.status(400).json({
        error: 'Données invalides',
        details: validation.errors
      });
    }

    return handler(req, res);
  };
}
