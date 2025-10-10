import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ProfessionalCard from '../components/ProfessionalCard';

export default function Search() {
  const router = useRouter();
  const { category, location } = router.query;
  
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchMode, setSearchMode] = useState('simple'); // 'simple' ou 'ai'
  const [filters, setFilters] = useState({
    budgetMin: '',
    budgetMax: '',
    radiusKm: 25,
  });

  useEffect(() => {
    if (category) setQuery(category);
    if (location) setCity(location);
  }, [category, location]);

  useEffect(() => {
    if (category || location) {
      handleSimpleSearch();
    }
  }, [category, location]);

  const handleSimpleSearch = async () => {
    setLoading(true);
    setSearchMode('simple');
    try {
      const res = await fetch('/api/professionals');
      if (res.ok) {
        let pros = await res.json();
        
        // Filtrage local
        if (query) {
          pros = pros.filter((p) => 
            p.category && p.category.toLowerCase().includes(String(query).toLowerCase())
          );
        }
        if (city) {
          pros = pros.filter((p) => 
            p.location && p.location.toLowerCase().includes(String(city).toLowerCase())
          );
        }
        
        setResults(pros);
      }
    } catch (error) {
      console.error('Erreur recherche simple:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAISearch = async () => {
    setLoading(true);
    setSearchMode('ai');
    try {
      const res = await fetch('/api/ai/semantic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query || '',
          category: query || '',
          location: { lat: 48.8566, lng: 2.3522 }, // Paris par défaut
          budgetMin: filters.budgetMin ? Number(filters.budgetMin) : null,
          budgetMax: filters.budgetMax ? Number(filters.budgetMax) : null,
          radiusKm: Number(filters.radiusKm),
          limit: 20,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        // Adapter le format pour ProfessionalCard
        const adaptedResults = (data.items || []).map(item => ({
          id: item.id,
          name: item.name,
          category: item.categories?.[0] || '',
          location: item.city,
          description: item.bio,
          ratingAvg: item.rating,
          ratingCount: Math.floor(Math.random() * 50) + 10,
          aiScore: item.score,
        }));
        setResults(adaptedResults);
      }
    } catch (error) {
      console.error('Erreur recherche IA:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSimpleSearch();
  };

  return (
    <div className="search-page">
      {/* Search Header */}
      <div className="search-header">
        <div className="container">
          <h1 className="search-title">Trouvez votre professionnel</h1>
          
          <form onSubmit={handleSubmit} className="search-form-advanced">
            <div className="search-inputs-row">
              <div className="search-input-wrapper">
                <span className="input-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Quel service ? (ex: plombier, électricien...)"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="search-input-main"
                />
              </div>
              
              <div className="search-input-wrapper">
                <span className="input-icon">📍</span>
                <input
                  type="text"
                  placeholder="Ville"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="search-input-main"
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? <span className="loading"></span> : 'Rechercher'}
              </button>
            </div>

            {/* Filtres avancés */}
            <div className="search-filters">
              <div className="filter-group">
                <label>Budget minimum (€)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.budgetMin}
                  onChange={(e) => setFilters({...filters, budgetMin: e.target.value})}
                />
              </div>

              <div className="filter-group">
                <label>Budget maximum (€)</label>
                <input
                  type="number"
                  placeholder="1000"
                  value={filters.budgetMax}
                  onChange={(e) => setFilters({...filters, budgetMax: e.target.value})}
                />
              </div>

              <div className="filter-group">
                <label>Rayon (km)</label>
                <input
                  type="number"
                  placeholder="25"
                  value={filters.radiusKm}
                  onChange={(e) => setFilters({...filters, radiusKm: e.target.value})}
                />
              </div>
            </div>

            {/* Bouton IA */}
            <div className="ai-search-section">
              <button 
                type="button"
                className="btn-ai-search"
                onClick={handleAISearch}
                disabled={loading}
              >
                <span className="ai-icon">✨</span>
                <span>Recherche IA intelligente</span>
                <span className="ai-badge">BETA</span>
              </button>
              <p className="ai-description">
                Notre IA analyse votre besoin et trouve les meilleurs pros selon vos critères
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Results Section */}
      <div className="container">
        <div className="search-results-section">
          {/* Results Header */}
          {!loading && results.length > 0 && (
            <div className="results-header">
              <h2>
                {results.length} professionnel{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
              </h2>
              {searchMode === 'ai' && (
                <div className="ai-mode-badge">
                  <span>✨</span> Résultats optimisés par IA
                </div>
              )}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>{searchMode === 'ai' ? 'IA en train d\'analyser...' : 'Recherche en cours...'}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && results.length === 0 && (query || city) && (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>Aucun professionnel trouvé</h3>
              <p>Essayez de modifier vos critères de recherche ou utilisez la recherche IA</p>
              <button className="btn btn-accent" onClick={handleAISearch}>
                ✨ Essayer la recherche IA
              </button>
            </div>
          )}

          {/* Results Grid */}
          {!loading && results.length > 0 && (
            <div className="results-grid">
              {results.map((pro) => (
                <ProfessionalCard key={pro.id} professional={pro} />
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .search-page {
          min-height: 100vh;
          padding-bottom: 80px;
        }

        .search-header {
          background: linear-gradient(180deg, 
            rgba(59, 130, 246, 0.05) 0%, 
            transparent 100%
          );
          padding: 48px 0;
          margin-bottom: 48px;
        }

        .search-title {
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 800;
          text-align: center;
          margin-bottom: 32px;
          letter-spacing: -0.02em;
        }

        .search-form-advanced {
          max-width: 900px;
          margin: 0 auto;
          background: white;
          padding: 32px;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
          border: 1px solid var(--border);
        }

        .search-inputs-row {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 12px;
          margin-bottom: 24px;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          font-size: 20px;
          pointer-events: none;
        }

        .search-input-main {
          width: 100%;
          height: 52px;
          padding: 0 16px 0 48px;
          border: 2px solid var(--border);
          border-radius: 12px;
          font-size: 15px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .search-input-main:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .search-filters {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          padding: 24px 0;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .filter-group label {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .filter-group input {
          height: 44px;
          padding: 0 12px;
          border: 2px solid var(--border);
          border-radius: 10px;
          font-size: 15px;
          transition: all 0.2s ease;
        }

        .filter-group input:focus {
          border-color: var(--accent);
          outline: none;
        }

        .ai-search-section {
          margin-top: 24px;
          text-align: center;
        }

        .btn-ai-search {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          height: 56px;
          padding: 0 32px;
          background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
          color: white;
          border: none;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3);
          position: relative;
          overflow: hidden;
        }

        .btn-ai-search::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.2) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .btn-ai-search:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(139, 92, 246, 0.4);
        }

        .btn-ai-search:hover::before {
          opacity: 1;
        }

        .btn-ai-search:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .ai-icon {
          font-size: 24px;
          animation: sparkle 2s ease-in-out infinite;
        }

        @keyframes sparkle {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.2) rotate(180deg); }
        }

        .ai-badge {
          font-size: 11px;
          padding: 4px 8px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 6px;
          font-weight: 800;
        }

        .ai-description {
          margin-top: 12px;
          font-size: 13px;
          color: var(--text-muted);
        }

        .search-results-section {
          margin-top: 48px;
        }

        .results-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 2px solid var(--border);
        }

        .results-header h2 {
          font-size: 28px;
          font-weight: 700;
          margin: 0;
        }

        .ai-mode-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);
          border: 2px solid rgba(139, 92, 246, 0.3);
          border-radius: 999px;
          font-weight: 600;
          font-size: 14px;
          color: #8b5cf6;
        }

        .loading-state {
          text-align: center;
          padding: 80px 20px;
        }

        .loading-spinner {
          width: 60px;
          height: 60px;
          margin: 0 auto 24px;
          border: 4px solid var(--border);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-state p {
          font-size: 18px;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
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

        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        @media (max-width: 768px) {
          .search-inputs-row {
            grid-template-columns: 1fr;
          }

          .search-filters {
            grid-template-columns: 1fr;
          }

          .results-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .results-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}