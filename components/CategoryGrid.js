import Link from 'next/link';
import { categories } from '../data/categories';

export default function CategoryGrid() {
  return (
    <section style={{ padding: '32px 0' }}>
      <h2 style={{ marginBottom: 16 }}>Catégories populaires</h2>
      <div className="grid grid-4">
        {categories.map(c => (
          <Link key={c.slug} href={`/search?category=${encodeURIComponent(c.slug)}`}>
            <div className="kard">
              <div style={{ fontSize: 26, marginBottom: 8 }}>🛠️</div>
              <div style={{ fontWeight: 700 }}>{c.name}</div>
              <div className="muted" style={{ fontSize: 12 }}>Voir les pros</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
