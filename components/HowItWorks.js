const steps = [
  {
    number: '1',
    icon: '🎯',
    title: 'Décrivez votre besoin',
    description: 'Notre IA analyse votre demande et identifie les meilleurs professionnels',
    color: '#3b82f6'
  },
  {
    number: '2',
    icon: '💬',
    title: 'Recevez des devis',
    description: 'Comparez les offres et choisissez le professionnel qui vous convient',
    color: '#8b5cf6'
  },
  {
    number: '3',
    icon: '💳',
    title: 'Réservez et payez',
    description: 'Paiement sécurisé, fonds bloqués jusqu\'à validation de la prestation',
    color: '#ec4899'
  },
  {
    number: '4',
    icon: '⭐',
    title: 'Évaluez le service',
    description: 'Partagez votre expérience pour aider la communauté',
    color: '#f59e0b'
  },
];

export default function HowItWorks() {
  return (
    <section style={{ padding: '80px 0', background: 'linear-gradient(180deg, transparent 0%, rgba(59, 130, 246, 0.02) 100%)' }}>
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <h2 style={{ 
          fontSize: 'clamp(32px, 5vw, 48px)', 
          fontWeight: 800, 
          marginBottom: '16px',
          letterSpacing: '-0.02em'
        }}>
          Comment ça marche ?
        </h2>
        <p className="muted" style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
          Trouvez votre professionnel en 4 étapes simples
        </p>
      </div>

      <div className="steps-container">
        {steps.map((step, index) => (
          <div key={index} className="step-wrapper">
            <div className="step-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="step-number" style={{ background: step.color }}>
                {step.number}
              </div>
              
              <div className="step-icon-container">
                <div className="step-icon" style={{ 
                  background: `linear-gradient(135deg, ${step.color}22 0%, ${step.color}11 100%)`,
                  borderColor: `${step.color}33`
                }}>
                  <span>{step.icon}</span>
                </div>
              </div>

              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>

              <div className="step-decoration" style={{ background: step.color }}></div>
            </div>

            {index < steps.length - 1 && (
              <div className="step-connector">
                <svg width="100%" height="2" xmlns="http://www.w3.org/2000/svg">
                  <line x1="0" y1="1" x2="100%" y2="1" stroke="var(--border)" strokeWidth="2" strokeDasharray="8,8">
                    <animate attributeName="stroke-dashoffset" from="16" to="0" dur="2s" repeatCount="indefinite"/>
                  </line>
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .steps-container {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          max-width: 1200px;
          margin: 0 auto;
          align-items: start;
        }

        .step-wrapper {
          display: contents;
        }

        .step-card {
          position: relative;
          padding: 32px 24px;
          text-align: center;
          animation: fadeInUp 0.8s ease-out both;
        }

        .step-number {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 800;
          color: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 2;
        }

        .step-icon-container {
          margin-top: 20px;
          margin-bottom: 24px;
          display: flex;
          justify-content: center;
        }

        .step-icon {
          width: 100px;
          height: 100px;
          border-radius: 24px;
          border: 2px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .step-card:hover .step-icon {
          transform: scale(1.1) rotate(-5deg);
        }

        .step-title {
          font-size: 20px;
          font-weight: 700;
          color: var(--text);
          margin: 0 0 12px;
        }

        .step-description {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        .step-decoration {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 4px;
          border-radius: 2px;
          opacity: 0.3;
        }

        .step-connector {
          display: flex;
          align-items: center;
          padding: 0 8px;
          margin-top: 80px;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 1024px) {
          .steps-container {
            grid-template-columns: repeat(2, 1fr);
            gap: 32px;
          }

          .step-connector {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .steps-container {
            grid-template-columns: 1fr;
            gap: 48px;
          }

          .step-card {
            padding: 24px 16px;
          }

          .step-icon {
            width: 80px;
            height: 80px;
            font-size: 40px;
          }

          .step-title {
            font-size: 18px;
          }
        }
      `}</style>
    </section>
  );
}