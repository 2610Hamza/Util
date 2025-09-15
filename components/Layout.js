import Head from 'next/head';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * Layout component wraps all pages to provide a consistent header and footer.
 * It also sets some default meta tags for SEO.
 */
export default function Layout({ children, title = 'Util' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Util – Trouvez un professionnel rapidement pour tous vos besoins." />
      </Head>
      <Navbar />
      <main style={{ minHeight: '80vh', padding: '1rem', maxWidth: '900px', margin: '0 auto' }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
