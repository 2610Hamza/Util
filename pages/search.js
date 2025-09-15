import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ProfessionalCard from '../components/ProfessionalCard';

/**
 * Page d'affichage des résultats de recherche de professionnels.
 */
export default function Search() {
  const router = useRouter();
  const { category, location } = router.query;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfessionals() {
      setLoading(true);
      const res = await fetch('/api/professionals');
      if (res.ok) {
        let pros = await res.json();
        // Filter results locally based on category and location
        if (category) {
          pros = pros.filter((p) => p.category && p.category.toLowerCase().includes(String(category).toLowerCase()));
        }
        if (location) {
          pros = pros.filter((p) => p.location && p.location.toLowerCase().includes(String(location).toLowerCase()));
        }
        setResults(pros);
      }
      setLoading(false);
    }
    fetchProfessionals();
  }, [category, location]);

  return (
    <div>
      <h1>Résultats de recherche</h1>
      {loading ? <p>Chargement...</p> : (
        <>
          {results.length === 0 ? (
            <p>Aucun professionnel trouvé pour ces critères.</p>
          ) : (
            results.map((pro) => <ProfessionalCard key={pro.id} professional={pro} />)
          )}
        </>
      )}
    </div>
  );
}
