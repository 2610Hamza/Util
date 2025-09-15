import Link from 'next/link';

/**
 * Card affichant un professionnel dans les résultats de recherche.
 * @param {{ professional: any }} props
 */
export default function ProfessionalCard({ professional }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '6px', marginBottom: '1rem' }}>
      <h3 style={{ marginTop: 0 }}>{professional.name}</h3>
      <p>Catégorie : {professional.category || 'N/A'}</p>
      {professional.location && <p>Localisation : {professional.location}</p>}
      {professional.description && <p>{professional.description}</p>}
      <Link href={`/professionals/${professional.id}`} style={{ color: '#0070f3' }}>Voir le profil</Link>
    </div>
  );
}
