import { useEffect, useState } from 'react';
import Link from 'next/link';

/**
 * Navigation bar displayed on every page. Shows links based on user role.
 */
export default function Navbar() {
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('user');
      if (data) {
        setUser(JSON.parse(data));
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #eee', marginBottom: '1rem' }}>
      <Link href="/">
        <span style={{ fontWeight: 'bold', marginRight: '1rem' }}>Util</span>
      </Link>
      <Link href="/search" style={{ marginRight: '1rem' }}>Rechercher</Link>
      {user && user.role === 'client' && (
        <Link href="/dashboard/client" style={{ marginRight: '1rem' }}>Mon tableau de bord</Link>
      )}
      {user && user.role === 'professional' && (
        <Link href="/dashboard/provider" style={{ marginRight: '1rem' }}>Mon tableau de bord</Link>
      )}
      {!user && (
        <>
          <Link href="/login" style={{ marginRight: '1rem' }}>Connexion</Link>
          <Link href="/signup" style={{ marginRight: '1rem' }}>Inscription</Link>
        </>
      )}
      {user && (
        <button onClick={handleLogout} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#0070f3' }}>
          Déconnexion
        </button>
      )}
    </nav>
  );
}
