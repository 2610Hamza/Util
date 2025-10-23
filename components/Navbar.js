import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('util_user');
      if (data) setUser(JSON.parse(data));

      const handleScroll = () => {
        setScrolled(window.scrollY > 20);
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('util_user');
    window.location.href = '/';
  };

  const navLinks = [
    { href: '/search', label: 'Rechercher', icon: '🔍' },
    { href: '/categories', label: 'Services', icon: '📂' },
    { href: '/signup-pro', label: 'Devenir Pro', icon: '💼', highlight: true },
  ];

  return (
    <>
      <header className={`navbar-premium ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="nav-content">
            {/* Logo */}
            <Link href="/" className="brand-premium">
              <div className="brand-logo-wrapper">
                <div className="brand-logo">
                  <span>U</span>
                </div>
              </div>
              <span className="brand-name">Util</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="nav-links desktop-only">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link ${link.highlight ? 'highlighted' : ''} ${
                    router.pathname === link.href ? 'active' : ''
                  }`}
                >
                  <span className="link-icon">{link.icon}</span>
                  <span>{link.label}</span>
                  {link.highlight && <span className="pro-badge">PRO</span>}
                </Link>
              ))}
            </nav>

            {/* User Actions */}
            <div className="nav-actions">
              {user ? (
                <>
                  <Link
                    href={user.role === 'client' ? '/dashboard/client' : '/dashboard/provider'}
                    className="user-menu"
                  >
                    <div className="user-avatar">
                      <span>{user.name?.charAt(0) || '👤'}</span>
                    </div>
                    <span className="desktop-only">Mon espace</span>
                  </Link>
                  <button className="btn-logout" onClick={logout}>
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn-login desktop-only">
                    Connexion
                  </Link>
                  <Link href="/signup" className="btn-signup">
                    S'inscrire
                  </Link>
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                className="mobile-menu-btn mobile-only"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menu"
              >
                <span className={`menu-icon ${mobileMenuOpen ? 'open' : ''}`}>
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          <div className="mobile-menu-header">
            <Link href="/" className="mobile-brand" onClick={() => setMobileMenuOpen(false)}>
              <div className="brand-logo">
                <span>U</span>
              </div>
              <span className="brand-name">Util</span>
            </Link>
            <button 
              className="close-menu"
              onClick={() => setMobileMenuOpen(false)}
            >
              ✕
            </button>
          </div>

          <nav className="mobile-nav">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="link-icon">{link.icon}</span>
                <span>{link.label}</span>
                {link.highlight && <span className="pro-badge">PRO</span>}
              </Link>
            ))}
          </nav>

          {user && (
            <div className="mobile-user-section">
              <Link
                href={user.role === 'client' ? '/dashboard/client' : '/dashboard/provider'}
                className="mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="link-icon">👤</span>
                <span>Mon espace</span>
              </Link>
            </div>
          )}

          <div className="mobile-actions">
            {user ? (
              <button className="btn-logout-mobile" onClick={logout}>
                Déconnexion
              </button>
            ) : (
              <>
                <Link href="/login" className="btn-login-mobile">
                  Connexion
                </Link>
                <Link href="/signup" className="btn-signup-mobile">
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div 
          className="mobile-backdrop"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <style jsx>{`
        .navbar-premium {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          backdrop-filter: blur(20px) saturate(180%);
          background: rgba(255, 255, 255, 0.85);
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .navbar-premium.scrolled {
          background: rgba(255, 255, 255, 0.98);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .nav-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
          padding: 0 8px;
        }

        .brand-premium {
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.3s ease;
        }

        .brand-logo-wrapper {
          position: relative;
        }

        .brand-logo {
          width: 42px;
          height: 42px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 900;
          color: white;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
          transition: all 0.3s ease;
          font-family: 'Playfair Display', serif;
        }

        .brand-premium:hover .brand-logo {
          transform: rotate(-5deg) scale(1.05);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35);
        }

        .brand-name {
          font-size: 24px;
          font-weight: 700;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-family: 'Playfair Display', serif;
          letter-spacing: -0.5px;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 10px;
          font-weight: 500;
          font-size: 15px;
          color: #4b5563;
          transition: all 0.2s ease;
          position: relative;
          font-family: 'Poppins', sans-serif;
        }

        .nav-link:hover {
          color: #1f2937;
          background: #f3f4f6;
        }

        .nav-link.active {
          color: #6366f1;
          background: rgba(99, 102, 241, 0.08);
        }

        .nav-link.highlighted {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
          color: #6366f1;
          font-weight: 600;
        }

        .link-icon {
          font-size: 18px;
        }

        .pro-badge {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          margin-left: 4px;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-menu {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 12px 6px 6px;
          background: #f9fafb;
          border-radius: 999px;
          transition: all 0.2s ease;
        }

        .user-menu:hover {
          background: #f3f4f6;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 14px;
        }

        .btn-login {
          padding: 10px 20px;
          font-weight: 600;
          font-size: 15px;
          color: #4b5563;
          transition: all 0.2s ease;
        }

        .btn-login:hover {
          color: #1f2937;
        }

        .btn-signup {
          padding: 10px 24px;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          color: white;
          border-radius: 10px;
          font-weight: 600;
          font-size: 15px;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
        }

        .btn-signup:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35);
        }

        .btn-logout {
          padding: 10px 20px;
          background: #fef2f2;
          color: #ef4444;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-logout:hover {
          background: #fee2e2;
        }

        .desktop-only {
          display: flex;
        }

        .mobile-only {
          display: none;
        }

        .mobile-menu-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 8px;
        }

        .menu-icon {
          width: 24px;
          height: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
        }

        .menu-icon span {
          width: 100%;
          height: 2px;
          background: #1f2937;
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .menu-icon.open span:nth-child(1) {
          transform: rotate(45deg) translate(6px, 6px);
        }

        .menu-icon.open span:nth-child(2) {
          opacity: 0;
        }

        .menu-icon.open span:nth-child(3) {
          transform: rotate(-45deg) translate(6px, -6px);
        }

        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          right: -100%;
          width: 100%;
          max-width: 400px;
          height: 100vh;
          background: white;
          z-index: 2000;
          transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1);
        }

        .mobile-menu-overlay.open {
          right: 0;
        }

        .mobile-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          z-index: 1999;
          backdrop-filter: blur(4px);
        }

        .mobile-menu-content {
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 24px;
        }

        .mobile-menu-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .mobile-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .close-menu {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f3f4f6;
          border: none;
          border-radius: 8px;
          font-size: 20px;
          color: #6b7280;
          cursor: pointer;
        }

        .mobile-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 12px;
          font-weight: 500;
          color: #1f2937;
          transition: all 0.2s ease;
        }

        .mobile-nav-link:hover {
          background: #f3f4f6;
          transform: translateX(4px);
        }

        .mobile-user-section {
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
          margin-bottom: 24px;
        }

        .mobile-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .btn-login-mobile,
        .btn-signup-mobile {
          width: 100%;
          padding: 14px;
          text-align: center;
          border-radius: 12px;
          font-weight: 600;
        }

        .btn-login-mobile {
          background: #f3f4f6;
          color: #1f2937;
        }

        .btn-signup-mobile {
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          color: white;
        }

        .btn-logout-mobile {
          width: 100%;
          padding: 14px;
          background: #fef2f2;
          color: #ef4444;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .desktop-only {
            display: none !important;
          }

          .mobile-only {
            display: flex;
          }

          .nav-content {
            padding: 0;
          }
        }
      `}</style>
    </>
  );
}