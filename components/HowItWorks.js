const Step = ({ n, title, desc }) => (
  <div style={{ flex: 1, minWidth: 220, border: '1px solid #eee', borderRadius: 12, padding: 16, background: '#fff' }}>
    <div style={{
      width: 36, height: 36, borderRadius: 999, background: '#111', color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, marginBottom: 12
    }}>{n}</div>
    <h3 style={{ margin: '0 0 8px' }}>{title}</h3>
    <p style={{ margin: 0, color: '#555' }}>{desc}</p>
  </div>
);

export default function HowItWorks() {
  return (
    <section style={{ padding: '32px 0' }}>
      <h2 style={{ marginBottom: 16 }}>Comment ça marche</h2>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Step n="1" title="Décrivez votre besoin" desc="Catégorie, ville, détails et budget." />
        <Step n="2" title="Recevez des devis" desc="Des pros vous répondent rapidement." />
        <Step n="3" title="Réservez et payez" desc="Paiement sécurisé, suivi de mission." />
        <Step n="4" title="Évaluez le pro" desc="Laissez une note et un avis." />
      </div>
    </section>
  );
}
