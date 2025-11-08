// app/dashboard/settings/page.tsx - Redirect to new subscriptions page
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new subscriptions page
    router.replace('/dashboard/subscriptions');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Přesměrování na správu odběrů...</p>
      </div>
    </div>
  );
}
