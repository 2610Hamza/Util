import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

/**
 * Tableau de bord du professionnel : liste des demandes reçues et possibilité d'envoyer des devis.
 */
export default function ProviderDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState(null);
  const [quoteInputs, setQuoteInputs] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      router.push('/login');
      return;
    }
    const u = JSON.parse(stored);
    if (u.role !== 'professional') {
      router.push('/');
      return;
    }
    setUser(u);
    async function fetchRequests() {
      const res = await fetch(`/api/requests?professionalId=${u.id}`);
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    }
    fetchRequests();
  }, [router]);

  function handleInputChange(requestId, field, value) {
    setQuoteInputs((prev) => ({ ...prev, [requestId]: { ...prev[requestId], [field]: value } }));
  }

  async function handleSendQuote(requestId) {
    const input = quoteInputs[requestId];
    if (!input || !input.price) {
      setMessage('Veuillez renseigner un prix pour votre devis.');
      return;
    }
    const body = {
      requestId,
      professionalId: user.id,
      professionalName: user.name,
      price: parseFloat(input.price),
      message: input.message || '',
    };
    const res = await fetch('/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setMessage('Devis envoyé avec succès.');
      // Optionally refresh requests list to reflect new status
      const refreshed = await fetch(`/api/requests?professionalId=${user.id}`);
      if (refreshed.ok) {
        const data = await refreshed.json();
        setRequests(data);
      }
      setQuoteInputs((prev) => ({ ...prev, [requestId]: {} }));
    } else {
      const err = await res.json();
      setMessage(err.error || 'Erreur lors de l\'envoi du devis');
    }
  }

  return (
    <div>
      <h1>Mon tableau de bord (Professionnel)</h1>
      <p>Bonjour {user && user.name}</p>
      {message && <p>{message}</p>}
      {requests.length === 0 ? (
        <p>Aucune demande pour l'instant.</p>
      ) : (
        requests.map((req) => (
          <div key={req.id} style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem' }}>
            <h3>{req.title}</h3>
            <p>{req.description}</p>
            <p><strong>Budget proposé :</strong> {req.budget} €</p>
            {/* form send quote */}
            <div style={{ marginTop: '1rem' }}>
              <h4>Envoyer un devis</h4>
              <input
                type="number"
                placeholder="Votre prix en €"
                value={quoteInputs[req.id]?.price || ''}
                onChange={(e) => handleInputChange(req.id, 'price', e.target.value)}
                style={{ padding: '0.4rem', marginRight: '0.5rem' }}
              />
              <input
                type="text"
                placeholder="Message (optionnel)"
                value={quoteInputs[req.id]?.message || ''}
                onChange={(e) => handleInputChange(req.id, 'message', e.target.value)}
                style={{ padding: '0.4rem', marginRight: '0.5rem' }}
              />
              <button onClick={() => handleSendQuote(req.id)} style={{ padding: '0.4rem', background: '#0070f3', color: '#fff', border: 'none' }}>
                Envoyer
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
