import { UserProvider } from '@auth0/nextjs-auth0/client';
import '../public/styles.css';

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;