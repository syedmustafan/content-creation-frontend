import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { ContentCard } from '../../components/ui/ContentCard';
import { DashboardNav } from '../../components/ui/DashboardNav';
import { ContentStatistics } from '../../components/ui/ContentStatistics';
import { Content, ContentType } from '../../types';
import { api } from '../../lib/api';

interface HistoryProps {
  user: { username: string } | null;
}

const History: NextPage<HistoryProps> = ({ user }) => {
  const router = useRouter();
  const [contents, setContents] = useState<Content[]>([]);
  const [filteredContents, setFilteredContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [selectedTone, setSelectedTone] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'longest' | 'shortest'>('newest');

  // Get unique tones from contents
  const uniqueTones = Array.from(new Set(contents.map(content => content.tone)));

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      fetchContents();
      fetchContentTypes();
    }
  }, [user, router]);

  // Apply filters whenever filter states change
  useEffect(() => {
    if (contents.length > 0) {
      applyFilters();
    }
  }, [searchTerm, selectedType, selectedTone, sortOrder, contents]);

  const fetchContents = async () => {
    try {
      setLoading(true);
      const data = await api.getUserContent();
      setContents(data);
      setFilteredContents(data);
      setError(null);
    } catch (error) {
      setError('Failed to load your content history. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchContentTypes = async () => {
    try {
      const types = await api.getContentTypes();
      setContentTypes(types);
    } catch (error) {
      console.error('Failed to load content types');
    }
  };

  const applyFilters = () => {
    let filtered = [...contents];

    // Apply search term filter
    if (searchTerm) {
      const termLower = searchTerm.toLowerCase();
      filtered = filtered.filter(content =>
        content.title.toLowerCase().includes(termLower) ||
        content.topic.toLowerCase().includes(termLower) ||
        content.generated_content.toLowerCase().includes(termLower)
      );
    }

    // Apply content type filter
    if (selectedType !== null) {
      filtered = filtered.filter(content => content.content_type.id === selectedType);
    }

    // Apply tone filter
    if (selectedTone) {
      filtered = filtered.filter(content => content.tone === selectedTone);
    }

    // Apply sorting
    switch (sortOrder) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'longest':
        filtered.sort((a, b) => b.length - a.length);
        break;
      case 'shortest':
        filtered.sort((a, b) => a.length - b.length);
        break;
    }

    setFilteredContents(filtered);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        await api.deleteContent(id);
        setContents(contents.filter(content => content.id !== id));
        setError(null);
      } catch (error) {
        setError('Failed to delete content. Please try again.');
      }
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedType(null);
    setSelectedTone(null);
    setSortOrder('newest');
  };

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div>
      <Head>
        <title>Content History - ContentCreator AI</title>
      </Head>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Content History</h1>
          <p className="mt-2 text-text-secondary">
            View and manage your previously generated content
          </p>
        </div>

        <button
          onClick={() => router.push('/dashboard')}
          className="btn-primary"
        >
          Create New Content
        </button>
      </div>

      {error && (
        <div className="bg-error/10 border border-error text-error px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Dashboard Navigation */}
      <DashboardNav />

      {/* Content Statistics */}
      {!loading && contents.length > 0 && (
        <ContentStatistics contents={contents} contentTypes={contentTypes} />
      )}

      {/* Filters Section */}
      <div className="card mb-8">
        <h2 className="text-lg font-medium text-text-primary mb-4">Filter & Sort</h2>
        
        <div className="grid md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-text-secondary mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search title, topic, or content..."
              className="input"
            />
          </div>
          
          {/* Content Type */}
          <div>
            <label htmlFor="contentType" className="block text-sm font-medium text-text-secondary mb-1">
              Content Type
            </label>
            <select
              id="contentType"
              value={selectedType || ''}
              onChange={(e) => setSelectedType(e.target.value ? parseInt(e.target.value) : null)}
              className="input"
            >
              <option value="">All Types</option>
              {contentTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
          
          {/* Tone */}
          <div>
            <label htmlFor="tone" className="block text-sm font-medium text-text-secondary mb-1">
              Tone
            </label>
            <select
              id="tone"
              value={selectedTone || ''}
              onChange={(e) => setSelectedTone(e.target.value || null)}
              className="input"
            >
              <option value="">All Tones</option>
              {uniqueTones.map(tone => (
                <option key={tone} value={tone}>{tone.charAt(0).toUpperCase() + tone.slice(1)}</option>
              ))}
            </select>
          </div>
          
          {/* Sort */}
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-text-secondary mb-1">
              Sort By
            </label>
            <select
              id="sort"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="input"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="longest">Longest First</option>
              <option value="shortest">Shortest First</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={handleClearFilters}
            className="btn-outline text-sm"
          >
            Clear Filters
          </button>
          
          <p className="text-text-secondary text-sm">
            {filteredContents.length} of {contents.length} items shown
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
      ) : filteredContents.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContents.map((content) => (
            <ContentCard
              key={content.id}
              content={content}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : contents.length > 0 ? (
        <div className="text-center py-12 card">
          <p className="text-text-secondary text-lg mb-4">
            No content matches your current filters.
          </p>
          <button
            onClick={handleClearFilters}
            className="btn-outline"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="text-center py-12 card">
          <p className="text-text-secondary text-lg mb-4">
            You haven't generated any content yet.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="btn-primary"
          >
            Create Your First Content
          </button>
        </div>
      )}
    </div>
  );
};

export default History;