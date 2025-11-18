/**
 * Configuration et helpers pour Stripe
 * Gère les paiements, les abonnements et les transferts
 */

import Stripe from 'stripe';

// Initialiser Stripe avec la clé secrète
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20',
});

/**
 * Créer une session de paiement Checkout
 * @param {Object} params - Paramètres de la session
 * @returns {Promise<Stripe.Checkout.Session>}
 */
export async function createCheckoutSession({
  amount,
  currency = 'eur',
  description,
  metadata = {},
  successUrl,
  cancelUrl,
  customerEmail,
  mode = 'payment'
}) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: 'Service Util',
              description: description || 'Paiement pour service professionnel'
            },
            unit_amount: Math.round(amount * 100) // Convertir en centimes
          },
          quantity: 1
        }
      ],
      mode,
      success_url: successUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
      customer_email: customerEmail,
      metadata: {
        ...metadata,
        platform: 'Util'
      },
      payment_intent_data: {
        metadata: {
          ...metadata,
          platform: 'Util'
        }
      }
    });

    return session;
  } catch (error) {
    console.error('Erreur lors de la création de la session Checkout:', error);
    throw error;
  }
}

/**
 * Créer un Payment Intent (paiement direct)
 * @param {Object} params - Paramètres du paiement
 * @returns {Promise<Stripe.PaymentIntent>}
 */
export async function createPaymentIntent({
  amount,
  currency = 'eur',
  description,
  metadata = {},
  customerEmail,
  captureMethod = 'automatic'
}) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      description,
      receipt_email: customerEmail,
      metadata: {
        ...metadata,
        platform: 'Util'
      },
      capture_method: captureMethod // 'automatic' ou 'manual'
    });

    return paymentIntent;
  } catch (error) {
    console.error('Erreur lors de la création du Payment Intent:', error);
    throw error;
  }
}

/**
 * Capturer un paiement (si capture_method = 'manual')
 * @param {string} paymentIntentId - ID du Payment Intent
 * @returns {Promise<Stripe.PaymentIntent>}
 */
export async function capturePayment(paymentIntentId) {
  try {
    const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.error('Erreur lors de la capture du paiement:', error);
    throw error;
  }
}

/**
 * Annuler un paiement
 * @param {string} paymentIntentId - ID du Payment Intent
 * @returns {Promise<Stripe.PaymentIntent>}
 */
export async function cancelPayment(paymentIntentId) {
  try {
    const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.error('Erreur lors de l\'annulation du paiement:', error);
    throw error;
  }
}

/**
 * Créer un remboursement
 * @param {Object} params - Paramètres du remboursement
 * @returns {Promise<Stripe.Refund>}
 */
export async function createRefund({
  paymentIntentId,
  amount = null,
  reason = 'requested_by_customer'
}) {
  try {
    const refundParams = {
      payment_intent: paymentIntentId,
      reason
    };

    // Si amount est spécifié, remboursement partiel
    if (amount) {
      refundParams.amount = Math.round(amount * 100);
    }

    const refund = await stripe.refunds.create(refundParams);
    return refund;
  } catch (error) {
    console.error('Erreur lors de la création du remboursement:', error);
    throw error;
  }
}

/**
 * Récupérer une session Checkout
 * @param {string} sessionId - ID de la session
 * @returns {Promise<Stripe.Checkout.Session>}
 */
export async function getCheckoutSession(sessionId) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'customer']
    });
    return session;
  } catch (error) {
    console.error('Erreur lors de la récupération de la session:', error);
    throw error;
  }
}

/**
 * Récupérer un Payment Intent
 * @param {string} paymentIntentId - ID du Payment Intent
 * @returns {Promise<Stripe.PaymentIntent>}
 */
export async function getPaymentIntent(paymentIntentId) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.error('Erreur lors de la récupération du Payment Intent:', error);
    throw error;
  }
}

/**
 * Créer un compte Stripe Connect pour un professionnel
 * @param {Object} params - Informations du professionnel
 * @returns {Promise<Stripe.Account>}
 */
export async function createConnectedAccount({
  email,
  country = 'FR',
  type = 'express',
  metadata = {}
}) {
  try {
    const account = await stripe.accounts.create({
      type,
      country,
      email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true }
      },
      metadata: {
        ...metadata,
        platform: 'Util'
      }
    });

    return account;
  } catch (error) {
    console.error('Erreur lors de la création du compte Connect:', error);
    throw error;
  }
}

/**
 * Créer un lien d'onboarding pour un compte Connect
 * @param {string} accountId - ID du compte Connect
 * @returns {Promise<Stripe.AccountLink>}
 */
export async function createAccountLink(accountId) {
  try {
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/provider?refresh=true`,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/provider?success=true`,
      type: 'account_onboarding'
    });

    return accountLink;
  } catch (error) {
    console.error('Erreur lors de la création du lien d\'onboarding:', error);
    throw error;
  }
}

/**
 * Créer un transfert vers un compte Connect
 * @param {Object} params - Paramètres du transfert
 * @returns {Promise<Stripe.Transfer>}
 */
export async function createTransfer({
  amount,
  currency = 'eur',
  destination,
  metadata = {}
}) {
  try {
    const transfer = await stripe.transfers.create({
      amount: Math.round(amount * 100),
      currency,
      destination,
      metadata: {
        ...metadata,
        platform: 'Util'
      }
    });

    return transfer;
  } catch (error) {
    console.error('Erreur lors de la création du transfert:', error);
    throw error;
  }
}

/**
 * Calculer la commission de la plateforme
 * @param {number} amount - Montant total
 * @param {number} commissionRate - Taux de commission (par défaut 12%)
 * @returns {Object} Montants calculés
 */
export function calculatePlatformFee(amount, commissionRate = 0.12) {
  const commission = Math.round(amount * commissionRate * 100) / 100;
  const professionalAmount = Math.round((amount - commission) * 100) / 100;

  return {
    total: amount,
    commission,
    professionalAmount,
    commissionRate
  };
}

/**
 * Vérifier la signature d'un webhook Stripe
 * @param {string} payload - Corps de la requête
 * @param {string} signature - Signature du webhook
 * @returns {Stripe.Event}
 */
export function constructWebhookEvent(payload, signature) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET n\'est pas configuré');
  }

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    );
    return event;
  } catch (error) {
    console.error('Erreur de vérification de la signature webhook:', error);
    throw error;
  }
}

/**
 * Récupérer les paiements d'un client
 * @param {string} customerEmail - Email du client
 * @param {number} limit - Nombre de résultats
 * @returns {Promise<Array>}
 */
export async function getCustomerPayments(customerEmail, limit = 10) {
  try {
    const paymentIntents = await stripe.paymentIntents.list({
      limit,
      customer: customerEmail
    });

    return paymentIntents.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements:', error);
    throw error;
  }
}

/**
 * Formater un montant en centimes vers euros
 * @param {number} amountInCents - Montant en centimes
 * @returns {number}
 */
export function formatAmount(amountInCents) {
  return amountInCents / 100;
}

/**
 * Vérifier si Stripe est configuré
 * @returns {boolean}
 */
export function isStripeConfigured() {
  return !!process.env.STRIPE_SECRET_KEY && !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
}

export default stripe;
