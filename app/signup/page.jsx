// app/signup/page.jsx - Redesigned signup page
'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validatePassword = (pwd) => {
    if (pwd.length < 6) {
      return 'Heslo musí mít alespoň 6 znaků';
    }
    return null;
  };

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { strength: 0, label: '', color: '' };

    let strength = 0;
    if (pwd.length >= 6) strength++;
    if (pwd.length >= 10) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;

    if (strength <= 2) return { strength: 1, label: 'Slabé', color: 'bg-red-500' };
    if (strength <= 3) return { strength: 2, label: 'Střední', color: 'bg-yellow-500' };
    return { strength: 3, label: 'Silné', color: 'bg-green-500' };
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Hesla se neshodují');
      return;
    }

    setIsLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      }
    });

    setIsLoading(false);

    if (signUpError) {
      setError('Chyba při registraci: ' + signUpError.message);
    } else {
      // Check if email confirmation is required
      if (data?.user?.identities?.length === 0) {
        setError('Tento email je již registrován');
      } else if (data?.user && !data?.session) {
        // Email confirmation required
        setMessage('Registrace úspěšná! Zkontrolujte svůj email pro potvrzení účtu.');
      } else {
        // Auto-login (if email confirmation is disabled)
        setMessage('Registrace úspěšná! Přesměrování...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      }
    }
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-4">
            <span className="text-2xl">🚀</span>
            <span className="text-sm font-medium text-gray-600">
              Registrace
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Vytvořte si účet
          </h1>
          <p className="text-gray-600">
            Začněte publikovat oznámení zdarma
          </p>
        </div>

        {/* Signup Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSignUp} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                E-mailová adresa
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="vas@email.cz"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Heslo
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Síla hesla:</span>
                    <span className={`text-xs font-semibold ${
                      passwordStrength.strength === 1 ? 'text-red-600' :
                      passwordStrength.strength === 2 ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <div className={`h-2 flex-1 rounded-full ${passwordStrength.strength >= 1 ? passwordStrength.color : 'bg-gray-200'}`}></div>
                    <div className={`h-2 flex-1 rounded-full ${passwordStrength.strength >= 2 ? passwordStrength.color : 'bg-gray-200'}`}></div>
                    <div className={`h-2 flex-1 rounded-full ${passwordStrength.strength >= 3 ? passwordStrength.color : 'bg-gray-200'}`}></div>
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-500 mt-2">
                Minimálně 6 znaků. Použijte kombinaci písmen, číslic a speciálních znaků.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Potvrďte heslo
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {message && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                <p className="text-green-700 text-sm">{message}</p>
              </div>
            )}

            {/* Terms acceptance */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 text-center">
                Registrací souhlasíte s našimi{' '}
                <Link href="/terms" className="text-indigo-600 hover:text-indigo-700 font-medium">
                  podmínkami použití
                </Link>
                {' '}a{' '}
                <Link href="/privacy" className="text-indigo-600 hover:text-indigo-700 font-medium">
                  zásadami ochrany osobních údajů
                </Link>
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Vytváření účtu...
                </span>
              ) : (
                '🚀 Vytvořit účet'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">nebo</span>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Už máte účet?{' '}
              <Link
                href="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Přihlásit se
              </Link>
            </p>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-200">
            <div className="text-2xl mb-2">⚡</div>
            <p className="text-xs text-gray-600 font-medium">Rychlé</p>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-200">
            <div className="text-2xl mb-2">🔒</div>
            <p className="text-xs text-gray-600 font-medium">Bezpečné</p>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-200">
            <div className="text-2xl mb-2">💯</div>
            <p className="text-xs text-gray-600 font-medium">Zdarma</p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors inline-flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Zpět na hlavní stránku
          </Link>
        </div>
      </div>
    </div>
  );
}