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
   { href: '/categories', label: 'Catégories', icon: '📂' },
   { href: '/signup-pro', label: 'Devenir pro', icon: '💼' },
 ];


 return (
   <>
     <div className={`nav-left ${scrolled ? 'scrolled' : ''}`}>
       <Link href="/" className="brand-container">
         <div className="brand-logo">
           <span className="brand-icon">U</span>
         </div>
         <span className="brand-text">Util</span>
       </Link>
      
       <nav className="nav-links desktop-only">
         {navLinks.map((link, index) => (
           <Link
             key={link.href}
             href={link.href}
             className={`nav-link ${router.pathname === link.href ? 'active' : ''}`}
             style={{ animationDelay: `${index * 0.05}s` }}
           >
             <span className="nav-link-icon">{link.icon}</span>
             {link.label}
           </Link>
         ))}
       </nav>
     </div>


     <div className="nav-cta">
       {user ? (
         <>
           <Link
             href={user.role === 'client' ? '/dashboard/client' : '/dashboard/provider'}
             className="btn btn-ghost btn-sm desktop-only"
           >
             <span>👤</span> Mon espace
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
         aria-label="Menu"
       >
         <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
           <span></span>
           <span></span>
           <span></span>
         </span>
       </button>
     </div>


     {/* Mobile Menu */}
     <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
       <div className="mobile-menu-content">
         <nav className="mobile-nav-links">
           {navLinks.map((link, index) => (
             <Link
               key={link.href}
               href={link.href}
               className="mobile-nav-link"
               onClick={() => setMobileMenuOpen(false)}
               style={{ animationDelay: `${index * 0.05}s` }}
             >
               <span className="mobile-nav-icon">{link.icon}</span>
               <span>{link.label}</span>
               <span className="mobile-nav-arrow">→</span>
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
               <span className="mobile-nav-icon">👤</span>
               <span>Mon espace</span>
               <span className="mobile-nav-arrow">→</span>
             </Link>
           </div>
         )}
       </div>
     </div>


     {mobileMenuOpen && (
       <div
         className="mobile-menu-overlay"
         onClick={() => setMobileMenuOpen(false)}
       />
     )}


     <style jsx>{`
       .nav-left {
         display: flex;
         align-items: center;
         gap: 40px;
       }


       .brand-container {
         display: flex;
         align-items: center;
         gap: 12px;
         transition: all 0.3s ease;
       }


       .brand-container:hover {
         transform: translateY(-2px);
       }


       .brand-logo {
         width: 44px;
         height: 44px;
         background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
         border-radius: 12px;
         display: flex;
         align-items: center;
         justify-content: center;
         box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
         transition: all 0.3s ease;
       }


       .brand-container:hover .brand-logo {
         box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
         transform: rotate(-3deg);
       }


       .brand-icon {
         font-size: 24px;
         font-weight: 900;
         color: white;
         letter-spacing: -0.02em;
       }


       .brand-text {
         font-weight: 800;
         font-size: 24px;
         letter-spacing: -0.02em;
         background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
         -webkit-background-clip: text;
         -webkit-text-fill-color: transparent;
         background-clip: text;
       }


       .nav-links {
         display: flex;
         align-items: center;
         gap: 4px;
       }


       .nav-link {
         display: flex;
         align-items: center;
         gap: 8px;
         padding: 10px 16px;
         border-radius: 10px;
         font-weight: 600;
         font-size: 15px;
         color: var(--text-secondary);
         transition: all 0.2s ease;
         position: relative;
         overflow: hidden;
         animation: fadeInDown 0.5s ease-out both;
       }


       .nav-link::before {
         content: '';
         position: absolute;
         inset: 0;
         background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
         opacity: 0;
         transition: opacity 0.2s ease;
       }


       .nav-link:hover {
         color: var(--text);
         transform: translateY(-2px);
       }


       .nav-link:hover::before {
         opacity: 1;
       }


       .nav-link.active {
         color: var(--accent);
         background: rgba(59, 130, 246, 0.1);
       }


       .nav-link-icon {
         font-size: 18px;
         transition: transform 0.2s ease;
       }


       .nav-link:hover .nav-link-icon {
         transform: scale(1.2);
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
         display: flex;
         align-items: center;
         justify-content: center;
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
         height: 3px;
         background: var(--text);
         border-radius: 2px;
         transition: all 0.3s ease;
       }


       .hamburger.open span:nth-child(1) {
         transform: rotate(45deg) translateY(8px);
       }


       .hamburger.open span:nth-child(2) {
         opacity: 0;
       }


       .hamburger.open span:nth-child(3) {
         transform: rotate(-45deg) translateY(-8px);
       }


       .mobile-menu {
         position: fixed;
         top: 72px;
         right: 0;
         width: 100%;
         max-width: 400px;
         height: calc(100vh - 72px);
         background: white;
         transform: translateX(100%);
         transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
         box-shadow: -4px 0 24px rgba(0, 0, 0, 0.1);
         z-index: 90;
         overflow-y: auto;
       }


       .mobile-menu.open {
         transform: translateX(0);
       }


       .mobile-menu-content {
         padding: 24px;
       }


       .mobile-nav-links {
         display: flex;
         flex-direction: column;
         gap: 8px;
       }


       .mobile-nav-link {
         display: flex;
         align-items: center;
         gap: 16px;
         padding: 16px;
         background: var(--bg);
         border: 2px solid var(--border);
         border-radius: 12px;
         font-weight: 600;
         font-size: 16px;
         color: var(--text);
         transition: all 0.2s ease;
         animation: slideInRight 0.3s ease-out both;
       }


       .mobile-nav-link:hover {
         background: white;
         border-color: var(--accent);
         transform: translateX(-4px);
       }


       .mobile-nav-icon {
         font-size: 24px;
         width: 32px;
         text-align: center;
       }


       .mobile-nav-arrow {
         margin-left: auto;
         font-size: 20px;
         color: var(--text-muted);
         transition: all 0.2s ease;
       }


       .mobile-nav-link:hover .mobile-nav-arrow {
         color: var(--accent);
         transform: translateX(4px);
       }


       .mobile-user-section {
         margin-top: 24px;
         padding-top: 24px;
         border-top: 1px solid var(--border);
       }


       .mobile-menu-overlay {
         position: fixed;
         inset: 0;
         background: rgba(0, 0, 0, 0.5);
         backdrop-filter: blur(4px);
         z-index: 89;
         animation: fadeIn 0.3s ease-out;
       }


       @keyframes fadeIn {
         from { opacity: 0; }
         to { opacity: 1; }
       }


       @keyframes fadeInDown {
         from {
           opacity: 0;
           transform: translateY(-10px);
         }
         to {
           opacity: 1;
           transform: translateY(0);
         }
       }


       @keyframes slideInRight {
         from {
           opacity: 0;
           transform: translateX(20px);
         }
         to {
           opacity: 1;
           transform: translateX(0);
         }
       }


       @media (max-width: 768px) {
         .desktop-only {
           display: none;
         }


         .mobile-only {
           display: flex;
         }


         .nav-left {
           gap: 16px;
         }


         .brand-logo {
           width: 40px;
           height: 40px;
         }


         .brand-icon {
           font-size: 20px;
         }


         .brand-text {
           font-size: 20px;
         }
       }
     `}</style>
   </>
 );
}

