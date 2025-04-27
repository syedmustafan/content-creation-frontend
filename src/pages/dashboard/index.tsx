import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { ContentCreationForm } from '../../components/forms/ContentCreationForm';
import { ContentDisplay } from '../../components/ui/ContentDisplay';
import { UserUsage } from '../../components/ui/UserUsage';
import { Content, ContentType } from '../../types';
import { api } from '../../lib/api';

interface DashboardProps {
  user: { username: string } | null;
}

const Dashboard: NextPage<DashboardProps> = ({ user }) => {
  const router = useRouter();
  const [generatedContent, setGeneratedContent] = useState<Content | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      fetchUserProfile();
    }
  }, [user, router]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const profile = await api.getUserProfile();
      setUserProfile(profile);
      setError(null);
    } catch (error) {
      setError('Failed to load user profile. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleContentGenerated = (content: Content) => {
    setGeneratedContent(content);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Refresh user profile to update usage count
    fetchUserProfile();
  };

  const handleError = (errorMsg: string) => {
    setError(errorMsg);
    setSuccessMessage(null);
  };

  const handleCopy = () => {
    setSuccessMessage('Content copied to clipboard!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div>
      <Head>
        <title>Dashboard - ContentCreator AI</title>
      </Head>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
        <p className="mt-2 text-text-secondary">
          Generate new content or view your content history
        </p>
      </div>

      {error && (
        <div className="bg-error/10 border border-error text-error px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-success/10 border border-success text-success px-4 py-3 rounded-md mb-6">
          {successMessage}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
      ) : userProfile ? (
        <UserUsage
          apiRequestsCount={userProfile.api_requests_count || 0}
          isPremium={userProfile.premium_user || false}
        />
      ) : null}

      {generatedContent && (
        <div className="mb-8">
          <ContentDisplay content={generatedContent} onCopy={handleCopy} />
        </div>
      )}

      <ContentCreationForm
        onContentGenerated={handleContentGenerated}
        onError={handleError}
      />
    </div>
  );
};

export default Dashboard;
