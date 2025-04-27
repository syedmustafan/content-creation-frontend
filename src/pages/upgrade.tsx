// pages/upgrade.tsx

import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { api } from '../lib/api';

interface UpgradeProps {
  user: { username: string } | null;
}

const Upgrade: NextPage<UpgradeProps> = ({ user }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/upgrade');
    } else {
      fetchUserProfile();
    }
  }, [user, router]);

  const fetchUserProfile = async () => {
    try {
      const profile = await api.getUserProfile();
      setUserProfile(profile);

      // If already premium, redirect to dashboard
      if (profile.premium_user) {
        router.push('/dashboard');
      }
    } catch (error) {
      setError('Failed to load user profile. Please try again later.');
    }
  };

  // This is a mock upgrade function - in a real application,
  // this would integrate with a payment processor like Stripe
  const handleUpgrade = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call to payment processor
      await new Promise(resolve => setTimeout(resolve, 1500));

      // For demo purposes, we'll simulate a successful upgrade
      // In a real app, this would be an API call to your backend
      // await api.upgradeToPremium();

      // Redirect to success page
      router.push('/upgrade/success');
    } catch (error) {
      setError('Failed to process payment. Please try again.');
      setLoading(false);
    }
  };

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Head>
        <title>Upgrade to Premium - ContentCreator AI</title>
      </Head>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Upgrade to Premium</h1>
        <p className="mt-2 text-text-secondary">
          Unlock unlimited content generation and premium features
        </p>
      </div>

      {error && (
        <div className="bg-error/10 border border-error text-error px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      <div className="card border border-accent mb-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 text-accent mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-text-primary">Premium Plan</h2>
          <div className="mt-2">
            <span className="text-3xl font-bold text-accent">$19</span>
            <span className="text-text-secondary ml-1">per month</span>
          </div>
          <p className="mt-2 text-text-secondary">
            Perfect for content creators and marketers
          </p>
        </div>

        <div className="border-t border-border py-4 mb-6">
          <ul className="space-y-3">
            <li className="flex items-start px-4">
              <svg className="h-5 w-5 text-accent flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-text-primary">Unlimited content generation</span>
            </li>
            <li className="flex items-start px-4">
              <svg className="h-5 w-5 text-accent flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-text-primary">Access to all content types</span>
            </li>
            <li className="flex items-start px-4">
              <svg className="h-5 w-5 text-accent flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-text-primary">Priority response time</span>
            </li>
            <li className="flex items-start px-4">
              <svg className="h-5 w-5 text-accent flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-text-primary">Content saved indefinitely</span>
            </li>
            <li className="flex items-start px-4">
              <svg className="h-5 w-5 text-accent flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-text-primary">Advanced customization options</span>
            </li>
            <li className="flex items-start px-4">
              <svg className="h-5 w-5 text-accent flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-text-primary">Email support</span>
            </li>
          </ul>
        </div>

        {/* Mock Payment Form */}
        <div className="border-t border-border pt-6">
          <h3 className="text-lg font-medium text-text-primary mb-4">Payment Information</h3>

          <div className="space-y-4">
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-text-secondary mb-1">
                Card Number
              </label>
              <input
                type="text"
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                className="input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiry" className="block text-sm font-medium text-text-secondary mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  id="expiry"
                  placeholder="MM/YY"
                  className="input"
                />
              </div>
              <div>
                <label htmlFor="cvc" className="block text-sm font-medium text-text-secondary mb-1">
                  CVC
                </label>
                <input
                  type="text"
                  id="cvc"
                  placeholder="123"
                  className="input"
                />
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">
                Name on Card
              </label>
              <input
                type="text"
                id="name"
                placeholder="John Doe"
                className="input"
              />
            </div>

            <div className="pt-4">
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Upgrade Now - $19/month'
                )}
              </button>
              <p className="text-xs text-text-secondary text-center mt-2">
                You'll be charged $19 monthly. Cancel anytime.
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-text-secondary">
        By upgrading, you agree to our <a href="/terms" className="text-accent hover:underline">Terms of Service</a> and <a href="/privacy" className="text-accent hover:underline">Privacy Policy</a>.
      </p>
    </div>
  );
};

export default Upgrade;