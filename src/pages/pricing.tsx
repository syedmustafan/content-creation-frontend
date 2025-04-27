// pages/pricing.tsx

import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CheckIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { api } from '../lib/api';

interface PricingProps {
  user: { username: string } | null;
}

const Pricing: NextPage<PricingProps> = ({ user }) => {
  const router = useRouter();
  const { fromLimit } = router.query;
  const [userProfile, setUserProfile] = useState<any>(null);

  // Check if user came from limit reached modal
  const isFromLimit = fromLimit === 'true';

  // Fetch user profile if logged in
  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        try {
          const profile = await api.getUserProfile();
          setUserProfile(profile);
        } catch (error) {
          console.error('Failed to fetch user profile');
        }
      };

      fetchProfile();
    }
  }, [user]);

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for occasional content needs',
      features: [
        'Generate up to 10 pieces of content per month',
        'Access to basic content types',
        'Standard response time',
        'Content saved for 30 days',
      ],
      cta: 'Get Started',
      ctaLink: user ? '/dashboard' : '/register',
      highlight: false,
      currentPlan: user && userProfile && !userProfile.premium_user,
    },
    {
      name: 'Premium',
      price: '$19',
      period: 'per month',
      description: 'Ideal for regular content creators',
      features: [
        'Unlimited content generation',
        'Access to all content types',
        'Priority response time',
        'Content saved indefinitely',
        'Advanced customization options',
        'Email support',
      ],
      cta: user ? (userProfile?.premium_user ? 'Current Plan' : 'Upgrade Now') : 'Sign Up',
      ctaLink: user ? '/upgrade' : '/register?plan=premium',
      highlight: true,
      currentPlan: user && userProfile && userProfile.premium_user,
    },
    {
      name: 'Business',
      price: '$49',
      period: 'per month',
      description: 'For teams and businesses',
      features: [
        'Everything in Premium',
        'Team collaboration features',
        'API access',
        'Branded content options',
        'Custom integrations',
        'Dedicated support',
      ],
      cta: 'Contact Sales',
      ctaLink: '/contact',
      highlight: false,
      currentPlan: false,
    },
  ];

  return (
    <div>
      <Head>
        <title>Pricing - ContentCreator AI</title>
      </Head>

      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-text-primary">Simple, Transparent Pricing</h1>
        <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
          Choose the plan that fits your content creation needs
        </p>

        {isFromLimit && (
          <div className="mt-6 bg-accent/10 border border-accent text-accent p-4 rounded-md inline-block">
            You've reached your free tier limit. Upgrade to Premium for unlimited content generation!
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`card border ${
              plan.highlight ? 'border-accent shadow-glow' : plan.currentPlan ? 'border-success' : 'border-border'
            } transition-all duration-300 hover:shadow-soft relative`}
          >
            {plan.highlight && (
              <div className="absolute -top-4 left-0 right-0 text-center">
                <span className="bg-accent text-white text-sm px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            )}

            {plan.currentPlan && (
              <div className="absolute -top-4 left-0 right-0 text-center">
                <span className="bg-success text-white text-sm px-3 py-1 rounded-full">
                  Current Plan
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-text-primary">{plan.name}</h2>
              <div className="mt-2">
                <span className="text-3xl font-bold text-accent">{plan.price}</span>
                <span className="text-text-secondary ml-1">{plan.period}</span>
              </div>
              <p className="mt-2 text-text-secondary">{plan.description}</p>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-accent flex-shrink-0 mr-2" />
                  <span className="text-text-primary text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto">
              <Link
                href={plan.ctaLink}
                className={`w-full btn ${
                  plan.currentPlan ? 'btn-secondary cursor-default' : plan.highlight ? 'btn-primary' : 'btn-outline'
                }`}
                onClick={(e) => plan.currentPlan && e.preventDefault()}
              >
                {plan.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-16 p-8 card max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-text-primary">Need a custom solution?</h2>
        <p className="mt-4 text-text-secondary">
          For enterprises or unique content needs, we offer custom plans tailored to your requirements.
        </p>
        <div className="mt-6">
          <Link href="/contact" className="btn-outline">
            Contact Us
          </Link>
        </div>
      </div>

      {/* Comparison table for premium features */}
      <div className="mt-16 max-w-6xl mx-auto overflow-hidden">
        <h2 className="text-2xl font-bold text-text-primary text-center mb-8">Feature Comparison</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary">
                <th className="px-6 py-3 text-left text-text-primary font-medium">Feature</th>
                <th className="px-6 py-3 text-center text-text-primary font-medium">Free</th>
                <th className="px-6 py-3 text-center text-text-primary font-medium bg-accent/10">Premium</th>
                <th className="px-6 py-3 text-center text-text-primary font-medium">Business</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="px-6 py-4 text-text-primary">Monthly content generations</td>
                <td className="px-6 py-4 text-center text-text-secondary">10</td>
                <td className="px-6 py-4 text-center text-text-secondary bg-accent/5">Unlimited</td>
                <td className="px-6 py-4 text-center text-text-secondary">Unlimited</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-text-primary">Maximum word count</td>
                <td className="px-6 py-4 text-center text-text-secondary">1,000</td>
                <td className="px-6 py-4 text-center text-text-secondary bg-accent/5">5,000</td>
                <td className="px-6 py-4 text-center text-text-secondary">10,000</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-text-primary">Content history storage</td>
                <td className="px-6 py-4 text-center text-text-secondary">30 days</td>
                <td className="px-6 py-4 text-center text-text-secondary bg-accent/5">Unlimited</td>
                <td className="px-6 py-4 text-center text-text-secondary">Unlimited</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-text-primary">Advanced content types</td>
                <td className="px-6 py-4 text-center text-text-secondary">
                  <svg className="w-5 h-5 mx-auto text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </td>
                <td className="px-6 py-4 text-center text-text-secondary bg-accent/5">
                  <svg className="w-5 h-5 mx-auto text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </td>
                <td className="px-6 py-4 text-center text-text-secondary">
                  <svg className="w-5 h-5 mx-auto text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-text-primary">Advanced customization</td>
                <td className="px-6 py-4 text-center text-text-secondary">
                  <svg className="w-5 h-5 mx-auto text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </td>
                <td className="px-6 py-4 text-center text-text-secondary bg-accent/5">
                  <svg className="w-5 h-5 mx-auto text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </td>
                <td className="px-6 py-4 text-center text-text-secondary">
                  <svg className="w-5 h-5 mx-auto text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-text-primary">Priority support</td>
                <td className="px-6 py-4 text-center text-text-secondary">
                  <svg className="w-5 h-5 mx-auto text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </td>
                <td className="px-6 py-4 text-center text-text-secondary bg-accent/5">
                  <svg className="w-5 h-5 mx-auto text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </td>
                <td className="px-6 py-4 text-center text-text-secondary">
                  <svg className="w-5 h-5 mx-auto text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-text-primary">Team collaboration</td>
                <td className="px-6 py-4 text-center text-text-secondary">
                  <svg className="w-5 h-5 mx-auto text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </td>
                <td className="px-6 py-4 text-center text-text-secondary bg-accent/5">
                  <svg className="w-5 h-5 mx-auto text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </td>
                <td className="px-6 py-4 text-center text-text-secondary">
                  <svg className="w-5 h-5 mx-auto text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-text-primary">API access</td>
                <td className="px-6 py-4 text-center text-text-secondary">
                  <svg className="w-5 h-5 mx-auto text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </td>
                <td className="px-6 py-4 text-center text-text-secondary bg-accent/5">
                  <svg className="w-5 h-5 mx-auto text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </td>
                <td className="px-6 py-4 text-center text-text-secondary">
                  <svg className="w-5 h-5 mx-auto text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-text-primary text-center mb-8">Frequently Asked Questions</h2>

        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-medium text-text-primary mb-2">What happens when I reach my monthly limit?</h3>
            <p className="text-text-secondary">
              Once you reach your monthly limit of 10 content generations on the free plan, you'll need to upgrade to our Premium plan to continue generating content. Your limit resets on the first day of each month.
            </p>
          </div>

          <div className="card">
            <h3 className="text-lg font-medium text-text-primary mb-2">Can I cancel my subscription anytime?</h3>
            <p className="text-text-secondary">
              Yes, you can cancel your subscription at any time. Your premium features will remain active until the end of your current billing period.
            </p>
          </div>

          <div className="card">
            <h3 className="text-lg font-medium text-text-primary mb-2">Is there a free trial for Premium features?</h3>
            <p className="text-text-secondary">
              We offer a 7-day free trial for our Premium plan. You can explore all the features without any commitment and decide if it's right for you.
            </p>
          </div>

          <div className="card">
            <h3 className="text-lg font-medium text-text-primary mb-2">How is content quality different between plans?</h3>
            <p className="text-text-secondary">
              The core AI technology powering content generation is the same across all plans. The differences are in usage limits, advanced customization options, and additional features available in Premium and Business plans.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;