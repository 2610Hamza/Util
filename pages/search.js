import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export default function SearchPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [professionals, setProfessionals] = useState([]);
  const [filteredPros, setFilteredPros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Tous les services', icon: '🔍' },
    { id: 'plombier', name: 'Plomberie', icon: '🔧' },
    { id: 'electricien', name: 'Électricité', icon: '⚡' },
    { id: 'menage', name: 'Ménage', icon: '🧹' },
    { id: 'coiffure', name: 'Coiffure', icon: '💇' },
    { id: 'informatique', name: 'Informatique', icon: '💻' },
    { id: 'bricolage', name: 'Bricolage', icon: '🔨' },
  ];

  useEffect(() => {
    const userData = localStorage.getItem('util_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchProfessionals();
  }, []);

  useEffect(() => {
    filterProfessionals();
  }, [searchTerm, selectedCategory, professionals]);

  const fetchProfessionals = async () => {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('verified', true)
        .order('rating', { ascending: false });

      if (error) throw error;
      setProfessionals(data || []);
      setFilteredPros(data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProfessionals = () => {
    let filtered = [...professionals];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(pro => 
        pro.categories?.includes(selectedCategory)
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(pro =>
        pro.name?.toLowerCase().includes(term) ||
        pro.bio?.toLowerCase().includes(term) ||
        pro.city?.toLowerCase().includes(term)
      );
    }

    setFilteredPros(filtered);
  };

  if (loading) {
    return (
      <div className="search-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Chargement des professionnels...</p>
        </div>
        <style jsx>{`
          .search-page { min-height: 100vh; background: #f9fafb; padding: 48px 0; }
          .loading-state { min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; }
          .loading-spinner { width: 50px; height: 50px; border: 3px solid #e5e7eb; border-top-color: #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="search-page">
      <div className="search-hero">
        <div className="container">
          <h1>Trouvez le professionnel qu'il vous faut</h1>
          <p>Des milliers de professionnels qualifiés à votre service</p>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Rechercher un service, une ville, un professionnel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-btn">🔍 Rechercher</button>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="categories-section">
          <h2>Catégories populaires</h2>
          <div className="categories-grid">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`category-card ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <div className="category-icon">{cat.icon}</div>
                <div className="category-name">{cat.name}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="results-section">
          <div className="results-header">
            <h2>{filteredPros.length} professionnel(s) trouvé(s)</h2>
            {(searchTerm || selectedCategory !== 'all') && (
              <button 
                className="reset-btn"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
              >
                ❌ Réinitialiser
              </button>
            )}
          </div>

          {filteredPros.length === 0 ? (
            <div className="empty-results">
              <div className="empty-icon">🔍</div>
              <h3>Aucun professionnel trouvé</h3>
              <p>Essayez de modifier vos critères de recherche</p>
            </div>
          ) : (
            <div className="professionals-grid">
              {filteredPros.map((pro) => (
                <Link 
                  key={pro.id} 
                  href={`/professionals/${pro.id}`}
                  className="pro-card"
                >
                  <div className="pro-header">
                    <div className="pro-avatar">
                      {pro.name?.charAt(0) || 'P'}
                    </div>
                    <div className="pro-badge">
                      {pro.verified ? '✓ Vérifié' : '⏳ En attente'}
                    </div>
                  </div>

                  <h3>{pro.name}</h3>
                  
                  {pro.bio && (
                    <p className="pro-bio">
                      {pro.bio.length > 100 ? pro.bio.substring(0, 100) + '...' : pro.bio}
                    </p>
                  )}

                  <div className="pro-info">
                    {pro.city && (
                      <div className="info-item">
                        <span className="info-icon">📍</span>
                        <span>{pro.city}</span>
                      </div>
                    )}
                    
                    <div className="info-item">
                      <span className="info-icon">⭐</span>
                      <span>{pro.rating || 0}/5 ({pro.rating_count || 0} avis)</span>
                    </div>

                    {pro.price_min && pro.price_max && (
                      <div className="info-item">
                        <span className="info-icon">💰</span>
                        <span>{pro.price_min}€ - {pro.price_max}€</span>
                      </div>
                    )}
                  </div>

                  {pro.categories && pro.categories.length > 0 && (
                    <div className="pro-categories">
                      {pro.categories.slice(0, 3).map((cat, index) => (
                        <span key={index} className="category-tag">
                          {categories.find(c => c.id === cat)?.icon || '🔹'} {cat}
                        </span>
                      ))}
                    </div>
                  )}

                  <button className="btn btn-primary btn-block">
                    Demander un devis
                  </button>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .search-page { min-height: 100vh; background: #f9fafb; padding-bottom: 80px; }
        .search-hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 80px 0 60px; color: white; text-align: center; }
        .search-hero h1 { font-size: 48px; font-weight: 800; margin: 0 0 16px; }
        .search-hero p { font-size: 20px; margin: 0 0 40px; opacity: 0.9; }
        .search-bar { max-width: 700px; margin: 0 auto; display: flex; gap: 12px; background: white; padding: 8px; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); }
        .search-bar input { flex: 1; height: 56px; padding: 0 24px; border: none; border-radius: 12px; font-size: 16px; }
        .search-bar input:focus { outline: none; }
        .search-btn { height: 56px; padding: 0 32px; background: #3b82f6; color: white; border: none; border-radius: 12px; font-weight: 700; font-size: 16px; cursor: pointer; white-space: nowrap; }
        .search-btn:hover { background: #2563eb; }
        .categories-section { margin: 60px 0 40px; }
        .categories-section h2 { font-size: 28px; font-weight: 700; margin-bottom: 24px; }
        .categories-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 16px; }
        .category-card { background: white; border: 2px solid #e5e7eb; border-radius: 16px; padding: 20px; text-align: center; cursor: pointer; transition: all 0.2s; }
        .category-card:hover { border-color: #3b82f6; transform: translateY(-4px); box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .category-card.active { background: #3b82f6; border-color: #3b82f6; color: white; }
        .category-icon { font-size: 40px; margin-bottom: 12px; }
        .category-name { font-size: 14px; font-weight: 600; }
        .results-section { margin-top: 40px; }
        .results-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
        .results-header h2 { font-size: 24px; font-weight: 700; margin: 0; }
        .reset-btn { padding: 10px 20px; background: white; border: 2px solid #e5e7eb; border-radius: 999px; font-weight: 600; cursor: pointer; }
        .reset-btn:hover { border-color: #ef4444; color: #ef4444; }
        .empty-results { background: white; border: 2px solid #e5e7eb; border-radius: 20px; padding: 80px 40px; text-align: center; }
        .empty-icon { font-size: 80px; margin-bottom: 24px; opacity: 0.5; }
        .empty-results h3 { font-size: 24px; font-weight: 700; margin: 0 0 12px; }
        .professionals-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
        .pro-card { background: white; border: 2px solid #e5e7eb; border-radius: 20px; padding: 24px; transition: all 0.3s; display: flex; flex-direction: column; }
        .pro-card:hover { border-color: #3b82f6; transform: translateY(-8px); box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
        .pro-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .pro-avatar { width: 64px; height: 64px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 28px; }
        .pro-badge { padding: 6px 12px; background: rgba(16, 185, 129, 0.1); color: #10b981; border-radius: 999px; font-size: 12px; font-weight: 700; }
        .pro-card h3 { font-size: 20px; font-weight: 700; margin: 0 0 12px; }
        .pro-bio { font-size: 14px; color: #6b7280; line-height: 1.6; margin: 0 0 16px; }
        .pro-info { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
        .info-item { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #6b7280; }
        .info-icon { font-size: 16px; }
        .pro-categories { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
        .category-tag { padding: 6px 12px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 999px; font-size: 12px; font-weight: 600; color: #6b7280; }
        .btn-block { width: 100%; margin-top: auto; }
        @media (max-width: 768px) {
          .search-hero h1 { font-size: 32px; }
          .search-bar { flex-direction: column; }
          .search-btn { width: 100%; }
          .categories-grid { grid-template-columns: repeat(2, 1fr); }
          .professionals-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}