import Link from 'next/link';

export default function ProfessionalCard({ professional }) {
  return (
    <div style={{ border: '1px solid #eee', padding: 16, borderRadius: 12, background: '#fff' }}>
      <h3 style={{ marginTop: 0 }}>{professional.name || professional.displayName || 'Professionnel'}</h3>
      <p style={{ color: '#555', marginTop: 4, marginBottom: 8 }}>
        {professional.category || (professional.categories && professional.categories.join(', '))} · {professional.location || professional.city || '—'}
      </p>
      {'ratingAvg' in professional && professional.ratingCount > 0 ? (
        <p style={{ margin: 0 }}>
          ⭐ {Number(professional.ratingAvg).toFixed(1)} ({professional.ratingCount})
        </p>
      ) : <p style={{ margin: 0, color: '#777' }}>Pas encore d’avis</p>}
      <div style={{ marginTop: 12 }}>
        <Link href={`/professionals/${professional.id}`}>
          <span style={{ background: '#111', color: '#fff', borderRadius: 8, padding: '8px 12px', cursor: 'pointer' }}>Voir le profil</span>
        </Link>
      </div>
    </div>
  );
}
