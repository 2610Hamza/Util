import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('util_user');
      if (data) setUser(JSON.parse(data));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('util_user');
    window.location.href = '/';
  };

  return (
    <nav style={{
      padding: '12px 0', marginBottom: 16, borderBottom: '1px solid #eee',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link href="/"><span style={{ fontWeight: 800, fontSize: 20, letterSpacing: .3 }}>Util</span></Link>
        <Link href="/search">Rechercher</Link>
        <Link href="/categories">Catégories</Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {user ? (
          <>
            {user.role === 'client' ? (
              <Link href="/dashboard/client">Mon espace</Link>
            ) : (
              <Link href="/dashboard/provider">Mon espace</Link>
            )}
            <button onClick={logout} style={{ background: '#111', color: '#fff', border: 0, borderRadius: 8, padding: '8px 12px', cursor: 'pointer' }}>
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Connexion</Link>
            <Link href="/signup">
              <span style={{ background: '#111', color: '#fff', borderRadius: 8, padding: '8px 12px' }}>
                S’inscrire
              </span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
