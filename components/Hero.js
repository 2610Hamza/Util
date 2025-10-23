import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query || location) {
      router.push({
        pathname: '/search',
        query: { category: query, location }
      });
    }
  };

  const quickSearches = [
    { icon: '🔧', text: 'Plombier', cat: 'plomberie' },
    { icon: '⚡', text: 'Électricien', cat: 'electricite' },
    { icon: '💻', text: 'Informatique', cat: 'informatique' },
    { icon: '🧹', text: 'Ménage', cat: 'menage' },
  ];

  const trustBadges = [
    { value: '10K+', label: 'Professionnels vérifiés' },
    { value: '4.9★', label: 'Note moyenne' },
    { value: '24h', label: 'Temps de réponse' },
    { value: '100%', label: 'Satisfaction' }
  ];

  return (
    <section className="hero-premium">
      <div className="hero-bg-effect"></div>
      <div className="hero-pattern"></div>
      
      <div className="container">
        <div className="hero-content">
          {/* Badge Premium */}
          <div className="hero-badge">
            <span className="badge-dot"></span>
            <span>Plus de 10 000 professionnels actifs</span>
          </div>

          {/* Titre Principal */}
          <h1 className="hero-title">
            Trouvez le professionnel
            <span className="gradient-text"> idéal </span>
            pour vos besoins
          </h1>

          <p className="hero-subtitle">
            Une plateforme élégante qui connecte clients exigeants 
            et professionnels d'excellence
          </p>

          {/* Search Bar Premium */}
          <form onSubmit={handleSubmit} className={`search-bar-premium ${focused ? 'focused' : ''}`}>
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Quel service recherchez-vous ?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 200)}
              />
            </div>
            
            <div className="search-divider"></div>
            
            <div className="search-input-wrapper">
              <span className="search-icon">📍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Votre ville"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 200)}
              />
            </div>
            
            <button type="submit" className="search-submit">
              Rechercher
            </button>
          </form>

          {/* Quick Searches */}
          <div className="quick-searches">
            <span className="quick-label">Recherches populaires</span>
            <div className="quick-pills">
              {quickSearches.map((item, i) => (
                <button
                  key={i}
                  onClick={() => router.push(`/search?category=${item.cat}`)}
                  className="quick-pill"
                >
                  <span className="pill-icon">{item.icon}</span>
                  <span className="pill-text">{item.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Trust Badges */}
          <div className="trust-badges">
            {trustBadges.map((badge, i) => (
              <div key={i} className="trust-badge">
                <div className="badge-value">{badge.value}</div>
                <div className="badge-label">{badge.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-premium {
          position: relative;
          min-height: 90vh;
          display: flex;
          align-items: center;
          padding: 120px 0 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          overflow: hidden;
        }

        .hero-bg-effect {
          position: absolute;
          top: -50%;
          right: -25%;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: float 20s linear infinite;
          opacity: 0.3;
        }

        .hero-pattern {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 300px;
          background: url("data:image/svg+xml,%3Csvg width='1440' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 150L48 165.7C96 181.3 192 212.7 288 213.8C384 215 480 186 576 176.2C672 166.3 768 175.7 864 181.3C960 187 1056 189 1152 180.5C1248 172 1344 153 1392 143.5L1440 134V300H1392C1344 300 1248 300 1152 300C1056 300 960 300 864 300C768 300 672 300 576 300C480 300 384 300 288 300C192 300 96 300 48 300H0V150Z' fill='white' fill-opacity='0.1'/%3E%3C/svg%3E");
          background-size: cover;
          opacity: 0.5;
        }

        @keyframes float {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-20px, -20px) rotate(180deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }

        .hero-content {
          position: relative;
          z-index: 1;
          text-align: center;
          max-width: 900px;
          margin: 0 auto;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 999px;
          color: white;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 32px;
          animation: fadeInDown 0.6s ease-out;
        }

        .badge-dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.5); }
        }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 700;
          line-height: 1.15;
          color: white;
          margin-bottom: 24px;
          animation: fadeInUp 0.8s ease-out;
        }

        .gradient-text {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: clamp(1.1rem, 2vw, 1.3rem);
          font-weight: 300;
          color: rgba(255, 255, 255, 0.95);
          margin-bottom: 48px;
          line-height: 1.6;
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }

        .search-bar-premium {
          background: white;
          border-radius: 20px;
          padding: 8px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
          display: flex;
          gap: 8px;
          max-width: 800px;
          margin: 0 auto 32px;
          animation: fadeInUp 0.8s ease-out 0.4s both;
          transition: all 0.3s ease;
        }

        .search-bar-premium.focused {
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.25);
          transform: translateY(-2px);
        }

        .search-input-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 0 20px;
        }

        .search-icon {
          font-size: 20px;
        }

        .search-input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 16px;
          font-weight: 500;
          color: #1f2937;
          background: transparent;
          height: 56px;
          font-family: 'Poppins', sans-serif;
        }

        .search-input::placeholder {
          color: #9ca3af;
          font-weight: 400;
        }

        .search-divider {
          width: 1px;
          height: 40px;
          background: #e5e7eb;
          align-self: center;
        }

        .search-submit {
          padding: 0 40px;
          height: 56px;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          color: white;
          border: none;
          border-radius: 14px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Poppins', sans-serif;
        }

        .search-submit:hover {
          transform: scale(1.02);
          box-shadow: 0 10px 25px rgba(99, 102, 241, 0.35);
        }

        .quick-searches {
          margin-bottom: 48px;
          animation: fadeInUp 0.8s ease-out 0.6s both;
        }

        .quick-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 16px;
        }

        .quick-pills {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .quick-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 999px;
          color: white;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .quick-pill:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }

        .pill-icon {
          font-size: 18px;
        }

        .trust-badges {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          max-width: 600px;
          margin: 0 auto;
          animation: fadeInUp 0.8s ease-out 0.8s both;
        }

        .trust-badge {
          text-align: center;
          padding: 20px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          transition: all 0.3s ease;
        }

        .trust-badge:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-4px);
        }

        .badge-value {
          font-size: 24px;
          font-weight: 800;
          color: white;
          margin-bottom: 8px;
        }

        .badge-label {
          font-size: 12px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.9);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .hero-premium {
            padding: 100px 0 60px;
            min-height: auto;
          }

          .hero-title {
            font-size: clamp(2rem, 8vw, 3rem);
          }

          .hero-subtitle {
            font-size: 1rem;
            margin-bottom: 32px;
          }

          .search-bar-premium {
            flex-direction: column;
            padding: 16px;
            gap: 16px;
          }

          .search-divider {
            display: none;
          }

          .search-submit {
            width: 100%;
          }

          .trust-badges {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }

          .quick-pills {
            justify-content: flex-start;
            overflow-x: auto;
            flex-wrap: nowrap;
            padding-bottom: 8px;
          }
        }
      `}</style>
    </section>
  );
}