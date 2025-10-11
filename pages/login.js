import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Chercher l'utilisateur dans Supabase
      const { data: user, error: loginError } = await supabase
        .from('users')
        .select('*')
        .eq('email', formData.email)
        .eq('password', formData.password)
        .single();

      if (loginError || !user) {
        setError('Email ou mot de passe incorrect');
        setLoading(false);
        return;
      }

      // Sauvegarder dans localStorage
      localStorage.setItem('util_user', JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }));

      // Rediriger selon le rôle
      if (user.role === 'client') {
        router.push('/dashboard/client');
      } else if (user.role === 'professional') {
        router.push('/dashboard/provider');
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Connexion</h1>
            <p>Accédez à votre espace Util</p>
          </div>

          {error && (
            <div className="error-banner">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Mot de passe</label>
              <input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-lg btn-block"
              disabled={loading}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Pas encore de compte ? {' '}
              <Link href="/signup">Créer un compte</Link>
            </p>
            <p>
              Vous êtes un professionnel ? {' '}
              <Link href="/signup-pro">Devenir prestataire</Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
        }
        .login-container {
          width: 100%;
          max-width: 440px;
        }
        .login-card {
          background: white;
          border-radius: 24px;
          padding: 48px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .login-header h1 {
          font-size: 32px;
          font-weight: 800;
          margin: 0 0 8px;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .login-header p {
          font-size: 16px;
          color: #6b7280;
          margin: 0;
        }
        .error-banner {
          background: #fef2f2;
          border: 2px solid #fecaca;
          color: #dc2626;
          padding: 12px 16px;
          border-radius: 12px;
          margin-bottom: 24px;
          font-weight: 600;
          font-size: 14px;
        }
        .login-form {
          margin-bottom: 24px;
        }
        .form-group {
          margin-bottom: 20px;
        }
        .form-group label {
          display: block;
          font-weight: 600;
          margin-bottom: 8px;
          color: #374151;
        }
        .form-group input {
          width: 100%;
          height: 48px;
          padding: 0 16px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 15px;
          transition: all 0.2s;
        }
        .form-group input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .btn-block {
          width: 100%;
        }
        .login-footer {
          text-align: center;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
        }
        .login-footer p {
          margin: 8px 0;
          font-size: 14px;
          color: #6b7280;
        }
        .login-footer a {
          color: #3b82f6;
          font-weight: 600;
        }
        @media (max-width: 480px) {
          .login-card {
            padding: 32px 24px;
          }
        }
      `}</style>
    </div>
  );
}