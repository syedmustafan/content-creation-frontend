import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { CheckIcon } from '@heroicons/react/24/outline';

interface PricingProps {
  user: { username: string } | null;
}

const Pricing: NextPage<PricingProps> = ({ user }) => {
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
      cta: user ? 'Upgrade Now' : 'Sign Up',
      ctaLink: user ? '/upgrade' : '/register?plan=premium',
      highlight: true,
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
    },
  ];

  return (
    <div>
      <Head>
        <title>Pricing - ContentCreator AI</title>
      </Head>

      <div className="text-center mb-16">
        <h1 className="text-3xl font-bold text-text-primary">Simple, Transparent Pricing</h1>
        <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
          Choose the plan that fits your content creation needs
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`card border ${
              plan.highlight ? 'border-accent shadow-glow' : 'border-border'
            } transition-all duration-300 hover:shadow-soft relative`}
          >
            {plan.highlight && (
              <div className="absolute -top-4 left-0 right-0 text-center">
                <span className="bg-accent text-white text-sm px-3 py-1 rounded-full">
                  Most Popular
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
                  plan.highlight ? 'btn-primary' : 'btn-outline'
                }`}
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
    </div>
  );
};

export default Pricing;