import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function RequestQuotePage() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    urgency: 'normal',
    date: '',
    time: '',
    address: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const userStr = localStorage.getItem('util_user');
    if (!userStr) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userStr);
    setLoading(true);

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          budget: formData.budget ? parseFloat(formData.budget) : null,
          clientId: user.id,
          professionalId: id,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/requests/${data.id}/tracking`);
      } else {
        const error = await res.json();
        alert('❌ ' + (error.error || 'Erreur'));
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quote-request-page">
      <div className="container">
        <Link href={`/professionals/${id}`} className="back-link">
          ← Retour au profil
        </Link>

        <div className="progress-stepper">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Détails</div>
          </div>
          <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Date & Lieu</div>
          </div>
          <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Confirmation</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="quote-form">
          {step === 1 && (
            <div className="form-step">
              <h2>Décrivez votre besoin</h2>
              
              <div className="form-group">
                <label>Titre de la demande *</label>
                <input
                  type="text"
                  placeholder="Ex: Réparation fuite robinet cuisine"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description détaillée *</label>
                <textarea
                  placeholder="Décrivez précisément votre besoin..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  rows={6}
                />
                <span className="input-hint">Plus vous êtes précis, plus les devis seront adaptés</span>
              </div>

              <div className="form-group">
                <label>Budget estimé (€)</label>
                <input
                  type="number"
                  placeholder="Ex: 150"
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label>Urgence</label>
                <div className="urgency-selector">
                  {['urgent', 'normal', 'flexible'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      className={`urgency-btn ${formData.urgency === level ? 'active' : ''}`}
                      onClick={() => setFormData({...formData, urgency: level})}
                    >
                      {level === 'urgent' && '🚨 Urgent (24h)'}
                      {level === 'normal' && '⏰ Normal'}
                      {level === 'flexible' && '📅 Flexible'}
                    </button>
                  ))}
                </div>
              </div>

              <button type="button" className="btn btn-primary btn-lg" onClick={() => setStep(2)}>
                Continuer →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="form-step">
              <h2>Quand et où ?</h2>

              <div className="form-row">
                <div className="form-group">
                  <label>Date souhaitée</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="form-group">
                  <label>Heure souhaitée</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Adresse de l'intervention</label>
                <input
                  type="text"
                  placeholder="Adresse complète"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>
                  ← Retour
                </button>
                <button type="button" className="btn btn-primary btn-lg" onClick={() => setStep(3)}>
                  Continuer →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="form-step">
              <h2>Récapitulatif</h2>

              <div className="recap-card">
                <div className="recap-item">
                  <strong>Titre</strong>
                  <p>{formData.title}</p>
                </div>
                
                <div className="recap-item">
                  <strong>Description</strong>
                  <p>{formData.description}</p>
                </div>

                {formData.budget && (
                  <div className="recap-item">
                    <strong>Budget estimé</strong>
                    <p>{formData.budget}€</p>
                  </div>
                )}

                <div className="recap-item">
                  <strong>Urgence</strong>
                  <p>
                    {formData.urgency === 'urgent' && '🚨 Urgent (24h)'}
                    {formData.urgency === 'normal' && '⏰ Normal'}
                    {formData.urgency === 'flexible' && '📅 Flexible'}
                  </p>
                </div>

                {formData.date && (
                  <div className="recap-item">
                    <strong>Date souhaitée</strong>
                    <p>{new Date(formData.date).toLocaleDateString('fr-FR')} {formData.time && `à ${formData.time}`}</p>
                  </div>
                )}
              </div>

              <div className="important-notice">
                <h3>📝 Comment ça marche ensuite ?</h3>
                <ul>
                  <li>✅ Le professionnel reçoit votre demande instantanément</li>
                  <li>💬 Il vous envoie un devis détaillé sous 2h en moyenne</li>
                  <li>🔍 Vous comparez et choisissez</li>
                  <li>💳 Vous payez en sécurité</li>
                  <li>⭐ Vous évaluez la prestation</li>
                </ul>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setStep(2)}>
                  ← Retour
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg"
                  disabled={loading}
                >
                  {loading ? 'Envoi en cours...' : '📤 Envoyer la demande'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      <style jsx>{`
        .quote-request-page {
          min-height: 100vh;
          background: var(--bg);
          padding: 48px 0 80px;
        }
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 32px;
        }
        .progress-stepper {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 48px;
          padding: 32px;
          background: white;
          border-radius: 16px;
          border: 2px solid var(--border);
        }
        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .step-number {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--bg);
          border: 3px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 18px;
        }
        .step.active .step-number {
          background: var(--accent);
          border-color: var(--accent);
          color: white;
        }
        .step-line {
          width: 80px;
          height: 3px;
          background: var(--border);
        }
        .step-line.active {
          background: var(--accent);
        }
        .quote-form {
          max-width: 700px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          padding: 40px;
          border: 2px solid var(--border);
        }
        .form-step h2 {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 32px;
        }
        .form-group {
          margin-bottom: 24px;
        }
        .form-group label {
          display: block;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .input-hint {
          display: block;
          font-size: 13px;
          color: var(--text-muted);
          margin-top: 6px;
        }
        .urgency-selector {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .urgency-btn {
          padding: 16px;
          background: white;
          border: 2px solid var(--border);
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .urgency-btn.active {
          background: var(--accent);
          color: white;
          border-color: var(--accent);
        }
        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 32px;
        }
        .recap-card {
          background: var(--bg);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
        }
        .recap-item {
          padding: 16px 0;
          border-bottom: 1px solid var(--border);
        }
        .recap-item:last-child {
          border-bottom: none;
        }
        .recap-item strong {
          display: block;
          font-size: 14px;
          color: var(--text-secondary);
          margin-bottom: 6px;
        }
        .important-notice {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
          border: 2px solid rgba(59, 130, 246, 0.3);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
        }
        .important-notice h3 {
          font-size: 18px;
          margin: 0 0 16px;
        }
        .important-notice ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .important-notice li {
          padding: 8px 0;
        }
        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          .urgency-selector {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}