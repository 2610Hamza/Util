import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function SearchPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [city, setCity] = useState('');
  const [budget, setBudget] = useState('');
  const [professionals, setProfessionals] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('util_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      alert('Veuillez décrire votre besoin');
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch('/api/ai/match-professionals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          city: city || null,
          budget: budget ? parseFloat(budget) : null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setProfessionals(data.professionals || []);
        setAiAnalysis(data.analysis);
      } else {
        alert('❌ ' + (data.error || 'Erreur de recherche'));
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-page">
      <div className="search-hero">
        <div className="container">
          <div className="hero-badge">🤖 Propulsé par l'IA</div>
          <h1>Décrivez votre besoin, l'IA trouve le pro idéal</h1>
          <p>Notre intelligence artificielle analyse votre demande et vous propose les meilleurs professionnels</p>

          <form onSubmit={handleSearch} className="search-form">
            <div className="main-search">
              <textarea
                placeholder="Ex: J'ai une fuite sous mon évier de cuisine qui coule depuis ce matin..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="filters-row">
              <input
                type="text"
                placeholder="📍 Ville (optionnel)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <input
                type="number"
                placeholder="💰 Budget max (optionnel)"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                min="0"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-lg btn-block"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  L'IA analyse votre demande...
                </>
              ) : (
                '🔍 Trouver les meilleurs professionnels'
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="container">
        {loading && (
          <div className="ai-thinking">
            <div className="thinking-animation">
              <div className="brain">🧠</div>
              <div className="dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <h3>L'IA analyse votre demande...</h3>
            <p>Recherche des professionnels les plus pertinents</p>
          </div>
        )}

        {!loading && searched && aiAnalysis && (
          <div className="ai-analysis">
            <div className="analysis-header">
              <h2>🤖 Analyse IA de votre demande</h2>
            </div>
            <div className="analysis-content">
              <div className="analysis-item">
                <strong>Catégories identifiées :</strong>
                <div className="tags">
                  {aiAnalysis.categories?.map((cat, i) => (
                    <span key={i} className="tag">{cat}</span>
                  ))}
                </div>
              </div>
              <div className="analysis-item">
                <strong>Urgence :</strong>
                <span className={`urgency-badge urgency-${aiAnalysis.urgency}`}>
                  {aiAnalysis.urgency === 'urgent' && '🚨 Urgent'}
                  {aiAnalysis.urgency === 'normal' && '⏰ Normal'}
                  {aiAnalysis.urgency === 'flexible' && '📅 Flexible'}
                </span>
              </div>
              {aiAnalysis.skills && aiAnalysis.skills.length > 0 && (
                <div className="analysis-item">
                  <strong>Compétences recherchées :</strong>
                  <div className="tags">
                    {aiAnalysis.skills.map((skill, i) => (
                      <span key={i} className="tag skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {!loading && searched && (
          <div className="results-section">
            <div className="results-header">
              <h2>
                {professionals.length > 0 
                  ? `✨ ${professionals.length} professionnel(s) trouvé(s) par l'IA`
                  : '😔 Aucun professionnel trouvé'
                }
              </h2>
              {professionals.length > 0 && (
                <p className="results-subtitle">
                  Triés par pertinence selon votre demande
                </p>
              )}
            </div>

            {professionals.length === 0 ? (
              <div className="empty-results">
                <div className="empty-icon">🔍</div>
                <h3>Aucun professionnel ne correspond à votre recherche</h3>
                <p>Essayez de modifier votre demande ou élargir vos critères</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    setSearchQuery('');
                    setCity('');
                    setBudget('');
                    setSearched(false);
                    setProfessionals([]);
                    setAiAnalysis(null);
                  }}
                >
                  Nouvelle recherche
                </button>
              </div>
            ) : (
              <div className="professionals-grid">
                {professionals.map((pro, index) => (
                  <div key={pro.id} className="pro-card">
                    <div className="pro-rank">
                      {index + 1 === 1 && '🥇'}
                      {index + 1 === 2 && '🥈'}
                      {index + 1 === 3 && '🥉'}
                      {index + 1 > 3 && `#${index + 1}`}
                    </div>

                    <div className="pro-header">
                      <div className="pro-avatar">
                        {pro.name?.charAt(0) || 'P'}
                      </div>
                      <div className="match-score">
                        <div className="score-label">Score IA</div>
                        <div className="score-value">{Math.round(pro.aiScore || 0)}/100</div>
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
                          <span>📍</span>
                          <span>{pro.city}</span>
                        </div>
                      )}
                      
                      <div className="info-item">
                        <span>⭐</span>
                        <span>{pro.rating || 0}/5 ({pro.rating_count || 0} avis)</span>
                      </div>

                      {pro.price_min && pro.price_max && (
                        <div className="info-item">
                          <span>💰</span>
                          <span>{pro.price_min}€ - {pro.price_max}€</span>
                        </div>
                      )}
                    </div>

                    {pro.categories && pro.categories.length > 0 && (
                      <div className="pro-categories">
                        {pro.categories.slice(0, 3).map((cat, i) => (
                          <span key={i} className="category-tag">{cat}</span>
                        ))}
                      </div>
                    )}

                    <div className="pro-actions">
                      <Link href={`/professionals/${pro.id}`} className="btn btn-ghost btn-sm">
                        Voir le profil
                      </Link>
                      <Link 
                        href={user ? `/professionals/${pro.id}/request-quote` : '/login'}
                        className="btn btn-primary btn-sm"
                      >
                        Demander un devis
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!searched && (
          <div className="how-it-works">
            <h2>🤖 Comment fonctionne notre IA ?</h2>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <h3>Vous décrivez</h3>
                <p>Expliquez votre besoin en langage naturel, comme si vous parliez à un ami</p>
              </div>
              <div className="step-card">
                <div className="step-number">2</div>
                <h3>L'IA analyse</h3>
                <p>Notre intelligence artificielle comprend votre demande et identifie les compétences requises</p>
              </div>
              <div className="step-card">
                <div className="step-number">3</div>
                <h3>Matching intelligent</h3>
                <p>L'IA trouve les professionnels les plus adaptés à votre situation spécifique</p>
              </div>
              <div className="step-card">
                <div className="step-number">4</div>
                <h3>Vous choisissez</h3>
                <p>Comparez les profils recommandés et choisissez le meilleur pour vous</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .search-page { min-height: 100vh; background: #f9fafb; padding-bottom: 80px; }
        .search-hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 60px 0 80px; color: white; text-align: center; }
        .hero-badge { display: inline-block; padding: 8px 20px; background: rgba(255,255,255,0.2); border-radius: 999px; font-size: 14px; font-weight: 700; margin-bottom: 20px; }
        .search-hero h1 { font-size: 48px; font-weight: 800; margin: 0 0 16px; line-height: 1.2; }
        .search-hero p { font-size: 20px; margin: 0 0 40px; opacity: 0.9; }
        .search-form { max-width: 800px; margin: 0 auto; }
        .main-search { margin-bottom: 16px; }
        .main-search textarea { width: 100%; padding: 20px; border: none; border-radius: 16px; font-size: 16px; font-family: inherit; resize: vertical; box-shadow: 0 10px 40px rgba(0,0,0,0.2); }
        .main-search textarea:focus { outline: none; box-shadow: 0 10px 40px rgba(0,0,0,0.3); }
        .filters-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
        .filters-row input { height: 56px; padding: 0 20px; border: none; border-radius: 12px; font-size: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .filters-row input:focus { outline: none; box-shadow: 0 4px 20px rgba(0,0,0,0.2); }
        .spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; margin-right: 8px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .ai-thinking { background: white; border: 2px solid #e5e7eb; border-radius: 20px; padding: 60px 40px; text-align: center; margin: 40px 0; }
        .thinking-animation { margin-bottom: 24px; }
        .brain { font-size: 80px; animation: float 2s ease-in-out infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        .dots { display: flex; gap: 8px; justify-content: center; margin-top: 20px; }
        .dots span { width: 12px; height: 12px; background: #3b82f6; border-radius: 50%; animation: bounce 1.4s ease-in-out infinite; }
        .dots span:nth-child(2) { animation-delay: 0.2s; }
        .dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-15px); } }
        .ai-analysis { background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%); border: 2px solid rgba(59, 130, 246, 0.3); border-radius: 20px; padding: 32px; margin: 40px 0; }
        .analysis-header h2 { font-size: 24px; font-weight: 700; margin: 0 0 24px; }
        .analysis-content { display: grid; gap: 20px; }
        .analysis-item strong { display: block; margin-bottom: 12px; font-size: 15px; color: #374151; }
        .tags { display: flex; flex-wrap: wrap; gap: 8px; }
        .tag { padding: 8px 16px; background: white; border: 1px solid #e5e7eb; border-radius: 999px; font-size: 14px; font-weight: 600; color: #374151; }
        .skill-tag { background: #3b82f6; color: white; border-color: #3b82f6; }
        .urgency-badge { padding: 8px 16px; border-radius: 999px; font-weight: 700; font-size: 14px; }
        .urgency-urgent { background: #fef2f2; color: #dc2626; }
        .urgency-normal { background: #eff6ff; color: #3b82f6; }
        .urgency-flexible { background: #f0fdf4; color: #10b981; }
        .results-section { margin-top: 40px; }
        .results-header { text-align: center; margin-bottom: 40px; }
        .results-header h2 { font-size: 32px; font-weight: 800; margin: 0 0 8px; }
        .results-subtitle { font-size: 16px; color: #6b7280; margin: 0; }
        .empty-results { background: white; border: 2px solid #e5e7eb; border-radius: 20px; padding: 80px 40px; text-align: center; }
        .empty-icon { font-size: 80px; margin-bottom: 24px; opacity: 0.5; }
        .empty-results h3 { font-size: 24px; font-weight: 700; margin: 0 0 12px; }
        .empty-results p { font-size: 16px; color: #6b7280; margin: 0 0 24px; }
        .professionals-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 24px; }
        .pro-card { background: white; border: 2px solid #e5e7eb; border-radius: 20px; padding: 24px; position: relative; transition: all 0.3s; }
        .pro-card:hover { border-color: #3b82f6; transform: translateY(-8px); box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
        .pro-rank { position: absolute; top: 20px; right: 20px; font-size: 24px; font-weight: 800; }
        .pro-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .pro-avatar { width: 64px; height: 64px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 28px; }
        .match-score { text-align: right; }
        .score-label { font-size: 11px; color: #6b7280; font-weight: 600; margin-bottom: 4px; }
        .score-value { font-size: 20px; font-weight: 800; color: #3b82f6; }
        .pro-card h3 { font-size: 20px; font-weight: 700; margin: 0 0 12px; }
        .pro-bio { font-size: 14px; color: #6b7280; line-height: 1.6; margin: 0 0 16px; }
        .pro-info { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
        .info-item { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #6b7280; }
        .pro-categories { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
        .category-tag { padding: 6px 12px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 999px; font-size: 12px; font-weight: 600; color: #6b7280; }
        .pro-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .how-it-works { margin: 80px 0; text-align: center; }
        .how-it-works h2 { font-size: 36px; font-weight: 800; margin: 0 0 48px; }
        .steps-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; }
        .step-card { background: white; border: 2px solid #e5e7eb; border-radius: 20px; padding: 32px; }
        .step-number { width: 64px; height: 64px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 800; margin: 0 auto 20px; }
        .step-card h3 { font-size: 20px; font-weight: 700; margin: 0 0 12px; }
        .step-card p { font-size: 15px; color: #6b7280; line-height: 1.6; margin: 0; }
        @media (max-width: 768px) {
          .search-hero h1 { font-size: 32px; }
          .filters-row { grid-template-columns: 1fr; }
          .professionals-grid { grid-template-columns: 1fr; }
          .steps-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}