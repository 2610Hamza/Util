import Link from 'next/link';

export default function ProfessionalCard({ professional }) {
  const name = professional.name || professional.displayName || 'Professionnel';
  const cats = professional.category || (professional.categories && professional.categories.join(', ')) || '—';
  const city = professional.location || professional.city || '—';
  const hasRating = typeof professional.ratingAvg !== 'undefined' && professional.ratingCount > 0;

  return (
    <div className="kard">
      <h3 style={{ marginTop: 0 }}>{name}</h3>
      <p className="muted" style={{ marginTop: 4, marginBottom: 8 }}>
        {cats} · {city}
      </p>
      {hasRating ? (
        <p style={{ margin: 0 }}>⭐ {Number(professional.ratingAvg).toFixed(1)} ({professional.ratingCount})</p>
      ) : (
        <p className="muted" style={{ margin: 0 }}>Pas encore d’avis</p>
      )}
      <div style={{ marginTop: 12 }}>
        <Link href={`/professionals/${professional.id}`} className="btn btn-primary">Voir le profil</Link>
      </div>
    </div>
  );
}
