import { buffer } from 'micro';
import {
  constructWebhookEvent,
  getCheckoutSession,
  formatAmount
} from '../../../lib/stripe';
import {
  readDb,
  writeDb,
  findById
} from '../../../lib/apiHelpers';

// Désactiver le body parser par défaut pour les webhooks Stripe
export const config = {
  api: {
    bodyParser: false
  }
};

/**
 * Webhook Stripe pour gérer les événements de paiement
 *
 * Événements gérés:
 * - checkout.session.completed: Paiement réussi
 * - payment_intent.succeeded: Confirmation de paiement
 * - payment_intent.payment_failed: Échec de paiement
 * - charge.refunded: Remboursement effectué
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    // Récupérer le corps de la requête en buffer
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];

    if (!sig) {
      console.error('Signature Stripe manquante');
      return res.status(400).json({ error: 'Signature manquante' });
    }

    // Vérifier et construire l'événement Stripe
    let event;
    try {
      event = constructWebhookEvent(buf.toString(), sig);
    } catch (err) {
      console.error('Erreur de vérification de signature:', err.message);
      return res.status(400).json({ error: `Signature invalide: ${err.message}` });
    }

    console.log(`Webhook reçu: ${event.type}`);

    const db = readDb();

    // Gérer les différents types d'événements
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object, db);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object, db);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object, db);
        break;

      case 'charge.refunded':
        await handleChargeRefunded(event.data.object, db);
        break;

      default:
        console.log(`Type d'événement non géré: ${event.type}`);
    }

    // Répondre à Stripe que le webhook a été reçu
    return res.status(200).json({ received: true });

  } catch (error) {
    console.error('Erreur lors du traitement du webhook:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}

/**
 * Gérer la complétion d'une session Checkout
 */
async function handleCheckoutSessionCompleted(session, db) {
  console.log('Checkout session completed:', session.id);

  const { requestId, quoteId, clientId, professionalId, platformCommission, professionalAmount } = session.metadata;

  try {
    // Récupérer la session complète avec le payment intent
    const fullSession = await getCheckoutSession(session.id);
    const paymentIntentId = fullSession.payment_intent?.id || fullSession.payment_intent;

    // Trouver la transaction dans la DB
    const transactionIndex = db.transactions?.findIndex(
      t => t.stripeSessionId === session.id
    );

    if (transactionIndex !== -1) {
      // Mettre à jour la transaction
      db.transactions[transactionIndex].status = 'completed';
      db.transactions[transactionIndex].stripePaymentIntentId = paymentIntentId;
      db.transactions[transactionIndex].paidAt = new Date().toISOString();
      db.transactions[transactionIndex].updatedAt = new Date().toISOString();
    } else {
      // Créer une nouvelle transaction si elle n'existe pas
      const transaction = {
        id: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        requestId,
        quoteId: quoteId || null,
        clientId,
        professionalId,
        amount: formatAmount(session.amount_total),
        commission: parseFloat(platformCommission || 0),
        professionalAmount: parseFloat(professionalAmount || 0),
        stripeSessionId: session.id,
        stripePaymentIntentId: paymentIntentId,
        status: 'completed',
        paidAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (!db.transactions) {
        db.transactions = [];
      }
      db.transactions.push(transaction);
    }

    // Mettre à jour le statut de la demande
    if (requestId) {
      const requestIndex = db.requests?.findIndex(r => r.id === requestId);
      if (requestIndex !== -1) {
        db.requests[requestIndex].status = 'accepted';
        db.requests[requestIndex].acceptedQuoteId = quoteId;
        db.requests[requestIndex].paidAt = new Date().toISOString();
        db.requests[requestIndex].updatedAt = new Date().toISOString();
      }
    }

    // Mettre à jour le statut du devis
    if (quoteId) {
      const quoteIndex = db.quotes?.findIndex(q => q.id === quoteId);
      if (quoteIndex !== -1) {
        db.quotes[quoteIndex].status = 'accepted';
        db.quotes[quoteIndex].acceptedAt = new Date().toISOString();
        db.quotes[quoteIndex].updatedAt = new Date().toISOString();
      }
    }

    // Créer une notification pour le professionnel
    const notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: professionalId,
      type: 'payment_received',
      title: 'Paiement reçu',
      message: `Un client a payé ${formatAmount(session.amount_total)}€ pour votre service`,
      data: {
        requestId,
        quoteId,
        amount: formatAmount(session.amount_total),
        commission: platformCommission,
        netAmount: professionalAmount
      },
      read: false,
      createdAt: new Date().toISOString()
    };

    if (!db.notifications) {
      db.notifications = [];
    }
    db.notifications.push(notification);

    // Créer une notification pour le client
    const clientNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: clientId,
      type: 'payment_confirmed',
      title: 'Paiement confirmé',
      message: 'Votre paiement a été confirmé avec succès',
      data: {
        requestId,
        quoteId,
        amount: formatAmount(session.amount_total)
      },
      read: false,
      createdAt: new Date().toISOString()
    };

    db.notifications.push(clientNotification);

    writeDb(db);

    console.log(`Transaction complétée pour la demande ${requestId}`);
  } catch (error) {
    console.error('Erreur lors du traitement de checkout.session.completed:', error);
    throw error;
  }
}

/**
 * Gérer le succès d'un Payment Intent
 */
async function handlePaymentIntentSucceeded(paymentIntent, db) {
  console.log('Payment intent succeeded:', paymentIntent.id);

  const transactionIndex = db.transactions?.findIndex(
    t => t.stripePaymentIntentId === paymentIntent.id
  );

  if (transactionIndex !== -1) {
    db.transactions[transactionIndex].status = 'completed';
    db.transactions[transactionIndex].paidAt = new Date().toISOString();
    db.transactions[transactionIndex].updatedAt = new Date().toISOString();

    writeDb(db);
  }
}

/**
 * Gérer l'échec d'un Payment Intent
 */
async function handlePaymentIntentFailed(paymentIntent, db) {
  console.log('Payment intent failed:', paymentIntent.id);

  const transactionIndex = db.transactions?.findIndex(
    t => t.stripePaymentIntentId === paymentIntent.id
  );

  if (transactionIndex !== -1) {
    db.transactions[transactionIndex].status = 'failed';
    db.transactions[transactionIndex].failureReason = paymentIntent.last_payment_error?.message || 'Échec de paiement';
    db.transactions[transactionIndex].updatedAt = new Date().toISOString();

    const requestId = db.transactions[transactionIndex].requestId;

    // Mettre à jour le statut de la demande
    if (requestId) {
      const requestIndex = db.requests?.findIndex(r => r.id === requestId);
      if (requestIndex !== -1) {
        db.requests[requestIndex].status = 'payment_failed';
        db.requests[requestIndex].updatedAt = new Date().toISOString();
      }
    }

    // Notifier le client
    const clientId = db.transactions[transactionIndex].clientId;
    if (clientId) {
      const notification = {
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId: clientId,
        type: 'payment_failed',
        title: 'Échec de paiement',
        message: 'Le paiement a échoué. Veuillez réessayer.',
        data: {
          requestId,
          reason: paymentIntent.last_payment_error?.message
        },
        read: false,
        createdAt: new Date().toISOString()
      };

      if (!db.notifications) {
        db.notifications = [];
      }
      db.notifications.push(notification);
    }

    writeDb(db);
  }
}

/**
 * Gérer un remboursement
 */
async function handleChargeRefunded(charge, db) {
  console.log('Charge refunded:', charge.id);

  const paymentIntentId = charge.payment_intent;

  const transactionIndex = db.transactions?.findIndex(
    t => t.stripePaymentIntentId === paymentIntentId
  );

  if (transactionIndex !== -1) {
    db.transactions[transactionIndex].status = 'refunded';
    db.transactions[transactionIndex].refundedAmount = formatAmount(charge.amount_refunded);
    db.transactions[transactionIndex].refundedAt = new Date().toISOString();
    db.transactions[transactionIndex].updatedAt = new Date().toISOString();

    const requestId = db.transactions[transactionIndex].requestId;
    const clientId = db.transactions[transactionIndex].clientId;

    // Mettre à jour le statut de la demande
    if (requestId) {
      const requestIndex = db.requests?.findIndex(r => r.id === requestId);
      if (requestIndex !== -1) {
        db.requests[requestIndex].status = 'refunded';
        db.requests[requestIndex].updatedAt = new Date().toISOString();
      }
    }

    // Notifier le client
    if (clientId) {
      const notification = {
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId: clientId,
        type: 'payment_refunded',
        title: 'Remboursement effectué',
        message: `Vous avez été remboursé de ${formatAmount(charge.amount_refunded)}€`,
        data: {
          requestId,
          amount: formatAmount(charge.amount_refunded)
        },
        read: false,
        createdAt: new Date().toISOString()
      };

      if (!db.notifications) {
        db.notifications = [];
      }
      db.notifications.push(notification);
    }

    writeDb(db);
  }
}
