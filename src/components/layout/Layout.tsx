// src/components/layout/Layout.tsx


import React, { ReactNode } from 'react';
import Head from 'next/head';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  user?: { username: string } | null;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  title = 'Content Creator AI',
  user,
  onLogout
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-primary">
      <Head>
        <title>{title}</title>
        <meta name="description" content="AI-powered content creation tool" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header user={user} onLogout={onLogout} />

      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>

      <Footer />
    </div>
  );
};
