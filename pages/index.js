import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import CategoryGrid from '../components/CategoryGrid';
import Link from 'next/link';

export default function Home() {
  const stats = [
    { value: '10k+', label: 'Professionnels' },
    { value: '12%', label: 'Commission' },
    { value: '4.8★', label: 'Note moyenne' },
    { value: '24/7', label: 'Support' },
  ];

  const features = [
    {
      icon: '🎯',
      title: 'IA Intelligente',
      desc: 'Matching automatique avec les meilleurs pros pour votre besoin'
    },
    {
      icon: '⚡',
      title: 'Devis instantanés',
      desc: 'Recevez plusieurs propositions en quelques minutes'
    },
    {
      icon: '🔒',
      title: 'Paiement sécurisé',
      desc: 'Fonds bloqués jusqu\'à validation de la prestation'
    },
    {
      icon: '✅',
      title: 'Pros vérifiés',
      desc: 'Tous nos professionnels sont vérifiés et certifiés'
    },
  ];

  return (
    <div>
      <Hero />

      {/* Stats Section */}
      <section style={{ padding: '48px 0', background: 'var(--panel)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '32px',
            textAlign: 'center'
          }}>
            {stats.map((stat, i) => (
              <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div style={{
                  fontSize: '40px',
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '8px'
                }}>
                  {stat.value}
                </div>
                <div className="muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container">
        <HowItWorks />

        {/* Features */}
        <section style={{ padding: '64px 0' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '16px' }}>
              Pourquoi choisir Util ?
            </h2>
            <p className="muted" style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
              La plateforme moderne qui révolutionne la mise en relation entre clients et professionnels
            </p>
          </div>

          <div className="grid grid-4">
            {features.map((feature, i) => (
              <div key={i} className="kard" style={{ textAlign: 'center', padding: '32px 24px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>
                  {feature.title}
                </h3>
                <p className="muted" style={{ fontSize: '14px', margin: 0 }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <CategoryGrid />

        {/* CTA Section */}
        <section style={{
          padding: '64px 32px',
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
          borderRadius: 'var(--radius-lg)',
          textAlign: 'center',
          color: 'white',
          marginBottom: '64px'
        }}>
          <h2 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '16px' }}>
            Prêt à trouver le bon professionnel ?
          </h2>
          <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
            Rejoignez des milliers d'utilisateurs qui trouvent leurs pros sur Util
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/search">
              <button className="btn btn-lg" style={{ background: 'white', color: 'var(--primary)' }}>
                🔍 Trouver un pro
              </button>
            </Link>
            <Link href="/signup-pro">
              <button className="btn btn-lg" style={{ background: 'transparent', border: '2px solid white', color: 'white' }}>
                💼 Devenir pro
              </button>
            </Link>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer style={{
        background: 'var(--primary)',
        color: 'white',
        padding: '48px 0 24px'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '32px',
            marginBottom: '32px'
          }}>
            <div>
              <div className="brand" style={{ color: 'white', marginBottom: '12px' }}>
                Util
              </div>
              <p style={{ opacity: 0.8, fontSize: '14px' }}>
                La plateforme qui connecte clients et professionnels de confiance.
              </p>
            </div>

            <div>
              <h4 style={{ marginBottom: '16px', fontSize: '16px' }}>Liens rapides</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                <Link href="/search" style={{ opacity: 0.8 }}>Rechercher</Link>
                <Link href="/categories" style={{ opacity: 0.8 }}>Catégories</Link>
                <Link href="/signup-pro" style={{ opacity: 0.8 }}>Devenir pro</Link>
              </div>
            </div>

            <div>
              <h4 style={{ marginBottom: '16px', fontSize: '16px' }}>Support</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                <a href="#" style={{ opacity: 0.8 }}>Centre d'aide</a>
                <a href="#" style={{ opacity: 0.8 }}>Contact</a>
                <a href="#" style={{ opacity: 0.8 }}>FAQ</a>
              </div>
            </div>

            <div>
              <h4 style={{ marginBottom: '16px', fontSize: '16px' }}>Légal</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                <a href="#" style={{ opacity: 0.8 }}>CGU</a>
                <a href="#" style={{ opacity: 0.8 }}>Confidentialité</a>
                <a href="#" style={{ opacity: 0.8 }}>Mentions légales</a>
              </div>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '24px',
            textAlign: 'center',
            fontSize: '14px',
            opacity: 0.7
          }}>
            © {new Date().getFullYear()} Util. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}