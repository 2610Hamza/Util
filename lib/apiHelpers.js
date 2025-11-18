/**
 * Helpers pour les API routes Next.js
 * Standardise les réponses et la gestion des erreurs
 */

/**
 * Réponse de succès standardisée
 */
export function successResponse(res, data = {}, message = 'Succès', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
}

/**
 * Réponse d'erreur standardisée
 */
export function errorResponse(res, error, statusCode = 400, details = null) {
  const response = {
    success: false,
    error: typeof error === 'string' ? error : error.message,
    timestamp: new Date().toISOString()
  };

  if (details) {
    response.details = details;
  }

  // Log l'erreur côté serveur
  console.error(`[API Error ${statusCode}]:`, error, details);

  return res.status(statusCode).json(response);
}

/**
 * Erreur de validation
 */
export function validationError(res, errors) {
  return errorResponse(res, 'Données invalides', 400, errors);
}

/**
 * Erreur d'authentification
 */
export function authError(res, message = 'Non autorisé') {
  return errorResponse(res, message, 401);
}

/**
 * Erreur de permission
 */
export function forbiddenError(res, message = 'Accès interdit') {
  return errorResponse(res, message, 403);
}

/**
 * Erreur de ressource non trouvée
 */
export function notFoundError(res, resource = 'Ressource') {
  return errorResponse(res, `${resource} non trouvé(e)`, 404);
}

/**
 * Erreur de méthode HTTP non autorisée
 */
export function methodNotAllowed(res, allowedMethods = []) {
  res.setHeader('Allow', allowedMethods);
  return errorResponse(res, 'Méthode non autorisée', 405);
}

/**
 * Erreur serveur interne
 */
export function serverError(res, error) {
  console.error('[Server Error]:', error);
  return errorResponse(
    res,
    'Erreur serveur interne',
    500,
    process.env.NODE_ENV === 'development' ? error.stack : null
  );
}

/**
 * Wrapper pour gérer les erreurs async dans les routes
 */
export function asyncHandler(handler) {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (error) {
      serverError(res, error);
    }
  };
}

/**
 * Middleware pour vérifier la méthode HTTP
 */
export function checkMethod(allowedMethods) {
  return (handler) => (req, res) => {
    if (!allowedMethods.includes(req.method)) {
      return methodNotAllowed(res, allowedMethods);
    }
    return handler(req, res);
  };
}

/**
 * Middleware pour limiter le taux de requêtes (rate limiting simple)
 */
const requestCounts = new Map();

export function rateLimit(maxRequests = 100, windowMs = 60000) {
  return (handler) => (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const key = `${ip}:${Date.now()}`;

    // Nettoyer les anciennes entrées
    const now = Date.now();
    for (const [k, v] of requestCounts.entries()) {
      if (now - v.timestamp > windowMs) {
        requestCounts.delete(k);
      }
    }

    // Compter les requêtes de cette IP
    const userRequests = Array.from(requestCounts.entries())
      .filter(([k]) => k.startsWith(ip))
      .length;

    if (userRequests >= maxRequests) {
      return errorResponse(
        res,
        'Trop de requêtes. Veuillez réessayer plus tard.',
        429
      );
    }

    requestCounts.set(key, { timestamp: now });
    return handler(req, res);
  };
}

/**
 * Middleware pour extraire l'utilisateur depuis le token/session
 */
export function requireAuth(handler) {
  return async (req, res) => {
    // À implémenter selon votre système d'auth (JWT, session, etc.)
    const user = req.session?.user || req.headers.authorization;

    if (!user) {
      return authError(res, 'Authentification requise');
    }

    req.user = user;
    return handler(req, res);
  };
}

/**
 * Middleware pour vérifier un rôle spécifique
 */
export function requireRole(role) {
  return (handler) => async (req, res) => {
    if (!req.user) {
      return authError(res, 'Authentification requise');
    }

    if (req.user.role !== role) {
      return forbiddenError(
        res,
        `Cette action requiert le rôle ${role}`
      );
    }

    return handler(req, res);
  };
}

/**
 * Composition de middlewares
 */
export function compose(...middlewares) {
  return (handler) => {
    return middlewares.reduceRight(
      (wrapped, middleware) => middleware(wrapped),
      handler
    );
  };
}

/**
 * Pagination helper
 */
export function paginate(items, page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  const paginatedItems = items.slice(offset, offset + limit);

  return {
    items: paginatedItems,
    pagination: {
      page,
      limit,
      total: items.length,
      totalPages: Math.ceil(items.length / limit),
      hasNext: offset + limit < items.length,
      hasPrev: page > 1
    }
  };
}

/**
 * Filtre les champs sensibles d'un objet
 */
export function sanitizeUser(user) {
  if (!user) return null;

  const { password, ...safeUser } = user;
  return safeUser;
}

/**
 * Vérifie si une requête provient d'un environnement de développement
 */
export function isDevelopment() {
  return process.env.NODE_ENV === 'development';
}

/**
 * Logger pour les API
 */
export function logRequest(req) {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);
}

/**
 * Gestionnaire de cache simple (in-memory)
 */
const cache = new Map();

export function withCache(key, ttl = 60000) {
  return (handler) => async (req, res) => {
    const cached = cache.get(key);

    if (cached && Date.now() - cached.timestamp < ttl) {
      return res.status(200).json(cached.data);
    }

    // Intercepter la réponse pour la mettre en cache
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      cache.set(key, { data, timestamp: Date.now() });
      return originalJson(data);
    };

    return handler(req, res);
  };
}

/**
 * Nettoie le cache
 */
export function clearCache() {
  cache.clear();
}

/**
 * Valide les paramètres de query string
 */
export function parseQueryParams(req, schema = {}) {
  const params = {};

  for (const [key, type] of Object.entries(schema)) {
    const value = req.query[key];

    if (value === undefined) continue;

    switch (type) {
      case 'number':
        params[key] = parseInt(value, 10);
        break;
      case 'boolean':
        params[key] = value === 'true';
        break;
      case 'array':
        params[key] = Array.isArray(value) ? value : [value];
        break;
      default:
        params[key] = value;
    }
  }

  return params;
}

/**
 * Génère un ID unique
 */
export function generateId(prefix = '') {
  return `${prefix}${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Gestion des fichiers DB JSON (helper pour les opérations courantes)
 */
import fs from 'fs';
import path from 'path';

export function getDbPath() {
  return path.join(process.cwd(), 'data', 'db.json');
}

export function readDb() {
  const dbPath = getDbPath();

  if (!fs.existsSync(dbPath)) {
    const dirPath = path.dirname(dbPath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const initialData = {
      users: [],
      professionals: [],
      requests: [],
      quotes: [],
      reviews: [],
      notifications: [],
      messages: []
    };

    fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
    return initialData;
  }

  return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
}

export function writeDb(data) {
  const dbPath = getDbPath();
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

/**
 * Helper pour trouver un élément par ID
 */
export function findById(collection, id) {
  return collection.find(item => item.id === id);
}

/**
 * Helper pour filtrer par propriété
 */
export function filterBy(collection, property, value) {
  return collection.filter(item => item[property] === value);
}
