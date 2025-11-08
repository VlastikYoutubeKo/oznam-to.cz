// app/forgot-password/page.jsx - Password reset request
'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setIsLoading(false);

    if (resetError) {
      setError('Chyba při odesílání emailu: ' + resetError.message);
    } else {
      setEmailSent(true);
      setMessage('Email s odkazem pro obnovení hesla byl odeslán!');
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Success State */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
            <div className="text-6xl mb-6">📧</div>
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Email odeslán!
            </h1>
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg mb-6 text-left">
              <p className="text-green-700 text-sm">
                ✅ Zkontrolujte svou emailovou schránku <strong>{email}</strong>
              </p>
            </div>
            <p className="text-gray-600 mb-6">
              Poslali jsme vám email s odkazem pro obnovení hesla. Klikněte na odkaz v emailu pro nastavení nového hesla.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6 text-left">
              <p className="text-blue-700 text-sm">
                <strong>💡 Tip:</strong> Odkaz je platný 1 hodinu. Pokud email nevidíte, zkontrolujte složku spam.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setEmailSent(false);
                  setEmail('');
                  setMessage('');
                }}
                className="w-full px-6 py-3 font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
              >
                Odeslat znovu
              </button>
              <Link
                href="/login"
                className="block w-full px-6 py-3 font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg text-center"
              >
                Zpět na přihlášení
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-4">
            <span className="text-2xl">🔑</span>
            <span className="text-sm font-medium text-gray-600">
              Obnovení hesla
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Zapomenuté heslo?
          </h1>
          <p className="text-gray-600">
            Zadejte svůj email a pošleme vám odkaz pro obnovení
          </p>
        </div>

        {/* Reset Request Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleResetRequest} className="space-y-5">
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
              <p className="text-xs text-gray-500 mt-2">
                Zadejte email, se kterým jste se registrovali
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {message && !emailSent && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                <p className="text-green-700 text-sm">{message}</p>
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
                  Odesílání...
                </span>
              ) : (
                '📧 Odeslat odkaz pro obnovení'
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

          {/* Back to Login */}
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Vzpomněli jste si na heslo?{' '}
              <Link
                href="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Přihlásit se
              </Link>
            </p>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
          <p className="text-xs text-gray-600 text-center">
            🔒 <strong>Bezpečnostní tip:</strong> Nikdy nesdílejte odkaz pro obnovení hesla s nikým jiným.
          </p>
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
