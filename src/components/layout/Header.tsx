// src/components/layout/Header.tsx

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, Transition } from '@headlessui/react';
import { UserIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  user?: { username: string } | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const router = useRouter();

  return (
    <header className="bg-secondary border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-accent">ContentCreator</span>
              <span className="text-xl font-light text-text-primary">AI</span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link href="/" className={`${router.pathname === '/' ? 'text-accent' : 'text-text-secondary'} hover:text-text-primary`}>
              Home
            </Link>
            <Link href="/dashboard" className={`${router.pathname.startsWith('/dashboard') ? 'text-accent' : 'text-text-secondary'} hover:text-text-primary`}>
              Dashboard
            </Link>
            <Link href="/pricing" className={`${router.pathname === '/pricing' ? 'text-accent' : 'text-text-secondary'} hover:text-text-primary`}>
              Pricing
            </Link>
          </nav>

          <div className="flex items-center">
            {user ? (
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center space-x-2 text-text-primary hover:text-accent">
                  <UserIcon className="h-6 w-6" />
                  <span>{user.username}</span>
                </Menu.Button>
                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-card-bg border border-border rounded-md shadow-lg py-1 z-50">
                    <Menu.Item>
                      {({ active }) => (
                        <Link href="/profile" className={`${active ? 'bg-hover' : ''} block px-4 py-2 text-sm text-text-primary`}>
                          Profile
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={onLogout}
                          className={`${active ? 'bg-hover' : ''} block w-full text-left px-4 py-2 text-sm text-text-primary`}
                        >
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <div className="flex space-x-4">
                <Link href="/login" className="btn-outline text-sm">
                  Log in
                </Link>
                <Link href="/register" className="btn-primary text-sm">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
