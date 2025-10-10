import Link from 'next/link';

export default function Footer() {
  const footerSections = [
    {
      title: 'Plateforme',
      links: [
        { label: 'Rechercher un pro', href: '/search', icon: '🔍' },
        { label: 'Catégories', href: '/categories', icon: '📂' },
        { label: 'Comment ça marche', href: '#', icon: '❓' },
        { label: 'Tarifs', href: '#', icon: '💰' },
      ]
    },
    {
      title: 'Pour les pros',
      links: [
        { label: 'Devenir professionnel', href: '/signup-pro', icon: '💼' },
        { label: 'Espace pro', href: '/dashboard/provider', icon: '👤' },
        { label: 'Avantages', href: '#', icon: '✨' },
        { label: 'FAQ Pros', href: '#', icon: '❓' },
      ]
    },
    {
      title: 'Entreprise',
      links: [
        { label: 'À propos', href: '#', icon: '🏢' },
        { label: 'Blog', href: '#', icon: '📝' },
        { label: 'Carrières', href: '#', icon: '🚀' },
        { label: 'Presse', href: '#', icon: '📰' },
      ]
    },
    {
      title: 'Légal',
      links: [
        { label: 'CGU', href: '#', icon: '📄' },
        { label: 'Confidentialité', href: '#', icon: '🔒' },
        { label: 'Mentions légales', href: '#', icon: '⚖️' },
        { label: 'Cookies', href: '#', icon: '🍪' },
      ]
    },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: '📘', href: '#' },
    { name: 'Twitter', icon: '🐦', href: '#' },
    { name: 'Instagram', icon: '📷', href: '#' },
    { name: 'LinkedIn', icon: '💼', href: '#' },
  ];

  return (
    <footer className="footer-modern">
      <div className="footer-gradient"></div>
      
      <div className="footer-content">
        {/* Top Section */}
        <div className="footer-top">
          <div className="footer-brand-section">
            <Link href="/" className="footer-brand">
              <div className="footer-logo">
                <span>U</span>
              </div>
              <span className="footer-brand-text">Util</span>
            </Link>
            
            <p className="footer-tagline">
              La plateforme qui connecte clients et professionnels de confiance.
            </p>

            <div className="footer-stats">
              <div className="footer-stat">
                <div className="footer-stat-value">10k+</div>
                <div className="footer-stat-label">Professionnels</div>
              </div>
              <div className="footer-stat">
                <div className="footer-stat-value">12%</div>
                <div className="footer-stat-label">Commission</div>
              </div>
              <div className="footer-stat">
                <div className="footer-stat-value">4.8★</div>
                <div className="footer-stat-label">Note moyenne</div>
              </div>
            </div>
          </div>

          <div className="footer-links-grid">
            {footerSections.map((section, index) => (
              <div key={index} className="footer-section">
                <h4 className="footer-section-title">{section.title}</h4>
                <ul className="footer-links">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link href={link.href} className="footer-link">
                        <span className="footer-link-icon">{link.icon}</span>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="footer-newsletter">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h3>Restez informé</h3>
              <p>Recevez nos dernières actualités et offres exclusives</p>
            </div>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Votre adresse email"
                className="newsletter-input"
              />
              <button type="submit" className="newsletter-btn">
                S'abonner →
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <p className="footer-copyright">
              © {new Date().getFullYear()} Util. Tous droits réservés.
            </p>
            <div className="footer-badges">
              <span className="footer-badge">🔒 Paiements sécurisés</span>
              <span className="footer-badge">✅ Pros vérifiés</span>
            </div>
          </div>

          <div className="footer-social">
            {socialLinks.map((social, index) => (
              <a 
                key={index}
                href={social.href}
                className="footer-social-link"
                aria-label={social.name}
                title={social.name}
              >
                <span>{social.icon}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer-modern {
          position: relative;
          background: linear-gradient(180deg, var(--bg) 0%, #0f172a 100%);
          color: white;
          padding: 80px 0 0;
          overflow: hidden;
        }

        .footer-gradient {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 200px;
          background: radial-gradient(ellipse 80% 100% at 50% 0%, 
            rgba(59, 130, 246, 0.15), 
            transparent);
          pointer-events: none;
        }

        .footer-content {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .footer-top {
          display: grid;
          grid-template-columns: 1.5fr 2.5fr;
          gap: 64px;
          margin-bottom: 64px;
        }

        .footer-brand-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.3s ease;
        }

        .footer-brand:hover {
          transform: translateY(-2px);
        }

        .footer-logo {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          font-weight: 900;
          color: white;
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
        }

        .footer-brand-text {
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .footer-tagline {
          font-size: 16px;
          line-height: 1.6;
          opacity: 0.8;
          max-width: 300px;
        }

        .footer-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-top: 8px;
        }

        .footer-stat {
          text-align: center;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .footer-stat-value {
          font-size: 20px;
          font-weight: 800;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .footer-stat-label {
          font-size: 11px;
          opacity: 0.7;
          margin-top: 4px;
        }

        .footer-links-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px;
        }

        .footer-section-title {
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 20px;
          opacity: 0.6;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-link {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          color: rgba(255, 255, 255, 0.8);
          transition: all 0.2s ease;
        }

        .footer-link:hover {
          color: white;
          transform: translateX(4px);
        }

        .footer-link-icon {
          font-size: 16px;
          transition: transform 0.2s ease;
        }

        .footer-link:hover .footer-link-icon {
          transform: scale(1.2);
        }

        .footer-newsletter {
          padding: 40px;
          background: linear-gradient(135deg, 
            rgba(59, 130, 246, 0.1) 0%, 
            rgba(139, 92, 246, 0.1) 100%);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 48px;
        }

        .newsletter-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
        }

        .newsletter-text h3 {
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 8px;
        }

        .newsletter-text p {
          font-size: 14px;
          opacity: 0.8;
          margin: 0;
        }

        .newsletter-form {
          display: flex;
          gap: 12px;
          flex: 1;
          max-width: 500px;
        }

        .newsletter-input {
          flex: 1;
          height: 50px;
          padding: 0 20px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          color: white;
          font-size: 15px;
          transition: all 0.2s ease;
        }

        .newsletter-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .newsletter-input:focus {
          outline: none;
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .newsletter-btn {
          height: 50px;
          padding: 0 32px;
          background: white;
          color: var(--primary);
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .newsletter-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255, 255, 255, 0.2);
        }

        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 32px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .footer-bottom-left {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .footer-copyright {
          font-size: 14px;
          opacity: 0.6;
          margin: 0;
        }

        .footer-badges {
          display: flex;
          gap: 12px;
        }

        .footer-badge {
          font-size: 12px;
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .footer-social {
          display: flex;
          gap: 12px;
        }

        .footer-social-link {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          font-size: 20px;
          transition: all 0.2s ease;
        }

        .footer-social-link:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
        }

        @media (max-width: 1024px) {
          .footer-top {
            grid-template-columns: 1fr;
            gap: 48px;
          }

          .footer-links-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .footer-modern {
            padding: 48px 0 0;
          }

          .footer-links-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }

          .newsletter-content {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
          }

          .newsletter-form {
            max-width: 100%;
            flex-direction: column;
          }

          .footer-bottom {
            flex-direction: column;
            gap: 24px;
            text-align: center;
          }

          .footer-bottom-left {
            flex-direction: column;
            gap: 16px;
          }

          .footer-badges {
            flex-wrap: wrap;
            justify-content: center;
          }

          .footer-stats {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </footer>
  );
}