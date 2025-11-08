// components/ChannelSubscription.tsx - Channel subscription component with category selection
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

const CATEGORIES = {
  info: { label: 'ℹ️ Informace', color: 'green' },
  warning: { label: '⚠️ Upozornění', color: 'amber' },
  event: { label: '📅 Událost', color: 'blue' },
  maintenance: { label: '🔧 Údržba', color: 'purple' },
};

interface ChannelSubscriptionProps {
  channelId: string;
  channelTitle: string;
  channelSlug: string;
}

export default function ChannelSubscription({ channelId, channelTitle, channelSlug }: ChannelSubscriptionProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[] | null>(null);
  const [email, setEmail] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setEmail(session.user.email || '');
        await fetchSubscription(session.user.id);
      } else {
        setLoading(false);
      }
    };
    fetchSession();
  }, [channelId]);

  const fetchSubscription = async (userId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/subscriptions/${channelId}?userId=${userId}`);
      const data = await response.json();

      if (data.exists) {
        setIsSubscribed(data.subscribed);
        setSelectedCategories(data.categories);
        setEmail(data.email || email);
      } else {
        setIsSubscribed(false);
        setSelectedCategories(null); // null = all categories
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!user) {
      // Redirect to login
      window.location.href = '/login';
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/subscriptions/${channelId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          email,
          subscribed: true,
          categories: selectedCategories,
        }),
      });

      if (response.ok) {
        setIsSubscribed(true);
        setMessage({
          type: 'success',
          text: '✅ Úspěšně přihlášeno k odběru oznámení!'
        });
        setShowSettings(true);
      } else {
        throw new Error('Failed to subscribe');
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      setMessage({
        type: 'error',
        text: '❌ Chyba při přihlášení k odběru. Zkuste to prosím znovu.'
      });
    } finally {
      setSaving(false);
      // Clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleUnsubscribe = async () => {
    if (!user) return;

    if (!confirm('Opravdu se chcete odhlásit z odběru oznámení z této nástěnky?')) {
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/subscriptions/${channelId}?userId=${user.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setIsSubscribed(false);
        setSelectedCategories(null);
        setShowSettings(false);
        setMessage({
          type: 'success',
          text: '✅ Úspěšně odhlášeno z odběru oznámení'
        });
      } else {
        throw new Error('Failed to unsubscribe');
      }
    } catch (error) {
      console.error('Error unsubscribing:', error);
      setMessage({
        type: 'error',
        text: '❌ Chyba při odhlášení z odběru. Zkuste to prosím znovu.'
      });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleUpdateCategories = async () => {
    if (!user) return;

    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/subscriptions/${channelId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          categories: selectedCategories,
        }),
      });

      if (response.ok) {
        setMessage({
          type: 'success',
          text: '✅ Nastavení kategorií uloženo!'
        });
      } else {
        throw new Error('Failed to update categories');
      }
    } catch (error) {
      console.error('Error updating categories:', error);
      setMessage({
        type: 'error',
        text: '❌ Chyba při ukládání nastavení. Zkuste to prosím znovu.'
      });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const toggleCategory = (category: string) => {
    if (selectedCategories === null) {
      // Currently all categories enabled, switch to specific selection
      setSelectedCategories([category]);
    } else if (selectedCategories.includes(category)) {
      // Remove category
      const newCategories = selectedCategories.filter(c => c !== category);
      // If no categories left, set to null (all categories)
      setSelectedCategories(newCategories.length === 0 ? null : newCategories);
    } else {
      // Add category
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const toggleAllCategories = () => {
    setSelectedCategories(null); // null = all categories
  };

  const isCategorySelected = (category: string) => {
    return selectedCategories === null || selectedCategories.includes(category);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl shadow-lg p-6 border border-indigo-100">
        <div className="text-center">
          <div className="text-4xl mb-4">🔔</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Dostávejte oznámení e-mailem
          </h3>
          <p className="text-gray-600 mb-4">
            Přihlaste se k odběru a buďte informováni o novinkách z této nástěnky
          </p>
          <button
            onClick={handleSubscribe}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
          >
            🔔 Přihlásit se k odběru
          </button>
        </div>
      </div>
    );
  }

  // Logged in, not subscribed
  if (!isSubscribed) {
    return (
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl shadow-lg p-6 border border-indigo-100">
        {message && (
          <div className={`mb-4 p-3 rounded-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}
        <div className="text-center">
          <div className="text-4xl mb-4">🔔</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Dostávejte oznámení e-mailem
          </h3>
          <p className="text-gray-600 mb-4">
            Přihlaste se k odběru a buďte informováni o novinkách z této nástěnky
          </p>
          <button
            onClick={handleSubscribe}
            disabled={saving}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Přihlašování...' : '🔔 Přihlásit se k odběru'}
          </button>
        </div>
      </div>
    );
  }

  // Logged in and subscribed
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 border border-green-200">
      {message && (
        <div className={`mb-4 p-3 rounded-lg ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">✅</div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Odebíráte oznámení
              </h3>
              <p className="text-sm text-gray-600">
                E-maily budou zasílány na: <strong>{email}</strong>
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-gray-600 hover:text-gray-900 transition-colors"
          title={showSettings ? 'Skrýt nastavení' : 'Zobrazit nastavení'}
        >
          <svg className={`w-6 h-6 transition-transform ${showSettings ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {showSettings && (
        <div className="space-y-4 pt-4 border-t border-green-200">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              📋 Kategorie oznámení
            </label>
            <p className="text-xs text-gray-600 mb-3">
              Vyberte, které typy oznámení chcete dostávat:
            </p>

            <div className="space-y-2">
              {/* All categories option */}
              <label className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-gray-200 hover:border-indigo-300 cursor-pointer transition-all">
                <input
                  type="checkbox"
                  checked={selectedCategories === null}
                  onChange={toggleAllCategories}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                />
                <span className="font-medium text-gray-900">
                  🏷️ Všechny kategorie
                </span>
              </label>

              {/* Individual categories */}
              {Object.entries(CATEGORIES).map(([key, { label, color }]) => (
                <label
                  key={key}
                  className={`flex items-center gap-3 p-3 bg-white rounded-lg border-2 ${
                    isCategorySelected(key) ? 'border-indigo-400' : 'border-gray-200'
                  } hover:border-indigo-300 cursor-pointer transition-all`}
                >
                  <input
                    type="checkbox"
                    checked={isCategorySelected(key)}
                    onChange={() => toggleCategory(key)}
                    disabled={selectedCategories === null}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                  />
                  <span className={`font-medium ${selectedCategories === null ? 'text-gray-400' : 'text-gray-900'}`}>
                    {label}
                  </span>
                </label>
              ))}
            </div>

            <button
              onClick={handleUpdateCategories}
              disabled={saving}
              className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Ukládám...' : '💾 Uložit nastavení kategorií'}
            </button>
          </div>

          {/* Unsubscribe Button */}
          <div className="pt-4 border-t border-green-200">
            <button
              onClick={handleUnsubscribe}
              disabled={saving}
              className="w-full px-4 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🔕 Odhlásit se z odběru
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
