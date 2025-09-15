import { useState } from 'react';
import { useRouter } from 'next/router';

/**
 * Page de connexion pour les utilisateurs existants.
 */
export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('user', JSON.stringify(data.user));
      setMessage('Connexion réussie, redirection...');
      setTimeout(() => {
        const role = data.user.role;
        router.push(role === 'client' ? '/dashboard/client' : '/dashboard/provider');
      }, 500);
    } else {
      const error = await res.json();
      setMessage(error.error || 'Identifiants incorrects');
    }
  }

  return (
    <div>
      <h1>Connexion</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: '0.5rem' }} />
        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: '0.5rem' }} />
        <button type="submit" style={{ padding: '0.5rem', background: '#0070f3', color: '#fff', border: 'none' }}>Se connecter</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}
