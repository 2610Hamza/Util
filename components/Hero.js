
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


 return (
   <section className="hero-modern">
     <div className="hero-bg-gradient"></div>
     <div className="hero-bg-pattern"></div>
    
     <div className="hero-content">
       <div className="hero-badges">
         <span className="badge badge-success">
           <span className="pulse-dot"></span>
           10,000+ pros actifs
         </span>
         <span className="badge">
           ⚡ Commission 12% seulement
         </span>
       </div>


       <h1 className="hero-title">
         Trouvez le professionnel
         <br />
         <span className="gradient-text">parfait</span> en 2 minutes
       </h1>


       <p className="hero-subtitle">
         IA, devis instantanés, paiement sécurisé. Plus de 10,000 professionnels
         vérifiés prêts à intervenir près de chez vous.
       </p>


       {/* Search Bar Améliorée */}
       <form onSubmit={handleSubmit} className={`search-bar-modern ${focused ? 'focused' : ''}`}>
         <div className="search-inputs">
           <div className="search-input-group">
             <span className="search-icon">🔍</span>
             <input
               type="text"
               placeholder="Quel service cherchez-vous ?"
               value={query}
               onChange={(e) => setQuery(e.target.value)}
               onFocus={() => setFocused(true)}
               onBlur={() => setFocused(false)}
               className="search-input"
             />
           </div>
          
           <div className="search-divider"></div>
          
           <div className="search-input-group">
             <span className="search-icon">📍</span>
             <input
               type="text"
               placeholder="Votre ville"
               value={location}
               onChange={(e) => setLocation(e.target.value)}
               onFocus={() => setFocused(true)}
               onBlur={() => setFocused(false)}
               className="search-input"
             />
           </div>
         </div>
        
         <button type="submit" className="btn btn-primary btn-search">
           Rechercher
         </button>
       </form>


       {/* Recherches rapides */}
       <div className="quick-searches">
         <span className="quick-label">Recherches populaires :</span>
         <div className="quick-buttons">
           {quickSearches.map((item, i) => (
             <button
               key={i}
               onClick={() => router.push(`/search?category=${item.cat}`)}
               className="quick-btn"
             >
               <span>{item.icon}</span>
               {item.text}
             </button>
           ))}
         </div>
       </div>


       {/* Trust Indicators */}
       <div className="trust-indicators">
         <div className="trust-item">
           <div className="trust-icon">✅</div>
           <div className="trust-text">
             <strong>Pros vérifiés</strong>
             <span>Identité et diplômes contrôlés</span>
           </div>
         </div>
         <div className="trust-item">
           <div className="trust-icon">🔒</div>
           <div className="trust-text">
             <strong>Paiement sécurisé</strong>
             <span>Fonds bloqués jusqu'à validation</span>
           </div>
         </div>
         <div className="trust-item">
           <div className="trust-icon">⚡</div>
           <div className="trust-text">
             <strong>Réponse rapide</strong>
             <span>Devis sous 24h en moyenne</span>
           </div>
         </div>
       </div>
     </div>


     <style jsx>{`
       .hero-modern {
         position: relative;
         min-height: 85vh;
         display: flex;
         align-items: center;
         justify-content: center;
         overflow: hidden;
         padding: 60px 20px;
       }


       .hero-bg-gradient {
         position: absolute;
         inset: 0;
         background: radial-gradient(ellipse 80% 50% at 50% -20%,
           rgba(59, 130, 246, 0.15),
           transparent 60%),
           radial-gradient(ellipse 60% 50% at 80% 50%,
           rgba(139, 92, 246, 0.1),
           transparent 60%);
         animation: gradientShift 15s ease infinite;
       }


       @keyframes gradientShift {
         0%, 100% { opacity: 1; transform: scale(1); }
         50% { opacity: 0.8; transform: scale(1.1); }
       }


       .hero-bg-pattern {
         position: absolute;
         inset: 0;
         background-image:
           radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.05) 1px, transparent 1px),
           radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.05) 1px, transparent 1px);
         background-size: 50px 50px;
         animation: patternFloat 20s linear infinite;
       }


       @keyframes patternFloat {
         0% { background-position: 0 0; }
         100% { background-position: 50px 50px; }
       }


       .hero-content {
         position: relative;
         z-index: 1;
         max-width: 900px;
         width: 100%;
         text-align: center;
         animation: fadeInUp 0.8s ease-out;
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


       .hero-badges {
         display: flex;
         gap: 12px;
         justify-content: center;
         flex-wrap: wrap;
         margin-bottom: 32px;
         animation: fadeInUp 0.8s ease-out 0.2s both;
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
         0%, 100% { opacity: 1; transform: scale(1); }
         50% { opacity: 0.5; transform: scale(1.2); }
       }


       .hero-title {
         font-size: clamp(40px, 6vw, 72px);
         font-weight: 900;
         line-height: 1.1;
         letter-spacing: -0.03em;
         margin: 0 0 24px;
         animation: fadeInUp 0.8s ease-out 0.3s both;
       }


       .gradient-text {
         background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
         -webkit-background-clip: text;
         -webkit-text-fill-color: transparent;
         background-clip: text;
         background-size: 200% auto;
         animation: gradientFlow 3s linear infinite;
       }


       @keyframes gradientFlow {
         0% { background-position: 0% center; }
         100% { background-position: 200% center; }
       }


       .hero-subtitle {
         font-size: clamp(16px, 2vw, 20px);
         color: var(--text-secondary);
         line-height: 1.6;
         margin: 0 auto 48px;
         max-width: 700px;
         animation: fadeInUp 0.8s ease-out 0.4s both;
       }


       .search-bar-modern {
         background: white;
         border-radius: 16px;
         padding: 8px;
         box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
         display: flex;
         gap: 8px;
         align-items: stretch;
         transition: all 0.3s ease;
         animation: fadeInUp 0.8s ease-out 0.5s both;
         margin-bottom: 32px;
       }


       .search-bar-modern.focused {
         box-shadow: 0 25px 70px rgba(59, 130, 246, 0.2);
         transform: translateY(-2px);
       }


       .search-inputs {
         flex: 1;
         display: flex;
         align-items: center;
         gap: 0;
       }


       .search-input-group {
         flex: 1;
         display: flex;
         align-items: center;
         gap: 12px;
         padding: 0 20px;
       }


       .search-icon {
         font-size: 20px;
         flex-shrink: 0;
       }


       .search-input {
         flex: 1;
         border: none;
         background: transparent;
         font-size: 16px;
         font-weight: 500;
         color: var(--text);
         outline: none;
         height: 56px;
       }


       .search-input::placeholder {
         color: var(--text-muted);
       }


       .search-divider {
         width: 1px;
         height: 40px;
         background: var(--border);
       }


       .btn-search {
         height: 56px;
         padding: 0 40px;
         font-size: 16px;
         font-weight: 700;
         white-space: nowrap;
         border-radius: 12px;
       }


       .quick-searches {
         display: flex;
         align-items: center;
         justify-content: center;
         gap: 12px;
         flex-wrap: wrap;
         margin-bottom: 48px;
         animation: fadeInUp 0.8s ease-out 0.6s both;
       }


       .quick-label {
         font-size: 14px;
         color: var(--text-muted);
         font-weight: 500;
       }


       .quick-buttons {
         display: flex;
         gap: 8px;
         flex-wrap: wrap;
       }


       .quick-btn {
         display: flex;
         align-items: center;
         gap: 6px;
         padding: 8px 16px;
         background: white;
         border: 1px solid var(--border);
         border-radius: 999px;
         font-size: 14px;
         font-weight: 600;
         color: var(--text);
         cursor: pointer;
         transition: all 0.2s ease;
       }


       .quick-btn:hover {
         border-color: var(--accent);
         color: var(--accent);
         transform: translateY(-2px);
         box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
       }


       .trust-indicators {
         display: grid;
         grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
         gap: 24px;
         animation: fadeInUp 0.8s ease-out 0.7s both;
       }


       .trust-item {
         display: flex;
         align-items: flex-start;
         gap: 12px;
         text-align: left;
         padding: 20px;
         background: rgba(255, 255, 255, 0.5);
         backdrop-filter: blur(10px);
         border: 1px solid var(--border);
         border-radius: 12px;
         transition: all 0.3s ease;
       }


       .trust-item:hover {
         background: white;
         box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
         transform: translateY(-4px);
       }


       .trust-icon {
         font-size: 32px;
         flex-shrink: 0;
       }


       .trust-text {
         display: flex;
         flex-direction: column;
         gap: 4px;
       }


       .trust-text strong {
         font-size: 15px;
         font-weight: 700;
         color: var(--text);
       }


       .trust-text span {
         font-size: 13px;
         color: var(--text-secondary);
       }


       @media (max-width: 768px) {
         .hero-modern {
           min-height: auto;
           padding: 40px 16px;
         }


         .search-bar-modern {
           flex-direction: column;
         }


         .search-inputs {
           flex-direction: column;
           width: 100%;
         }


         .search-divider {
           display: none;
         }


         .btn-search {
           width: 100%;
         }


         .trust-indicators {
           grid-template-columns: 1fr;
         }


         .quick-searches {
           flex-direction: column;
           align-items: stretch;
         }


         .quick-buttons {
           justify-content: center;
         }
       }
     `}</style>
   </section>
 );
}
