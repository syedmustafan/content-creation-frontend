// src/components/ui/UserUsage.tsx

import React from 'react';
import Link from 'next/link';

interface UserUsageProps {
  apiRequestsCount: number;
  isPremium: boolean;
}

export const UserUsage: React.FC<UserUsageProps> = ({ apiRequestsCount, isPremium }) => {
  // Calculate percentage for the progress bar
  const usagePercentage = isPremium ? 0 : Math.min((apiRequestsCount / 10) * 100, 100);

  // Determine status color
  let statusColor = 'bg-success';
  if (usagePercentage > 70) statusColor = 'bg-warning';
  if (usagePercentage > 90) statusColor = 'bg-error';

  return (
    <div className="card mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-text-primary">Usage Summary</h2>
        <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent">
          {isPremium ? 'Premium' : 'Free Plan'}
        </span>
      </div>

      {isPremium ? (
        <div>
          <div className="flex items-center justify-between text-text-secondary mb-2">
            <span>Premium Plan Active</span>
            <span className="text-success">Unlimited</span>
          </div>
          <p className="text-text-secondary text-sm">
            You have unlimited content generation with your premium subscription.
          </p>
          <div className="mt-4">
            <p className="text-xs text-text-secondary">
              Total content generated: <span className="text-text-primary">{apiRequestsCount}</span>
            </p>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between text-text-secondary mb-2">
            <span>Monthly Limit</span>
            <span>{apiRequestsCount} / 10</span>
          </div>
          <div className="w-full bg-border rounded-full h-2.5 mb-4">
            <div
              className={`${statusColor} h-2.5 rounded-full transition-all duration-300`}
              style={{ width: `${usagePercentage}%` }}
            ></div>
          </div>

          {apiRequestsCount >= 10 ? (
            <div className="bg-error/10 border border-error text-error px-4 py-3 rounded-md mb-4">
              You've reached your monthly limit. Upgrade to Premium for unlimited content.
            </div>
          ) : apiRequestsCount >= 7 ? (
            <div className="bg-warning/10 border border-warning text-warning px-4 py-3 rounded-md mb-4">
              You're approaching your monthly limit. Consider upgrading to Premium.
            </div>
          ) : null}

          <div className="flex justify-between items-center">
            <p className="text-sm text-text-secondary">
              Free plan limited to 10 content generations per month.
            </p>
            <Link href="/pricing" className="btn-primary text-xs">
              Upgrade
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};