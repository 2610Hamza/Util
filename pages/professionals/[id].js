import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ProfessionalProfile() {
  const router = useRouter();
  const { id } = router.query;
  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestData, setRequestData] = useState({
    title: '',
    description: '',
    budget: '',
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchProfessional();
  }, [id]);

  const fetchProfessional = async () => {
    try {
      const res = await fetch(`/api/professionals?id=${id}`);
      if (res.ok) {
        const data = await res.json();
        setProfessional(Array.isArray(data) ? data[0] : data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    
    const userStr = localStorage.getItem('util_user');
    if (!userStr) {
      alert('Veuillez vous connecter pour envoyer une demande');
      router.push('/login');
      return;
    }

    const user = JSON.parse(userStr);
    setSending(true);

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...requestData,
          budget: requestData.budget ? parseFloat(requestData.budget) : null,
          clientId: user.id,
          professionalId: id,
        }),
      });

      if (res.ok) {
        alert('✅ Demande envoyée avec succès !');
        setShowRequestForm(false);
        setRequestData({ title: '', description: '', budget: '' });
        router.push('/dashboard/client');
      } else {
        const error = await res.json();
        alert('❌ ' + (error.error || 'Erreur'));
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Une erreur est survenue');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="loading-spinner"></div>
        <p>Chargement du profil...</p>
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="error-page">
        <div className="error-icon">😕</div>
        <h2>Professionnel introuvable</h2>
        <p>Ce professionnel n'existe pas ou a été supprimé</p>
        <Link href="/search" className="btn btn-primary">
          ← Retour à la recherche
        </Link>
      </div>
    );
  }

  const name = professional.name || 'Professionnel';
  const category = professional.category || '—';
  const location = professional.location || professional.city || '—';
  const description = professional.description || professional.bio || '';
  const rating = professional.ratingAvg || 4.5;
  const reviewCount = professional.ratingCount || Math.floor(Math.random() * 50) + 10;

  return (
    <div className="profile-page">
      {/* Hero Section */}
      <div className="profile-hero">
        <div className="container">
          <Link href="/search" className="back-btn">
            ← Retour aux résultats
          </Link>

          <div className="hero-content">
            <div className="profile-main">
              <div className="profile-avatar">
                <span>{name.charAt(0).toUpperCase()}</span>
              </div>

              <div className="profile-info">
                <div className="profile-badges">
                  {professional.verified && (
                    <span className="badge-verified">✓ Vérifié</span>
                  )}
                  {rating >= 4.5 && (
                    <span className="badge-top">⭐ Top professionnel</span>
                  )}
                </div>

                <h1>{name}</h1>
                
                <div className="profile-meta">
                  <span>📂 {category}</span>
                  <span>•</span>
                  <span>📍 {location}</span>
                </div>

                <div className="profile-rating">
                  <div className="rating-stars">
                    {'⭐'.repeat(Math.round(rating))}
                  </div>
                  <span className="rating-text">
                    <strong>{rating.toFixed(1)}</strong> ({reviewCount} avis)
                  </span>
                </div>
              </div>
            </div>

            <div className="profile-actions">
              <button 
                className="btn btn-primary btn-lg"
                onClick={() => setShowRequestForm(true)}
              >
                💬 Demander un devis
              </button>
              <button className="btn btn-ghost btn-lg">
                ❤️ Sauvegarder
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container">
        <div className="profile-content">
          {/* Left Column */}
          <div className="profile-main-column">
            {/* About */}
            <div className="content-card">
              <h2>À propos</h2>
              {description ? (
                <p>{description}</p>
              ) : (
                <p className="muted">Ce professionnel n'a pas encore ajouté de description.</p>
              )}
            </div>

            {/* Services */}
            <div className="content-card">
              <h2>Services proposés</h2>
              <div className="services-list">
                <div className="service-item">
                  <span className="service-icon">🔧</span>
                  <div>
                    <strong>Dépannage</strong>
                    <p>Intervention rapide pour tous types de problèmes</p>
                  </div>
                </div>
                <div className="service-item">
                  <span className="service-icon">⚙️</span>
                  <div>
                    <strong>Installation</strong>
                    <p>Installation professionnelle et garantie</p>
                  </div>
                </div>
                <div className="service-item">
                  <span className="service-icon">🔍</span>
                  <div>
                    <strong>Diagnostic</strong>
                    <p>Analyse complète et devis détaillé</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="content-card">
              <h2>Avis clients ({reviewCount})</h2>
              <div className="reviews-list">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="review-item">
                    <div className="review-header">
                      <div className="review-avatar">
                        {String.fromCharCode(65 + i)}
                      </div>
                      <div>
                        <strong>Client {i}</strong>
                        <div className="review-rating">⭐⭐⭐⭐⭐</div>
                      </div>
                      <span className="review-date">Il y a {i} jour(s)</span>
                    </div>
                    <p className="review-text">
                      Excellent travail, professionnel et rapide. Je recommande vivement !
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="profile-sidebar">
            {/* Quick Info */}
            <div className="sidebar-card">
              <h3>Informations</h3>
              <div className="info-list">
                <div className="info-item">
                  <span className="info-icon">⚡</span>
                  <div>
                    <strong>Temps de réponse</strong>
                    <p>Environ 2 heures</p>
                  </div>
                </div>
                <div className="info-item">
                  <span className="info-icon">📍</span>
                  <div>
                    <strong>Zone d'intervention</strong>
                    <p>{location}</p>
                  </div>
                </div>
                <div className="info-item">
                  <span className="info-icon">💼</span>
                  <div>
                    <strong>Expérience</strong>
                    <p>Plus de 5 ans</p>
                  </div>
                </div>
                <div className="info-item">
                  <span className="info-icon">🎓</span>
                  <div>
                    <strong>Certifications</strong>
                    <p>Professionnel certifié</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Card */}
            <div className="sidebar-card cta-card">
              <h3>Besoin de ce service ?</h3>
              <p>Envoyez une demande gratuite et recevez un devis personnalisé</p>
              <button 
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={() => setShowRequestForm(true)}
              >
                💬 Demander un devis
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Request Modal */}
      {showRequestForm && (
        <>
          <div className="modal-overlay" onClick={() => setShowRequestForm(false)} />
          <div className="modal-content">
            <div className="modal-header">
              <h2>Envoyer une demande à {name}</h2>
              <button 
                className="modal-close"
                onClick={() => setShowRequestForm(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendRequest} className="request-form">
              <div className="form-group">
                <label>Titre de la demande *</label>
                <input
                  type="text"
                  placeholder="Ex: Réparation fuite robinet cuisine"
                  value={requestData.title}
                  onChange={(e) => setRequestData({...requestData, title: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description détaillée *</label>
                <textarea
                  placeholder="Décrivez votre besoin en détail..."
                  value={requestData.description}
                  onChange={(e) => setRequestData({...requestData, description: e.target.value})}
                  required
                  rows={5}
                />
              </div>

              <div className="form-group">
                <label>Budget estimé (€)</label>
                <input
                  type="number"
                  placeholder="Ex: 150"
                  value={requestData.budget}
                  onChange={(e) => setRequestData({...requestData, budget: e.target.value})}
                  min="0"
                  step="0.01"
                />
                <span className="input-hint">Optionnel - Aidez le pro à estimer le coût</span>
              </div>

              <div className="form-actions">
                <button 
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowRequestForm(false)}
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                  disabled={sending}
                >
                  {sending ? (
                    <>
                      <span className="loading"></span>
                      Envoi...
                    </>
                  ) : (
                    '💬 Envoyer la demande'
                  )}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      <style jsx>{`
        .loading-page,
        .error-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
          text-align: center;
          padding: 20px;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid var(--border);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .error-icon {
          font-size: 80px;
        }

        .error-page h2 {
          font-size: 28px;
          font-weight: 700;
          margin: 0;
        }

        .error-page p {
          font-size: 16px;
          color: var(--text-secondary);
          margin: 0 0 24px;
        }

        .profile-page {
          min-height: 100vh;
          background: var(--bg);
        }

        .profile-hero {
          background: linear-gradient(135deg, 
            rgba(59, 130, 246, 0.05) 0%, 
            rgba(139, 92, 246, 0.05) 100%
          );
          padding: 32px 0 48px;
          border-bottom: 1px solid var(--border);
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          font-weight: 600;
          color: var(--text-secondary);
          transition: all 0.2s ease;
          margin-bottom: 24px;
        }

        .back-btn:hover {
          color: var(--accent);
        }

        .hero-content {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 32px;
        }

        .profile-main {
          display: flex;
          gap: 24px;
          flex: 1;
        }

        .profile-avatar {
          width: 120px;
          height: 120px;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          font-weight: 900;
          color: white;
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
          flex-shrink: 0;
        }

        .profile-info {
          flex: 1;
        }

        .profile-badges {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }

        .badge-verified,
        .badge-top {
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
        }

        .badge-verified {
          background: rgba(16, 185, 129, 0.1);
          color: var(--success);
          border: 2px solid rgba(16, 185, 129, 0.3);
        }

        .badge-top {
          background: rgba(245, 158, 11, 0.1);
          color: var(--warning);
          border: 2px solid rgba(245, 158, 11, 0.3);
        }

        .profile-info h1 {
          font-size: 36px;
          font-weight: 800;
          margin: 0 0 12px;
        }

        .profile-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          color: var(--text-secondary);
          margin-bottom: 16px;
        }

        .profile-rating {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .rating-stars {
          font-size: 18px;
          letter-spacing: 2px;
        }

        .rating-text strong {
          font-weight: 700;
          color: var(--text);
        }

        .profile-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .profile-content {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 32px;
          padding: 48px 0;
        }

        .profile-main-column {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .content-card,
        .sidebar-card {
          background: white;
          border: 2px solid var(--border);
          border-radius: 16px;
          padding: 32px;
        }

        .content-card h2,
        .sidebar-card h3 {
          font-size: 22px;
          font-weight: 700;
          margin: 0 0 20px;
        }

        .content-card p {
          font-size: 15px;
          line-height: 1.7;
          color: var(--text-secondary);
          margin: 0;
        }

        .services-list,
        .info-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .service-item,
        .info-item {
          display: flex;
          gap: 16px;
        }

        .service-icon,
        .info-icon {
          font-size: 32px;
          flex-shrink: 0;
        }

        .service-item strong,
        .info-item strong {
          display: block;
          font-size: 15px;
          margin-bottom: 4px;
        }

        .service-item p,
        .info-item p {
          font-size: 13px;
          color: var(--text-secondary);
          margin: 0;
        }

        .reviews-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .review-item {
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border);
        }

        .review-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .review-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .review-avatar {
          width: 40px;
          height: 40px;
          background: var(--accent);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }

        .review-rating {
          font-size: 12px;
        }

        .review-date {
          margin-left: auto;
          font-size: 12px;
          color: var(--text-muted);
        }

        .review-text {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        .sidebar-card {
          position: sticky;
          top: 88px;
        }

        .cta-card {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          color: white;
        }

        .cta-card h3 {
          color: white;
        }

        .cta-card p {
          font-size: 14px;
          opacity: 0.9;
          margin-bottom: 20px;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 999;
          animation: fadeIn 0.2s ease;
        }

        .modal-content {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          border-radius: 20px;
          padding: 32px;
          max-width: 600px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          z-index: 1000;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, -45%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .modal-header h2 {
          font-size: 24px;
          font-weight: 700;
          margin: 0;
        }

        .modal-close {
          width: 32px;
          height: 32px;
          border: none;
          background: var(--bg);
          border-radius: 8px;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .modal-close:hover {
          background: var(--border);
        }

        .request-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-size: 14px;
          font-weight: 600;
          color: var(--text);
        }

        .input-hint {
          font-size: 12px;
          color: var(--text-muted);
        }

        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 8px;
        }

        @media (max-width: 1024px) {
          .profile-content {
            grid-template-columns: 1fr;
          }

          .sidebar-card {
            position: static;
          }
        }

        @media (max-width: 768px) {
          .hero-content {
            flex-direction: column;
          }

          .profile-main {
            flex-direction: column;
          }

          .profile-avatar {
            width: 100px;
            height: 100px;
            font-size: 40px;
          }

          .profile-info h1 {
            font-size: 28px;
          }

          .profile-actions {
            width: 100%;
          }

          .modal-content {
            width: 95%;
            padding: 24px;
          }

          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}