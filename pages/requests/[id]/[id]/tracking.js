import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function RequestTracking() {
  const router = useRouter();
  const { id } = router.query;
  const [request, setRequest] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    if (!id) return;
    fetchData();
    
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    if (!request) return;
    const timer = setInterval(() => {
      const created = new Date(request.createdAt);
      const now = new Date();
      const diff = Math.floor((now - created) / 1000 / 60);
      setTimeElapsed(diff);
    }, 1000);
    return () => clearInterval(timer);
  }, [request]);

  const fetchData = async () => {
    try {
      const [reqRes, quotesRes] = await Promise.all([
        fetch(`/api/requests?id=${id}`),
        fetch(`/api/quotes?requestId=${id}`)
      ]);

      if (reqRes.ok) {
        const reqData = await reqRes.json();
        setRequest(reqData);
      }

      if (quotesRes.ok) {
        const quotesData = await quotesRes.json();
        setQuotes(quotesData);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptQuote = async (quoteId) => {
    if (!confirm('Accepter ce devis et procéder au paiement ?')) return;

    try {
      const res = await fetch('/api/payment/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quoteId, requestId: id }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.url) {
          window.location.href = data.url;
        } else {
          router.push(`/payment/success?requestId=${id}&quoteId=${quoteId}`);
        }
      } else {
        alert('❌ ' + (data.error || 'Erreur'));
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Une erreur est survenue');
    }
  };

  if (loading) {
    return (
      <div className="tracking-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Chargement...</p>
        </div>
        <style jsx>{`
          .tracking-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; }
          .loading-state { text-align: center; }
          .loading-spinner { width: 50px; height: 50px; border: 3px solid #e5e7eb; border-top-color: #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="tracking-page">
        <div className="container">
          <h2>Demande introuvable</h2>
          <Link href="/dashboard/client" className="btn btn-primary">← Retour</Link>
        </div>
      </div>
    );
  }

  const hasQuotes = quotes.length > 0;

  return (
    <div className="tracking-page">
      <div className="container">
        <Link href="/dashboard/client" className="back-link">← Mes demandes</Link>

        <div className="tracking-header">
          <div className="header-content">
            <h1>{request.title}</h1>
            <div className="status-badge">
              {request.status === 'pending' && '⏳ En attente de devis'}
              {request.status === 'quote_received' && `💬 ${quotes.length} devis reçu(s)`}
              {request.status === 'accepted' && '✅ Devis accepté'}
              {request.status === 'completed' && '🎉 Terminé'}
            </div>
          </div>

          <div className="timer-widget">
            <div className="timer-icon">⏱️</div>
            <div className="timer-content">
              <div className="timer-label">Temps d'attente</div>
              <div className="timer-value">{timeElapsed} min</div>
            </div>
          </div>
        </div>

        <div className="progress-timeline">
          <div className="timeline-step completed">
            <div className="step-icon">✅</div>
            <div className="step-content">
              <div className="step-title">Demande envoyée</div>
              <div className="step-time">{new Date(request.createdAt).toLocaleString('fr-FR')}</div>
            </div>
          </div>

          <div className={`timeline-step ${hasQuotes ? 'completed' : 'active'}`}>
            <div className="step-icon">{hasQuotes ? '✅' : '⏳'}</div>
            <div className="step-content">
              <div className="step-title">{hasQuotes ? 'Devis reçus' : 'En attente de devis'}</div>
              {hasQuotes && <div className="step-time">{quotes.length} proposition(s)</div>}
            </div>
          </div>

          <div className={`timeline-step ${request.status === 'accepted' ? 'completed' : ''}`}>
            <div className="step-icon">{request.status === 'accepted' ? '✅' : '⏳'}</div>
            <div className="step-content">
              <div className="step-title">Paiement & Réservation</div>
            </div>
          </div>

          <div className={`timeline-step ${request.status === 'completed' ? 'completed' : ''}`}>
            <div className="step-icon">{request.status === 'completed' ? '✅' : '⏳'}</div>
            <div className="step-content">
              <div className="step-title">Prestation terminée</div>
            </div>
          </div>
        </div>

        {hasQuotes ? (
          <div className="quotes-section">
            <h2>Devis reçus ({quotes.length})</h2>
            <div className="quotes-grid">
              {quotes.map((quote) => (
                <div key={quote.id} className="quote-card">
                  <div className="quote-header">
                    <div className="pro-info">
                      <div className="pro-avatar">{quote.professionalName.charAt(0)}</div>
                      <div>
                        <h3>{quote.professionalName}</h3>
                        <p className="quote-time">
                          Reçu {new Date(quote.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="quote-price">{quote.price}€</div>
                  </div>

                  {quote.message && (
                    <div className="quote-message">
                      <p>{quote.message}</p>
                    </div>
                  )}

                  <div className="quote-footer">
                    <Link href={`/professionals/${quote.professionalId}`} className="btn btn-ghost">
                      Voir le profil
                    </Link>
                    <button className="btn btn-primary" onClick={() => handleAcceptQuote(quote.id)}>
                      ✓ Accepter & Payer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="waiting-state">
            <div className="waiting-animation">
              <div className="pulse-circle"></div>
              <div className="waiting-icon">📨</div>
            </div>
            <h3>Recherche du meilleur professionnel...</h3>
            <p>Votre demande a été envoyée. Vous recevrez les devis sous peu !</p>
          </div>
        )}

        <div className="request-details">
          <h3>Détails de votre demande</h3>
          <div className="details-grid">
            <div className="detail-item">
              <strong>Description</strong>
              <p>{request.description}</p>
            </div>
            {request.budget && (
              <div className="detail-item">
                <strong>Budget estimé</strong>
                <p>{request.budget}€</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .tracking-page { min-height: 100vh; background: #f9fafb; padding: 48px 0 80px; }
        .back-link { display: inline-flex; align-items: center; gap: 8px; font-weight: 600; color: #6b7280; margin-bottom: 24px; }
        .tracking-header { background: white; border-radius: 20px; padding: 32px; border: 2px solid #e5e7eb; margin-bottom: 32px; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
        .header-content h1 { font-size: 28px; font-weight: 700; margin: 0 0 12px; }
        .status-badge { display: inline-flex; padding: 10px 20px; background: rgba(59, 130, 246, 0.1); border: 2px solid rgba(59, 130, 246, 0.3); border-radius: 999px; font-weight: 600; color: #3b82f6; }
        .timer-widget { display: flex; align-items: center; gap: 16px; padding: 20px 24px; background: #f9fafb; border-radius: 16px; }
        .timer-icon { font-size: 40px; }
        .timer-label { font-size: 13px; color: #6b7280; }
        .timer-value { font-size: 24px; font-weight: 800; color: #3b82f6; }
        .progress-timeline { background: white; border-radius: 20px; padding: 40px; border: 2px solid #e5e7eb; margin-bottom: 32px; }
        .timeline-step { display: flex; gap: 20px; padding: 24px 0; position: relative; }
        .timeline-step:not(:last-child)::after { content: ''; position: absolute; left: 23px; top: 60px; width: 3px; height: calc(100% - 20px); background: #e5e7eb; }
        .timeline-step.completed::after { background: #10b981; }
        .step-icon { width: 48px; height: 48px; border-radius: 50%; background: #f9fafb; border: 3px solid #e5e7eb; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0; position: relative; z-index: 1; }
        .timeline-step.completed .step-icon { background: #10b981; border-color: #10b981; }
        .timeline-step.active .step-icon { background: #3b82f6; border-color: #3b82f6; animation: pulse 2s ease-in-out infinite; }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        .step-title { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
        .step-time { font-size: 14px; color: #6b7280; }
        .waiting-state { background: white; border-radius: 20px; padding: 60px 40px; text-align: center; border: 2px solid #e5e7eb; margin-bottom: 32px; }
        .waiting-animation { position: relative; width: 120px; height: 120px; margin: 0 auto 32px; }
        .pulse-circle { position: absolute; inset: 0; border-radius: 50%; background: rgba(59, 130, 246, 0.1); animation: pulse-expand 2s ease-out infinite; }
        @keyframes pulse-expand { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.5); opacity: 0; } }
        .waiting-icon { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 60px; }
        .waiting-state h3 { font-size: 24px; font-weight: 700; margin: 0 0 12px; }
        .quotes-section { margin-bottom: 32px; }
        .quotes-section h2 { font-size: 24px; font-weight: 700; margin-bottom: 24px; }
        .quotes-grid { display: grid; gap: 20px; }
        .quote-card { background: white; border: 2px solid #e5e7eb; border-radius: 16px; padding: 24px; transition: all 0.3s; }
        .quote-card:hover { border-color: #3b82f6; box-shadow: 0 10px 40px rgba(0,0,0,0.1); transform: translateY(-4px); }
        .quote-header { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 16px; }
        .pro-info { display: flex; align-items: center; gap: 16px; }
        .pro-avatar { width: 56px; height: 56px; background: #3b82f6; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 24px; }
        .pro-info h3 { font-size: 18px; font-weight: 700; margin: 0 0 4px; }
        .quote-time { font-size: 13px; color: #9ca3af; margin: 0; }
        .quote-price { font-size: 32px; font-weight: 800; color: #3b82f6; }
        .quote-message { padding: 16px; background: #f9fafb; border-radius: 12px; margin-bottom: 16px; }
        .quote-message p { font-size: 15px; color: #6b7280; margin: 0; }
        .quote-footer { display: flex; gap: 12px; padding-top: 16px; border-top: 1px solid #e5e7eb; }
        .request-details { background: white; border-radius: 20px; padding: 32px; border: 2px solid #e5e7eb; }
        .request-details h3 { font-size: 20px; font-weight: 700; margin: 0 0 24px; }
        .details-grid { display: grid; gap: 20px; }
        .detail-item strong { display: block; font-size: 14px; color: #6b7280; margin-bottom: 8px; }
        .detail-item p { font-size: 16px; margin: 0; }
        @media (max-width: 768px) {
          .tracking-header { flex-direction: column; align-items: flex-start; }
          .quote-header { flex-direction: column; align-items: flex-start; }
          .quote-footer { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}