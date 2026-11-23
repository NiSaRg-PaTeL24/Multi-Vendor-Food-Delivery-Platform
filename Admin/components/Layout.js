import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import FlashMessage from './FlashMessage';
import Head from 'next/head';

export default function Layout({ children }) {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const { success, error } = router.query;

  return (
    <>
      <Head>
        <title>Uber Eats Admin</title>
        <meta name="description" content="Uber Eats Admin Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="container">
        <header>
          <h1>Admin</h1>
          <nav>
            <Link href="/">🏠 Home</Link>
            {user && (
              <>
                <Link href="/add-food">➕ Add Food</Link>
                <Link href="/rules">⚙️ Rules</Link>
                <Link href="/api/auth/logout">🚪 Logout</Link>
              </>
            )}
            {!user && !isLoading && (
              <Link href="/api/auth/login">🔑 Login</Link>
            )}
          </nav>
          
          {user && (
            <div className="user-info">
              Welcome, {user.name}!
            </div>
          )}
        </header>
        
        {/* Flash messages */}
        {success && <FlashMessage type="success" message={success === 'food_added' ? 'Food added successfully' : 
                                                          success === 'food_deleted' ? 'Food deleted successfully' : 
                                                          success === 'rules_updated' ? 'Rules updated successfully' : 
                                                          'Changes saved successfully'} />}
        
        {error && <FlashMessage type="error" message={error === 'rules_error' ? 'Error fetching rules' :
                                                     error === 'update_failed' ? 'Failed to update rules' :
                                                     'An error occurred'} />}
        
        <main>
          {user ? children : (
            <div className="login-message">
              <p>Please <Link href="/api/auth/login">login</Link> to access dashboard.</p>
            </div>
          )}
        </main>
      </div>
    </>
  );
}