// app/dashboard/[slug]/settings/page.tsx - Redesigned settings
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';

type Channel = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  theme_color: string;
  logo_url: string | null;
};

// Supabase returns users as an array in the join
type SupabaseMember = {
  id: string;
  role: 'owner' | 'admin';
  users: {
    id: string;
    email: string;
  }[];
};

// Our internal type with single user object
type Member = {
  id: string;
  role: 'owner' | 'admin';
  users: {
    id: string;
    email: string;
  } | null;
};

const THEME_COLORS = [
  { value: 'indigo', label: 'Indigo (výchozí)', gradient: 'from-indigo-600 to-purple-600' },
  { value: 'blue', label: 'Modrá', gradient: 'from-blue-600 to-cyan-600' },
  { value: 'green', label: 'Zelená', gradient: 'from-green-600 to-emerald-600' },
  { value: 'red', label: 'Červená', gradient: 'from-red-600 to-pink-600' },
  { value: 'purple', label: 'Fialová', gradient: 'from-purple-600 to-fuchsia-600' },
  { value: 'orange', label: 'Oranžová', gradient: 'from-orange-600 to-amber-600' },
];

export default function ChannelSettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [channel, setChannel] = useState<Channel | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [description, setDescription] = useState('');
  const [themeColor, setThemeColor] = useState('indigo');
  const [isSavingAppearance, setIsSavingAppearance] = useState(false);

  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  // Validate slug format (alphanumeric + hyphens only, max 100 chars)
  const isValidSlug = (slug: string): boolean => {
    return /^[a-zA-Z0-9-]+$/.test(slug) && slug.length > 0 && slug.length <= 100;
  };

  const fetchData = async (currentUser: User) => {
    setLoading(true);

    // Validate slug format before querying database
    if (!isValidSlug(slug)) {
      setError('Neplatný formát kanálu');
      setTimeout(() => router.push('/dashboard'), 2000);
      return;
    }

    const { data: channelData } = await supabase
      .from('channels')
      .select('*')
      .eq('slug', slug)
      .single();
    if (!channelData) { router.push('/dashboard'); return; }
    setChannel(channelData);
    setDescription(channelData.description || '');
    setThemeColor(channelData.theme_color || 'indigo');

    const { data: memberData } = await supabase
      .from('channel_members')
      .select('role')
      .eq('channel_id', channelData.id)
      .eq('user_id', currentUser.id)
      .eq('role', 'owner')
      .single();

    if (!memberData) {
      setError('Pouze vlastník může spravovat nastavení kanálu.');
      setTimeout(() => router.push(`/dashboard/${slug}`), 2000);
      return;
    }

    const { data: membersData } = await supabase
      .from('channel_members')
      .select('id, role, users ( id, email )')
      .eq('channel_id', channelData.id);

    if (membersData) {
      // Transform Supabase data: extract first user from array
      // Use 'unknown' as intermediate type to satisfy TypeScript in build mode
      const transformedMembers: Member[] = (membersData as unknown as SupabaseMember[]).map(m => ({
        id: m.id,
        role: m.role,
        users: m.users && m.users.length > 0 ? m.users[0] : null
      }));
      setMembers(transformedMembers);
    }

    setLoading(false);
  };

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); }
      else { setUser(session.user); fetchData(session.user); }
    };
    fetchSession();
  }, [router, slug]);

  const handleSaveAppearance = async () => {
    if (!channel) return;

    setIsSavingAppearance(true);
    setMessage('');
    setError('');

    const { error: updateError } = await supabase
      .from('channels')
      .update({
        description,
        theme_color: themeColor,
      })
      .eq('id', channel.id);

    setIsSavingAppearance(false);

    if (updateError) {
      setError('Chyba při ukládání: ' + updateError.message);
    } else {
      setMessage('Vzhled kanálu byl úspěšně uložen!');
      setChannel({ ...channel, description, theme_color: themeColor });
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleInviteMember = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!channel) return;

    setMessage('');
    setError('');
    setIsInviting(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const role = formData.get('role') as 'owner' | 'admin';

    const { data, error: rpcError } = await supabase.rpc('add_member_by_email', {
      target_channel_id: channel.id,
      invited_email: email,
      member_role: role
    });

    setIsInviting(false);

    if (rpcError) {
      setError(`Chyba: ${rpcError.message}`);
    } else if (data?.error) {
      setError(`Chyba: ${data.error}`);
    } else {
      setMessage('Člen úspěšně přidán/aktualizován!');
      fetchData(user!);
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDeleteChannel = async () => {
    if (!channel) return;

    if (deleteConfirmText !== 'SMAZAT') {
      setError('Musíte napsat "SMAZAT" pro potvrzení');
      return;
    }

    setIsDeleting(true);

    const { error: deleteError } = await supabase
      .from('channels')
      .delete()
      .eq('id', channel.id);

    if (deleteError) {
      setError('Chyba při mazání kanálu: ' + deleteError.message);
      setIsDeleting(false);
    } else {
      setMessage('Kanál byl úspěšně smazán. Přesměrování...');
      setTimeout(() => router.push('/dashboard'), 2000);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Načítání nastavení...</p>
        </div>
      </div>
    );
  }

  if (!channel || !user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back Button */}
        <Link
          href={`/dashboard/${slug}`}
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-8 transition-colors group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Zpět na správu kanálu
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-4">
            <span className="text-2xl">⚙️</span>
            <span className="text-sm font-medium text-gray-600">
              Nastavení
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {channel.title}
          </h1>
          <p className="text-gray-600">
            /{channel.slug}
          </p>
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

        {/* Appearance Settings */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-3xl">🎨</div>
            <h2 className="text-2xl font-bold text-gray-900">Vzhled kanálu</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Popis kanálu
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                rows={3}
                placeholder="Krátký popis kanálu zobrazený na veřejné stránce..."
              />
              <p className="text-xs text-gray-500 mt-2">
                Tento popis se zobrazí nahoře na veřejné stránce vašeho kanálu
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Barevné téma
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {THEME_COLORS.map((theme) => (
                  <button
                    key={theme.value}
                    onClick={() => setThemeColor(theme.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      themeColor === theme.value
                        ? 'border-gray-900 bg-gray-50 ring-2 ring-gray-300'
                        : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`h-10 rounded bg-gradient-to-r ${theme.gradient} mb-2 shadow-md`}></div>
                    <p className="text-sm font-medium text-gray-900">{theme.label}</p>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Barva ovlivní vzhled tlačítek a odkazů na veřejné stránce
              </p>
            </div>

            <button
              onClick={handleSaveAppearance}
              disabled={isSavingAppearance}
              className={`w-full px-6 py-3 font-bold text-white bg-gradient-to-r ${
                THEME_COLORS.find(t => t.value === themeColor)?.gradient || THEME_COLORS[0].gradient
              } rounded-lg hover:opacity-90 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSavingAppearance ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Ukládání...
                </span>
              ) : (
                '💾 Uložit vzhled'
              )}
            </button>
          </div>
        </div>

        {/* Member Management */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-3xl">👥</div>
            <h2 className="text-2xl font-bold text-gray-900">Správa členů</h2>
          </div>

          {/* Invite Form */}
          <form onSubmit={handleInviteMember} className="space-y-5 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                E-mail uživatele
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="uzivatel@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <p className="text-xs text-gray-500 mt-2">
                Uživatel musí být již registrován v systému
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Role
              </label>
              <select
                name="role"
                defaultValue="admin"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="admin">⭐ Admin - může psát a mazat své příspěvky</option>
                <option value="owner">👑 Owner - má plnou kontrolu nad kanálem</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isInviting}
              className="w-full px-6 py-3 font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isInviting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Přidávání...
                </span>
              ) : (
                '➕ Pozvat / Aktualizovat roli'
              )}
            </button>
          </form>

          {/* Members List */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Aktuální členové ({members.length})
            </h3>
            {members.length > 0 ? (
              <div className="space-y-3">
                {members.map(mem => {
                  if (!mem.users) return null;
                  return (
                    <div
                      key={mem.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {mem.users.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{mem.users.email}</p>
                          {mem.users.id === user.id && (
                            <p className="text-xs text-gray-500">To jste vy</p>
                          )}
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        mem.role === 'owner'
                          ? 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700'
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        {mem.role === 'owner' ? '👑 Vlastník' : '⭐ Admin'}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Žádní členové</p>
            )}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-red-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-3xl">⚠️</div>
            <h2 className="text-2xl font-bold text-red-700">Nebezpečná zóna</h2>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
            <p className="text-red-700 text-sm">
              <strong>Varování:</strong> Smazáním kanálu dojde k <strong>nevratnému odstranění</strong> všech příspěvků, členů a veškerých dat spojených s tímto kanálem.
            </p>
          </div>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-6 py-3 font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all shadow-md hover:shadow-lg"
          >
            🗑️ Trvale smazat tento kanál
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🚨</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Opravdu smazat kanál?
                </h3>
                <p className="text-gray-600">
                  Tato akce je <strong>nevratná</strong>!
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
                <p className="text-red-700 text-sm font-medium mb-2">
                  Budou smazány:
                </p>
                <ul className="text-red-600 text-sm space-y-1 list-disc list-inside">
                  <li>Všechny příspěvky</li>
                  <li>Všichni členové</li>
                  <li>Veškerá nastavení</li>
                </ul>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Napište "SMAZAT" pro potvrzení:
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="SMAZAT"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmText('');
                    setError('');
                  }}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all disabled:opacity-50"
                >
                  Zrušit
                </button>
                <button
                  onClick={handleDeleteChannel}
                  disabled={isDeleting || deleteConfirmText !== 'SMAZAT'}
                  className="flex-1 px-4 py-3 font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Mazání...
                    </span>
                  ) : (
                    'Smazat navždy'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}