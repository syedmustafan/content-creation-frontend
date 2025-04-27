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

  // Calculate the preview text - strip markdown formatting for cleaner preview
  const previewText = content.generated_content
    .replace(/#{1,6}\s+/g, '') // Remove headings
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links but keep text
    .replace(/```[\s\S]*?```/g, 'Code snippet') // Replace code blocks
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .substring(0, 180) + '...';

  return (
    <div className="card hover:shadow-soft transition-shadow duration-300">
      <h3 className="text-lg font-medium text-text-primary truncate">
        {content.title}
      </h3>

      <div className="mt-2 flex flex-wrap gap-2">
        <span className="bg-input-bg px-2 py-1 rounded-md text-xs text-text-secondary">
          {content.content_type.name}
        </span>
        <span className="bg-input-bg px-2 py-1 rounded-md text-xs text-text-secondary capitalize">
          {content.tone}
        </span>
        <span className="bg-input-bg px-2 py-1 rounded-md text-xs text-text-secondary">
          {content.length} words
        </span>
      </div>

      <p className="mt-4 text-text-secondary line-clamp-3 text-sm">
        {previewText}
      </p>

      <div className="mt-6 pt-4 border-t border-border flex justify-between items-center text-sm">
        <span className="text-text-secondary">
          {formatDate(content.created_at)}
        </span>

        <div className="flex space-x-2">
          <Link
            href={`/content/${content.id}`}
            className="btn-outline text-xs py-1 px-3"
          >
            View
          </Link>
          <button
            onClick={() => onDelete(content.id)}
            className="btn-outline text-xs py-1 px-3 text-error hover:bg-error/10"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};