import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

interface Channel {
  slug: string;
  created_at: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://oznam-to.cyn.cz';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/jak-funguje`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.6,
    },
  ];

  // Fetch all public channels from database
  let dynamicPages: MetadataRoute.Sitemap = [];

  try {
    // Create Supabase client inside the function
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: channels, error } = await supabase
        .from('channels')
        .select('slug, created_at')
        .order('created_at', { ascending: false });

      if (!error && channels) {
        dynamicPages = channels.map((channel: Channel) => ({
          url: `${baseUrl}/${channel.slug}`,
          lastModified: new Date(channel.created_at),
          changeFrequency: 'daily' as const,
          priority: 0.8,
        }));
      }
    }
  } catch (error) {
    console.error('Error fetching channels for sitemap:', error);
    // Return static pages even if database fetch fails
  }

  return [...staticPages, ...dynamicPages];
}
