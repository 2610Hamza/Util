import SearchBar from './SearchBar';

export default function Hero() {
  return (
    <section style={{
      padding: '64px 16px', background: 'linear-gradient(180deg,#fff, #f6f7fb)',
      borderRadius: '16px', border: '1px solid #eee'
    }}>
      <h1 style={{ fontSize: 36, margin: 0 }}>Util — trouvez un pro en quelques minutes</h1>
      <p style={{ color: '#555', margin: '12px 0 24px' }}>
        De la plomberie à l’informatique, réservez un professionnel vérifié, payez en ligne, suivez la mission, puis laissez un avis.
      </p>
      <SearchBar />
      <ul style={{ display: 'flex', gap: 16, listStyle: 'none', padding: 0, marginTop: 24, color: '#666' }}>
        <li>✔️ Pros vérifiés</li>
        <li>✔️ Devis rapides</li>
        <li>✔️ Paiement sécurisé</li>
      </ul>
    </section>
  );
}
