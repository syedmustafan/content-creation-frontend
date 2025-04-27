// src/components/ui/LimitReachedModal.tsx

import React from 'react';
import { useRouter } from 'next/router';

interface LimitReachedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LimitReachedModal: React.FC<LimitReachedModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    router.push('/pricing');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-card-bg border border-border rounded-lg max-w-md w-full shadow-glow">
        <div className="p-6">
          <div className="mb-4 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-warning/20 text-warning mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-text-primary">Usage Limit Reached</h3>
            <p className="mt-2 text-text-secondary">
              You've used all 10 of your free content generations this month.
            </p>
          </div>

          <div className="bg-secondary p-4 rounded-md mb-4">
            <h4 className="font-medium text-text-primary mb-2">Upgrade to Premium and get:</h4>
            <ul className="space-y-2 text-text-secondary">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-accent flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Unlimited content generation</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-accent flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Access to all content types</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-accent flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Advanced customization options</span>
              </li>
            </ul>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleUpgrade}
              className="btn-primary flex-grow"
            >
              Upgrade to Premium
            </button>
            <button
              onClick={onClose}
              className="btn-outline"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};