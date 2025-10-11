import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';

export default function ClientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const userData = localStorage.getItem('util_user');
    if (!userData) {
      router.push('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'client') {
      router.push('/dashboard/provider');
      return;
    }
    
    setUser(parsedUser);
  }, []);

  useEffect(() => {
    if (user) {
      fetchRequests();
      const interval = setInterval(fetchRequests, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRequests(data || []);
      
      setStats({
        total: data?.length || 0,
        pending: data?.filter(r => r.status === 'pending' || r.status === 'quote_received').length || 0,
        inProgress: data?.filter(r => r.status === 'accepted').length || 0,
        completed: data?.filter(r => r.status === 'completed').length || 0,
      });
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredRequests = () => {
    if (filter === 'all') return requests;
    if (filter === 'pending') return requests.filter(r => r.status === 'pending' || r.status === 'quote_received');
    if (filter === 'accepted') return requests.filter(r => r.status === 'accepted');
    if (filter === 'completed') return requests.filter(r => r.status === 'completed');
    return requests;
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: '⏳ En attente', class: 'status-pending' },
      quote_received: { text: '💬 Devis reçus', class: 'status-quote' },
      accepted: { text: '✅ En cours', class: 'status-accepted' },
      completed: { text: '🎉 Terminé', class: 'status-completed' },
      cancelled: { text: '❌ Annulé', class: 'status-cancelled' },
    };
    return badges[status] || badges.pending;
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Chargement de votre espace...</p>
        </div>
        <style jsx>{`
          .dashboard-page { min-height: 100vh; background: #f9fafb; padding: 48px 0; }
          .loading-state { min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; }
          .loading-spinner { width: 50px; height: 50px; border: 3px solid #e5e7eb; border-top-color: #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  const filteredRequests = getFilteredRequests();

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Bonjour {user?.name} 👋</h1>
            <p className="subtitle">Gérez vos demandes de services</p>
          </div>
          <Link href="/search" className="btn btn-primary">
            ➕ Nouvelle demande
          </Link>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total demandes</div>
            </div>
          </div>

          <div className="stat-card highlight">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <div className="stat-value">{stats.pending}</div>
              <div className="stat-label">En attente</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🔄</div>
            <div className="stat-content">
              <div className="stat-value">{stats.inProgress}</div>
              <div className="stat-label">En cours</div>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-value">{stats.completed}</div>
              <div className="stat-label">Terminées</div>
            </div>
          </div>
        </div>

        <div className="filters-bar">
          <div className="filters">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Toutes ({requests.length})
            </button>
            <button 
              className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              En attente ({stats.pending})
            </button>
            <button 
              className={`filter-btn ${filter === 'accepted' ? 'active' : ''}`}
              onClick={() => setFilter('accepted')}
            >
              En cours ({stats.inProgress})
            </button>
            <button 
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Terminées ({stats.completed})
            </button>
          </div>
        </div>

        <div className="requests-section">
          {filteredRequests.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>Aucune demande</h3>
              <p>
                {filter === 'all' 
                  ? "Vous n'avez pas encore créé de demande"
                  : `Aucune demande ${filter === 'pending' ? 'en attente' : filter === 'accepted' ? 'en cours' : 'terminée'}`
                }
              </p>
              {filter === 'all' && (
                <Link href="/search" className="btn btn-primary">
                  Créer ma première demande
                </Link>
              )}
            </div>
          ) : (
            <div className="requests-grid">
              {filteredRequests.map((request) => {
                const badge = getStatusBadge(request.status);
                const daysAgo = Math.floor((new Date() - new Date(request.created_at)) / (1000 * 60 * 60 * 24));
                
                return (
                  <div key={request.id} className="request-card">
                    <div className="request-header">
                      <h3>{request.title}</h3>
                      <span className={`status-badge ${badge.class}`}>
                        {badge.text}
                      </span>
                    </div>

                    <p className="request-description">
                      {request.description.length > 120 
                        ? request.description.substring(0, 120) + '...'
                        : request.description
                      }
                    </p>

                    <div className="request-meta">
                      <div className="meta-item">
                        <span className="meta-icon">📅</span>
                        <span className="meta-text">
                          {daysAgo === 0 ? "Aujourd'hui" : `Il y a ${daysAgo}j`}
                        </span>
                      </div>
                      {request.budget && (
                        <div className="meta-item">
                          <span className="meta-icon">💰</span>
                          <span className="meta-text">{request.budget}€</span>
                        </div>
                      )}
                      {request.professional_name && (
                        <div className="meta-item">
                          <span className="meta-icon">👤</span>
                          <span className="meta-text">{request.professional_name}</span>
                        </div>
                      )}
                    </div>

                    <div className="request-actions">
                      <Link 
                        href={`/requests/${request.id}/tracking`}
                        className="btn btn-ghost btn-sm"
                      >
                        📊 Voir détails
                      </Link>
                      
                      {(request.status === 'accepted' || request.status === 'completed') && (
                        <Link 
                          href={`/messages/${request.id}`}
                          className="btn btn-ghost btn-sm"
                        >
                          💬 Messagerie
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

      <style jsx>{`
        .dashboard-page { min-height: 100vh; background: #f9fafb; padding: 48px 0 80px; }
        .dashboard-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; gap: 24px; }
        .dashboard-header h1 { font-size: 32px; font-weight: 800; margin: 0 0 8px; }
        .subtitle { font-size: 16px; color: #6b7280; margin: 0; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 32px; }
        .stat-card { background: white; border: 2px solid #e5e7eb; border-radius: 16px; padding: 24px; display: flex; align-items: center; gap: 20px; transition: all 0.3s; }
        .stat-card:hover { transform: translateY(-4px); box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
        .stat-card.highlight { background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%); border-color: rgba(59, 130, 246, 0.3); }
        .stat-card.success { background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%); border-color: rgba(16, 185, 129, 0.3); }
        .stat-icon { width: 56px; height: 56px; background: #f9fafb; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 28px; flex-shrink: 0; }
        .stat-value { font-size: 32px; font-weight: 800; line-height: 1; margin-bottom: 4px; }
        .stat-label { font-size: 14px; color: #6b7280; font-weight: 600; }
        .filters-bar { background: white; border: 2px solid #e5e7eb; border-radius: 16px; padding: 20px; margin-bottom: 32px; }
        .filters { display: flex; gap: 12px; flex-wrap: wrap; }
        .filter-btn { padding: 10px 20px; background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 999px; font-weight: 600; font-size: 14px; color: #6b7280; cursor: pointer; transition: all 0.2s; }
        .filter-btn:hover { border-color: #3b82f6; color: #3b82f6; }
        .filter-btn.active { background: #3b82f6; border-color: #3b82f6; color: white; }
        .empty-state { background: white; border: 2px solid #e5e7eb; border-radius: 20px; padding: 80px 40px; text-align: center; }
        .empty-icon { font-size: 80px; margin-bottom: 24px; opacity: 0.5; }
        .empty-state h3 { font-size: 24px; font-weight: 700; margin: 0 0 12px; }
        .empty-state p { font-size: 16px; color: #6b7280; margin: 0 0 24px; }
        .requests-grid { display: grid; gap: 20px; }
        .request-card { background: white; border: 2px solid #e5e7eb; border-radius: 16px; padding: 24px; transition: all 0.3s; }
        .request-card:hover { border-color: #3b82f6; box-shadow: 0 10px 40px rgba(0,0,0,0.1); transform: translateY(-2px); }
        .request-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 12px; }
        .request-header h3 { font-size: 20px; font-weight: 700; margin: 0; flex: 1; }
        .status-badge { padding: 6px 14px; border-radius: 999px; font-size: 13px; font-weight: 600; white-space: nowrap; }
        .status-pending { background: rgba(251, 191, 36, 0.1); color: #f59e0b; border: 1px solid rgba(251, 191, 36, 0.3); }
        .status-quote { background: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.3); }
        .status-accepted { background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); }
        .status-completed { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; border: 1px solid rgba(139, 92, 246, 0.3); }
        .request-description { font-size: 15px; color: #6b7280; line-height: 1.6; margin: 0 0 16px; }
        .request-meta { display: flex; flex-wrap: wrap; gap: 16px; padding: 16px 0; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; margin-bottom: 16px; }
        .meta-item { display: flex; align-items: center; gap: 8px; }
        .meta-icon { font-size: 16px; }
        .meta-text { font-size: 14px; color: #6b7280; font-weight: 600; }
        .request-actions { display: flex; gap: 12px; flex-wrap: wrap; }
        @media (max-width: 768px) {
          .dashboard-header { flex-direction: column; align-items: flex-start; }
          .stats-grid { grid-template-columns: 1fr; }
          .filters { flex-direction: column; }
          .filter-btn { width: 100%; }
          .request-header { flex-direction: column; }
          .request-actions { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}