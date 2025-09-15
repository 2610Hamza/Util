import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import QuoteList from '../../components/QuoteList';

/**
 * Tableau de bord du client : liste des demandes envoyées et devis reçus.
 */
export default function ClientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // Check user role
    const stored = localStorage.getItem('user');
    if (!stored) {
      router.push('/login');
      return;
    }
    const u = JSON.parse(stored);
    if (u.role !== 'client') {
      router.push('/');
      return;
    }
    setUser(u);
    async function fetchRequests() {
      const res = await fetch(`/api/requests?clientId=${u.id}`);
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    }
    fetchRequests();
  }, [router]);

  async function handleAccept(requestId, quoteId) {
    const res = await fetch('/api/requests/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId, quoteId }),
    });
    if (res.ok) {
      setMessage('Devis accepté !');
      // Refresh requests
      const refreshed = await fetch(`/api/requests?clientId=${user.id}`);
      if (refreshed.ok) {
        const data = await refreshed.json();
        setRequests(data);
      }
    } else {
      const err = await res.json();
      setMessage(err.error || 'Erreur lors de l\'acceptation du devis');
    }
  }

  return (
    <div>
      <h1>Mon tableau de bord (Client)</h1>
      <p>Bonjour {user && user.name}</p>
      <p>Vous pouvez retrouver ci-dessous vos demandes et les devis reçus.</p>
      {message && <p>{message}</p>}
      {requests.length === 0 ? (
        <p>Aucune demande pour l'instant. <a href="/search" style={{ color: '#0070f3' }}>Rechercher un professionnel</a></p>
      ) : (
        requests.map((req) => (
          <div key={req.id} style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem' }}>
            <h3>{req.title}</h3>
            <p>{req.description}</p>
            <p><strong>Budget :</strong> {req.budget} €</p>
            <p><strong>Statut :</strong> {req.status || 'en attente'}</p>
            <QuoteList requestId={req.id} onAccept={(quoteId) => handleAccept(req.id, quoteId)} />
          </div>
        ))
      )}
    </div>
  );
}
