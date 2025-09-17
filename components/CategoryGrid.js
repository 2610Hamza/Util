import Link from 'next/link';
import { categories } from '../data/categories';

export default function CategoryGrid() {
  return (
    <section style={{ padding: '32px 0' }}>
      <h2 style={{ marginBottom: 16 }}>Catégories populaires</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 16 }}>
        {categories.map(c => (
          <Link key={c.slug} href={`/search?category=${encodeURIComponent(c.slug)}`}>
            <div style={{
              border: '1px solid #eee', borderRadius: 12, padding: 16, background: '#fff',
              cursor: 'pointer'
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🛠️</div>
              <div style={{ fontWeight: 600 }}>{c.name}</div>
              <div style={{ fontSize: 12, color: '#666' }}>Voir les pros</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
