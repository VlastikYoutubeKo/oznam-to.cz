// app/reset-password/page.jsx - Password reset form
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user has a valid recovery session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        setIsValidSession(true);
      } else {
        setError('Neplatný nebo vypršený odkaz pro obnovení hesla.');
      }
      setIsCheckingSession(false);
    };

    checkSession();

    // Listen for auth changes (when user clicks the email link)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsValidSession(true);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const validatePassword = (pwd) => {
    if (pwd.length < 6) {
      return 'Heslo musí mít alespoň 6 znaků';
    }
    return null;
  };

  const handleResetPassword = async (e) => {
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

    const { error: updateError } = await supabase.auth.updateUser({
      password: password
    });

    setIsLoading(false);

    if (updateError) {
      setError('Chyba při změně hesla: ' + updateError.message);
    } else {
      setMessage('Heslo bylo úspěšně změněno!');
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    }
  };

  // Loading state while checking session
  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Ověřování...</p>
        </div>
      </div>
    );
  }

  // Invalid session - show error
  if (!isValidSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
            <div className="text-6xl mb-6">⚠️</div>
            <h1 className="text-3xl font-bold mb-4 text-gray-900">
              Neplatný odkaz
            </h1>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6 text-left">
              <p className="text-red-700 text-sm">
                {error}
              </p>
            </div>
            <p className="text-gray-600 mb-6">
              Odkaz pro obnovení hesla je neplatný nebo již vypršel. Platnost odkazu je 1 hodina.
            </p>
            <Link
              href="/forgot-password"
              className="inline-block px-6 py-3 font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
            >
              Požádat o nový odkaz
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (message) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
            <div className="text-6xl mb-6">✅</div>
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Heslo změněno!
            </h1>
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg mb-6">
              <p className="text-green-700 text-sm">
                ✅ Vaše heslo bylo úspěšně změněno
              </p>
            </div>
            <p className="text-gray-600 mb-6">
              Přesměrováváme vás na dashboard...
            </p>
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // Reset password form
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-4">
            <span className="text-2xl">🔐</span>
            <span className="text-sm font-medium text-gray-600">
              Nové heslo
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Nastavte nové heslo
          </h1>
          <p className="text-gray-600">
            Vytvořte si silné a bezpečné heslo
          </p>
        </div>

        {/* Reset Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nové heslo
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
              <p className="text-xs text-gray-500 mt-2">
                Minimálně 6 znaků
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Potvrďte nové heslo
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

            {/* Password strength indicator */}
            {password && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-lg">
                <p className="text-blue-700 text-xs">
                  <strong>💡 Tip pro silné heslo:</strong> Použijte kombinaci velkých a malých písmen, číslic a speciálních znaků.
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

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
                  Nastavování...
                </span>
              ) : (
                '🔓 Nastavit nové heslo'
              )}
            </button>
          </form>
        </div>

        {/* Security Note */}
        <div className="mt-6 bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
          <p className="text-xs text-gray-600 text-center">
            🔒 Po změně hesla budete automaticky přihlášeni
          </p>
        </div>

        {/* Back to Login */}
        <div className="text-center mt-6">
          <Link
            href="/login"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors inline-flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Zpět na přihlášení
          </Link>
        </div>
      </div>
    </div>
  );
}
