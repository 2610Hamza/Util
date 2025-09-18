import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <>
      <header className="header">
        <div className="container nav-row">
          <Navbar />
        </div>
      </header>

      <main className="container" style={{ padding: '24px 0 48px' }}>
        {children}
      </main>

      <footer>
        <div className="container" style={{ padding: '24px 0 48px' }}>
          <Footer />
        </div>
      </footer>
    </>
  );
}
