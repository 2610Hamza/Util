import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function PaymentSuccess() {
  const router = useRouter();
  const { session_id, requestId, quoteId } = router.query;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler une vérification
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return (
      <div className="payment-page">
        <div className="payment-loading">
          <div className="loading-spinner"></div>
          <p>Vérification du paiement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-success">
        <div className="success-icon">✓</div>
        <h1>Paiement réussi !</h1>
        <p>Votre paiement a été accepté. Le professionnel a été notifié et va bientôt commencer la mission.</p>

        <div className="success-details">
          <div className="detail-item">
            <span className="detail-label">Numéro de transaction</span>
            <span className="detail-value">{session_id || 'DEMO_' + Date.now()}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Statut</span>
            <span className="detail-value badge-success">Payé</span>
          </div>
        </div>

        <div className="success-actions">
          <Link href="/dashboard/client" className="btn btn-primary btn-lg">
            Voir ma demande
          </Link>
          <Link href="/search" className="btn btn-secondary btn-lg">
            Nouvelle recherche
          </Link>
        </div>

        <div className="success-info">
          <p>📧 Un email de confirmation a été envoyé</p>
          <p>💬 Vous pouvez maintenant discuter avec le professionnel</p>
        </div>
      </div>

      <style jsx>{`
        .payment-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: var(--bg);
        }

        .payment-loading {
          text-align: center;
        }

        .loading-spinner {
          width: 60px;
          height: 60px;
          margin: 0 auto 24px;
          border: 3px solid var(--border);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .payment-success {
          max-width: 600px;
          width: 100%;
          background: white;
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 48px;
          text-align: center;
        }

        .success-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 24px;
          background: var(--success);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          font-weight: 700;
        }

        .payment-success h1 {
          font-size: 32px;
          font-weight: 700;
          margin: 0 0 16px;
        }

        .payment-success > p {
          font-size: 16px;
          color: var(--text-secondary);
          margin: 0 0 32px;
          line-height: 1.6;
        }

        .success-details {
          background: var(--bg-secondary);
          border-radius: var(--radius);
          padding: 24px;
          margin-bottom: 32px;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid var(--border);
        }

        .detail-item:last-child {
          border-bottom: none;
        }

        .detail-label {
          font-size: 14px;
          color: var(--text-secondary);
        }

        .detail-value {
          font-weight: 600;
          font-size: 14px;
        }

        .badge-success {
          background: rgba(5, 163, 87, 0.1);
          color: var(--success);
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 13px;
        }

        .success-actions {
          display: flex;
          gap: 12px;
          margin-bottom: 32px;
        }

        .success-info {
          padding-top: 24px;
          border-top: 1px solid var(--border);
        }

        .success-info p {
          font-size: 14px;
          color: var(--text-secondary);
          margin: 8px 0;
        }

        @media (max-width: 640px) {
          .payment-success {
            padding: 32px 24px;
          }

          .success-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}