import SearchBar from '../components/SearchBar';

/**
 * Page d'accueil de l'application Util. Présente le concept et permet de chercher un professionnel.
 */
export default function Home() {
  return (
    <div>
      <h1>Bienvenue sur Util</h1>
      <p>La plateforme universelle qui vous connecte à un professionnel qualifié pour tous vos besoins. De la plomberie à la médecine, en passant par le coaching et l'enseignement, trouvez l'expert idéal en quelques clics.</p>
      <h2>Cherchez dès maintenant</h2>
      <SearchBar />
    </div>
  );
}
