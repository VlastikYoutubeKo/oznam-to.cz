// app/dashboard/page.tsx - Redesigned dashboard
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';

// Supabase actually returns channels as a single object when using !inner join
type ChannelMembership = {
  role: 'owner' | 'admin';
  channels: {
    id: string;
    title: string;
    slug: string;
  } | null;
};

// Type for validated channels (after filtering out nulls)
type ValidChannelMembership = {
  role: 'owner' | 'admin';
  channels: {
    id: string;
    title: string;
    slug: string;
  };
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [channels, setChannels] = useState<ValidChannelMembership[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const fetchChannels = async (currentUser: User) => {
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from('channel_members')
      .select('role, channels!inner ( id, title, slug )')
      .eq('user_id', currentUser.id);

    if (fetchError) {
      setError('Chyba při načítání kanálů: ' + fetchError.message);
      console.error('Fetch error:', fetchError);
    } else if (data) {
      console.log('Raw data from Supabase:', data);
      // Supabase returns channels as objects directly, not arrays (despite TypeScript types)
      // Use 'unknown' as intermediate type to satisfy TypeScript in build mode
      // Type guard filter ensures TypeScript knows channels is not null after filtering
      const validChannels = (data as unknown as ChannelMembership[]).filter(
        (m): m is ValidChannelMembership => m.channels !== null
      );
      console.log('Valid channels:', validChannels);
      setChannels(validChannels);
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
        fetchChannels(session.user);
      }
    };
    fetchSession();
  }, [router]);

  const handleCreateChannel = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setMessage('');
    setError('');
    setIsCreating(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      setError('Adresa (slug) může obsahovat pouze malá písmena, čísla a pomlčky');
      setIsCreating(false);
      return;
    }

    // 1. Create channel
    const { data: channelData, error: channelError } = await supabase
      .from('channels')
      .insert({ title, slug })
      .select()
      .single();

    if (channelError) {
      if (channelError.code === '23505') {
        setError('Tato adresa (slug) je již obsazena. Zvolte jinou.');
      } else {
        setError('Chyba při vytváření kanálu: ' + channelError.message);
      }
      setIsCreating(false);
      return;
    }

    // 2. Make creator the owner
    const { error: memberError } = await supabase
      .from('channel_members')
      .insert({
        channel_id: channelData.id,
        user_id: user.id,
        role: 'owner',
      });

    setIsCreating(false);

    if (memberError) {
      setError('Chyba při přiřazení role: ' + memberError.message);
    } else {
      setMessage('Kanál byl úspěšně vytvořen!');
      fetchChannels(user);
      (e.target as HTMLFormElement).reset();

      // Clear success message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Načítání vašich kanálů...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-4">
            <span className="text-2xl">📊</span>
            <span className="text-sm font-medium text-gray-600">
              Dashboard
            </span>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Moje kanály
          </h1>
          {user?.email && (
            <p className="text-gray-600">
              Přihlášen jako <span className="font-semibold text-gray-900">{user.email}</span>
            </p>
          )}
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
            <p className="text-green-700 font-medium">✅ {message}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <p className="text-red-700 font-medium">❌ {error}</p>
          </div>
        )}

        {/* Channels List */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              📋 Vaše kanály ({channels.length})
            </h2>
          </div>

          {channels.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {channels.map((mem) => (
                <Link
                    key={mem.channels.id}
                    href={`/dashboard/${mem.channels.slug}`}
                    className="group bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">
                          {mem.channels.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          /{mem.channels.slug}
                        </p>
                      </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        mem.role === 'owner'
                          ? 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {mem.role === 'owner' ? '👑 Vlastník' : '⭐ Admin'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Spravovat
                    </span>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg border-2 border-dashed border-gray-300">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Zatím žádné kanály
              </h3>
              <p className="text-gray-600 mb-6">
                Vytvořte svůj první kanál a začněte publikovat oznámení!
              </p>
              <div className="inline-flex items-center gap-2 text-indigo-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <span className="font-medium">Použijte formulář níže</span>
              </div>
            </div>
          )}
        </div>

        {/* Create Channel Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-3xl">➕</div>
            <h2 className="text-2xl font-bold text-gray-900">Vytvořit nový kanál</h2>
          </div>

          <form onSubmit={handleCreateChannel} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Název kanálu
              </label>
              <input
                name="title"
                type="text"
                required
                placeholder="např. Naše SVJ Praha 5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <p className="text-xs text-gray-500 mt-2">
                Veřejný název vašeho kanálu
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Adresa (slug)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">{typeof window !== 'undefined' ? window.location.host : 'oznam-to.cz'}/</span>
                <input
                  name="slug"
                  type="text"
                  required
                  placeholder="nase-svj-praha-5"
                  pattern="[a-z0-9\-]+"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Pouze malá písmena, čísla a pomlčky (např: muj-kanal-123)
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
              <p className="text-blue-700 text-sm">
                <strong>💡 Tip:</strong> Vyberte snadno zapamatovatelnou adresu. Adresu můžete použít pro sdílení s ostatními.
              </p>
            </div>

            <button
              type="submit"
              disabled={isCreating}
              className="w-full px-6 py-3 font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Vytváření...
                </span>
              ) : (
                '✨ Vytvořit kanál'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}