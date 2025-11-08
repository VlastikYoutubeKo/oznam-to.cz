// app/[slug]/page.jsx - NOVÁ VEŘEJNÁ VERZE
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useParams } from 'next/navigation';
import SafeHTML from '@/components/SafeHTML';
import ChannelSubscription from '@/components/ChannelSubscription';

const CATEGORIES = {
  info: { label: 'ℹ️ Informace', color: 'green' },
  warning: { label: '⚠️ Upozornění', color: 'amber' },
  event: { label: '📅 Událost', color: 'blue' },
  maintenance: { label: '🔧 Údržba', color: 'purple' },
};

const getCategoryStyle = (category) => {
  switch(category) {
    case 'warning': return 'bg-amber-50 border-l-4 border-amber-400';
    case 'event': return 'bg-blue-50 border-l-4 border-blue-400';
    case 'maintenance': return 'bg-purple-50 border-l-4 border-purple-400';
    case 'info': return 'bg-green-50 border-l-4 border-green-400';
    default: return 'bg-white border-l-4 border-gray-300';
  }
};

export default function ChannelPage() {
  const [channel, setChannel] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const params = useParams();

  // Validate slug format (alphanumeric + hyphens only, max 100 chars)
  const isValidSlug = (slug) => {
    return /^[a-zA-Z0-9-]+$/.test(slug) && slug.length > 0 && slug.length <= 100;
  };

  useEffect(() => {
    const fetchChannelData = async () => {
      const { slug } = params;
      if (!slug) return;

      // Validate slug format before querying database
      if (!isValidSlug(slug)) {
        setError('Neplatný formát kanálu.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const { data: channelData, error: channelError } = await supabase
        .from('channels')
        .select('*')
        .eq('slug', slug)
        .single();

      if (channelError || !channelData) {
        setError('Kanál nenalezen.');
        setLoading(false);
        return;
      }
      setChannel(channelData);

      const { data: postsData } = await supabase
        .from('posts')
        .select('*')
        .eq('channel_id', channelData.id)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });
      setPosts(postsData || []);
      setLoading(false);
    };
    fetchChannelData();
  }, [params]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Načítání kanálu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Kanál nenalezen</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // Filter out expired posts from public view
  const now = new Date();
  const activePosts = posts.filter(p => !p.expires_at || new Date(p.expires_at) > now);

  const pinnedPosts = activePosts.filter(p => p.is_pinned);
  const regularPosts = activePosts.filter(p => !p.is_pinned);

  const filteredPosts = filter === 'all'
    ? regularPosts
    : regularPosts.filter(p => p.category === filter);

  const availableCategories = [...new Set(posts.map(p => p.category).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
            {channel.title}
          </h1>
          <p className="text-xl text-gray-600 flex items-center justify-center gap-2">
            📢 Veřejná nástěnka
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
            <span className="text-sm text-gray-600">
              {posts.length} {posts.length === 1 ? 'oznámení' : posts.length < 5 ? 'oznámení' : 'oznámení'}
            </span>
          </div>
        </div>

        {/* Subscription Component */}
        <div className="mb-8">
          <ChannelSubscription
            channelId={channel.id}
            channelTitle={channel.title}
            channelSlug={channel.slug}
          />
        </div>

        {/* Filtr kategorií */}
        {availableCategories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
              }`}
            >
              🏷️ Vše
            </button>
            {availableCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  filter === cat
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
                }`}
              >
                {CATEGORIES[cat]?.label || cat}
              </button>
            ))}
          </div>
        )}

        {/* Pinované příspěvky */}
        {pinnedPosts.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-3xl">📌</span>
              Důležitá oznámení
            </h2>
            <div className="space-y-6">
              {pinnedPosts.map((post) => (
                <PostCard key={post.id} post={post} isPinned />
              ))}
            </div>
          </div>
        )}

        {/* Běžné příspěvky */}
        <div>
          {pinnedPosts.length > 0 && (
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-3xl">📋</span>
              Další oznámení
            </h2>
          )}
          
          {filteredPosts.length > 0 ? (
            <div className="space-y-6">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg border-2 border-dashed border-gray-300">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-xl text-gray-600 font-medium mb-2">
                Zatím zde nejsou žádná oznámení
              </p>
              <p className="text-gray-500">
                Buďte první, kdo přidá nové oznámení!
              </p>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
              <p className="text-gray-600">
                V této kategorii nejsou žádné příspěvky
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Komponenta pro kartu příspěvku
function PostCard({ post, isPinned = false }) {
  const categoryData = CATEGORIES[post.category];
  
  return (
    <article 
      className={`rounded-2xl shadow-lg p-8 transition-all hover:shadow-xl ${getCategoryStyle(post.category)}`}
    >
      <div className="flex flex-wrap gap-2 mb-4">
        {categoryData && (
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-white rounded-full shadow-sm">
            {categoryData.label}
          </span>
        )}
        {isPinned && (
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-full">
            📌 Připnuto
          </span>
        )}
      </div>

      <div className="prose prose-lg max-w-none mb-6">
        <SafeHTML content={post.content} />
      </div>

      <footer className="text-sm text-gray-500 pt-4 border-t border-gray-200 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {new Date(post.created_at).toLocaleString('cs-CZ', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </footer>
    </article>
  );
}