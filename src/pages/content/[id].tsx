// pages/content/[id].tsx

import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { ContentDisplay } from '../../components/ui/ContentDisplay';
import { Content } from '../../types';
import { api } from '../../lib/api';

interface ContentViewProps {
  user: { username: string } | null;
}

const ContentView: NextPage<ContentViewProps> = ({ user }) => {
  const router = useRouter();
  const { id } = router.query;

  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (id && typeof id === 'string') {
      fetchContent(parseInt(id));
    }
  }, [user, router, id]);

  const fetchContent = async (contentId: number) => {
    try {
      setLoading(true);
      const data = await api.getContentById(contentId);
      setContent(data);
      setError(null);
    } catch (error) {
      setError('Failed to load content. It may have been deleted or you may not have permission to view it.');
    } finally {
      setLoading(false);
    }
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
        <title>{content ? `${content.title} - ContentCreator AI` : 'Loading Content - ContentCreator AI'}</title>
      </Head>

      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-text-secondary hover:text-text-primary flex items-center"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
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
      ) : content ? (
        <ContentDisplay content={content} onCopy={handleCopy} />
      ) : (
        <div className="text-center py-12">
          <p className="text-text-secondary text-lg">
            Content not found.
          </p>
        </div>
      )}
    </div>
  );
};

export default ContentView;