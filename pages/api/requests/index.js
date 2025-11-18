import {
  asyncHandler,
  methodNotAllowed,
  successResponse,
  errorResponse,
  notFoundError,
  validationError,
  readDb,
  writeDb,
  generateId,
  findById,
  filterBy,
  paginate,
  parseQueryParams
} from '../../../lib/apiHelpers';
import {
  validateText,
  validateAmount,
  validateID,
  sanitizeString
} from '../../../lib/validation';

/**
 * API route pour les demandes de services.
 *
 * GET: Liste des demandes filtrées avec pagination
 * POST: Créer une nouvelle demande
 * PATCH: Mettre à jour une demande existante
 */
export default asyncHandler(async (req, res) => {
  const allowedMethods = ['GET', 'POST', 'PATCH'];

  if (!allowedMethods.includes(req.method)) {
    return methodNotAllowed(res, allowedMethods);
  }

  const db = readDb();

  // GET - Récupérer les demandes
  if (req.method === 'GET') {
    const queryParams = parseQueryParams(req, {
      clientId: 'string',
      professionalId: 'string',
      id: 'string',
      status: 'string',
      page: 'number',
      limit: 'number'
    });

    const {
      clientId,
      professionalId,
      id,
      status,
      page = 1,
      limit = 10
    } = queryParams;

    let requests = db.requests || [];

    // Récupérer une demande spécifique
    if (id) {
      const request = findById(requests, id);

      if (!request) {
        return notFoundError(res, 'Demande');
      }

      // Enrichir avec les informations du client et du professionnel
      const client = findById(db.users, request.clientId);
      const professional = findById(db.users, request.professionalId);

      return successResponse(res, {
        ...request,
        client: client ? {
          id: client.id,
          name: client.name,
          email: client.email
        } : null,
        professional: professional ? {
          id: professional.id,
          name: professional.name,
          email: professional.email,
          category: professional.category,
          rating: professional.rating
        } : null
      });
    }

    // Filtrer les demandes
    if (clientId) {
      requests = filterBy(requests, 'clientId', clientId);
    }

    if (professionalId) {
      requests = filterBy(requests, 'professionalId', professionalId);
    }

    if (status) {
      requests = filterBy(requests, 'status', status);
    }

    // Tri par date (plus récent en premier)
    requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    const paginatedData = paginate(requests, page, limit);

    return successResponse(res, paginatedData, 'Demandes récupérées avec succès');
  }

  // POST - Créer une nouvelle demande
  if (req.method === 'POST') {
    const {
      title,
      description,
      budget,
      clientId,
      professionalId,
      category,
      location,
      urgency = 'normal'
    } = req.body;

    // Validation des champs
    const errors = {};

    // Valider le titre
    const titleValidation = validateText(
      title,
      5,
      100,
      'Titre'
    );
    if (!titleValidation.valid) {
      errors.title = titleValidation.error;
    }

    // Valider la description
    const descValidation = validateText(
      description,
      20,
      2000,
      'Description'
    );
    if (!descValidation.valid) {
      errors.description = descValidation.error;
    }

    // Valider le budget (optionnel)
    if (budget) {
      const budgetValidation = validateAmount(budget, 0, 100000);
      if (!budgetValidation.valid) {
        errors.budget = budgetValidation.error;
      }
    }

    // Valider les IDs
    const clientIdValidation = validateID(clientId, 'Client ID');
    if (!clientIdValidation.valid) {
      errors.clientId = clientIdValidation.error;
    }

    if (professionalId) {
      const proIdValidation = validateID(professionalId, 'Professional ID');
      if (!proIdValidation.valid) {
        errors.professionalId = proIdValidation.error;
      }
    }

    if (Object.keys(errors).length > 0) {
      return validationError(res, errors);
    }

    // Vérifier que le client existe
    const client = findById(db.users, clientId);
    if (!client || client.role !== 'client') {
      return errorResponse(res, 'Client invalide ou introuvable', 400);
    }

    // Vérifier que le professionnel existe (si spécifié)
    if (professionalId) {
      const professional = findById(db.users, professionalId);
      if (!professional || professional.role !== 'professional') {
        return errorResponse(res, 'Professionnel invalide ou introuvable', 400);
      }
    }

    // Créer la demande
    const request = {
      id: generateId('req-'),
      title: sanitizeString(title.trim()),
      description: sanitizeString(description.trim()),
      budget: budget ? parseFloat(budget) : null,
      clientId,
      professionalId: professionalId || null,
      category: category || null,
      location: location || null,
      urgency,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      quotesCount: 0,
      rating: null,
      review: null
    };

    if (!db.requests) {
      db.requests = [];
    }

    db.requests.push(request);
    writeDb(db);

    return successResponse(
      res,
      request,
      'Demande créée avec succès',
      201
    );
  }

  // PATCH - Mettre à jour une demande
  if (req.method === 'PATCH') {
    const { id, status, rating, review, professionalId } = req.body;

    // Validation de l'ID
    const idValidation = validateID(id, 'ID');
    if (!idValidation.valid) {
      return validationError(res, { id: idValidation.error });
    }

    const requestIndex = db.requests.findIndex((r) => r.id === id);

    if (requestIndex === -1) {
      return notFoundError(res, 'Demande');
    }

    const errors = {};

    // Valider le statut si fourni
    const validStatuses = ['pending', 'quote_received', 'accepted', 'in_progress', 'completed', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      errors.status = 'Statut invalide';
    }

    // Valider la note si fournie
    if (rating !== undefined) {
      if (isNaN(rating) || rating < 1 || rating > 5) {
        errors.rating = 'La note doit être entre 1 et 5';
      }
    }

    // Valider l'avis si fourni
    if (review) {
      const reviewValidation = validateText(review, 10, 1000, 'Avis');
      if (!reviewValidation.valid) {
        errors.review = reviewValidation.error;
      }
    }

    if (Object.keys(errors).length > 0) {
      return validationError(res, errors);
    }

    // Mise à jour des champs
    if (status) {
      db.requests[requestIndex].status = status;
    }

    if (rating !== undefined) {
      db.requests[requestIndex].rating = Number(rating);
    }

    if (review) {
      db.requests[requestIndex].review = sanitizeString(review);
    }

    if (professionalId) {
      db.requests[requestIndex].professionalId = professionalId;
    }

    db.requests[requestIndex].updatedAt = new Date().toISOString();

    writeDb(db);

    return successResponse(
      res,
      db.requests[requestIndex],
      'Demande mise à jour avec succès'
    );
  }
});