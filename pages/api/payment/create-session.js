/**
 * API route pour créer une session de paiement Stripe.
 * POST: { quoteId }
 * Dans ce prototype, nous renvoyons simplement un ID fictif car nous ne pouvons pas
 * appeler Stripe en environnement local sans clés API.
 */
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }
  const { quoteId } = req.body;
  if (!quoteId) {
    return res.status(400).json({ error: 'quoteId manquant' });
  }
  // Retourne un identifiant de session fictif
  const sessionId = `sess_${Date.now()}`;
  return res.status(200).json({ sessionId });
}
