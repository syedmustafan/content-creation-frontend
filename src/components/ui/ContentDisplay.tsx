// src/components/ui/ContentDisplay.tsx

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Content } from '../../types';

interface ContentDisplayProps {
  content: Content;
  onCopy: () => void;
}

export const ContentDisplay: React.FC<ContentDisplayProps> = ({ content, onCopy }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'markdown'>('preview');

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-text-primary">{content.title}</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => navigator.clipboard.writeText(content.generated_content).then(onCopy)}
            className="btn-outline text-sm"
          >
            Copy
          </button>
        </div>
      </div>

      <div className="border-b border-border mb-4">
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
            <code className="text-text-primary text-sm font-mono">
              {content.generated_content}
            </code>
          </pre>
        )}
      </div>

      <div className="mt-6 border-t border-border pt-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-text-secondary">Content Type:</span>{' '}
            <span className="text-text-primary">{content.content_type.name}</span>
          </div>
          <div>
            <span className="text-text-secondary">Tone:</span>{' '}
            <span className="text-text-primary capitalize">{content.tone}</span>
          </div>
          <div>
            <span className="text-text-secondary">Target Audience:</span>{' '}
            <span className="text-text-primary">{content.target_audience}</span>
          </div>
          <div>
            <span className="text-text-secondary">Length:</span>{' '}
            <span className="text-text-primary">{content.length} words</span>
          </div>
        </div>
      </div>
    </div>
  );
};
