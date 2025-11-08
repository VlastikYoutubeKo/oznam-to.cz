// app/admin/page.tsx - Admin panel for viewing all channels
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';

const ADMIN_EMAIL = 'male@cyn.cz';

type Channel = {
  id: string;
  title: string;
  slug: string;
  created_at: string;
};

type ChannelWithMemberCount = Channel & {
  member_count: number;
  post_count: number;
  owner_email: string | null;
};

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [channels, setChannels] = useState<ChannelWithMemberCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  const getChannelMemberCount = async (channelId: string) => {
    const { count } = await supabase
      .from('channel_members')
      .select('*', { count: 'exact', head: true })
      .eq('channel_id', channelId);
    return count || 0;
  };

  const getChannelPostCount = async (channelId: string) => {
    const { count } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('channel_id', channelId);
    return count || 0;
  };

  const getChannelOwnerEmail = async (channelId: string): Promise<string | null> => {
    const { data } = await supabase
      .from('channel_members')
      .select('users ( email )')
      .eq('channel_id', channelId)
      .eq('role', 'owner')
      .single();

    if (!data?.users) return null;

    // Supabase returns users as array or object depending on context
    const users = data.users as { email: string }[] | { email: string };
    return Array.isArray(users) ? users[0]?.email || null : users?.email || null;
  };

  const enrichChannelWithStats = async (channel: Channel) => {
    const [memberCount, postCount, ownerEmail] = await Promise.all([
      getChannelMemberCount(channel.id),
      getChannelPostCount(channel.id),
      getChannelOwnerEmail(channel.id),
    ]);

    return {
      ...channel,
      member_count: memberCount,
      post_count: postCount,
      owner_email: ownerEmail,
    };
  };

  const fetchAllChannels = async () => {
    setLoading(true);

    const { data: channelsData, error: channelsError } = await supabase
      .from('channels')
      .select('*')
      .order('created_at', { ascending: false });

    if (channelsError || !channelsData) {
      console.error('Error fetching channels:', channelsError);
      setLoading(false);
      return;
    }

    const channelsWithStats = await Promise.all(
      channelsData.map(enrichChannelWithStats)
    );

    setChannels(channelsWithStats);
    setLoading(false);
  };

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      const currentUser = session.user;
      setUser(currentUser);

      // Check if user is admin
      if (currentUser.email !== ADMIN_EMAIL) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setIsAdmin(true);
      await fetchAllChannels();
    };

    fetchSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Načítání...</p>
        </div>
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Přístup odepřen
            </h1>
            <p className="text-gray-600 mb-6">
              Tato stránka je přístupná pouze administrátorům.
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-6 py-3 font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
            >
              Zpět na Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-4">
            <span className="text-2xl">👑</span>
            <span className="text-sm font-medium text-gray-600">
              Admin Panel
            </span>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Všechny kanály
          </h1>
          <p className="text-gray-600">
            Celkem <span className="font-bold text-gray-900">{channels.length}</span> kanálů v systému
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">📊</span>
              <h3 className="text-lg font-bold text-gray-900">Celkem kanálů</h3>
            </div>
            <p className="text-4xl font-bold text-indigo-600">{channels.length}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">📝</span>
              <h3 className="text-lg font-bold text-gray-900">Celkem příspěvků</h3>
            </div>
            <p className="text-4xl font-bold text-purple-600">
              {channels.reduce((sum, ch) => sum + ch.post_count, 0)}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">👥</span>
              <h3 className="text-lg font-bold text-gray-900">Celkem členů</h3>
            </div>
            <p className="text-4xl font-bold text-green-600">
              {channels.reduce((sum, ch) => sum + ch.member_count, 0)}
            </p>
          </div>
        </div>

        {/* Channels List */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Název kanálu</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Slug</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Vlastník</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Členové</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Příspěvky</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Vytvořeno</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Akce</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {channels.map((channel) => (
                  <tr key={channel.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{channel.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {channel.slug}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {channel.owner_email || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full font-semibold text-sm">
                        {channel.member_count}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-700 rounded-full font-semibold text-sm">
                        {channel.post_count}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {new Date(channel.created_at).toLocaleDateString('cs-CZ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/${channel.slug}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Zobrazit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {channels.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Zatím žádné kanály
              </h3>
              <p className="text-gray-600">
                V systému zatím nebyly vytvořeny žádné kanály.
              </p>
            </div>
          )}
        </div>

        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Zpět na můj Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
