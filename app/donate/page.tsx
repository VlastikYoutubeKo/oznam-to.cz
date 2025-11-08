// app/donate/page.tsx
'use client';

import Link from 'next/link';

export default function DonatePage() {
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
            <span className="text-2xl">💝</span>
            <span className="text-sm font-medium text-gray-600">
              Podpora projektu
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Podpořte Oznam to!
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Tento projekt je <strong>zcela zdarma</strong> a vždy takový zůstane. Pokud se vám líbí, můžete podpořit jeho další vývoj.
          </p>
        </div>

        {/* Free Service Highlight */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 mb-8 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="text-5xl">🎉</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                100% zdarma, žádné poplatky
              </h2>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Bez skrytých poplatků</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Bez limitů na počet kanálů nebo příspěvků</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Bez reklam</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Open source a transparentní</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Proč podpořit?</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Oznam to! je projekt vytvořený s láskou pro komunitu. Veškerý čas a úsilí věnované vývoju této platformy
                je dobrovolné. Vaše podpora mi pomáhá:
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-indigo-600 text-xl">🚀</span>
                  <span>Pokrýt provozní náklady (hosting, doména)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-600 text-xl">💻</span>
                  <span>Věnovat více času dalšímu vývoji a nových funkcí</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-600 text-xl">🔧</span>
                  <span>Udržovat platformu bezpečnou a aktuální</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-600 text-xl">☕</span>
                  <span>Koupit si občas kávu při pozdním ladění kódu</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Jak můžete přispět</h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Ko-fi */}
                <a
                  href="https://ko-fi.com/vlastimilnovotny"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 hover:shadow-lg transition-all hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md">
                      ☕
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        Ko-fi
                      </h3>
                      <p className="text-sm text-gray-600">Jednorázový příspěvek</p>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm mb-4">
                    Kupte mi virtuální kávu a podpořte projekt malou částkou dle vlastního uvážení.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-mono">ko-fi.com/vlastimilnovotny</span>
                    <svg className="w-5 h-5 text-indigo-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </a>

                {/* PayPal */}
                <a
                  href="https://paypal.me/mxnticek"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6 hover:shadow-lg transition-all hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md">
                      💳
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                        PayPal
                      </h3>
                      <p className="text-sm text-gray-600">Rychlý a bezpečný</p>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm mb-4">
                    Pošlete příspěvek přímo přes PayPal - rychlé, jednoduché a bezpečné.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-mono">paypal.me/mxnticek</span>
                    <svg className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </a>
              </div>
            </section>

            <section className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-500 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span>💡</span>
                Jiné způsoby podpory
              </h3>
              <ul className="space-y-2 text-gray-700 text-sm">
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
                  <span>Přispějte do open source kódu (GitHub)</span>
                </li>
              </ul>
            </section>

            <section className="text-center">
              <div className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-8 shadow-xl">
                <p className="text-2xl font-bold mb-2">
                  Děkuji za vaši podporu! 💜
                </p>
                <p className="text-indigo-100 text-sm">
                  Každý příspěvek, ať už malý nebo velký, znamená pro mě hodně.
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* Author Info */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md">
              VN
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Vlastimil Novotný</h3>
              <p className="text-gray-600 text-sm">Vývojář projektu Oznam to!</p>
              <p className="text-gray-500 text-xs mt-1">
                📧 <a href="mailto:admin@oznam-to.cz" className="hover:text-indigo-600">admin@oznam-to.cz</a>
              </p>
            </div>
          </div>
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
            <Link href="/dashboard" className="text-indigo-600 hover:underline">
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
