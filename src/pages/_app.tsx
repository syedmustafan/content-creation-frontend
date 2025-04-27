import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { api } from '../lib/api';

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('auth_token');
    if (token) {
      getUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const getUserProfile = async () => {
    try {
      const profile = await api.getUserProfile();
      setUser({ username: profile.user.username });
    } catch (error) {
      // Token might be invalid or expired
      localStorage.removeItem('auth_token');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      <Component {...pageProps} user={user} setUser={setUser} />
    </Layout>
  );
}

export default MyApp;
