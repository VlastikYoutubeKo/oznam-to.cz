// app/dashboard/subscriptions/page.tsx - Manage all channel subscriptions
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';

const CATEGORIES = {
  info: { label: 'ℹ️ Informace', color: 'green' },
  warning: { label: '⚠️ Upozornění', color: 'amber' },
  event: { label: '📅 Událost', color: 'blue' },
  maintenance: { label: '🔧 Údržba', color: 'purple' },
};

interface Channel {
  id: string;
  title: string;
  slug: string;
}

interface Subscription {
  id: string;
  channel_id: string;
  email: string;
  subscribed: boolean;
  categories: string[] | null;
  created_at: string;
  updated_at: string;
  channels: Channel;
}

export default function SubscriptionsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null); // Track which subscription is being saved
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
        await fetchSubscriptions(session.user.id);
      }
    };
    fetchSession();
  }, [router]);

  const fetchSubscriptions = async (userId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/subscriptions?userId=${userId}`);
      const data = await response.json();

      if (response.ok) {
        setSubscriptions(data.subscriptions || []);
      } else {
        console.error('Error fetching subscriptions:', data.error);
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSubscription = async (subscription: Subscription) => {
    if (!user) return;

    setSaving(subscription.id);
    setMessage(null);

    try {
      const response = await fetch(`/api/subscriptions/${subscription.channel_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          subscribed: !subscription.subscribed,
        }),
      });

      if (response.ok) {
        // Update local state
        setSubscriptions(prev =>
          prev.map(sub =>
            sub.id === subscription.id
              ? { ...sub, subscribed: !sub.subscribed }
              : sub
          )
        );
        setMessage({
          type: 'success',
          text: `✅ Odběr ${!subscription.subscribed ? 'zapnut' : 'vypnut'} pro ${subscription.channels.title}`
        });
      } else {
        throw new Error('Failed to update subscription');
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
      setMessage({
        type: 'error',
        text: '❌ Chyba při aktualizaci odběru. Zkuste to prosím znovu.'
      });
    } finally {
      setSaving(null);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleUpdateCategories = async (subscription: Subscription, newCategories: string[] | null) => {
    if (!user) return;

    setSaving(subscription.id);
    setMessage(null);

    try {
      const response = await fetch(`/api/subscriptions/${subscription.channel_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          categories: newCategories,
        }),
      });

      if (response.ok) {
        // Update local state
        setSubscriptions(prev =>
          prev.map(sub =>
            sub.id === subscription.id
              ? { ...sub, categories: newCategories }
              : sub
          )
        );
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
        text: '❌ Chyba při ukládání kategorií. Zkuste to prosím znovu.'
      });
    } finally {
      setSaving(null);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleUnsubscribe = async (subscription: Subscription) => {
    if (!user) return;

    if (!confirm(`Opravdu se chcete odhlásit z odběru oznámení z nástěnky "${subscription.channels.title}"?`)) {
      return;
    }

    setSaving(subscription.id);
    setMessage(null);

    try {
      const response = await fetch(`/api/subscriptions/${subscription.channel_id}?userId=${user.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove from local state
        setSubscriptions(prev => prev.filter(sub => sub.id !== subscription.id));
        setMessage({
          type: 'success',
          text: `✅ Odhlášeno z odběru nástěnky "${subscription.channels.title}"`
        });
      } else {
        throw new Error('Failed to unsubscribe');
      }
    } catch (error) {
      console.error('Error unsubscribing:', error);
      setMessage({
        type: 'error',
        text: '❌ Chyba při odhlášení. Zkuste to prosím znovu.'
      });
    } finally {
      setSaving(null);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const toggleCategory = (subscription: Subscription, category: string) => {
    if (subscription.categories === null) {
      // Currently all categories enabled, switch to specific selection
      handleUpdateCategories(subscription, [category]);
    } else if (subscription.categories.includes(category)) {
      // Remove category
      const newCategories = subscription.categories.filter(c => c !== category);
      // If no categories left, set to null (all categories)
      handleUpdateCategories(subscription, newCategories.length === 0 ? null : newCategories);
    } else {
      // Add category
      handleUpdateCategories(subscription, [...subscription.categories, category]);
    }
  };

  const toggleAllCategories = (subscription: Subscription) => {
    handleUpdateCategories(subscription, null); // null = all categories
  };

  const isCategorySelected = (subscription: Subscription, category: string) => {
    return subscription.categories === null || subscription.categories.includes(category);
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Načítání...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-5xl mx-auto p-6 lg:p-8">
        {/* Breadcrumb */}
        <Link
          href="/dashboard"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6 font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Zpět na přehled
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🔔 Správa odběrů</h1>
          <p className="text-gray-600">
            Spravujte si, z jakých nástěnek chcete dostávat e-mailová oznámení
          </p>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center">
              <span className="mr-2">
                {message.type === 'success' ? '✅' : '❌'}
              </span>
              <span className="font-medium">{message.text}</span>
            </div>
          </div>
        )}

        {/* Subscriptions List */}
        {subscriptions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Žádné odběry
            </h2>
            <p className="text-gray-600 mb-6">
              Zatím neodebíráte oznámení z žádné nástěnky
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
            >
              📋 Zobrazit moje nástěnky
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {subscriptions.map((subscription) => (
              <div
                key={subscription.id}
                className={`bg-white rounded-2xl shadow-lg p-6 border-2 transition-all ${
                  subscription.subscribed
                    ? 'border-green-200'
                    : 'border-gray-200 opacity-75'
                }`}
              >
                {/* Subscription Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {subscription.channels.title}
                      </h3>
                      <Link
                        href={`/${subscription.channels.slug}`}
                        target="_blank"
                        className="text-indigo-600 hover:text-indigo-800 transition-colors"
                        title="Otevřít nástěnku"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </Link>
                    </div>
                    <p className="text-sm text-gray-600">
                      /{subscription.channels.slug}
                    </p>
                  </div>

                  {/* Toggle Subscription */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={subscription.subscribed}
                      onChange={() => handleToggleSubscription(subscription)}
                      disabled={saving === subscription.id}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-900">
                      {subscription.subscribed ? '🔔 Zapnuto' : '🔕 Vypnuto'}
                    </span>
                  </label>
                </div>

                {/* Category Selection (only if subscribed) */}
                {subscription.subscribed && (
                  <div className="pt-4 border-t border-gray-200">
                    <label className="block text-sm font-bold text-gray-900 mb-3">
                      📋 Kategorie oznámení
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* All categories option */}
                      <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-indigo-300 cursor-pointer transition-all">
                        <input
                          type="checkbox"
                          checked={subscription.categories === null}
                          onChange={() => toggleAllCategories(subscription)}
                          disabled={saving === subscription.id}
                          className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                        />
                        <span className="font-medium text-gray-900">
                          🏷️ Všechny kategorie
                        </span>
                      </label>

                      {/* Individual categories */}
                      {Object.entries(CATEGORIES).map(([key, { label }]) => (
                        <label
                          key={key}
                          className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg border-2 ${
                            isCategorySelected(subscription, key) ? 'border-indigo-400' : 'border-gray-200'
                          } hover:border-indigo-300 cursor-pointer transition-all`}
                        >
                          <input
                            type="checkbox"
                            checked={isCategorySelected(subscription, key)}
                            onChange={() => toggleCategory(subscription, key)}
                            disabled={subscription.categories === null || saving === subscription.id}
                            className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                          />
                          <span className={`font-medium ${subscription.categories === null ? 'text-gray-400' : 'text-gray-900'}`}>
                            {label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-4 border-t border-gray-200 mt-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleUnsubscribe(subscription)}
                      disabled={saving === subscription.id}
                      className="flex-1 px-4 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      🔕 Odhlásit se z odběru
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Jak se přihlásit k odběru nové nástěnky?
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Otevřete veřejnou stránku nástěnky (například <code className="bg-blue-100 px-1 rounded">/svj-bilina-1</code>)
                  a klikněte na tlačítko <strong>"Přihlásit se k odběru"</strong>.
                  Poté si můžete vybrat, které kategorie oznámení chcete dostávat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
