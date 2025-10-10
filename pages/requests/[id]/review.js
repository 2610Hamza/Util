import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function ReviewPage() {
  const router = useRouter();
  const { id } = router.query;
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (!id) return;
    fetchRequest();
  }, [id]);

  const fetchRequest = async () => {
    try {
      const res = await fetch(`/api/requests?id=${id}`);
      if (res.ok) {
        const data = await res.json();
        setRequest(data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      alert('Veuillez sélectionner une note');
      return;
    }

    const userStr = localStorage.getItem('util_user');
    if (!userStr) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userStr);
    setSubmitting(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: id,
          clientId: user.id,
          professionalId: request.professionalId,
          rating,
          comment,
        }),
      });

      if (res.ok) {
        alert('✅ Merci pour votre avis !');
        router.push('/dashboard/client');
      } else {
        const error = await res.json();
        alert('❌ ' + (error.error || 'Erreur'));
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Une erreur est survenue');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="review-page">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="review-page">
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
    <div className="review-page">
      <div className="container">
        <div className="review-container">
          <Link href="/dashboard/client" className="back-link">
            ← Retour
          </Link>

          <div className="review-header">
            <h1>Évaluez la prestation</h1>
            <p>Votre avis aide la communauté à choisir les meilleurs professionnels</p>
          </div>

          <div className="request-info">
            <h3>{request.title}</h3>
            <p>{request.description}</p>
          </div>

          <form onSubmit={handleSubmit} className="review-form">
            {/* Rating Stars */}
            <div className="rating-section">
              <label>Votre note *</label>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star ${star <= (hoveredRating || rating) ? 'active' : ''}`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                  >
                    ★
                  </button>
                ))}
              </div>
              <div className="rating-labels">
                <span className="muted">Mauvais</span>
                <span className="muted">Excellent</span>
              </div>
            </div>

            {/* Comment */}
            <div className="form-group">
              <label>Votre commentaire (optionnel)</label>
              <textarea
                placeholder="Décrivez votre expérience avec ce professionnel..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
              />
              <span className="input-hint">
                Soyez constructif et respectueux
              </span>
            </div>

            {/* Quick tags */}
            <div className="quick-tags">
              <label>Points forts (optionnel)</label>
              <div className="tags-grid">
                {['Ponctuel', 'Professionnel', 'Bon rapport qualité/prix', 'Travail soigné', 'Sympathique', 'Efficace'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className="tag-btn"
                    onClick={() => setComment(prev => prev ? `${prev}\n• ${tag}` : `• ${tag}`)}
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={submitting || rating === 0}
              style={{ width: '100%' }}
            >
              {submitting ? (
                <>
                  <span className="loading"></span>
                  Envoi en cours...
                </>
              ) : (
                'Publier mon avis'
              )}
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .review-page {
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

        .review-container {
          max-width: 700px;
          margin: 0 auto;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 32px;
          transition: var(--transition);
        }

        .back-link:hover {
          color: var(--text);
        }

        .review-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .review-header h1 {
          font-size: 32px;
          font-weight: 700;
          margin: 0 0 12px;
        }

        .review-header p {
          font-size: 16px;
          color: var(--text-secondary);
          margin: 0;
        }

        .request-info {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 24px;
          margin-bottom: 32px;
        }

        .request-info h3 {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 8px;
        }

        .request-info p {
          font-size: 15px;
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.5;
        }

        .review-form {
          background: white;
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 32px;
        }

        .rating-section {
          margin-bottom: 32px;
        }

        .rating-section label {
          display: block;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .stars {
          display: flex;
          gap: 8px;
          justify-content: center;
          margin-bottom: 8px;
        }

        .star {
          width: 56px;
          height: 56px;
          background: none;
          border: none;
          font-size: 48px;
          color: var(--border);
          cursor: pointer;
          transition: var(--transition);
          padding: 0;
        }

        .star:hover,
        .star.active {
          color: #FFD700;
          transform: scale(1.1);
        }

        .rating-labels {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-group label {
          display: block;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .input-hint {
          display: block;
          font-size: 13px;
          color: var(--text-muted);
          margin-top: 6px;
        }

        .quick-tags {
          margin-bottom: 32px;
        }

        .quick-tags label {
          display: block;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .tags-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .tag-btn {
          padding: 10px 16px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
        }

        .tag-btn:hover {
          background: white;
          border-color: var(--primary);
        }

        @media (max-width: 640px) {
          .review-form {
            padding: 24px;
          }

          .star {
            width: 48px;
            height: 48px;
            font-size: 40px;
          }

          .tags-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}