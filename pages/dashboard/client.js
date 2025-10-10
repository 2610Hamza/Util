import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function ClientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('util_user');
    if (!stored) {
      router.push('/login');
      return;
    }
    
    const u = JSON.parse(stored);
    if (u.role !== 'client') {
      router.push('/');
      return;
    }
    
    setUser(u);
    fetchRequests(u.id);
  }, [router]);

  const fetchRequests = async (userId) => {
    try {
      const res = await fetch(`/api/requests?clientId=${userId}`);
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

  const getStatusBadge = (status) => {
    const badges = {
      pending: { label: 'En attente', color: '#f59e0b' },
      quote_received: { label: 'Devis reçu', color: '#3b82f6' },
      accepted: { label: 'Accepté', color: '#10b981' },
      completed: { label: 'Terminé', color: '#6366f1' },
    };
    return badges[status] || badges.pending;
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
              <h1>Bonjour, {user?.name} 👋</h1>
              <p>Gérez vos demandes et trouvez des professionnels</p>
            </div>
            <Link href="/search" className="btn btn-primary">
              🔍 Trouver un pro
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
                <div className="stat-value">{requests.length}</div>
                <div className="stat-label">Demandes totales</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                ⏳
              </div>
              <div className="stat-info">
                <div className="stat-value">
                  {requests.filter(r => r.status === 'pending' || r.status === 'quote_received').length}
                </div>
                <div className="stat-label">En cours</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                ✅
              </div>
              <div className="stat-info">
                <div className="stat-value">
                  {requests.filter(r => r.status === 'completed').length}
                </div>
                <div className="stat-label">Terminées</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
                💬
              </div>
              <div className="stat-info">
                <div className="stat-value">
                  {requests.filter(r => r.status === 'quote_received').length}
                </div>
                <div className="stat-label">Devis reçus</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h2>Actions rapides</h2>
            <div className="actions-grid">
              <Link href="/search" className="action-card">
                <div className="action-icon">🔍</div>
                <div>
                  <h3>Rechercher un pro</h3>
                  <p>Trouvez le professionnel parfait</p>
                </div>
                <span className="action-arrow">→</span>
              </Link>

              <Link href="/categories" className="action-card">
                <div className="action-icon">📂</div>
                <div>
                  <h3>Parcourir les catégories</h3>
                  <p>Explorez tous les services</p>
                </div>
                <span className="action-arrow">→</span>
              </Link>

              <Link href="/ai" className="action-card ai-card">
                <div className="action-icon">✨</div>
                <div>
                  <h3>Recherche IA</h3>
                  <p>Matching intelligent par IA</p>
                </div>
                <span className="action-arrow">→</span>
              </Link>
            </div>
          </div>

          {/* Requests List */}
          <div className="requests-section">
            <div className="section-header">
              <h2>Mes demandes</h2>
              {requests.length > 0 && (
                <span className="requests-count">{requests.length} demande(s)</span>
              )}
            </div>

            {requests.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h3>Aucune demande pour le moment</h3>
                <p>Commencez par rechercher un professionnel pour votre projet</p>
                <Link href="/search" className="btn btn-primary">
                  🔍 Trouver un professionnel
                </Link>
              </div>
            ) : (
              <div className="requests-list">
                {requests.map((request) => {
                  const statusBadge = getStatusBadge(request.status);
                  return (
                    <div key={request.id} className="request-card">
                      <div className="request-header">
                        <div>
                          <h3>{request.title}</h3>
                          <p className="request-date">
                            📅 {new Date(request.createdAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <span 
                          className="status-badge" 
                          style={{ background: `${statusBadge.color}22`, color: statusBadge.color }}
                        >
                          {statusBadge.label}
                        </span>
                      </div>

                      <p className="request-description">{request.description}</p>

                      {request.budget && (
                        <div className="request-budget">
                          💰 Budget estimé : <strong>{request.budget}€</strong>
                        </div>
                      )}

                      <div className="request-footer">
                        <Link 
                          href={`/requests/${request.id}`}
                          className="btn btn-ghost btn-sm"
                        >
                          Voir les détails
                        </Link>
                        
                        {request.status === 'quote_received' && (
                          <Link 
                            href={`/requests/${request.id}/quotes`}
                            className="btn btn-primary btn-sm"
                          >
                            💬 Voir les devis
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
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
            rgba(59, 130, 246, 0.05) 0%, 
            rgba(139, 92, 246, 0.05) 100%
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

        .quick-actions h2,
        .section-header h2 {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 24px;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .action-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 24px;
          background: white;
          border: 2px solid var(--border);
          border-radius: 16px;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .action-card:hover {
          border-color: var(--accent);
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .action-card.ai-card {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%);
          border-color: rgba(139, 92, 246, 0.3);
        }

        .action-icon {
          font-size: 40px;
          flex-shrink: 0;
        }

        .action-card h3 {
          font-size: 16px;
          font-weight: 700;
          margin: 0 0 4px;
          color: var(--text);
        }

        .action-card p {
          font-size: 13px;
          color: var(--text-secondary);
          margin: 0;
        }

        .action-arrow {
          font-size: 24px;
          color: var(--text-muted);
          margin-left: auto;
          transition: all 0.2s ease;
        }

        .action-card:hover .action-arrow {
          transform: translateX(4px);
          color: var(--accent);
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
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
          background: rgba(16, 185, 129, 0.05);
          border-radius: 10px;
        }

        .request-budget strong {
          color: var(--success);
          font-weight: 700;
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

          .actions-grid {
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

          .request-header {
            flex-direction: column;
          }

          .request-footer {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}