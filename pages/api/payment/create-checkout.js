import fs from 'fs';
import path from 'path';

/**
 * API pour créer une session de paiement Stripe
 * POST: { quoteId, requestId }
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { quoteId, requestId } = req.body;

  if (!quoteId || !requestId) {
    return res.status(400).json({ error: 'quoteId et requestId requis' });
  }

  const dbPath = path.join(process.cwd(), 'data', 'db.json');
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

  // Vérifier que le devis et la demande existent
  const quote = db.quotes.find(q => q.id === quoteId);
  const request = db.requests.find(r => r.id === requestId);

  if (!quote || !request) {
    return res.status(404).json({ error: 'Devis ou demande introuvable' });
  }

  // Vérifier que le devis correspond à la demande
  if (quote.requestId !== requestId) {
    return res.status(400).json({ error: 'Le devis ne correspond pas à cette demande' });
  }

  // Si Stripe est configuré, créer une vraie session
  if (process.env.STRIPE_SECRET_KEY) {
    try {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: request.title,
                description: `Service de ${quote.professionalName}`,
              },
              unit_amount: Math.round(quote.price * 100), // Centimes
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/success?session_id={CHECKOUT_SESSION_ID}&requestId=${requestId}&quoteId=${quoteId}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/cancel?requestId=${requestId}`,
        metadata: {
          requestId,
          quoteId,
          professionalId: quote.professionalId,
        },
      });

      // Mettre à jour le statut
      const requestIndex = db.requests.findIndex(r => r.id === requestId);
      if (requestIndex !== -1) {
        db.requests[requestIndex].status = 'payment_pending';
        db.requests[requestIndex].acceptedQuoteId = quoteId;
        db.requests[requestIndex].stripeSessionId = session.id;
        db.requests[requestIndex].updatedAt = new Date().toISOString();
      }

      fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

      return res.status(200).json({
        sessionId: session.id,
        url: session.url,
      });
    } catch (error) {
      console.error('Stripe error:', error);
      return res.status(500).json({ error: 'Erreur lors de la création de la session Stripe' });
    }
  }

  // Mode démo sans Stripe (pour développement)
  const sessionId = `demo_session_${Date.now()}`;
  
  const requestIndex = db.requests.findIndex(r => r.id === requestId);
  if (requestIndex !== -1) {
    db.requests[requestIndex].status = 'accepted';
    db.requests[requestIndex].acceptedQuoteId = quoteId;
    db.requests[requestIndex].paidAt = new Date().toISOString();
    db.requests[requestIndex].updatedAt = new Date().toISOString();
  }

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

  return res.status(200).json({
    sessionId,
    demo: true,
    message: 'Mode démo - Paiement simulé. Configure STRIPE_SECRET_KEY pour les vrais paiements.',
  });
}