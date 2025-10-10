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

  return (
    <section className="hero-pro">
      <div className="container">
        <div className="hero-content">
          <h1>Trouvez le professionnel qu'il vous faut</h1>
          <p className="hero-subtitle">
            Des milliers de professionnels vérifiés disponibles près de chez vous
          </p>

          <form onSubmit={handleSubmit} className="search-bar-pro">
            <div className="search-inputs">
              <input
                type="text"
                placeholder="Quel service recherchez-vous ?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-input"
              />
              <div className="input-divider" />
              <input
                type="text"
                placeholder="Ville"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="search-input"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Rechercher
            </button>
          </form>

          <div className="hero-stats">
            <div className="stat">
              <div className="stat-value">10,000+</div>
              <div className="stat-label">Professionnels</div>
            </div>
            <div className="stat">
              <div className="stat-value">12%</div>
              <div className="stat-label">Commission</div>
            </div>
            <div className="stat">
              <div className="stat-value">4.8/5</div>
              <div className="stat-label">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-pro {
          padding: 80px 0 120px;
          background: #ffffff;
          position: relative;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }

        h1 {
          font-size: 56px;
          font-weight: 700;
          letter-spacing: -0.04em;
          color: var(--text);
          margin: 0 0 24px;
          line-height: 1.1;
        }

        .hero-subtitle {
          font-size: 20px;
          color: var(--text-secondary);
          margin: 0 0 48px;
          font-weight: 400;
        }

        .search-bar-pro {
          display: flex;
          gap: 12px;
          background: white;
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          margin-bottom: 64px;
          transition: var(--transition);
        }

        .search-bar-pro:focus-within {
          border-color: var(--primary);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        }

        .search-inputs {
          flex: 1;
          display: flex;
          align-items: center;
        }

        .search-input {
          flex: 1;
          height: 56px;
          padding: 0 20px;
          border: none;
          background: transparent;
          font-size: 16px;
          color: var(--text);
          font-family: inherit;
        }

        .search-input:focus {
          outline: none;
        }

        .search-input::placeholder {
          color: var(--text-muted);
        }

        .input-divider {
          width: 1px;
          height: 32px;
          background: var(--border);
        }

        .search-bar-pro .btn {
          height: 56px;
          padding: 0 32px;
          white-space: nowrap;
          font-size: 16px;
        }

        .hero-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 48px;
          max-width: 600px;
          margin: 0 auto;
        }

        .stat {
          text-align: center;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 14px;
          color: var(--text-secondary);
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .hero-pro {
            padding: 48px 0 80px;
          }

          h1 {
            font-size: 36px;
          }

          .hero-subtitle {
            font-size: 18px;
          }

          .search-bar-pro {
            flex-direction: column;
            gap: 0;
          }

          .search-inputs {
            flex-direction: column;
          }

          .input-divider {
            width: 100%;
            height: 1px;
          }

          .search-bar-pro .btn {
            width: 100%;
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