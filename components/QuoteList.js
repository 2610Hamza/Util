import { useEffect, useState } from 'react';

/**
 * Liste des devis envoyés par les professionnels pour une demande donnée.
 * @param {{ requestId: string, onAccept?: (quoteId: string) => void }} props
 */
export default function QuoteList({ requestId, onAccept }) {
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    async function fetchQuotes() {
      const res = await fetch(`/api/quotes?requestId=${requestId}`);
      if (res.ok) {
        const data = await res.json();
        setQuotes(data);
      }
    }
    fetchQuotes();
  }, [requestId]);

  if (!quotes.length) return <p>Aucun devis pour l'instant.</p>;
  return (
    <div style={{ marginTop: '1rem' }}>
      <h4>Devis reçus</h4>
      {quotes.map((quote) => (
        <div key={quote.id} style={{ border: '1px solid #ccc', padding: '0.5rem', marginBottom: '0.5rem' }}>
          <p><strong>Pro :</strong> {quote.professionalName || quote.professionalId}</p>
          <p><strong>Prix :</strong> {quote.price} €</p>
          <p>{quote.message}</p>
          {onAccept && (
            <button onClick={() => onAccept(quote.id)} style={{ padding: '0.3rem 0.5rem', background: '#28a745', color: '#fff', border: 'none' }}>
              Accepter
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
