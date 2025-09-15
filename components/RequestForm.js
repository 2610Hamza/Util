import { useState } from 'react';

/**
 * Formulaire permettant à un client de soumettre une demande à un professionnel.
 * @param {{ professionalId: string }} props
 */
export default function RequestForm({ professionalId }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [message, setMessage] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      setMessage('Veuillez vous connecter pour envoyer une demande.');
      return;
    }
    const user = JSON.parse(userStr);
    const body = {
      title,
      description,
      budget: parseFloat(budget),
      clientId: user.id,
      professionalId,
    };
    const res = await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setMessage('Demande envoyée avec succès.');
      setTitle('');
      setDescription('');
      setBudget('');
    } else {
      const json = await res.json();
      setMessage(json.error || 'Erreur lors de l\'envoi de la demande.');
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
      <h4>Envoyer une demande</h4>
      <input
        type="text"
        placeholder="Titre de la demande"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        style={{ padding: '0.5rem' }}
      />
      <textarea
        placeholder="Description détaillée de votre besoin"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        rows={4}
        style={{ padding: '0.5rem' }}
      />
      <input
        type="number"
        placeholder="Budget en €"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        style={{ padding: '0.5rem' }}
      />
      <button type="submit" style={{ padding: '0.5rem', background: '#0070f3', color: '#fff', border: 'none' }}>Envoyer</button>
      {message && <p>{message}</p>}
    </form>
  );
}
