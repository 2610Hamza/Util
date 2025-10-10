import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'client',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('util_user', JSON.stringify(data.user));
        
        // Redirection selon le rôle
        if (formData.role === 'professional') {
          router.push('/signup-pro'); // Page détaillée pour les pros
        } else {
          router.push('/dashboard/client');
        }
      } else {
        setError(data.error || 'Erreur lors de l\'inscription');
      }
    } catch (err) {
      setError('Une erreur est survenue. Réessayez.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left side - Visual */}
        <div className="auth-visual">
          <div className="auth-visual-content">
            <Link href="/" className="auth-brand">
              <div className="auth-logo">U</div>
              <span>Util</span>
            </Link>

            <div className="auth-hero">
              <h1>Rejoignez Util 🚀</h1>
              <p>Créez votre compte gratuitement et accédez à des milliers de professionnels</p>
            </div>

            <div className="auth-stats">
              <div className="stat-item">
                <div className="stat-value">10k+</div>
                <div className="stat-label">Professionnels</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">4.8★</div>
                <div className="stat-label">Note moyenne</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">24/7</div>
                <div className="stat-label">Support</div>
              </div>
            </div>

            <div className="auth-testimonial">
              <p>"Util m'a permis de trouver un excellent plombier en moins de 2 heures. Service rapide et pro !"</p>
              <div className="testimonial-author">
                <strong>Marie D.</strong>
                <span>Cliente à Paris</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="auth-form-section">
          <div className="auth-form-container">
            <div className="auth-form-header">
              <h2>Créer un compte</h2>
              <p>Déjà inscrit ? <Link href="/login" className="auth-link">Se connecter</Link></p>
            </div>

            {error && (
              <div className="auth-error">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              {/* Role Selection */}
              <div className="role-selector">
                <button
                  type="button"
                  className={`role-btn ${formData.role === 'client' ? 'active' : ''}`}
                  onClick={() => handleChange('role', 'client')}
                >
                  <span className="role-icon">👤</span>
                  <div>
                    <strong>Client</strong>
                    <p>Je cherche des services</p>
                  </div>
                </button>
                
                <button
                  type="button"
                  className={`role-btn ${formData.role === 'professional' ? 'active' : ''}`}
                  onClick={() => handleChange('role', 'professional')}
                >
                  <span className="role-icon">💼</span>
                  <div>
                    <strong>Professionnel</strong>
                    <p>Je propose mes services</p>
                  </div>
                </button>
              </div>

              <div className="form-group">
                <label htmlFor="name">Nom complet</label>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input
                    id="name"
                    type="text"
                    placeholder="Jean Dupont"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Adresse email</label>
                <div className="input-wrapper">
                  <span className="input-icon">📧</span>
                  <input
                    id="email"
                    type="email"
                    placeholder="vous@exemple.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Mot de passe</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    id="password"
                    type="password"
                    placeholder="Minimum 8 caractères"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    required
                    minLength={8}
                    autoComplete="new-password"
                  />
                </div>
                <span className="input-hint">Au moins 8 caractères</span>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-lg"
                disabled={loading}
                style={{ width: '100%' }}
              >
                {loading ? (
                  <>
                    <span className="loading"></span>
                    Création du compte...
                  </>
                ) : (
                  'Créer mon compte'
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p>En créant un compte, vous acceptez nos <Link href="#">Conditions d'utilisation</Link> et notre <Link href="#">Politique de confidentialité</Link></p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          background: var(--bg);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .auth-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          max-width: 1200px;
          width: 100%;
          background: white;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
        }

        .auth-visual {
          background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
          padding: 60px;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .auth-visual::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
          animation: float 20s ease-in-out infinite;
        }

        .auth-visual-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 40px;
          height: 100%;
        }

        .auth-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 28px;
          font-weight: 800;
        }

        .auth-logo {
          width: 48px;
          height: 48px;
          background: white;
          color: #8b5cf6;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          font-weight: 900;
        }

        .auth-hero h1 {
          font-size: 42px;
          font-weight: 800;
          margin: 0 0 16px;
          line-height: 1.1;
        }

        .auth-hero p {
          font-size: 18px;
          opacity: 0.9;
          line-height: 1.6;
        }

        .auth-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .stat-item {
          text-align: center;
          padding: 20px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }

        .stat-value {
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 13px;
          opacity: 0.8;
        }

        .auth-testimonial {
          margin-top: auto;
          padding: 24px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          backdrop-filter: blur(10px);
        }

        .auth-testimonial p {
          font-size: 16px;
          font-style: italic;
          margin: 0 0 16px;
          line-height: 1.6;
        }

        .testimonial-author {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .testimonial-author strong {
          font-size: 14px;
        }

        .testimonial-author span {
          font-size: 12px;
          opacity: 0.8;
        }

        .auth-form-section {
          padding: 60px;
          display: flex;
          align-items: center;
        }

        .auth-form-container {
          width: 100%;
          max-width: 420px;
          margin: 0 auto;
        }

        .auth-form-header {
          margin-bottom: 32px;
        }

        .auth-form-header h2 {
          font-size: 32px;
          font-weight: 800;
          margin: 0 0 8px;
        }

        .auth-form-header p {
          font-size: 15px;
          color: var(--text-secondary);
          margin: 0;
        }

        .auth-link {
          color: var(--accent);
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .auth-link:hover {
          text-decoration: underline;
        }

        .auth-error {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: rgba(239, 68, 68, 0.1);
          border: 2px solid rgba(239, 68, 68, 0.3);
          border-radius: 12px;
          color: var(--error);
          font-weight: 500;
          margin-bottom: 24px;
        }

        .error-icon {
          font-size: 20px;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .role-selector {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 8px;
        }

        .role-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: white;
          border: 2px solid var(--border);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .role-btn:hover {
          border-color: var(--accent);
          transform: translateY(-2px);
        }

        .role-btn.active {
          border-color: var(--accent);
          background: rgba(59, 130, 246, 0.05);
        }

        .role-icon {
          font-size: 32px;
        }

        .role-btn strong {
          display: block;
          font-size: 15px;
          color: var(--text);
          margin-bottom: 2px;
        }

        .role-btn p {
          font-size: 12px;
          color: var(--text-muted);
          margin: 0;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-size: 14px;
          font-weight: 600;
          color: var(--text);
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          font-size: 18px;
          pointer-events: none;
        }

        .input-wrapper input {
          padding-left: 48px;
          height: 52px;
        }

        .input-hint {
          font-size: 12px;
          color: var(--text-muted);
        }

        .auth-footer {
          text-align: center;
          margin-top: 32px;
        }

        .auth-footer p {
          font-size: 12px;
          color: var(--text-muted);
          line-height: 1.6;
        }

        .auth-footer a {
          color: var(--accent);
          font-weight: 600;
        }

        .auth-footer a:hover {
          text-decoration: underline;
        }

        @media (max-width: 1024px) {
          .auth-container {
            grid-template-columns: 1fr;
          }

          .auth-visual {
            display: none;
          }

          .auth-form-section {
            padding: 40px 24px;
          }
        }

        @media (max-width: 640px) {
          .auth-page {
            padding: 0;
          }

          .auth-container {
            border-radius: 0;
            min-height: 100vh;
          }

          .auth-form-section {
            padding: 32px 20px;
          }

          .auth-form-header h2 {
            font-size: 28px;
          }

          .role-selector {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}