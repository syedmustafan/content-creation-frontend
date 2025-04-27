import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export const DashboardNav: React.FC = () => {
  const router = useRouter();

  // Determine which tab is active
  const isCreateActive = router.pathname === '/dashboard';
  const isHistoryActive = router.pathname === '/dashboard/history';

  return (
    <div className="card mb-8">
      <nav className="flex border-b border-border">
        <Link
          href="/dashboard"
          className={`px-4 py-3 flex items-center ${
            isCreateActive 
              ? 'border-b-2 border-accent text-accent -mb-px' 
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create Content
        </Link>

        <Link
          href="/dashboard/history"
          className={`px-4 py-3 flex items-center ${
            isHistoryActive 
              ? 'border-b-2 border-accent text-accent -mb-px' 
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Content History
        </Link>
      </nav>

      <div className="p-4">
        {isCreateActive && (
          <div className="flex items-center text-text-secondary">
            <svg className="w-5 h-5 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Create new content by filling in the form below. Your generated content will be saved automatically.</span>
          </div>
        )}

        {isHistoryActive && (
          <div className="flex items-center text-text-secondary">
            <svg className="w-5 h-5 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Browse, filter, and manage all your previously generated content.</span>
          </div>
        )}
      </div>
    </div>
  );
};