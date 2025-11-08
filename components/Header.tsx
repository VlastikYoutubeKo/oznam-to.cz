// components/Header.tsx - Redesigned header
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';

const ADMIN_EMAIL = 'male@cyn.cz';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <header className="w-full bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo / Název */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-3xl">📢</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Oznam to!
            </span>
          </Link>

          {/* Desktop Navigation - hidden on mobile, visible on md and up */}
          <div className="hidden md:flex items-center gap-3">
            {/* About link - always visible */}
            <Link
              href="/about"
              className={`px-4 py-2 font-medium rounded-lg transition-all ${
                pathname === '/about'
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
              }`}
            >
              ℹ️ O projektu
            </Link>

            {user ? (
              // Pokud je přihlášen
              <>
                <Link
                  href="/dashboard"
                  className={`px-4 py-2 font-medium rounded-lg transition-all ${
                    pathname.startsWith('/dashboard') && pathname !== '/dashboard/subscriptions'
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  📊 Dashboard
                </Link>

                <Link
                  href="/dashboard/subscriptions"
                  className={`px-4 py-2 font-medium rounded-lg transition-all ${
                    pathname === '/dashboard/subscriptions'
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  🔔 Odběry
                </Link>

                {/* Admin link - only visible for admin users */}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className={`px-4 py-2 font-medium rounded-lg transition-all ${
                      pathname === '/admin'
                        ? 'text-indigo-600 bg-indigo-50'
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                    }`}
                  >
                    👑 Admin
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="px-5 py-2.5 font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                >
                  Odhlásit
                </button>
              </>
            ) : (
              // Pokud NENÍ přihlášen
              <>
                <Link
                  href="/login"
                  className="px-5 py-2.5 font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Přihlásit se
                </Link>
                <Link
                  href="/signup"
                  className="px-5 py-2.5 font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                >
                  Registrovat
                </Link>
              </>
            )}
          </div>

          {/* Hamburger button - visible only on mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-indigo-600 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu - visible only when open */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2">
            {/* About link */}
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2 font-medium rounded-lg transition-all ${
                pathname === '/about'
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
              }`}
            >
              ℹ️ O projektu
            </Link>

            {user ? (
              // Pokud je přihlášen
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 font-medium rounded-lg transition-all ${
                    pathname.startsWith('/dashboard') && pathname !== '/dashboard/subscriptions'
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  📊 Dashboard
                </Link>

                <Link
                  href="/dashboard/subscriptions"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 font-medium rounded-lg transition-all ${
                    pathname === '/dashboard/subscriptions'
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  🔔 Odběry
                </Link>

                {/* Admin link - only visible for admin users */}
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-2 font-medium rounded-lg transition-all ${
                      pathname === '/admin'
                        ? 'text-indigo-600 bg-indigo-50'
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                    }`}
                  >
                    👑 Admin
                  </Link>
                )}

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-4 py-2 font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
                >
                  Odhlásit
                </button>
              </>
            ) : (
              // Pokud NENÍ přihlášen
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-all"
                >
                  Přihlásit se
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
                >
                  Registrovat
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}