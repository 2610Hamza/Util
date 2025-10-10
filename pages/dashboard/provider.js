import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function ProviderDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quoteInputs, setQuoteInputs] = useState({});
  const [sendingQuote, setSendingQuote] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('util_user');
    if (!stored) {
      router.push('/login');
      return;
    }
    
    const u = JSON.parse(stored);
    if (u.role !== 'professional') {
      router.push('/');
      return;
    }
    
    setUser(u);
    fetchRequests(u.id);
  }, [router]);

  const fetchRequests = async (userId) => {
    try {
      const res = await fetch(`/api/requests?professionalId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (error) {
      console.error('Erreur chargement demandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuoteChange = (requestId, field, value) => {
    setQuoteInputs(prev => ({
      ...prev,
      [requestId]: {
        ...prev[requestId],
        [field]: value
      }
    }));
  };

  const handleSendQuote = async (requestId) => {
    const input = quoteInputs[requestId];
    if (!input?.price) {
      alert('Veuillez renseigner un prix');
      return;
    }

    setSendingQuote(requestId);

    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId,
          professionalId: user.id,
          professionalName: user.name,
          price: parseFloat(input.price),
          message: input.message || '',
        }),
      });

      if (res.ok) {
        alert('✅ Devis envoyé avec succès !');
        setQuoteInputs(prev => ({ ...prev, [requestId]: {} }));
        fetchRequests(user.id); // Refresh
      } else {
        const error = await res.json();
        alert('❌ ' + (error.error || 'Erreur lors de l\'envoi'));
      }
    } catch (error) {
      console.error('Erreur envoi devis:', error);
      alert('❌ Une erreur est survenue');
    } finally {
      setSendingQuote(null);
    }
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    quoted: requests.filter(r => r.status === 'quote_received').length,
    accepted: requests.filter(r => r.status === 'accepted').length,
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div>
              <h1>Bienvenue, {user?.name} 💼</h1>
              <p>Gérez vos demandes et développez votre activité</p>
            </div>
            <Link href="/signup-pro" className="btn btn-primary">
              ⚙️ Gérer mon profil
            </Link>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="dashboard-content">
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
                📋
              </div>
              <div className="stat-info">
                <div className="stat-value">{stats.total}</div>
                <div className="stat-label">Demandes reçues</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                ⏳
              </div>
              <div className="stat-info">
                <div className="stat-value">{stats.pending}</div>
                <div className="stat-label">En attente de devis</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
                💬
              </div>
              <div className="stat-info">
                <div className="stat-value">{stats.quoted}</div>
                <div className="stat-label">Devis envoyés</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                ✅
              </div>
              <div className="stat-info">
                <div className="stat-value">{stats.accepted}</div>
                <div className="stat-label">Missions acceptées</div>
              </div>
            </div>
          </div>

          {/* Performance Card */}
          <div className="performance-card">
            <div className="performance-header">
              <div>
                <h3>📊 Vos performances</h3>
                <p>Statistiques ce mois-ci</p>
              </div>
              <div className="performance-badge">
                🌟 Professionnel actif
              </div>
            </div>
            
            <div className="performance-metrics">
              <div className="metric">
                <div className="metric-value">4.8★</div>
                <div className="metric-label">Note moyenne</div>
              </div>
              <div className="metric">
                <div className="metric-value">~2h</div>
                <div className="metric-label">Temps de réponse</div>
              </div>
              <div className="metric">
                <div className="metric-value">85%</div>
                <div className="metric-label">Taux d'acceptation</div>
              </div>
              <div className="metric">
                <div className="metric-value">{stats.total}</div>
                <div className="metric-label">Missions ce mois</div>
              </div>
            </div>
          </div>

          {/* Requests List */}
          <div className="requests-section">
            <div className="section-header">
              <h2>Demandes reçues</h2>
              {requests.length > 0 && (
                <span className="requests-count">{requests.length} demande(s)</span>
              )}
            </div>

            {requests.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h3>Aucune demande pour le moment</h3>
                <p>Les clients vous contacteront bientôt pour leurs projets</p>
                <Link href="/signup-pro" className="btn btn-primary">
                  ⚙️ Optimiser mon profil
                </Link>
              </div>
            ) : (
              <div className="requests-list">
                {requests.map((request) => (
                  <div key={request.id} className="request-card">
                    <div className="request-header">
                      <div>
                        <h3>{request.title}</h3>
                        <p className="request-date">
                          📅 {new Date(request.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <span className={`status-badge ${request.status}`}>
                        {request.status === 'pending' && '⏳ Nouveau'}
                        {request.status === 'quote_received' && '💬 Devis envoyé'}
                        {request.status === 'accepted' && '✅ Accepté'}
                        {request.status === 'completed' && '🎉 Terminé'}
                      </span>
                    </div>

                    <p className="request-description">{request.description}</p>

                    {request.budget && (
                      <div className="request-budget">
                        💰 Budget client : <strong>{request.budget}€</strong>
                      </div>
                    )}

                    {/* Quote Form */}
                    {request.status === 'pending' && (
                      <div className="quote-form">
                        <h4>📝 Envoyer un devis</h4>
                        
                        <div className="quote-inputs">
                          <div className="form-group">
                            <label>Votre prix (€)</label>
                            <input
                              type="number"
                              placeholder="Ex: 150"
                              value={quoteInputs[request.id]?.price || ''}
                              onChange={(e) => handleQuoteChange(request.id, 'price', e.target.value)}
                              min="0"
                              step="0.01"
                            />
                          </div>

                          <div className="form-group">
                            <label>Message (optionnel)</label>
                            <textarea
                              placeholder="Décrivez votre prestation..."
                              value={quoteInputs[request.id]?.message || ''}
                              onChange={(e) => handleQuoteChange(request.id, 'message', e.target.value)}
                              rows={3}
                            />
                          </div>
                        </div>

                        <button
                          className="btn btn-primary"
                          onClick={() => handleSendQuote(request.id)}
                          disabled={sendingQuote === request.id}
                        >
                          {sendingQuote === request.id ? (
                            <>
                              <span className="loading"></span>
                              Envoi...
                            </>
                          ) : (
                            <>💬 Envoyer le devis</>
                          )}
                        </button>
                      </div>
                    )}

                    {request.status !== 'pending' && (
                      <div className="request-footer">
                        <Link 
                          href={`/requests/${request.id}`}
                          className="btn btn-ghost btn-sm"
                        >
                          Voir les détails
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-page {
          min-height: 100vh;
          background: var(--bg);
          padding-bottom: 80px;
        }

        .dashboard-loading {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid var(--border);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .dashboard-header {
          background: linear-gradient(135deg, 
            rgba(139, 92, 246, 0.05) 0%, 
            rgba(236, 72, 153, 0.05) 100%
          );
          padding: 48px 0;
          margin-bottom: 48px;
          border-bottom: 1px solid var(--border);
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .header-content h1 {
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 800;
          margin: 0 0 8px;
          letter-spacing: -0.02em;
        }

        .header-content p {
          font-size: 16px;
          color: var(--text-secondary);
          margin: 0;
        }

        .dashboard-content {
          display: flex;
          flex-direction: column;
          gap: 48px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 24px;
          background: white;
          border: 2px solid var(--border);
          border-radius: 16px;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          border-color: var(--border-hover);
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .stat-info {
          flex: 1;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 800;
          color: var(--text);
          line-height: 1;
          margin-bottom: 6px;
        }

        .stat-label {
          font-size: 14px;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .performance-card {
          background: white;
          border: 2px solid var(--border);
          border-radius: 16px;
          padding: 32px;
        }

        .performance-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
        }

        .performance-header h3 {
          font-size: 22px;
          font-weight: 700;
          margin: 0 0 6px;
        }

        .performance-header p {
          font-size: 14px;
          color: var(--text-secondary);
          margin: 0;
        }

        .performance-badge {
          padding: 12px 20px;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%);
          border: 2px solid rgba(16, 185, 129, 0.3);
          border-radius: 999px;
          font-weight: 600;
          color: var(--success);
        }

        .performance-metrics {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        .metric {
          text-align: center;
          padding: 24px;
          background: var(--bg);
          border-radius: 12px;
        }

        .metric-value {
          font-size: 28px;
          font-weight: 800;
          color: var(--accent);
          margin-bottom: 8px;
        }

        .metric-label {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .section-header h2 {
          font-size: 24px;
          font-weight: 700;
          margin: 0;
        }

        .requests-count {
          font-size: 14px;
          color: var(--text-muted);
          font-weight: 600;
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
          background: white;
          border: 2px dashed var(--border);
          border-radius: 16px;
        }

        .empty-icon {
          font-size: 80px;
          margin-bottom: 24px;
          opacity: 0.5;
        }

        .empty-state h3 {
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 12px;
        }

        .empty-state p {
          font-size: 16px;
          color: var(--text-secondary);
          margin: 0 0 32px;
        }

        .requests-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .request-card {
          background: white;
          border: 2px solid var(--border);
          border-radius: 16px;
          padding: 24px;
          transition: all 0.3s ease;
        }

        .request-card:hover {
          border-color: var(--border-hover);
          box-shadow: var(--shadow-lg);
        }

        .request-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 16px;
        }

        .request-header h3 {
          font-size: 20px;
          font-weight: 700;
          margin: 0 0 8px;
          color: var(--text);
        }

        .request-date {
          font-size: 14px;
          color: var(--text-muted);
          margin: 0;
        }

        .status-badge {
          padding: 8px 16px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
        }

        .status-badge.pending {
          background: rgba(245, 158, 11, 0.1);
          color: var(--warning);
          border: 2px solid rgba(245, 158, 11, 0.3);
        }

        .status-badge.quote_received {
          background: rgba(59, 130, 246, 0.1);
          color: var(--accent);
          border: 2px solid rgba(59, 130, 246, 0.3);
        }

        .status-badge.accepted {
          background: rgba(16, 185, 129, 0.1);
          color: var(--success);
          border: 2px solid rgba(16, 185, 129, 0.3);
        }

        .request-description {
          font-size: 15px;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0 0 16px;
        }

        .request-budget {
          font-size: 14px;
          color: var(--text-secondary);
          margin-bottom: 20px;
          padding: 12px 16px;
          background: rgba(59, 130, 246, 0.05);
          border-radius: 10px;
        }

        .request-budget strong {
          color: var(--accent);
          font-weight: 700;
        }

        .quote-form {
          margin-top: 24px;
          padding: 24px;
          background: var(--bg);
          border-radius: 12px;
          border: 2px dashed var(--border);
        }

        .quote-form h4 {
          font-size: 16px;
          font-weight: 700;
          margin: 0 0 20px;
        }

        .quote-inputs {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 16px;
          margin-bottom: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-size: 13px;
          font-weight: 600;
          color: var(--text);
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
        }

        .request-footer {
          display: flex;
          gap: 12px;
          padding-top: 20px;
          border-top: 1px solid var(--border);
        }

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .performance-metrics {
            grid-template-columns: repeat(2, 1fr);
          }

          .quote-inputs {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .header-content {
            flex-direction: column;
            align-items: flex-start;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .performance-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .performance-metrics {
            grid-template-columns: 1fr;
          }

          .request-header {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}