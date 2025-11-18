/**
 * Configuration et helpers pour les paiements (MODE DÉMO)
 * Stripe temporairement désactivé - tout fonctionne en mode simulation
 */

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
  return false; // Stripe désactivé pour le moment
}

/**
 * Créer une session de paiement (MODE DÉMO)
 * @param {Object} params - Paramètres de la session
 * @returns {Promise<Object>} Session simulée
 */
export async function createCheckoutSession(params) {
  // Mode démo - retourne une session simulée
  return {
    id: `demo_session_${Date.now()}`,
    url: `/payment/success?demo=true&session_id=demo_session_${Date.now()}`,
    amount_total: Math.round(params.amount * 100),
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    metadata: params.metadata || {},
    payment_status: 'paid',
    status: 'complete'
  };
}

/**
 * Créer un Payment Intent (MODE DÉMO)
 * @param {Object} params - Paramètres du paiement
 * @returns {Promise<Object>} Payment Intent simulé
 */
export async function createPaymentIntent(params) {
  return {
    id: `demo_pi_${Date.now()}`,
    amount: Math.round(params.amount * 100),
    currency: params.currency || 'eur',
    status: 'succeeded',
    metadata: params.metadata || {}
  };
}

/**
 * Récupérer une session Checkout (MODE DÉMO)
 * @param {string} sessionId - ID de la session
 * @returns {Promise<Object>} Session simulée
 */
export async function getCheckoutSession(sessionId) {
  return {
    id: sessionId,
    payment_intent: {
      id: `demo_pi_${Date.now()}`
    },
    amount_total: 10000,
    metadata: {},
    payment_status: 'paid',
    status: 'complete'
  };
}

/**
 * Capturer un paiement (MODE DÉMO)
 * @param {string} paymentIntentId - ID du Payment Intent
 * @returns {Promise<Object>}
 */
export async function capturePayment(paymentIntentId) {
  return {
    id: paymentIntentId,
    status: 'succeeded',
    captured: true
  };
}

/**
 * Annuler un paiement (MODE DÉMO)
 * @param {string} paymentIntentId - ID du Payment Intent
 * @returns {Promise<Object>}
 */
export async function cancelPayment(paymentIntentId) {
  return {
    id: paymentIntentId,
    status: 'canceled'
  };
}

/**
 * Créer un remboursement (MODE DÉMO)
 * @param {Object} params - Paramètres du remboursement
 * @returns {Promise<Object>}
 */
export async function createRefund(params) {
  return {
    id: `demo_refund_${Date.now()}`,
    payment_intent: params.paymentIntentId,
    amount: params.amount ? Math.round(params.amount * 100) : null,
    status: 'succeeded',
    reason: params.reason || 'requested_by_customer'
  };
}

/**
 * Vérifier la signature d'un webhook (DÉSACTIVÉ)
 * @param {string} payload - Corps de la requête
 * @param {string} signature - Signature du webhook
 * @returns {never}
 */
export function constructWebhookEvent(payload, signature) {
  throw new Error('Webhooks Stripe désactivés - mode démo uniquement');
}

/**
 * Créer un compte Connect (MODE DÉMO)
 * @param {Object} params - Informations du professionnel
 * @returns {Promise<Object>}
 */
export async function createConnectedAccount(params) {
  return {
    id: `demo_acct_${Date.now()}`,
    email: params.email,
    type: params.type || 'express',
    country: params.country || 'FR'
  };
}

/**
 * Créer un lien d'onboarding (MODE DÉMO)
 * @param {string} accountId - ID du compte Connect
 * @returns {Promise<Object>}
 */
export async function createAccountLink(accountId) {
  return {
    url: `/dashboard/provider?onboarding=complete`,
    expires_at: Math.floor(Date.now() / 1000) + 3600
  };
}

/**
 * Créer un transfert (MODE DÉMO)
 * @param {Object} params - Paramètres du transfert
 * @returns {Promise<Object>}
 */
export async function createTransfer(params) {
  return {
    id: `demo_transfer_${Date.now()}`,
    amount: Math.round(params.amount * 100),
    currency: params.currency || 'eur',
    destination: params.destination,
    status: 'paid'
  };
}

/**
 * Récupérer un Payment Intent (MODE DÉMO)
 * @param {string} paymentIntentId - ID du Payment Intent
 * @returns {Promise<Object>}
 */
export async function getPaymentIntent(paymentIntentId) {
  return {
    id: paymentIntentId,
    amount: 10000,
    currency: 'eur',
    status: 'succeeded'
  };
}

/**
 * Récupérer les paiements d'un client (MODE DÉMO)
 * @param {string} customerEmail - Email du client
 * @param {number} limit - Nombre de résultats
 * @returns {Promise<Array>}
 */
export async function getCustomerPayments(customerEmail, limit = 10) {
  return [];
}

export default null;
