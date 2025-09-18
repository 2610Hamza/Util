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
    <>
      <div className="nav-left" style={{ display:'flex', alignItems:'center', gap:16 }}>
        <Link href="/" className="brand">Util</Link>
        <nav className="nav-links">
          <Link href="/search">Rechercher</Link>
          <Link href="/categories">Catégories</Link>
          <Link href="/signup-pro">Devenir pro</Link>
        </nav>
      </div>

      <div className="nav-cta">
        {user ? (
          <>
            <Link
              href={user.role === 'client' ? '/dashboard/client' : '/dashboard/provider'}
              className="btn"
            >Mon espace</Link>
            <button className="btn btn-primary" onClick={logout}>Déconnexion</button>
          </>
        ) : (
          <>
            <Link href="/login" className="btn">Connexion</Link>
            <Link href="/signup" className="btn btn-primary">S’inscrire</Link>
          </>
        )}
      </div>
    </>
  );
}
