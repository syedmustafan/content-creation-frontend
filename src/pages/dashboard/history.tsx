// pages/dashboard/history.tsx

import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { ContentCard } from '../../components/ui/ContentCard';
import { Content } from '../../types';
import { api } from '../../lib/api';

interface HistoryProps {
  user: { username: string } | null;
}

const History: NextPage<HistoryProps> = ({ user }) => {
  const router = useRouter();
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      fetchContents();
    }
  }, [user, router]);

  const fetchContents = async () => {
    try {
      setLoading(true);
      const data = await api.getUserContent();
      setContents(data);
      setError(null);
    } catch (error) {
      setError('Failed to load your content history. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        await api.deleteContent(id);
        setContents(contents.filter(content => content.id !== id));
      } catch (error) {
        setError('Failed to delete content. Please try again.');
      }
    }
  };

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div>
      <Head>
        <title>Content History - ContentCreator AI</title>
      </Head>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Content History</h1>
        <p className="mt-2 text-text-secondary">
          View and manage your previously generated content
        </p>
      </div>

      {error && (
        <div className="bg-error/10 border border-error text-error px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
      ) : contents.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contents.map((content) => (
            <ContentCard
              key={content.id}
              content={content}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-text-secondary text-lg">
            You haven't generated any content yet.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 btn-primary"
          >
            Create Your First Content
          </button>
        </div>
      )}
    </div>
  );
};

export default History;
