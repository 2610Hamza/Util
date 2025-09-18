import SearchBar from './SearchBar';

export default function Hero() {
  return (
    <section className="hero card">
      <h1>Réservez un professionnel de confiance</h1>
      <p>De la plomberie à l’informatique : comparez les pros, recevez des devis, réservez et payez en ligne, puis évaluez.</p>
      <div style={{ marginBottom: 16 }}>
        <SearchBar />
      </div>
      <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
        <span className="badge">✅ Pros vérifiés</span>
        <span className="badge">⚡ Devis rapides</span>
        <span className="badge">🔒 Paiement sécurisé</span>
      </div>
    </section>
  );
}
