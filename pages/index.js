import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import CategoryGrid from '../components/CategoryGrid';
import Link from 'next/link';

export default function Home() {
  const stats = [
    { value: '10k+', label: 'Professionnels actifs', icon: '👥' },
    { value: '12%', label: 'Commission seulement', icon: '💰' },
    { value: '4.9★', label: 'Note moyenne', icon: '⭐' },
    { value: '24/7', label: 'Support client', icon: '🎧' },
  ];

  const features = [
    {
      icon: '🎯',
      title: 'IA de Matching Intelligente',
      desc: 'Notre intelligence artificielle analyse votre demande et trouve les professionnels les plus qualifiés en quelques secondes',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      icon: '⚡',
      title: 'Devis Instantanés',
      desc: 'Recevez plusieurs propositions tarifaires détaillées en quelques minutes et comparez facilement',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      icon: '🔒',
      title: 'Paiement 100% Sécurisé',
      desc: 'Vos fonds sont bloqués sur un compte tiers jusqu\'à validation complète de la prestation',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      icon: '✅',
      title: 'Professionnels Vérifiés',
      desc: 'Tous nos pros passent par une vérification d\'identité, de diplômes et d\'assurance stricte',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
  ];

  const testimonials = [
    {
      name: 'Marie Dubois',
      role: 'Cliente',
      avatar: '👩',
      text: 'J\'ai trouvé un excellent plombier en moins de 10 minutes. Service impeccable et prix transparent!',
      rating: 5
    },
    {
      name: 'Thomas Martin',
      role: 'Électricien',
      avatar: '👨',
      text: 'Depuis que je suis sur Util, j\'ai multiplié ma clientèle par 3. La plateforme est vraiment bien pensée.',
      rating: 5
    },
    {
      name: 'Sophie Laurent',
      role: 'Cliente',
      avatar: '👩',
      text: 'Super expérience! Les devis sont arrivés rapidement et j\'ai pu choisir le meilleur pro pour mon budget.',
      rating: 5
    }
  ];

  return (
    <div>
      <Hero />

      {/* Stats Section - Enhanced */}
      <section style={{ padding: 'var(--space-3xl) 0', background: 'var(--panel)' }}>
        <div className="container">
          <div className="grid grid-4">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="card-premium animate-scale-in"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  textAlign: 'center',
                  padding: 'var(--space-xl)'
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: 'var(--space-md)' }}>
                  {stat.icon}
                </div>
                <div style={{
                  fontSize: '48px',
                  fontWeight: 900,
                  background: 'var(--accent-gradient)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: 'var(--space-sm)'
                }}>
                  {stat.value}
                </div>
                <div style={{
                  color: 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '15px'
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container">
        <HowItWorks />

        {/* Features - Premium */}
        <section style={{ padding: 'var(--space-3xl) 0' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <span className="badge badge-gradient" style={{ marginBottom: 'var(--space-md)' }}>
              ✨ Fonctionnalités Premium
            </span>
            <h2 style={{
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 900,
              marginBottom: 'var(--space-md)',
              lineHeight: 1.2
            }}>
              Pourquoi choisir Util ?
            </h2>
            <p style={{
              fontSize: '20px',
              color: 'var(--text-secondary)',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: 1.6
            }}>
              La plateforme moderne qui révolutionne la mise en relation entre clients et professionnels grâce à l'IA
            </p>
          </div>

          <div className="grid grid-4">
            {features.map((feature, i) => (
              <div
                key={i}
                className="card animate-slide-up"
                style={{
                  padding: 'var(--space-xl)',
                  textAlign: 'center',
                  animationDelay: `${i * 0.1}s`,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto var(--space-lg)',
                  background: feature.gradient,
                  borderRadius: 'var(--radius-xl)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '40px',
                  boxShadow: 'var(--shadow-lg)'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  marginBottom: 'var(--space-sm)',
                  color: 'var(--text)'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  margin: 0
                }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <CategoryGrid />

        {/* Testimonials Section */}
        <section style={{ padding: 'var(--space-3xl) 0' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <span className="badge badge-success" style={{ marginBottom: 'var(--space-md)' }}>
              💬 Témoignages
            </span>
            <h2 style={{
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 900,
              marginBottom: 'var(--space-md)'
            }}>
              Ils nous font confiance
            </h2>
            <p style={{
              fontSize: '18px',
              color: 'var(--text-secondary)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Rejoignez des milliers d'utilisateurs satisfaits
            </p>
          </div>

          <div className="grid grid-3">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className="card-glass animate-fade-in"
                style={{
                  padding: 'var(--space-xl)',
                  animationDelay: `${i * 0.15}s`
                }}
              >
                <div style={{ marginBottom: 'var(--space-md)' }}>
                  {'⭐'.repeat(testimonial.rating)}
                </div>
                <p style={{
                  fontSize: '15px',
                  lineHeight: 1.7,
                  color: 'var(--text)',
                  marginBottom: 'var(--space-lg)',
                  fontStyle: 'italic'
                }}>
                  "{testimonial.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--accent-gradient)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px'
                  }}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text)' }}>
                      {testimonial.name}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section - Enhanced */}
        <section style={{
          padding: 'var(--space-3xl)',
          background: 'var(--accent-gradient)',
          borderRadius: 'var(--radius-2xl)',
          textAlign: 'center',
          color: 'white',
          marginBottom: 'var(--space-3xl)',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-2xl)'
        }}>
          {/* Decorative elements */}
          <div style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '300px',
            height: '300px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            filter: 'blur(60px)'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-100px',
            left: '-100px',
            width: '300px',
            height: '300px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            filter: 'blur(60px)'
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              width: '72px',
              height: '72px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-lg)',
              fontSize: '36px',
              backdropFilter: 'blur(10px)'
            }}>
              🚀
            </div>
            <h2 style={{
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 900,
              marginBottom: 'var(--space-md)',
              lineHeight: 1.2
            }}>
              Prêt à transformer votre expérience ?
            </h2>
            <p style={{
              fontSize: '20px',
              opacity: 0.95,
              marginBottom: 'var(--space-xl)',
              maxWidth: '700px',
              margin: '0 auto var(--space-xl)',
              lineHeight: 1.6
            }}>
              Rejoignez des milliers d'utilisateurs qui trouvent leurs professionnels en quelques clics grâce à notre IA
            </p>
            <div style={{
              display: 'flex',
              gap: 'var(--space-md)',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <Link href="/search">
                <button className="btn btn-lg" style={{
                  background: 'white',
                  color: 'var(--accent)',
                  boxShadow: 'var(--shadow-xl)',
                  fontWeight: 700
                }}>
                  🔍 Trouver un professionnel
                </button>
              </Link>
              <Link href="/signup-pro">
                <button className="btn btn-lg" style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '2px solid white',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  fontWeight: 700
                }}>
                  💼 Devenir professionnel
                </button>
              </Link>
            </div>
            <div style={{
              marginTop: 'var(--space-xl)',
              fontSize: '14px',
              opacity: 0.9
            }}>
              ✨ Aucune carte bancaire requise • 🎯 Devis gratuits • ⚡ Réponse instantanée
            </div>
          </div>
        </section>
      </div>

      {/* Footer - Enhanced */}
      <footer style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-600) 100%)',
        color: 'white',
        padding: 'var(--space-3xl) 0 var(--space-lg)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          opacity: 0.3
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--space-xl)',
            marginBottom: 'var(--space-2xl)'
          }}>
            <div>
              <div style={{
                fontSize: '32px',
                fontWeight: 900,
                marginBottom: 'var(--space-md)',
                background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Util
              </div>
              <p style={{
                opacity: 0.9,
                fontSize: '15px',
                lineHeight: 1.6,
                marginBottom: 'var(--space-md)'
              }}>
                La plateforme intelligente qui connecte clients et professionnels de confiance grâce à l'IA.
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                <a href="#" style={{
                  width: '40px',
                  height: '40px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 'var(--radius)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'var(--transition)'
                }}>📘</a>
                <a href="#" style={{
                  width: '40px',
                  height: '40px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 'var(--radius)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'var(--transition)'
                }}>🐦</a>
                <a href="#" style={{
                  width: '40px',
                  height: '40px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 'var(--radius)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'var(--transition)'
                }}>📷</a>
                <a href="#" style={{
                  width: '40px',
                  height: '40px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 'var(--radius)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'var(--transition)'
                }}>💼</a>
              </div>
            </div>

            <div>
              <h4 style={{
                marginBottom: 'var(--space-md)',
                fontSize: '16px',
                fontWeight: 700
              }}>Liens rapides</h4>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-sm)',
                fontSize: '14px'
              }}>
                <Link href="/search" style={{
                  opacity: 0.85,
                  transition: 'var(--transition)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-xs)'
                }}>
                  → Rechercher un pro
                </Link>
                <Link href="/categories" style={{
                  opacity: 0.85,
                  transition: 'var(--transition)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-xs)'
                }}>
                  → Toutes les catégories
                </Link>
                <Link href="/signup-pro" style={{
                  opacity: 0.85,
                  transition: 'var(--transition)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-xs)'
                }}>
                  → Devenir professionnel
                </Link>
                <Link href="/login" style={{
                  opacity: 0.85,
                  transition: 'var(--transition)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-xs)'
                }}>
                  → Se connecter
                </Link>
              </div>
            </div>

            <div>
              <h4 style={{
                marginBottom: 'var(--space-md)',
                fontSize: '16px',
                fontWeight: 700
              }}>Support & Aide</h4>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-sm)',
                fontSize: '14px'
              }}>
                <a href="#" style={{ opacity: 0.85, transition: 'var(--transition)' }}>
                  Centre d'aide
                </a>
                <a href="#" style={{ opacity: 0.85, transition: 'var(--transition)' }}>
                  Nous contacter
                </a>
                <a href="#" style={{ opacity: 0.85, transition: 'var(--transition)' }}>
                  FAQ
                </a>
                <a href="#" style={{ opacity: 0.85, transition: 'var(--transition)' }}>
                  Guide d'utilisation
                </a>
              </div>
            </div>

            <div>
              <h4 style={{
                marginBottom: 'var(--space-md)',
                fontSize: '16px',
                fontWeight: 700
              }}>Légal & Sécurité</h4>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-sm)',
                fontSize: '14px'
              }}>
                <a href="#" style={{ opacity: 0.85, transition: 'var(--transition)' }}>
                  Conditions générales
                </a>
                <a href="#" style={{ opacity: 0.85, transition: 'var(--transition)' }}>
                  Politique de confidentialité
                </a>
                <a href="#" style={{ opacity: 0.85, transition: 'var(--transition)' }}>
                  Mentions légales
                </a>
                <a href="#" style={{ opacity: 0.85, transition: 'var(--transition)' }}>
                  Charte de qualité
                </a>
              </div>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.15)',
            paddingTop: 'var(--space-lg)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'var(--space-md)',
            fontSize: '14px',
            opacity: 0.85
          }}>
            <div>
              © {new Date().getFullYear()} Util. Tous droits réservés.
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
              <span>🇫🇷 France</span>
              <span>•</span>
              <span>Fait avec ❤️ à Paris</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}