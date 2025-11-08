// app/about/page.tsx
'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-8 transition-colors group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Zpět na hlavní stránku
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-4">
            <span className="text-2xl">ℹ️</span>
            <span className="text-sm font-medium text-gray-600">
              O projektu
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Často kladené dotazy
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Vše, co potřebujete vědět o projektu Oznam to!
          </p>
        </div>

        {/* FAQ Section */}
        <div className="space-y-4 mb-12">
          {/* Proč tento projekt vznikl? */}
          <details className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <summary className="flex justify-between items-center p-6 font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 transition-colors">
              <span className="text-lg">Proč tento projekt vznikl?</span>
              <svg className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </summary>
            <div className="px-6 pb-6 text-gray-700 space-y-4 border-t border-gray-100 pt-4">
              <p>
                Oznam to! vznikl jako experiment s využitím umělé inteligence při vývoji webových aplikací.
                Cílem bylo otestovat, jak efektivně dokáže AI spolupracovat s člověkem na vytvoření plně funkční
                platformy od nuly.
              </p>
              <p>
                Projekt byl vytvořen postupným vývojem, kde každá funkce vznikala na základě zpětné vazby
                a požadavků. Díky tomu máme aplikaci, která je nejen funkční, ale také bezpečná, moderní
                a uživatelsky přívětivá.
              </p>
            </div>
          </details>

          {/* Jak byla aplikace vytvořena? */}
          <details className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <summary className="flex justify-between items-center p-6 font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 transition-colors">
              <span className="text-lg">Jak byla aplikace vytvořena?</span>
              <svg className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </summary>
            <div className="px-6 pb-6 text-gray-700 space-y-4 border-t border-gray-100 pt-4">
              <p className="font-semibold text-gray-900">Týmová spolupráce tří složek:</p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <p className="font-semibold text-gray-900">Váš nápad a vedení</p>
                    <p className="text-sm text-gray-600">
                      Kreativní myšlenka, požadavky na funkce a celkové směřování projektu
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🤖</span>
                  <div>
                    <p className="font-semibold text-gray-900">Google Gemini - MVP (základ)</p>
                    <p className="text-sm text-gray-600">
                      Vytvoření minimální funkční verze (MVP) aplikace s základními funkcemi
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <p className="font-semibold text-gray-900">Claude (Anthropic) - Rozšíření a vylepšení</p>
                    <p className="text-sm text-gray-600">
                      Přidání pokročilých funkcí, bezpečnostních prvků, optimalizace kódu a vytvoření moderního UI
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-indigo-500 p-4 rounded-lg mt-4">
                <p className="font-semibold text-gray-900 mb-2">Filozofie AI-asistovaného vývoje:</p>
                <p className="text-sm text-gray-700">
                  Tento projekt dokazuje, že AI je neuvěřitelně mocný nástroj pro vývoj software.
                  Nenahrazuje vývojáře, ale funguje jako skvělý "parťák", který zrychluje vývoj
                  a pomáhá řešit komplexní problémy. Kreativní a architektonické myšlení je stále na člověku,
                  ale AI dokáže skvěle realizovat to, co mu přesně zadáme.
                </p>
              </div>
            </div>
          </details>

          {/* Jaké technologie byly použity? */}
          <details className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <summary className="flex justify-between items-center p-6 font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 transition-colors">
              <span className="text-lg">Jaké technologie byly použity?</span>
              <svg className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </summary>
            <div className="px-6 pb-6 text-gray-700 border-t border-gray-100 pt-4">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-indigo-600 text-xl">⚛️</span>
                  <div>
                    <span className="font-semibold text-gray-900">Next.js 16 (App Router)</span>
                    <span className="text-sm text-gray-600"> - React framework pro moderní webové aplikace</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-600 text-xl">📘</span>
                  <div>
                    <span className="font-semibold text-gray-900">TypeScript</span>
                    <span className="text-sm text-gray-600"> - Type-safe JavaScript pro lepší kvalitu kódu</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-600 text-xl">🗄️</span>
                  <div>
                    <span className="font-semibold text-gray-900">Supabase</span>
                    <span className="text-sm text-gray-600"> - Backend as a Service (databáze + autentizace)</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-600 text-xl">🎨</span>
                  <div>
                    <span className="font-semibold text-gray-900">TailwindCSS 4</span>
                    <span className="text-sm text-gray-600"> - Utility-first CSS framework</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-600 text-xl">✏️</span>
                  <div>
                    <span className="font-semibold text-gray-900">TipTap</span>
                    <span className="text-sm text-gray-600"> - Rich text editor pro formátování obsahu</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-600 text-xl">🔒</span>
                  <div>
                    <span className="font-semibold text-gray-900">DOMPurify</span>
                    <span className="text-sm text-gray-600"> - Ochrana před XSS útoky</span>
                  </div>
                </li>
              </ul>
            </div>
          </details>

          {/* Je projekt open source? */}
          <details className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <summary className="flex justify-between items-center p-6 font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 transition-colors">
              <span className="text-lg">Je projekt open source?</span>
              <svg className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </summary>
            <div className="px-6 pb-6 text-gray-700 space-y-3 border-t border-gray-100 pt-4">
              <p>
                Ano! Oznam to! je plně open source projekt. Zdrojový kód je dostupný pro každého,
                kdo se chce podívat, jak funguje, nebo přispět vlastními vylepšeními.
              </p>
              <p>
                Projekt je zdarma a vždy takový zůstane. Není zde žádný business model,
                žádné skryté poplatky ani reklamy.
              </p>
            </div>
          </details>

          {/* Jak mohu podpořit projekt? */}
          <details className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <summary className="flex justify-between items-center p-6 font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 transition-colors">
              <span className="text-lg">Jak mohu podpořit projekt?</span>
              <svg className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </summary>
            <div className="px-6 pb-6 text-gray-700 space-y-4 border-t border-gray-100 pt-4">
              <p>
                Největší podporou je, když aplikaci používáte a sdílíte s ostatními.
                Ukažte světu, co dokáže spolupráce člověka a AI!
              </p>
              <p>
                Pokud byste chtěli podpořit autora finančně, můžete tak učinit na{' '}
                <Link href="/donate" className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline">
                  stránce s podporou
                </Link>
                . Každý příspěvek pomáhá financovat další experimenty s AI a rozvoj podobných projektů.
              </p>
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-500 p-4 rounded-lg">
                <p className="font-semibold text-gray-900 mb-2">Další způsoby podpory:</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>Sdílejte Oznam to! s přáteli a komunitami</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>Nahlaste chyby nebo navrhněte nové funkce</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>Napište recenzi nebo zpětnou vazbu</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>Přispějte do open source kódu na GitHubu</span>
                  </li>
                </ul>
              </div>
            </div>
          </details>
        </div>

        {/* Credits Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-8 shadow-xl mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Poděkování</h2>
          <p className="text-indigo-100 text-center max-w-2xl mx-auto">
            Tento projekt je důkazem toho, že budoucnost vývoje softwaru spočívá v symbióze
            člověka a umělé inteligence. Děkujeme všem, kdo Oznam to! používají a podporují!
          </p>
        </div>

        {/* Footer Links */}
        <div className="text-center">
          <div className="flex justify-center gap-6 text-sm">
            <Link href="/" className="text-indigo-600 hover:underline">
              Hlavní stránka
            </Link>
            <Link href="/privacy" className="text-indigo-600 hover:underline">
              Ochrana soukromí
            </Link>
            <Link href="/donate" className="text-indigo-600 hover:underline">
              Podpořit projekt
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
