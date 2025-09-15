import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import RequestForm from '../../components/RequestForm';

/**
 * Affiche la page de profil détaillée d'un professionnel.
 */
export default function ProfessionalProfile() {
  const router = useRouter();
  const { id } = router.query;
  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function fetchData() {
      const res = await fetch(`/api/professionals?id=${id}`);
      if (res.ok) {
        const data = await res.json();
        setProfessional(Array.isArray(data) ? data[0] : data);
      }
      setLoading(false);
    }
    fetchData();
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (!professional) return <p>Professionnel introuvable.</p>;

  return (
    <div>
      <h1>{professional.name}</h1>
      <p><strong>Catégorie :</strong> {professional.category}</p>
      {professional.location && <p><strong>Localisation :</strong> {professional.location}</p>}
      {professional.description && <p><strong>Description :</strong> {professional.description}</p>}
      <hr />
      <RequestForm professionalId={professional.id} />
    </div>
  );
}
