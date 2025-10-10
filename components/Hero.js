import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query || location) {
      router.push({
        pathname: '/search',
        query: { category: query, location }
      });
    }
  };

  const popularSearches = [
    { icon: '🔧', label: 'Plombier', value: 'plomberie' },
    { icon: '⚡', label: 'Électricien', value: 'electricite' },
    { icon: '💻', label: 'Informatique', value: 'informatique' },
    { icon: '🧹', label: 'Ménage', value: 'menage' },
  ];

  return (
    <section className="hero">
      <div className="hero-background">
        <div className="hero-gradient hero-gradient-1"></div>
        <div className="hero-gradient hero-gradient-2"></div>
      </div>

      <div className="container">
        <div className="hero-content">
          <div className="hero-badges">
            <span className="badge badge-success">
              <span className="pulse-dot"></span>
              10,000+ professionnels actifs
            </span>
            <span className="badge">
              ⚡ Commission 12% uniquement
            </span>
          </div>

          <h1>
            Trouvez le professionnel
            <br />
            <span className="gradient-text">parfait</span> en quelques clics
          </h1>

          <p className="hero-subtitle">
            Des milliers de professionnels vérifiés près de chez vous.
            Devis instantanés, paiement sécurisé, satisfaction garantie.
          </p>

          <form onSubmit={handleSubmit} className="search-bar">
            <div className="search-wrapper">
              <div className="search-group">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Quel service recherchez-vous ?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="search-input"
                />
              </div>
              
              <div className="search-divider"></div>
              
              <div className="search-group">
                <span className="search-icon">📍</span>
                <input
                  type="text"
                  placeholder="Votre ville"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg search-btn">
              Rechercher
            </button>
          </form>

          <div className="popular-searches">
            <span className="popular-label">Recherches populaires :</span>
            {popularSearches.map((item, i) => (
              <button
                key={i}
                onClick={() => router.push(`/search?category=${item.value}`)}
                className="popular-btn"
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          <div className="hero-stats">
            <div className="stat">
              <div className="stat-value">10k+</div>
              <div className="stat-label">Professionnels</div>
            </div>
            <div className="stat">
              <div className="stat-value">4.8★</div>
              <div className="stat-label">Note moyenne</div>
            </div>
            <div className="stat">
              <div className="stat-value">24/7</div>
              <div className="stat-label">Support</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero {
          position: relative;
          padding: 80px 0 120px;
          overflow: hidden;
          background: white;
        }

        .hero-background {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .hero-gradient {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.3;
          animation: float 20s ease-in-out infinite;
        }

        .hero-gradient-1 {
          width: 600px;
          height: 600px;
          background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
          top: -200px;
          left: -100px;
        }

        .hero-gradient-2 {
          width: 500px;
          height: 500px;
          background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);
          bottom: -150px;
          right: -100px;
          animation-delay: -10s;
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 900px;
          margin: 0 auto;
          text-align: center;
        }

        .hero-badges {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 32px;
          animation: fadeInUp 0.6s ease 0.1s both;
        }

        .pulse-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          background: var(--success);
          border-radius: 50%;
          margin-right: 8px;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.2);
          }
        }

        h1 {
          font-size: clamp(40px, 6vw, 64px);
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: -0.04em;
          margin: 0 0 24px;
          animation: fadeInUp 0.6s ease 0.2s both;
        }

        .hero-subtitle {
          font-size: clamp(16px, 2vw, 20px);
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0 0 48px;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
          animation: fadeInUp 0.6s ease 0.3s both;
        }

        .search-bar {
          display: flex;
          gap: 12px;
          background: white;
          border: 2px solid var(--border);
          border-radius: 16px;
          padding: 8px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
          margin-bottom: 32px;
          transition: var(--transition);
          animation: fadeInUp 0.6s ease 0.4s both;
        }

        .search-bar:focus-within {
          border-color: var(--accent);
          box-shadow: 0 20px 60px rgba(59, 130, 246, 0.15);
        }

        .search-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
        }

        .search-group {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 16px;
        }

        .search-icon {
          font-size: 20px;
          flex-shrink: 0;
        }

        .search-input {
          flex: 1;
          height: 56px;
          border: none;
          background: transparent;
          font-size: 16px;
          font-weight: 500;
          color: var(--text);
          padding: 0;
        }

        .search-input:focus {
          outline: none;
        }

        .search-input::placeholder {
          color: var(--text-muted);
        }

        .search-divider {
          width: 1px;
          height: 40px;
          background: var(--border);
        }

        .search-btn {
          height: 56px;
          padding: 0 40px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .popular-searches {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 64px;
          animation: fadeInUp 0.6s ease 0.5s both;
        }

        .popular-label {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .popular-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: white;
          border: 1px solid var(--border);
          border-radius: var(--radius-full);
          font-size: 14px;
          font-weight: 600;
          color: var(--text);
          cursor: pointer;
          transition: var(--transition);
        }

        .popular-btn:hover {
          background: var(--accent);
          color: white;
          border-color: var(--accent);
          transform: translateY(-2px);
          box-shadow: var(--shadow);
        }

        .hero-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 48px;
          max-width: 600px;
          margin: 0 auto;
          animation: fadeInUp 0.6s ease 0.6s both;
        }

        .stat {
          text-align: center;
        }

        .stat-value {
          font-size: 36px;
          font-weight: 800;
          background: var(--gradient-accent);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 14px;
          color: var(--text-secondary);
          font-weight: 600;
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
          .hero {
            padding: 48px 0 80px;
          }

          .search-bar {
            flex-direction: column;
          }

          .search-wrapper {
            flex-direction: column;
          }

          .search-divider {
            width: 100%;
            height: 1px;
          }

          .search-btn {
            width: 100%;
          }

          .popular-searches {
            flex-direction: column;
            align-items: stretch;
          }

          .popular-btn {
            justify-content: center;
          }

          .hero-stats {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }
      `}</style>
    </section>
  );
}