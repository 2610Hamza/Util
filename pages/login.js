import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('util_user', JSON.stringify(data.user));
        
        // Redirection selon le rôle
        const redirectPath = data.user.role === 'client' 
          ? '/dashboard/client' 
          : '/dashboard/provider';
        
        router.push(redirectPath);
      } else {
        setError(data.error || 'Identifiants incorrects');
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
              <h1>Bon retour ! 👋</h1>
              <p>Connectez-vous pour accéder à votre espace et gérer vos services</p>
            </div>

            <div className="auth-features">
              <div className="auth-feature">
                <span className="feature-icon">🔍</span>
                <div>
                  <strong>Trouvez des pros</strong>
                  <p>Accédez à 10,000+ professionnels vérifiés</p>
                </div>
              </div>
              <div className="auth-feature">
                <span className="feature-icon">💬</span>
                <div>
                  <strong>Devis instantanés</strong>
                  <p>Recevez des propositions en quelques minutes</p>
                </div>
              </div>
              <div className="auth-feature">
                <span className="feature-icon">🔒</span>
                <div>
                  <strong>Paiement sécurisé</strong>
                  <p>Vos transactions sont protégées</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="auth-form-section">
          <div className="auth-form-container">
            <div className="auth-form-header">
              <h2>Connexion</h2>
              <p>Pas encore de compte ? <Link href="/signup" className="auth-link">S'inscrire</Link></p>
            </div>

            {error && (
              <div className="auth-error">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Adresse email</label>
                <div className="input-wrapper">
                  <span className="input-icon">📧</span>
                  <input
                    id="email"
                    type="email"
                    placeholder="vous@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="form-label-row">
                  <label htmlFor="password">Mot de passe</label>
                  <Link href="/forgot-password" className="forgot-link">
                    Mot de passe oublié ?
                  </Link>
                </div>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
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
                    Connexion...
                  </>
                ) : (
                  'Se connecter'
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span>ou</span>
            </div>

            <div className="auth-alt-actions">
              <Link href="/signup" className="btn btn-ghost btn-lg" style={{ width: '100%' }}>
                Créer un compte
              </Link>
            </div>

            <div className="auth-footer">
              <p>En vous connectant, vous acceptez nos <Link href="#">CGU</Link> et notre <Link href="#">Politique de confidentialité</Link></p>
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
          background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
          padding: 60px;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .auth-visual::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
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
          gap: 48px;
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
          color: var(--primary);
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

        .auth-features {
          display: flex;
          flex-direction: column;
          gap: 24px;
          margin-top: auto;
        }

        .auth-feature {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .feature-icon {
          font-size: 32px;
          flex-shrink: 0;
        }

        .auth-feature strong {
          display: block;
          font-size: 16px;
          margin-bottom: 4px;
        }

        .auth-feature p {
          font-size: 14px;
          opacity: 0.8;
          margin: 0;
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

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .form-group label {
          font-size: 14px;
          font-weight: 600;
          color: var(--text);
        }

        .forgot-link {
          font-size: 13px;
          color: var(--accent);
          font-weight: 600;
        }

        .forgot-link:hover {
          text-decoration: underline;
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

        .auth-divider {
          position: relative;
          text-align: center;
          margin: 32px 0;
        }

        .auth-divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: var(--border);
        }

        .auth-divider span {
          position: relative;
          background: white;
          padding: 0 16px;
          font-size: 14px;
          color: var(--text-muted);
        }

        .auth-alt-actions {
          margin-bottom: 32px;
        }

        .auth-footer {
          text-align: center;
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
        }
      `}</style>
    </div>
  );
}