import Link from 'next/link';
import { categories } from '../data/categories';

const categoryIcons = {
  plomberie: '🔧',
  electricite: '⚡',
  informatique: '💻',
  coiffure: '✂️',
  menage: '🧹',
  coaching: '💪',
  sante: '🏥',
  jardinage: '🌱',
};

const categoryColors = {
  plomberie: { from: '#3b82f6', to: '#2563eb' },
  electricite: { from: '#f59e0b', to: '#d97706' },
  informatique: { from: '#8b5cf6', to: '#7c3aed' },
  coiffure: { from: '#ec4899', to: '#db2777' },
  menage: { from: '#10b981', to: '#059669' },
  coaching: { from: '#ef4444', to: '#dc2626' },
  sante: { from: '#06b6d4', to: '#0891b2' },
  jardinage: { from: '#84cc16', to: '#65a30d' },
};

export default function CategoryGrid() {
  return (
    <section style={{ padding: '64px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h2 style={{ 
          fontSize: 'clamp(32px, 5vw, 48px)', 
          fontWeight: 800, 
          marginBottom: '16px',
          letterSpacing: '-0.02em'
        }}>
          Explorez nos catégories
        </h2>
        <p className="muted" style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
          Des milliers de professionnels qualifiés dans tous les domaines
        </p>
      </div>

      <div className="categories-grid">
        {categories.map((cat, index) => {
          const colors = categoryColors[cat.slug] || { from: '#3b82f6', to: '#2563eb' };
          return (
            <Link key={cat.slug} href={`/search?category=${encodeURIComponent(cat.slug)}`}>
              <div className="category-card" style={{ animationDelay: `${index * 0.05}s` }}>
                <div 
                  className="category-icon"
                  style={{
                    background: `linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 100%)`
                  }}
                >
                  <span>{categoryIcons[cat.slug] || '🛠️'}</span>
                </div>
                
                <div className="category-content">
                  <h3 className="category-name">{cat.name}</h3>
                  <p className="category-count">
                    {Math.floor(Math.random() * 1000 + 500)}+ pros
                  </p>
                </div>

                <div className="category-arrow">→</div>
              </div>
            </Link>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', marginTop: '48px' }}>
        <Link href="/categories">
          <button className="btn btn-secondary btn-lg">
            Voir toutes les catégories
          </button>
        </Link>
      </div>

      <style jsx>{`
        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }

        .category-card {
          position: relative;
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 28px;
          background: white;
          border: 2px solid var(--border);
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          animation: fadeInUp 0.6s ease-out both;
          overflow: hidden;
        }

        .category-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, transparent 0%, rgba(59, 130, 246, 0.03) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .category-card:hover {
          border-color: var(--accent);
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(59, 130, 246, 0.15);
        }

        .category-card:hover::before {
          opacity: 1;
        }

        .category-icon {
          position: relative;
          flex-shrink: 0;
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          transition: all 0.3s ease;
        }

        .category-card:hover .category-icon {
          transform: rotate(-5deg) scale(1.1);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
        }

        .category-content {
          flex: 1;
          min-width: 0;
        }

        .category-name {
          font-size: 18px;
          font-weight: 700;
          color: var(--text);
          margin: 0 0 6px;
          transition: color 0.3s ease;
        }

        .category-card:hover .category-name {
          color: var(--accent);
        }

        .category-count {
          font-size: 14px;
          color: var(--text-muted);
          margin: 0;
          font-weight: 500;
        }

        .category-arrow {
          font-size: 24px;
          color: var(--text-muted);
          transition: all 0.3s ease;
          opacity: 0;
        }

        .category-card:hover .category-arrow {
          opacity: 1;
          transform: translateX(4px);
          color: var(--accent);
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .categories-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .category-card {
            padding: 20px;
          }

          .category-icon {
            width: 56px;
            height: 56px;
            font-size: 28px;
          }
        }
      `}</style>
    </section>
  );
}