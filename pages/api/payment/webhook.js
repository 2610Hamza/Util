/**
 * Webhook pour les paiements (MODE DÉMO - DÉSACTIVÉ)
 * Stripe temporairement désactivé
 */

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  // Mode démo - webhooks désactivés
  return res.status(200).json({
    received: true,
    demo: true,
    message: 'Webhooks Stripe désactivés - mode démo uniquement'
  });
}
