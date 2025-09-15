import { useState } from 'react';
import { useRouter } from 'next/router';

/**
 * Page d'inscription pour les clients et les professionnels.
 */
export default function Signup() {
  const router = useRouter();
  const [role, setRole] = useState('client');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const body = { name, email, password, role };
    if (role === 'professional') {
      body.category = category;
      body.location = location;
      body.description = description;
    }
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('user', JSON.stringify(data.user));
      setMessage('Inscription réussie ! Redirection...');
      setTimeout(() => {
        router.push(role === 'client' ? '/dashboard/client' : '/dashboard/provider');
      }, 1000);
    } else {
      const error = await res.json();
      setMessage(error.error || 'Erreur lors de l\'inscription');
    }
  }

  return (
    <div>
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label>Je suis :
          <select value={role} onChange={(e) => setRole(e.target.value)} style={{ marginLeft: '0.5rem' }}>
            <option value="client">Un client</option>
            <option value="professional">Un professionnel</option>
          </select>
        </label>
        <input type="text" placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: '0.5rem' }} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: '0.5rem' }} />
        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: '0.5rem' }} />
        {role === 'professional' && (
          <>
            <input type="text" placeholder="Catégorie principale" value={category} onChange={(e) => setCategory(e.target.value)} required style={{ padding: '0.5rem' }} />
            <input type="text" placeholder="Localisation" value={location} onChange={(e) => setLocation(e.target.value)} required style={{ padding: '0.5rem' }} />
            <textarea placeholder="Description de vos services" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} style={{ padding: '0.5rem' }} />
          </>
        )}
        <button type="submit" style={{ padding: '0.5rem', background: '#0070f3', color: '#fff', border: 'none' }}>S'inscrire</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}
