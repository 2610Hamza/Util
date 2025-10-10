import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function NotificationsDropdown({ user }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
      // Refresh toutes les 30 secondes
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user?.id) return;

    try {
      const res = await fetch(`/api/notifications?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.slice(0, 10)); // Limiter à 10
        setUnreadCount(data.filter(n => !n.read).length);
      }
    } catch (error) {
      console.error('Erreur notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: notificationId, userId: user.id }),
      });
      fetchNotifications();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const markAllAsRead = async () => {
    setLoading(true);
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, markAllAsRead: true }),
      });
      fetchNotifications();
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type) => {
    const icons = {
      new_quote: '💬',
      request_accepted: '✅',
      payment_received: '💰',
      new_review: '⭐',
      new_request: '📋',
      mission_completed: '🎉',
    };
    return icons[type] || '🔔';
  };

  if (!user) return null;

  return (
    <div className="notifications-wrapper">
      <button 
        className="notif-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        🔔
        {unreadCount > 0 && (
          <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="notif-overlay" onClick={() => setIsOpen(false)} />
          <div className="notif-dropdown">
            <div className="notif-header">
              <h3>Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  className="mark-all-btn"
                  onClick={markAllAsRead}
                  disabled={loading}
                >
                  {loading ? 'Chargement...' : 'Tout marquer comme lu'}
                </button>
              )}
            </div>

            <div className="notif-list">
              {notifications.length === 0 ? (
                <div className="notif-empty">
                  <span className="empty-icon">📭</span>
                  <p>Aucune notification</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    className={`notif-item ${!notif.read ? 'unread' : ''}`}
                    onClick={() => {
                      if (!notif.read) markAsRead(notif.id);
                      if (notif.link) {
                        window.location.href = notif.link;
                      }
                    }}
                  >
                    <div className="notif-icon">{getIcon(notif.type)}</div>
                    <div className="notif-content">
                      <div className="notif-title">{notif.title}</div>
                      <div className="notif-message">{notif.message}</div>
                      <div className="notif-time">
                        {new Date(notif.createdAt).toLocaleString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .notifications-wrapper {
          position: relative;
        }

        .notif-button {
          position: relative;
          width: 40px;
          height: 40px;
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          border-radius: var(--radius);
          transition: var(--transition);
        }

        .notif-button:hover {
          background: var(--bg-secondary);
        }

        .notif-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          min-width: 18px;
          height: 18px;
          padding: 0 5px;
          background: var(--error);
          color: white;
          border-radius: 9px;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .notif-overlay {
          position: fixed;
          inset: 0;
          z-index: 998;
        }

        .notif-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 380px;
          max-height: 500px;
          background: white;
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-xl);
          z-index: 999;
          display: flex;
          flex-direction: column;
        }

        .notif-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border);
        }

        .notif-header h3 {
          font-size: 16px;
          font-weight: 700;
          margin: 0;
        }

        .mark-all-btn {
          background: none;
          border: none;
          font-size: 13px;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition);
        }

        .mark-all-btn:hover {
          color: var(--text);
        }

        .notif-list {
          overflow-y: auto;
          max-height: 420px;
        }

        .notif-empty {
          padding: 60px 20px;
          text-align: center;
        }

        .empty-icon {
          font-size: 48px;
          display: block;
          margin-bottom: 12px;
          opacity: 0.5;
        }

        .notif-empty p {
          font-size: 14px;
          color: var(--text-muted);
          margin: 0;
        }

        .notif-item {
          display: flex;
          gap: 12px;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border);
          cursor: pointer;
          transition: var(--transition);
        }

        .notif-item:last-child {
          border-bottom: none;
        }

        .notif-item:hover {
          background: var(--bg-secondary);
        }

        .notif-item.unread {
          background: rgba(0, 0, 0, 0.02);
        }

        .notif-icon {
          font-size: 24px;
          flex-shrink: 0;
        }

        .notif-content {
          flex: 1;
          min-width: 0;
        }

        .notif-title {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 4px;
          color: var(--text);
        }

        .notif-message {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.4;
          margin-bottom: 6px;
        }

        .notif-time {
          font-size: 12px;
          color: var(--text-muted);
        }

        @media (max-width: 480px) {
          .notif-dropdown {
            position: fixed;
            top: 72px;
            left: 0;
            right: 0;
            width: 100%;
            max-height: calc(100vh - 72px);
            border-radius: 0;
          }
        }
      `}</style>
    </div>
  );
}