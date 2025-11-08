// app/dashboard/[slug]/page.tsx - NOVÁ VERZE
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';
import RichTextEditor from '@/components/RichTextEditor';
import SafeHTML from '@/components/SafeHTML';

type Channel = { id: string; title: string; slug: string; };
type Post = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  is_pinned: boolean;
  category: string | null;
  expires_at: string | null;
};
type Role = 'owner' | 'admin';

const CATEGORIES = [
  { value: '', label: '🏷️ Bez kategorie' },
  { value: 'info', label: 'ℹ️ Informace' },
  { value: 'warning', label: '⚠️ Upozornění' },
  { value: 'event', label: '📅 Událost' },
  { value: 'maintenance', label: '🔧 Údržba' },
];

const getCategoryStyle = (category: string | null) => {
  switch(category) {
    case 'warning': return 'bg-amber-50 border-l-4 border-amber-500';
    case 'event': return 'bg-blue-50 border-l-4 border-blue-500';
    case 'maintenance': return 'bg-purple-50 border-l-4 border-purple-500';
    case 'info': return 'bg-green-50 border-l-4 border-green-500';
    default: return 'bg-white border-l-4 border-gray-200';
  }
};

export default function ChannelAdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [channel, setChannel] = useState<Channel | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editExpiresAt, setEditExpiresAt] = useState('');
  
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
      alert('Neplatný formát kanálu');
      router.push('/dashboard');
      return;
    }
    const { data: channelData, error: channelError } = await supabase
      .from('channels')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (channelError || !channelData) { 
      alert('Kanál nenalezen'); 
      router.push('/dashboard'); 
      return; 
    }
    setChannel(channelData);

    const { data: memberData, error: memberError } = await supabase
      .from('channel_members')
      .select('role')
      .eq('channel_id', channelData.id)
      .eq('user_id', currentUser.id)
      .single();
      
    if (memberError || !memberData) { 
      alert('Nemáte přístup k tomuto kanálu'); 
      router.push('/dashboard'); 
      return; 
    }
    setRole(memberData.role as Role);

    const { data: postsData } = await supabase
      .from('posts')
      .select('*')
      .eq('channel_id', channelData.id)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });
    setPosts(postsData || []);
    
    setLoading(false);
  };

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
        fetchData(session.user);
      }
    };
    fetchSession();
  }, [router, slug]);

  const handleAddPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newPostContent.trim() || !user || !channel) return;

    setIsSubmitting(true);
    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_id: user.id,
        channel_id: channel.id,
        content: newPostContent,
        category: selectedCategory || null,
        expires_at: expiresAt || null,
      })
      .select()
      .single();

    if (data) {
      setPosts([data, ...posts]);
      setNewPostContent('');
      setSelectedCategory('');
      setExpiresAt('');

      // Send email notifications to subscribed users
      try {
        const response = await fetch('/api/notifications/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            channelSlug: slug,
            channelId: channel.id,
            postId: data.id,
            userId: user.id,
            postCategory: data.category,
          }),
        });

        const result = await response.json();
        if (response.ok) {
          console.log('Email notifications sent:', result);
          if (result.sent > 0) {
            console.log(`✉️ ${result.sent} notification(s) sent for channel "${result.channel}"`);
          }
        } else {
          console.error('Failed to send notifications:', result);
        }
      } catch (notifError) {
        console.error('Error sending notifications:', notifError);
        // Don't block the post creation if notification fails
      }
    } else {
      alert('Chyba při přidávání příspěvku: ' + error?.message);
    }
    setIsSubmitting(false);
  };

  const handleTogglePin = async (postId: string, currentState: boolean) => {
    if (role !== 'owner') {
      alert('Pouze vlastník může pinovat příspěvky');
      return;
    }

    const { data, error } = await supabase.rpc('toggle_pin_post', {
      post_id_to_pin: postId,
      pin_state: !currentState
    });

    if (error || data?.error) {
      alert('Chyba při pinování: ' + (error?.message || data?.error));
    } else {
      fetchData(user!);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Opravdu smazat tento příspěvek?')) return;

    setPosts(posts.filter((post) => post.id !== postId));
    const { error } = await supabase.from('posts').delete().eq('id', postId);

    if (error) {
      alert('Chyba při mazání: ' + error.message);
      fetchData(user!);
    }
  };

  const handleStartEdit = (post: Post) => {
    setEditingPostId(post.id);
    setEditContent(post.content);
    setEditCategory(post.category || '');
    setEditExpiresAt(post.expires_at ? new Date(post.expires_at).toISOString().slice(0, 16) : '');
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setEditContent('');
    setEditCategory('');
    setEditExpiresAt('');
  };

  const handleSaveEdit = async (postId: string) => {
    if (!editContent.trim()) return;

    const { error } = await supabase
      .from('posts')
      .update({
        content: editContent,
        category: editCategory || null,
        expires_at: editExpiresAt || null,
      })
      .eq('id', postId);

    if (error) {
      alert('Chyba při úpravě: ' + error.message);
    } else {
      setPosts(posts.map(p =>
        p.id === postId
          ? { ...p, content: editContent, category: editCategory || null, expires_at: editExpiresAt || null }
          : p
      ));
      handleCancelEdit();
    }
  };

  if (loading || !user || !channel || !role) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Načítání...</p>
        </div>
      </div>
    );
  }

  const pinnedPosts = posts.filter(p => p.is_pinned);
  const regularPosts = posts.filter(p => !p.is_pinned);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-5xl mx-auto p-6 lg:p-8">
        {/* Breadcrumb */}
        <Link href="/dashboard" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6 font-medium">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Zpět na přehled
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">{channel.title}</h1>
              <div className="flex items-center gap-3 text-sm">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-semibold">
                  {role === 'owner' ? '👑 Vlastník' : '⭐ Admin'}
                </span>
                <span className="text-gray-500">
                  {posts.length} {posts.length === 1 ? 'oznámení' : 'oznámení'}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <Link 
                href={`/${slug}`}
                target="_blank"
                className="px-5 py-2.5 font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                👁️ Náhled
              </Link>
              <Link 
                href={`/dashboard/${slug}/settings`} 
                className="px-5 py-2.5 font-medium text-white bg-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
              >
                ⚙️ Nastavení
              </Link>
            </div>
          </div>
        </div>

        {/* Formulář pro nový příspěvek */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">✍️ Nové oznámení</h2>
          <form onSubmit={handleAddPost} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategorie</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Datum vypršení (volitelné)
              </label>
              <input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Nechte prázdné pro trvalý příspěvek"
              />
              <p className="text-xs text-gray-500 mt-1">
                ⏰ Příspěvek se automaticky skryje po tomto datu
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Obsah</label>
              <RichTextEditor
                value={newPostContent}
                onChange={setNewPostContent}
                placeholder="Napište své oznámení..."
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting || !newPostContent.trim()}
              className="w-full px-6 py-3 font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {isSubmitting ? 'Přidávám...' : '📢 Publikovat oznámení'}
            </button>
          </form>
        </div>

        {/* Pinované příspěvky */}
        {pinnedPosts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              📌 Připnuté příspěvky
            </h2>
            <div className="space-y-4">
              {pinnedPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  user={user}
                  role={role}
                  onDelete={handleDeletePost}
                  onTogglePin={handleTogglePin}
                  onEdit={handleStartEdit}
                  isEditing={editingPostId === post.id}
                  editContent={editContent}
                  editCategory={editCategory}
                  editExpiresAt={editExpiresAt}
                  onEditContentChange={setEditContent}
                  onEditCategoryChange={setEditCategory}
                  onEditExpiresAtChange={setEditExpiresAt}
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={handleCancelEdit}
                />
              ))}
            </div>
          </div>
        )}

        {/* Běžné příspěvky */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">📋 Všechna oznámení</h2>
          {regularPosts.length === 0 && pinnedPosts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-300">
              <p className="text-gray-500 text-lg">Zatím žádné příspěvky</p>
              <p className="text-gray-400 text-sm mt-2">Začněte přidáním prvního oznámení ↑</p>
            </div>
          ) : regularPosts.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-2xl border border-gray-200">
              <p className="text-gray-500">Všechny příspěvky jsou připnuté</p>
            </div>
          ) : (
            <div className="space-y-4">
              {regularPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  user={user}
                  role={role}
                  onDelete={handleDeletePost}
                  onTogglePin={handleTogglePin}
                  onEdit={handleStartEdit}
                  isEditing={editingPostId === post.id}
                  editContent={editContent}
                  editCategory={editCategory}
                  editExpiresAt={editExpiresAt}
                  onEditContentChange={setEditContent}
                  onEditCategoryChange={setEditCategory}
                  onEditExpiresAtChange={setEditExpiresAt}
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={handleCancelEdit}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Komponenta pro kartu příspěvku
function PostCard({
  post,
  user,
  role,
  onDelete,
  onTogglePin,
  onEdit,
  isEditing,
  editContent,
  editCategory,
  editExpiresAt,
  onEditContentChange,
  onEditCategoryChange,
  onEditExpiresAtChange,
  onSaveEdit,
  onCancelEdit,
}: {
  post: Post;
  user: User;
  role: Role;
  onDelete: (id: string) => void;
  onTogglePin: (id: string, currentState: boolean) => void;
  onEdit: (post: Post) => void;
  isEditing: boolean;
  editContent: string;
  editCategory: string;
  editExpiresAt: string;
  onEditContentChange: (content: string) => void;
  onEditCategoryChange: (category: string) => void;
  onEditExpiresAtChange: (expiresAt: string) => void;
  onSaveEdit: (id: string) => void;
  onCancelEdit: () => void;
}) {
  const categoryLabel = CATEGORIES.find(c => c.value === post.category)?.label || '🏷️ Bez kategorie';

  if (isEditing) {
    return (
      <div className={`rounded-xl shadow-md p-6 ${getCategoryStyle(post.category)}`}>
        <h3 className="text-lg font-bold text-gray-900 mb-4">✏️ Upravit příspěvek</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategorie</label>
            <select
              value={editCategory}
              onChange={(e) => onEditCategoryChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Datum vypršení (volitelné)
            </label>
            <input
              type="datetime-local"
              value={editExpiresAt}
              onChange={(e) => onEditExpiresAtChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              ⏰ Příspěvek se automaticky skryje po tomto datu
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Obsah</label>
            <RichTextEditor
              value={editContent}
              onChange={onEditContentChange}
              placeholder="Upravte obsah..."
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onSaveEdit(post.id)}
              className="px-4 py-2 font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              💾 Uložit změny
            </button>
            <button
              onClick={onCancelEdit}
              className="px-4 py-2 font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              ❌ Zrušit
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl shadow-md p-6 transition-all hover:shadow-lg ${getCategoryStyle(post.category)}`}>
      <div className="flex justify-between items-start gap-4 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium px-2 py-1 bg-white rounded-full shadow-sm">
            {categoryLabel}
          </span>
          {post.is_pinned && (
            <span className="text-xs font-medium px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
              📌 Připnuto
            </span>
          )}
          {post.user_id === user.id && (
            <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
              ✏️ Váš příspěvek
            </span>
          )}
        </div>

        <div className="flex gap-2">
          {role === 'owner' && (
            <button
              onClick={() => onTogglePin(post.id, post.is_pinned)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title={post.is_pinned ? 'Odepnout' : 'Připnout'}
            >
              {post.is_pinned ? '📍' : '📌'}
            </button>
          )}
          {(role === 'owner' || post.user_id === user.id) && (
            <>
              <button
                onClick={() => onEdit(post)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Upravit"
              >
                ✏️
              </button>
              <button
                onClick={() => onDelete(post.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Smazat"
              >
                🗑️
              </button>
            </>
          )}
        </div>
      </div>

      <SafeHTML content={post.content} className="text-gray-800 mb-4" />

      <div className="text-xs text-gray-500 pt-3 border-t border-gray-200 space-y-1">
        <div>📅 Vytvořeno: {new Date(post.created_at).toLocaleString('cs-CZ')}</div>
        {post.expires_at && (
          <div className="flex items-center gap-1">
            ⏰ Vyprší: {new Date(post.expires_at).toLocaleString('cs-CZ')}
            {new Date(post.expires_at) < new Date() && (
              <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">
                VYPRŠELO
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}