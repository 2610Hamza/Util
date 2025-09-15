/**
 * Simple footer displayed on every page.
 */
export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid #eee', padding: '1rem', textAlign: 'center' }}>
      <p>© {new Date().getFullYear()} Util. Tous droits réservés.</p>
    </footer>
  );
}
