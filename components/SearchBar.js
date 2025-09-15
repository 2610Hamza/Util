import { useState } from 'react';
import { useRouter } from 'next/router';

/**
 * Search bar for finding professionals by catégorie et localisation.
 */
export default function SearchBar() {
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = {};
    if (category) query.category = category;
    if (location) query.location = location;
    router.push({ pathname: '/search', query });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <input
        type="text"
        placeholder="Catégorie (ex: plomberie, médecine, coaching...)"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ padding: '0.5rem', fontSize: '1rem' }}
      />
      <input
        type="text"
        placeholder="Localisation (ex: Paris, Lyon, Marseille...)"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        style={{ padding: '0.5rem', fontSize: '1rem' }}
      />
      <button type="submit" style={{ padding: '0.5rem', background: '#0070f3', color: '#fff', border: 'none', cursor: 'pointer' }}>
        Rechercher
      </button>
    </form>
  );
}
