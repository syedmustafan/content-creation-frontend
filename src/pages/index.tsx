//pages/index.tsx: 

import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

interface HomeProps {
  user: { username: string } | null;
}

const Home: NextPage<HomeProps> = ({ user }) => {
  const router = useRouter();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <div>
      <Head>
        <title>ContentCreator AI - Create Engaging Content with AI</title>
        <meta name="description" content="Generate articles and social media posts with AI" />
      </Head>

      <section className="py-12 md:py-20">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary">
            Create Engaging <span className="text-accent">Content</span> with AI
          </h1>
          <p className="mt-6 text-xl text-text-secondary max-w-3xl mx-auto">
            Generate articles, blog posts, and social media content in seconds. Powered by advanced AI to deliver high-quality results for any topic.
          </p>
          <div className="mt-10">
            <Link href="/register" className="btn-primary text-lg px-8 py-3">
              Get Started Free
            </Link>
            <Link href="/pricing" className="ml-4 btn-outline text-lg px-8 py-3">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 border-t border-border">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-text-primary">How It Works</h2>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
            Creating content has never been easier. Just follow these simple steps:
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="card text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/20 text-accent mb-4">
              <span className="text-xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-semibold text-text-primary">Choose Content Type</h3>
            <p className="mt-2 text-text-secondary">
              Select the type of content you need, from blog posts to social media updates.
            </p>
          </div>

          <div className="card text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/20 text-accent mb-4">
              <span className="text-xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-semibold text-text-primary">Set Parameters</h3>
            <p className="mt-2 text-text-secondary">
              Specify your topic, tone, target audience, and desired length.
            </p>
          </div>

          <div className="card text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/20 text-accent mb-4">
              <span className="text-xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-semibold text-text-primary">Generate & Use</h3>
            <p className="mt-2 text-text-secondary">
              Get your AI-generated content instantly, ready to copy, edit, or publish.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 border-t border-border">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-text-primary">Features</h2>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
            Everything you need to create professional content efficiently
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="card">
            <h3 className="text-xl font-semibold text-text-primary">Multiple Content Types</h3>
            <p className="mt-2 text-text-secondary">
              From in-depth articles to punchy social posts and everything in between.
            </p>
          </div>

          <div className="card">
            <h3 className="text-xl font-semibold text-text-primary">Adjustable Tone</h3>
            <p className="mt-2 text-text-secondary">
              Professional, casual, humorous—tailor the voice to your brand and audience.
            </p>
          </div>

          <div className="card">
            <h3 className="text-xl font-semibold text-text-primary">Target Audience Focus</h3>
            <p className="mt-2 text-text-secondary">
              Create content that resonates with your specific audience segments.
            </p>
          </div>

          <div className="card">
            <h3 className="text-xl font-semibold text-text-primary">Custom Length</h3>
            <p className="mt-2 text-text-secondary">
              Get content of any length, from brief social updates to comprehensive articles.
            </p>
          </div>

          <div className="card">
            <h3 className="text-xl font-semibold text-text-primary">Content History</h3>
            <p className="mt-2 text-text-secondary">
              Access and reuse all your previously generated content.
            </p>
          </div>

          <div className="card">
            <h3 className="text-xl font-semibold text-text-primary">Advanced AI</h3>
            <p className="mt-2 text-text-secondary">
              Powered by state-of-the-art language models for natural, engaging text.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-secondary border-t border-border">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-text-primary">Ready to create amazing content?</h2>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
            Join thousands of content creators, marketers, and businesses who are using AI to create better content faster.
          </p>
          <div className="mt-10">
            <Link href="/register" className="btn-primary text-lg px-8 py-3">
              Get Started Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
