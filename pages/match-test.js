// pages/match-test.js
import { useState } from 'react';

export default function MatchTest() {
  const [query, setQuery] = useState('fuite robinet urgence');
  const [category, setCategory] = useState('plomberie');
  const [lat, setLat] = useState(48.8566);
  const [lng, setLng] = useState(2.3522);
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [radiusKm, setRadiusKm] = useState(25);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          category,
          location: { lat: Number(lat), lng: Number(lng) },
          budgetMin: budgetMin ? Number(budgetMin) : null,
          budgetMax: budgetMax ? Number(budgetMax) : null,
          radiusKm: Number(radiusKm),
          limit: 20,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Erreur');
      setItems(json.items || []);
    } catch (e) {
      alert('Erreur matching');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Test IA Matching</h1>

      <div className="kard" style={{ padding: 16, display:'grid', gap:12 }}>
        <input className="card" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Décris ton besoin (ex: fuite robinet urgence)" />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <input className="card" value={category} onChange={e=>setCategory(e.target.value)} placeholder="Catégorie (ex: plomberie)" />
          <input className="card" value={radiusKm} onChange={e=>setRadiusKm(e.target.value)} placeholder="Rayon km" />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <input className="card" value={lat} onChange={e=>setLat(e.target.value)} placeholder="Latitude" />
          <input className="card" value={lng} onChange={e=>setLng(e.target.value)} placeholder="Longitude" />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <input className="card" value={budgetMin} onChange={e=>setBudgetMin(e.target.value)} placeholder="Budget min (optionnel)" />
          <input className="card" value={budgetMax} onChange={e=>setBudgetMax(e.target.value)} placeholder="Budget max (optionnel)" />
        </div>
        <button className="btn btn-primary" disabled={loading} onClick={run}>
          {loading ? 'Calcul…' : 'Lancer le matching'}
        </button>
      </div>

      <div style={{ marginTop:16, display:'grid', gap:12 }}>
        {items.map((x,i)=>(
          <div key={x.id || i} className="kard" style={{ padding:16 }}>
            <div style={{ display:'flex', justifyContent:'space-between', gap:12 }}>
              <div>
                <h3 style={{ margin:'0 0 4px' }}>{x.name} {x.verified ? '✅' : ''} — {x.rating ?? '—'}★</h3>
                <div className="muted" style={{ fontSize:13 }}>
                  {x.city} · {x.distanceKm != null ? `${x.distanceKm} km` : 'distance ?'} · {x.categories?.join(', ')}
                </div>
                <div className="muted" style={{ fontSize:13 }}>
                  {x.priceMin || '—'}€ – {x.priceMax || '—'}€
                </div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div><b>Score</b> {x.score}</div>
                <div className="muted" style={{ fontSize:12 }}>
                  sim {x.explain.sim} · dist {x.explain.distPenalty} · rat {x.explain.ratingBonus}
                </div>
              </div>
            </div>
            {x.bio && <p style={{ marginTop:8 }}>{x.bio}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
