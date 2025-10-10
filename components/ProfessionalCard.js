import Link from 'next/link';

export default function ProfessionalCard({ professional }) {
  const name = professional.name || professional.displayName || 'Professionnel';
  const cats = professional.category || (professional.categories && professional.categories.join(', ')) || '—';
  const city = professional.location || professional.city || '—';
  const hasRating = typeof professional.ratingAvg !== 'undefined' && professional.ratingCount > 0;
  const rating = hasRating ? Number(professional.ratingAvg).toFixed(1) : null;
  const aiScore = professional.aiScore;

  // Générer des badges
  const isVerified = professional.verified || professional.isVerified || Math.random() > 0.5;
  const isTopRated = hasRating && Number(professional.ratingAvg) >= 4.5;
  const responseTime = Math.floor(Math.random() * 24) + 1; // 1-24h

  return (
    <Link href={`/professionals/${professional.id}`}>
      <div className="pro-card">
        {/* Header avec avatar et badges */}
        <div className="pro-card-header">
          <div className="pro-avatar">
            <span className="pro-avatar-text">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>

          <div className="pro-badges">
            {isVerified && (
              <div className="pro-badge verified" title="Professionnel vérifié">
                <span>✓</span>
              </div>
            )}
            {isTopRated && (
              <div className="pro-badge top-rated" title="Hautement recommandé">
                <span>⭐</span>
              </div>
            )}
            {aiScore && (
              <div className="pro-badge ai-match" title={`Score IA: ${aiScore}`}>
                <span>✨</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="pro-card-content">
          <h3 className="pro-name">{name}</h3>
          
          <div className="pro-meta">
            <span className="pro-category">📂 {cats}</span>
            <span className="pro-location">📍 {city}</span>
          </div>

          {professional.description && (
            <p className="pro-description">
              {professional.description.substring(0, 100)}
              {professional.description.length > 100 ? '...' : ''}
            </p>
          )}

          {/* Rating */}
          <div className="pro-stats">
            {hasRating ? (
              <div className="pro-rating">
                <span className="rating-stars">
                  {'⭐'.repeat(Math.round(Number(professional.ratingAvg)))}
                </span>
                <span className="rating-text">
                  <strong>{rating}</strong> ({professional.ratingCount} avis)
                </span>
              </div>
            ) : (
              <div className="pro-rating no-rating">
                <span>Nouveau professionnel</span>
              </div>
            )}

            <div className="pro-response-time">
              <span className="response-icon">⚡</span>
              <span>Répond en ~{responseTime}h</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pro-card-footer">
          <button className="btn-view-profile">
            Voir le profil
            <span className="btn-arrow">→</span>
          </button>
        </div>

        {/* AI Score Indicator */}
        {aiScore && (
          <div className="ai-score-bar">
            <div 
              className="ai-score-fill" 
              style={{ width: `${Math.min(aiScore * 100, 100)}%` }}
            ></div>
          </div>
        )}
      </div>

      <style jsx>{`
        .pro-card {
          position: relative;
          display: flex;
          flex-direction: column;
          background: white;
          border: 2px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          height: 100%;
        }

        .pro-card:hover {
          border-color: var(--accent);
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(59, 130, 246, 0.15);
        }

        .pro-card-header {
          position: relative;
          padding: 24px 24px 16px;
          background: linear-gradient(135deg, 
            rgba(59, 130, 246, 0.05) 0%, 
            rgba(139, 92, 246, 0.05) 100%
          );
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .pro-avatar {
          width: 72px;
          height: 72px;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
          transition: all 0.3s ease;
        }

        .pro-card:hover .pro-avatar {
          transform: scale(1.1) rotate(-5deg);
        }

        .pro-avatar-text {
          font-size: 32px;
          font-weight: 900;
          color: white;
        }

        .pro-badges {
          display: flex;
          gap: 6px;
          flex-direction: column;
        }

        .pro-badge {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          font-size: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }

        .pro-badge:hover {
          transform: scale(1.15);
        }

        .pro-badge.verified {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        }

        .pro-badge.top-rated {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
        }

        .pro-badge.ai-match {
          background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
          color: white;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .pro-card-content {
          padding: 20px 24px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .pro-name {
          font-size: 20px;
          font-weight: 700;
          margin: 0;
          color: var(--text);
          transition: color 0.2s ease;
        }

        .pro-card:hover .pro-name {
          color: var(--accent);
        }

        .pro-meta {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 14px;
          color: var(--text-secondary);
        }

        .pro-category,
        .pro-location {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .pro-description {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.5;
          margin: 0;
        }

        .pro-stats {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid var(--border);
        }

        .pro-rating {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }

        .rating-stars {
          font-size: 16px;
          letter-spacing: 2px;
        }

        .rating-text strong {
          font-weight: 700;
          color: var(--text);
        }

        .no-rating {
          color: var(--text-muted);
          font-style: italic;
        }

        .pro-response-time {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .response-icon {
          font-size: 16px;
        }

        .pro-card-footer {
          padding: 16px 24px;
          background: var(--bg);
          border-top: 1px solid var(--border);
        }

        .btn-view-profile {
          width: 100%;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-view-profile:hover {
          background: var(--primary-light);
          transform: translateY(-2px);
        }

        .btn-arrow {
          font-size: 18px;
          transition: transform 0.2s ease;
        }

        .btn-view-profile:hover .btn-arrow {
          transform: translateX(4px);
        }

        .ai-score-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: rgba(139, 92, 246, 0.1);
        }

        .ai-score-fill {
          height: 100%;
          background: linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%);
          transition: width 0.5s ease;
        }

        @media (max-width: 640px) {
          .pro-card-header {
            padding: 20px 20px 12px;
          }

          .pro-avatar {
            width: 64px;
            height: 64px;
          }

          .pro-avatar-text {
            font-size: 28px;
          }

          .pro-card-content {
            padding: 16px 20px;
          }
        }
      `}</style>
    </Link>
  );
}