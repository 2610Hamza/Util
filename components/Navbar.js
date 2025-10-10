import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import NotificationsDropdown from './NotificationsDropdown';

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
        setScrolled(window.scrollY > 10);
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('util_user');
    window.location.href = '/';
  };

  return (
    <>
      <div className={`nav-left ${scrolled ? 'scrolled' : ''}`}>
        <Link href="/" className="brand">
          Util
        </Link>
        
        <nav className="nav-links desktop-only">
          <Link href="/search">Rechercher</Link>
          <Link href="/categories">Catégories</Link>
          <Link href="/signup-pro">Devenir pro</Link>
        </nav>
      </div>

      <div className="nav-cta">
        {user && <NotificationsDropdown user={user} />}
        
        {user ? (
          <>
            <Link
              href={user.role === 'client' ? '/dashboard/client' : '/dashboard/provider'}
              className="btn btn-ghost btn-sm desktop-only"
            >
              Mon espace
            </Link>
            <button className="btn btn-primary btn-sm" onClick={logout}>
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="btn btn-ghost btn-sm desktop-only">
              Connexion
            </Link>
            <Link href="/signup" className="btn btn-primary btn-sm">
              S'inscrire
            </Link>
          </>
        )}

        <button 
          className="mobile-menu-btn mobile-only"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)} />
          <div className="mobile-menu">
            <Link href="/search" onClick={() => setMobileMenuOpen(false)}>
              Rechercher
            </Link>
            <Link href="/categories" onClick={() => setMobileMenuOpen(false)}>
              Catégories
            </Link>
            <Link href="/signup-pro" onClick={() => setMobileMenuOpen(false)}>
              Devenir pro
            </Link>
            {user && (
              <Link
                href={user.role === 'client' ? '/dashboard/client' : '/dashboard/provider'}
                onClick={() => setMobileMenuOpen(false)}
              >
                Mon espace
              </Link>
            )}
          </div>
        </>
      )}

      <style jsx>{`
        .desktop-only {
          display: flex;
        }

        .mobile-only {
          display: none;
        }

        .mobile-menu-btn {
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
        }

        .hamburger {
          width: 24px;
          height: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
        }

        .hamburger span {
          width: 100%;
          height: 2px;
          background: var(--text);
          transition: var(--transition);
        }

        .hamburger.open span:nth-child(1) {
          transform: rotate(45deg) translateY(9px);
        }

        .hamburger.open span:nth-child(2) {
          opacity: 0;
        }

        .hamburger.open span:nth-child(3) {
          transform: rotate(-45deg) translateY(-9px);
        }

        .mobile-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          z-index: 98;
        }

        .mobile-menu {
          position: fixed;
          top: 72px;
          right: 0;
          bottom: 0;
          width: 280px;
          background: white;
          border-left: 1px solid var(--border);
          z-index: 99;
          display: flex;
          flex-direction: column;
          padding: 24px;
          gap: 4px;
        }

        .mobile-menu a {
          padding: 16px;
          border-radius: var(--radius);
          font-weight: 500;
          color: var(--text);
          transition: var(--transition);
        }

        .mobile-menu a:hover {
          background: var(--bg-secondary);
        }

        @media (max-width: 768px) {
          .desktop-only {
            display: none;
          }

          .mobile-only {
            display: flex;
          }
        }
      `}</style>
    </>
  );
}