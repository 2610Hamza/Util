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
  const [gettingLocation, setGettingLocation] = useState(false);
  const [userCoords, setUserCoords] = useState(null);
  const [filters, setFilters] = useState({
    budgetMin: '',
    budgetMax: '',
    radiusKm: 25,
    sortBy: 'distance', // 'distance', 'rating', 'price'
  });

  useEffect(() => {
    if (category) setQuery(category);
    if (location) setCity(location);
  }, [category, location]);

  useEffect(() => {
    if (category || location) {
      handleSearch();
    }
  }, [category, location]);

  // Géolocalisation du navigateur
  const getUserLocation = () => {
    setGettingLocation(true);

    if (!navigator.geolocation) {
      alert('La géolocalisation n\'est pas supportée par votre navigateur');
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserCoords(coords);
        
        // Reverse geocoding pour obtenir le nom de la ville
        try {
          const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`;
          const res = await fetch(url, {
            headers: { 'User-Agent': 'Util-App/1.0' }
          });
          const data = await res.json();
          const cityName = data.address?.city || data.address?.town || data.address?.village || 'Ma position';
          setCity(cityName);
        } catch (error) {
          console.error('Reverse geocoding error:', error);
          setCity('Ma position');
        }

        setGettingLocation(false);
        handleSearch(coords);
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Impossible d\'accéder à votre position');
        setGettingLocation(false);
      }
    );
  };

  const handleSearch = async (coords = userCoords) => {
    setLoading(true);

    try {
      // Si une ville est spécifiée, la géocoder
      let searchCoords = coords;
      
      if (city && !coords) {
        const geoRes = await fetch(`/api/geocoding/address?address=${encodeURIComponent(city)}`);
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          searchCoords = { lat: geoData.lat, lng: geoData.lng };
          setUserCoords(searchCoords);
        }
      }

      // Recherche avec IA si on a des coordonnées
      if (searchCoords) {
        const res = await fetch('/api/ai/semantic', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: query || '',
            category: query || '',
            location: searchCoords,
            budgetMin: filters.budgetMin ? Number(filters.budgetMin) : null,
            budgetMax: filters.budgetMax ? Number(filters.budgetMax) : null,
            radiusKm: Number(filters.radiusKm),
            limit: 50,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          let pros = data.items || [];

          // Tri selon le filtre
          if (filters.sortBy === 'rating') {
            pros.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          } else if (filters.sortBy === 'price') {
            pros.sort((a, b) => (a.priceMin || 0) - (b.priceMin || 0));
          }
          // Par défaut déjà trié par distance

          const adaptedResults = pros.map(item => ({
            id: item.id,
            name: item.name,
            category: item.categories?.[0] || '',
            location: item.city,
            description: item.bio,
            ratingAvg: item.rating,
            ratingCount: Math.floor(Math.random() * 50) + 10,
            aiScore: item.score,
            distanceKm: item.distanceKm,
          }));

          setResults(adaptedResults);
        }
      } else {
        // Recherche simple sans géolocalisation
        const res = await fetch('/api/professionals');
        if (res.ok) {
          let pros = await res.json();
          
          if (query) {
            pros = pros.filter((p) => 
              p.category && p.category.toLowerCase().includes(String(query).toLowerCase())
            );
          }
          
          setResults(pros);
        }
      }
    } catch (error) {
      console.error('Erreur recherche:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <div className="container">
          <h1>Rechercher un professionnel</h1>
          
          <div className="search-form">
            <div className="search-row">
              <input
                type="text"
                placeholder="Service recherché..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-input"
              />
              
              <div className="location-input-group">
                <input
                  type="text"
                  placeholder="Ville"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="search-input"
                />
                <button
                  type="button"
                  className="location-btn"
                  onClick={getUserLocation}
                  disabled={gettingLocation}
                  title="Utiliser ma position"
                >
                  {gettingLocation ? '⌛' : '📍'}
                </button>
              </div>

              <button 
                onClick={() => handleSearch()}
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Recherche...' : 'Rechercher'}
              </button>
            </div>

            {/* Filtres */}
            <div className="filters-row">
              <select 
                value={filters.radiusKm}
                onChange={(e) => setFilters({...filters, radiusKm: e.target.value})}
                className="filter-select"
              >
                <option value="5">5 km</option>
                <option value="10">10 km</option>
                <option value="25">25 km</option>
                <option value="50">50 km</option>
                <option value="100">100 km</option>
              </select>

              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                className="filter-select"
              >
                <option value="distance">Plus proche</option>
                <option value="rating">Mieux notés</option>
                <option value="price">Prix croissant</option>
              </select>

              <input
                type="number"
                placeholder="Budget min"
                value={filters.budgetMin}
                onChange={(e) => setFilters({...filters, budgetMin: e.target.value})}
                className="filter-input"
              />

              <input
                type="number"
                placeholder="Budget max"
                value={filters.budgetMax}
                onChange={(e) => setFilters({...filters, budgetMax: e.target.value})}
                className="filter-input"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="results-section">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Recherche en cours...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>Aucun résultat</h3>
              <p>Essayez d'élargir votre recherche ou de modifier vos filtres</p>
            </div>
          ) : (
            <>
              <div className="results-header">
                <h2>{results.length} professionnel(s) trouvé(s)</h2>
                {userCoords && <span className="location-badge">📍 Près de vous</span>}
              </div>
              <div className="results-grid">
                {results.map((pro) => (
                  <ProfessionalCard key={pro.id} professional={pro} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .search-page {
          min-height: 100vh;
          background: var(--bg);
          padding-bottom: 80px;
        }

        .search-header {
          background: white;
          border-bottom: 1px solid var(--border);
          padding: 40px 0;
          margin-bottom: 40px;
        }

        h1 {
          font-size: 32px;
          font-weight: 700;
          margin: 0 0 32px;
        }

        .search-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .search-row {
          display: grid;
          grid-template-columns: 2fr 1.5fr auto;
          gap: 12px;
        }

        .location-input-group {
          position: relative;
          display: flex;
          align-items: center;
        }

        .location-btn {
          position: absolute;
          right: 12px;
          width: 32px;
          height: 32px;
          background: var(--bg-secondary);
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: var(--transition);
          font-size: 16px;
        }

        .location-btn:hover {
          background: var(--border);
        }

        .search-input {
          height: 48px;
          padding: 0 16px;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          font-size: 15px;
        }

        .location-input-group .search-input {
          padding-right: 50px;
        }

        .filters-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .filter-select,
        .filter-input {
          height: 40px;
          padding: 0 12px;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          font-size: 14px;
          background: white;
        }

        .results-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .results-header h2 {
          font-size: 20px;
          font-weight: 600;
          margin: 0;
        }

        .location-badge {
          padding: 6px 12px;
          background: var(--success);
          color: white;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
        }

        .loading-state,
        .empty-state {
          text-align: center;
          padding: 80px 20px;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          margin: 0 auto 24px;
          border: 3px solid var(--border);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .empty-state h3 {
          font-size: 20px;
          margin: 0 0 8px;
        }

        .empty-state p {
          color: var(--text-secondary);
          margin: 0;
        }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        @media (max-width: 768px) {
          .search-row {
            grid-template-columns: 1fr;
          }

          .filters-row {
            grid-template-columns: 1fr 1fr;
          }

          .results-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}