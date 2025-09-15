import Layout from '../components/Layout';
import '../styles/globals.css';

/**
 * Custom App component to wrap every page with a consistent Layout.
 */
export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
