import {
  asyncHandler,
  successResponse,
  errorResponse,
  validationError,
  methodNotAllowed,
  readDb,
  writeDb,
  generateId,
  findById
} from '../../../lib/apiHelpers';
import {
  validateAmount,
  validateID,
  validateEmail
} from '../../../lib/validation';
import {
  createCheckoutSession,
  calculatePlatformFee,
  isStripeConfigured
} from '../../../lib/stripe';

/**
 * API route pour créer une session de paiement Stripe
 *
 * POST: Créer une session de paiement pour une demande de service
 */
export default asyncHandler(async (req, res) => {
  if (req.method !== 'POST') {
    return methodNotAllowed(res, ['POST']);
  }

  const {
    requestId,
    quoteId,
    amount,
    clientEmail,
    clientId,
    professionalId,
    description
  } = req.body;

  // Validation des champs
  const errors = {};

  const requestIdValidation = validateID(requestId, 'Demande');
  if (!requestIdValidation.valid) {
    errors.requestId = requestIdValidation.error;
  }

  if (quoteId) {
    const quoteIdValidation = validateID(quoteId, 'Devis');
    if (!quoteIdValidation.valid) {
      errors.quoteId = quoteIdValidation.error;
    }
  }

  const amountValidation = validateAmount(amount, 10, 50000);
  if (!amountValidation.valid) {
    errors.amount = amountValidation.error;
  }

  const emailValidation = validateEmail(clientEmail);
  if (!emailValidation.valid) {
    errors.clientEmail = emailValidation.error;
  }

  const clientIdValidation = validateID(clientId, 'Client');
  if (!clientIdValidation.valid) {
    errors.clientId = clientIdValidation.error;
  }

  const proIdValidation = validateID(professionalId, 'Professionnel');
  if (!proIdValidation.valid) {
    errors.professionalId = proIdValidation.error;
  }

  if (Object.keys(errors).length > 0) {
    return validationError(res, errors);
  }

  try {
    const db = readDb();

    // Vérifier que la demande existe
    const request = findById(db.requests, requestId);
    if (!request) {
      return errorResponse(res, 'Demande introuvable', 404);
    }

    // Vérifier que le devis existe (si spécifié)
    let quote = null;
    if (quoteId) {
      quote = findById(db.quotes, quoteId);
      if (!quote) {
        return errorResponse(res, 'Devis introuvable', 404);
      }
    }

    // Vérifier que le client existe
    const client = findById(db.users, clientId);
    if (!client || client.role !== 'client') {
      return errorResponse(res, 'Client invalide', 400);
    }

    // Vérifier que le professionnel existe
    const professional = findById(db.users, professionalId);
    if (!professional || professional.role !== 'professional') {
      return errorResponse(res, 'Professionnel invalide', 400);
    }

    // Calculer les frais de plateforme
    const feeBreakdown = calculatePlatformFee(parseFloat(amount));

    // Si Stripe n'est pas configuré, mode démo
    if (!isStripeConfigured()) {
      const transaction = {
        id: generateId('txn-'),
        requestId,
        quoteId: quoteId || null,
        clientId,
        professionalId,
        amount: parseFloat(amount),
        commission: feeBreakdown.commission,
        professionalAmount: feeBreakdown.professionalAmount,
        stripeSessionId: `demo_${Date.now()}`,
        stripePaymentIntentId: null,
        status: 'completed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        demo: true
      };

      if (!db.transactions) {
        db.transactions = [];
      }

      db.transactions.push(transaction);

      // Mettre à jour le statut de la demande
      const requestIndex = db.requests.findIndex(r => r.id === requestId);
      if (requestIndex !== -1) {
        db.requests[requestIndex].status = 'accepted';
        db.requests[requestIndex].acceptedQuoteId = quoteId;
        db.requests[requestIndex].paidAt = new Date().toISOString();
        db.requests[requestIndex].updatedAt = new Date().toISOString();
      }

      writeDb(db);

      return successResponse(res, {
        demo: true,
        transactionId: transaction.id,
        message: 'Mode démo - Configure STRIPE_SECRET_KEY pour les vrais paiements'
      }, 'Paiement simulé avec succès');
    }

    // Créer la session Stripe Checkout
    const session = await createCheckoutSession({
      amount: parseFloat(amount),
      currency: 'eur',
      description: description || `Paiement pour: ${request.title}`,
      customerEmail: clientEmail,
      metadata: {
        requestId,
        quoteId: quoteId || '',
        clientId,
        professionalId,
        platformCommission: feeBreakdown.commission.toString(),
        professionalAmount: feeBreakdown.professionalAmount.toString()
      },
      successUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/success?session_id={CHECKOUT_SESSION_ID}&request_id=${requestId}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/requests/${requestId}?payment=cancelled`
    });

    // Créer une transaction dans la base de données
    const transaction = {
      id: generateId('txn-'),
      requestId,
      quoteId: quoteId || null,
      clientId,
      professionalId,
      amount: parseFloat(amount),
      commission: feeBreakdown.commission,
      professionalAmount: feeBreakdown.professionalAmount,
      stripeSessionId: session.id,
      stripePaymentIntentId: null,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (!db.transactions) {
      db.transactions = [];
    }

    db.transactions.push(transaction);

    // Mettre à jour le statut de la demande
    const requestIndex = db.requests.findIndex(r => r.id === requestId);
    if (requestIndex !== -1) {
      db.requests[requestIndex].status = 'payment_pending';
      db.requests[requestIndex].acceptedQuoteId = quoteId;
      db.requests[requestIndex].updatedAt = new Date().toISOString();
    }

    writeDb(db);

    return successResponse(res, {
      sessionId: session.id,
      sessionUrl: session.url,
      transactionId: transaction.id,
      feeBreakdown,
      expiresAt: new Date(session.expires_at * 1000).toISOString()
    }, 'Session de paiement créée avec succès');

  } catch (error) {
    console.error('Erreur lors de la création de la session de paiement:', error);
    return errorResponse(
      res,
      'Erreur lors de la création de la session de paiement',
      500
    );
  }
});
