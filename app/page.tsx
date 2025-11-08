// app/page.tsx - Redesigned landing page
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    fetchSession();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-8">
            <span className="text-2xl">📢</span>
            <span className="text-sm font-medium text-gray-600">
              Moderní oznamovací systém
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Digitální oznámková deska pro SVJ a bytová družstva
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Moderní online nástěnka pro společenství vlastníků jednotek a správu bytových domů.
            Sdílejte oznámení, události a důležité informace s obyvateli rychle a přehledně.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {user ? (
              <Link
                href="/dashboard"
                className="px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                📊 Přejít na Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                >
                  🚀 Začít zdarma
                </Link>
                <Link
                  href="/login"
                  className="px-8 py-4 text-lg font-medium text-gray-700 bg-white rounded-xl hover:bg-gray-50 transition-all shadow-md"
                >
                  Přihlásit se
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Use Cases Section */}
        <div className="mb-20 max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
            Pro koho je Oznam to! určeno?
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Perfektní řešení pro komunikaci v rezidenčních budovách a komunitách
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
              <div className="text-4xl mb-3">🏢</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Společenství vlastníků jednotek (SVJ)
              </h3>
              <p className="text-gray-700">
                Informujte vlastníky o schůzích, hlasováních, opravách společných prostor, změnách v předpisech a plánované údržbě.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
              <div className="text-4xl mb-3">🏘️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Bytová družstva
              </h3>
              <p className="text-gray-700">
                Sdílejte informace o revizích, výlukách, akcích družstva a důležitých oznámeních pro všechny členy.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
              <div className="text-4xl mb-3">🏠</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Správci bytových domů
              </h3>
              <p className="text-gray-700">
                Centralizované místo pro všechna oznámení - od výměny výtahů po čištění společných prostor.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 border border-orange-100">
              <div className="text-4xl mb-3">🏘️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Bytové komunity a rezidence
              </h3>
              <p className="text-gray-700">
                Organizujte společenské akce, sdílejte novinky a koordinujte aktivity mezi sousedy.
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Rychlé nastavení</h3>
            <p className="text-gray-600">
              Vytvořte si kanál během vteřin. Žádné složité formuláře ani čekání.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-5xl mb-4">✨</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Rich text editor</h3>
            <p className="text-gray-600">
              Formátujte text, přidávejte odkazy a strukturujte obsah jako profesionál.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-5xl mb-4">🔒</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Bezpečné</h3>
            <p className="text-gray-600">
              Ochrana před XSS útoky, autentizace a role-based přístup.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-5xl mb-4">📌</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Připínání příspěvků</h3>
            <p className="text-gray-600">
              Důležité oznámení můžete připnout nahoru pro lepší viditelnost.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-5xl mb-4">🏷️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Kategorie</h3>
            <p className="text-gray-600">
              Organizujte oznámení podle typu: informace, upozornění, události.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-5xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Týmová spolupráce</h3>
            <p className="text-gray-600">
              Přidávejte další členy týmu jako administrátory vašeho kanálu.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12 max-w-3xl mx-auto border border-gray-100">
            {user ? (
              <>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Vítejte zpět!
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Vytvořte nový kanál nebo spravujte své stávající oznámení.
                </p>
                <Link
                  href="/dashboard"
                  className="inline-block px-10 py-4 text-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                >
                  📊 Přejít na Dashboard
                </Link>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Připraveni začít?
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Zaregistrujte se zdarma a vytvořte svou první nástěnku během minuty.
                </p>
                <Link
                  href="/signup"
                  className="inline-block px-10 py-4 text-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Vytvořit účet zdarma
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              © 2025 Oznam to! - Zcela zdarma a open source
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/jak-funguje" className="text-indigo-600 hover:text-indigo-700 hover:underline transition-colors">
                📖 Jak to funguje
              </Link>
              <Link href="/about" className="text-indigo-600 hover:text-indigo-700 hover:underline transition-colors">
                ℹ️ O projektu
              </Link>
              <Link href="/privacy" className="text-indigo-600 hover:text-indigo-700 hover:underline transition-colors">
                🔒 Ochrana soukromí
              </Link>
              <Link href="/donate" className="text-indigo-600 hover:text-indigo-700 hover:underline transition-colors">
                💝 Podpořit projekt
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}