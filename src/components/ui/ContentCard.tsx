// src/components/ui/ContentCard.tsx


import React from 'react';
import Link from 'next/link';
import { Content } from '../../types';

interface ContentCardProps {
  content: Content;
  onDelete: (id: number) => void;
}

export const ContentCard: React.FC<ContentCardProps> = ({ content, onDelete }) => {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="card hover:shadow-glow transition-shadow duration-300">
      <h3 className="text-lg font-medium text-text-primary truncate">
        {content.title}
      </h3>

      <div className="mt-2 text-text-secondary text-sm">
        <span className="bg-input-bg px-2 py-1 rounded-md">
          {content.content_type.name}
        </span>
        <span className="ml-2 capitalize">{content.tone}</span>
      </div>

      <p className="mt-4 text-text-secondary line-clamp-3">
        {content.generated_content.substring(0, 150)}...
      </p>

      <div className="mt-4 flex justify-between items-center text-sm">
        <span className="text-text-secondary">
          {formatDate(content.created_at)}
        </span>

        <div className="flex space-x-2">
          <Link href={`/content/${content.id}`} className="btn-outline text-xs py-1">
            View
          </Link>
          <button
            onClick={() => onDelete(content.id)}
            className="btn-outline text-xs py-1 text-error hover:bg-error/10"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};