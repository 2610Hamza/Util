import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      // Vérifier si l'email existe déjà
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', formData.email)
        .single();

      if (existingUser) {
        setError('Cet email est déjà utilisé');
        setLoading(false);
        return;
      }

      // Créer l'utilisateur
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            password: formData.password, // ⚠️ En production, hasher avec bcrypt
            role: 'client',
          }
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      // Connexion automatique
      localStorage.setItem('util_user', JSON.stringify({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      }));

      router.push('/dashboard/client');
    } catch (error) {
      console.error('Erreur:', error);
      setError('Une erreur est survenue. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-card">
          <div className="signup-header">
            <h1>Créer un compte</h1>
            <p>Rejoignez Util en quelques secondes</p>
          </div>

          {error && (
            <div className="error-banner">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-group">
              <label>Nom complet</label>
              <input
                type="text"
                placeholder="Jean Dupont"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

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
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label>Confirmer le mot de passe</label>
              <input
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                minLength={6}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-lg btn-block"
              disabled={loading}
            >
              {loading ? 'Création...' : "Créer mon compte"}
            </button>
          </form>

          <div className="signup-footer">
            <p>
              Vous avez déjà un compte ? {' '}
              <Link href="/login">Se connecter</Link>
            </p>
            <p>
              Vous êtes un professionnel ? {' '}
              <Link href="/signup-pro">Devenir prestataire</Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .signup-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
        }
        .signup-container {
          width: 100%;
          max-width: 440px;
        }
        .signup-card {
          background: white;
          border-radius: 24px;
          padding: 48px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        .signup-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .signup-header h1 {
          font-size: 32px;
          font-weight: 800;
          margin: 0 0 8px;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .signup-header p {
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
        .signup-form {
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
        .signup-footer {
          text-align: center;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
        }
        .signup-footer p {
          margin: 8px 0;
          font-size: 14px;
          color: #6b7280;
        }
        .signup-footer a {
          color: #3b82f6;
          font-weight: 600;
        }
        @media (max-width: 480px) {
          .signup-card {
            padding: 32px 24px;
          }
        }
      `}</style>
    </div>
  );
}