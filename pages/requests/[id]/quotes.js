import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function RequestQuotes() {
  const router = useRouter();
  const { id } = router.query;
  const [request, setRequest] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      // Récupérer la demande
      const reqRes = await fetch(`/api/requests?id=${id}`);
      if (reqRes.ok) {
        const reqData = await reqRes.json();
        setRequest(reqData);
      }

      // Récupérer les devis
      const quotesRes = await fetch(`/api/quotes?requestId=${id}`);
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

    setProcessing(quoteId);

    try {
      const res = await fetch('/api/payment/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quoteId,
          requestId: id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.url) {
          // Rediriger vers Stripe
          window.location.href = data.url;
        } else {
          // Mode démo
          alert('✅ Paiement simulé avec succès (mode démo)');
          router.push(`/payment/success?requestId=${id}&quoteId=${quoteId}`);
        }
      } else {
        alert('❌ ' + (data.error || 'Erreur'));
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Une erreur est survenue');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="quotes-page">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="quotes-page">
        <div className="error">
          <h2>Demande introuvable</h2>
          <Link href="/dashboard/client" className="btn btn-primary">
            ← Retour au dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="quotes-page">
      <div className="container">
        <Link href="/dashboard/client" className="back-link">
          ← Retour
        </Link>

        {/* Request Info */}
        <div className="request-card">
          <h1>{request.title}</h1>
          <p className="request-description">{request.description}</p>
          {request.budget && (
            <div className="request-budget">
              Budget estimé : <strong>{request.budget}€</strong>
            </div>
          )}
        </div>

        {/* Quotes List */}
        <div className="quotes-section">
          <h2>Devis reçus ({quotes.length})</h2>

          {quotes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <h3>Aucun devis pour le moment</h3>
              <p>Les professionnels vont vous répondre bientôt</p>
            </div>
          ) : (
            <div className="quotes-grid">
              {quotes.map((quote) => (
                <div key={quote.id} className="quote-card">
                  <div className="quote-header">
                    <div className="pro-info">
                      <div className="pro-avatar">
                        {quote.professionalName.charAt(0)}
                      </div>
                      <div>
                        <h3>{quote.professionalName}</h3>
                        <p className="quote-date">
                          {new Date(quote.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="quote-price">
                      {quote.price}€
                    </div>
                  </div>

                  {quote.message && (
                    <div className="quote-message">
                      <p>{quote.message}</p>
                    </div>
                  )}

                  <div className="quote-footer">
                    <Link 
                      href={`/professionals/${quote.professionalId}`}
                      className="btn btn-secondary"
                    >
                      Voir le profil
                    </Link>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleAcceptQuote(quote.id)}
                      disabled={processing === quote.id}
                    >
                      {processing === quote.id ? (
                        <>
                          <span className="loading"></span>
                          Traitement...
                        </>
                      ) : (
                        '✓ Accepter et payer'
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .quotes-page {
          min-height: 100vh;
          background: var(--bg);
          padding: 48px 0 80px;
        }

        .loading,
        .error {
          min-height: 60vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 3px solid var(--border);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 24px;
          transition: var(--transition);
        }

        .back-link:hover {
          color: var(--text);
        }

        .request-card {
          background: white;
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 32px;
          margin-bottom: 32px;
        }

        .request-card h1 {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 16px;
        }

        .request-description {
          font-size: 16px;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0 0 16px;
        }

        .request-budget {
          display: inline-flex;
          padding: 12px 20px;
          background: var(--bg-secondary);
          border-radius: var(--radius);
          font-size: 15px;
        }

        .request-budget strong {
          font-weight: 700;
          margin-left: 8px;
        }

        .quotes-section h2 {
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 24px;
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
          background: white;
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .empty-state h3 {
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 8px;
        }

        .empty-state p {
          color: var(--text-secondary);
          margin: 0;
        }

        .quotes-grid {
          display: grid;
          gap: 20px;
        }

        .quote-card {
          background: white;
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 24px;
          transition: var(--transition);
        }

        .quote-card:hover {
          border-color: var(--border-hover);
          box-shadow: var(--shadow-lg);
        }

        .quote-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .pro-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .pro-avatar {
          width: 48px;
          height: 48px;
          background: var(--primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 20px;
        }

        .pro-info h3 {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 4px;
        }

        .quote-date {
          font-size: 13px;
          color: var(--text-muted);
          margin: 0;
        }

        .quote-price {
          font-size: 32px;
          font-weight: 700;
          color: var(--primary);
        }

        .quote-message {
          padding: 16px;
          background: var(--bg-secondary);
          border-radius: var(--radius);
          margin-bottom: 20px;
        }

        .quote-message p {
          font-size: 15px;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        .quote-footer {
          display: flex;
          gap: 12px;
          padding-top: 20px;
          border-top: 1px solid var(--border);
        }

        @media (max-width: 640px) {
          .quote-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .quote-footer {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}