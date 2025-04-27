// pages/content/[id].tsx

import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
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
  const [activeTab, setActiveTab] = useState<'preview' | 'markdown'>('preview');

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
    if (content) {
      navigator.clipboard.writeText(content.generated_content);
      setSuccessMessage('Content copied to clipboard!');
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleDelete = async () => {
    if (!content) return;

    if (window.confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
      try {
        await api.deleteContent(content.id);
        setSuccessMessage('Content deleted successfully!');
        setTimeout(() => router.push('/dashboard/history'), 1500);
      } catch (error) {
        setError('Failed to delete content. Please try again.');
      }
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          Back to History
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
        <div className="card">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-text-primary">{content.title}</h1>

            <div className="flex space-x-3">
              <button
                onClick={handleCopy}
                className="btn-outline text-sm"
              >
                <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </button>

              <button
                onClick={() => {
                  const element = document.createElement("a");
                  const file = new Blob([content.generated_content], {type: 'text/markdown'});
                  element.href = URL.createObjectURL(file);
                  element.download = `${content.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
                  document.body.appendChild(element);
                  element.click();
                  document.body.removeChild(element);
                }}
                className="btn-outline text-sm"
              >
                <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>

              <button
                onClick={handleDelete}
                className="btn-outline text-sm text-error hover:bg-error/10"
              >
                <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-secondary rounded-md p-3">
              <p className="text-xs text-text-secondary mb-1">Content Type</p>
              <p className="text-text-primary">{content.content_type.name}</p>
            </div>
            <div className="bg-secondary rounded-md p-3">
              <p className="text-xs text-text-secondary mb-1">Tone</p>
              <p className="text-text-primary capitalize">{content.tone}</p>
            </div>
            <div className="bg-secondary rounded-md p-3">
              <p className="text-xs text-text-secondary mb-1">Target Audience</p>
              <p className="text-text-primary">{content.target_audience}</p>
            </div>
            <div className="bg-secondary rounded-md p-3">
              <p className="text-xs text-text-secondary mb-1">Word Count</p>
              <p className="text-text-primary">{content.length}</p>
            </div>
          </div>

          <div className="border-b border-border mb-6">
            <nav className="flex -mb-px" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'preview'
                    ? 'border-b-2 border-accent text-accent'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Preview
              </button>
              <button
                onClick={() => setActiveTab('markdown')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'markdown'
                    ? 'border-b-2 border-accent text-accent'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Markdown
              </button>
            </nav>
          </div>

          <div className="prose prose-invert max-w-none">
            {activeTab === 'preview' ? (
              <ReactMarkdown>{content.generated_content}</ReactMarkdown>
            ) : (
              <pre className="bg-card-bg p-4 rounded-md overflow-x-auto">
                <code className="text-text-primary text-sm font-mono whitespace-pre-wrap">
                  {content.generated_content}
                </code>
              </pre>
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-border text-sm text-text-secondary">
            <p>Created: {formatDate(content.created_at)}</p>
            {content.updated_at !== content.created_at && (
              <p>Last updated: {formatDate(content.updated_at)}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-text-secondary text-lg">
            Content not found.
          </p>
        </div>
      )}

      {/* Related Links */}
      {content && (
        <div className="mt-8 card">
          <h2 className="text-lg font-medium text-text-primary mb-4">What would you like to do next?</h2>

          <div className="grid md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="btn-outline flex flex-col items-center justify-center p-4 h-32"
            >
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-text-primary">Create New Content</span>
              <span className="text-text-secondary text-xs mt-1">Generate fresh content</span>
            </button>

            <button
              onClick={() => router.push('/dashboard/history')}
              className="btn-outline flex flex-col items-center justify-center p-4 h-32"
            >
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-text-primary">View History</span>
              <span className="text-text-secondary text-xs mt-1">Browse all your content</span>
            </button>

            <button
              onClick={() => {
                const similarContent = {
                  content_type: content.content_type.id,
                  topic: content.topic,
                  tone: content.tone,
                  target_audience: content.target_audience,
                  length: content.length,
                };
                // Store in localStorage to pre-fill the form
                localStorage.setItem('content_template', JSON.stringify(similarContent));
                router.push('/dashboard');
              }}
              className="btn-outline flex flex-col items-center justify-center p-4 h-32"
            >
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="text-text-primary">Create Similar</span>
              <span className="text-text-secondary text-xs mt-1">Use this as a template</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentView;