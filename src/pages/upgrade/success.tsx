// pages/upgrade/success.tsx

import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface UpgradeSuccessProps {
  user: { username: string } | null;
}

const UpgradeSuccess: NextPage<UpgradeSuccessProps> = ({ user }) => {
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }

    // This is a mock implementation
    // In a real app, you would verify the user's subscription status

  }, [user, router]);

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="max-w-2xl mx-auto text-center">
      <Head>
        <title>Upgrade Successful - ContentCreator AI</title>
      </Head>

      <div className="card border border-success">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/20 text-success mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-text-primary mb-4">Upgrade Successful!</h1>

        <p className="text-lg text-text-secondary mb-6">
          Thank you for upgrading to Premium. You now have access to unlimited content generation and all our premium features.
        </p>

        <div className="bg-secondary p-4 rounded-md mb-6">
          <h2 className="text-lg font-medium text-text-primary mb-2">What's included in your Premium plan:</h2>
          <ul className="space-y-2 text-text-secondary text-left">
            <li className="flex items-start">
              <svg className="h-5 w-5 text-success flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Unlimited content generation</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-success flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Access to all content types</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-success flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Priority response time</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-success flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Content saved indefinitely</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-success flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Advanced customization options</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-success flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Priority email support</span>
            </li>
          </ul>
        </div>

        <p className="text-text-secondary mb-8">
          Your first billing cycle has started today. You'll be charged $19 on a monthly basis.
        </p>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
          <Link href="/dashboard" className="btn-primary">
            Go to Dashboard
          </Link>
          <Link href="/profile" className="btn-outline">
            Manage Subscription
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-text-primary mb-4">Need help getting started?</h2>
        <p className="text-text-secondary mb-4">
          We've prepared some resources to help you make the most of your Premium subscription:
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <Link href="#" className="card hover:shadow-soft transition-all duration-200">
            <h3 className="text-accent font-medium mb-1">Content Creation Guide</h3>
            <p className="text-sm text-text-secondary">Learn tips and tricks for creating effective content</p>
          </Link>
          <Link href="#" className="card hover:shadow-soft transition-all duration-200">
            <h3 className="text-accent font-medium mb-1">Premium Features Tour</h3>
            <p className="text-sm text-text-secondary">Discover all the new features available to you</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UpgradeSuccess;