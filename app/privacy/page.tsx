// app/privacy/page.tsx
'use client';

import Link from 'next/link';

export default function PrivacyPage() {
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
            <span className="text-2xl">🔒</span>
            <span className="text-sm font-medium text-gray-600">
              Ochrana soukromí
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Zásady ochrany osobních údajů
          </h1>
          <p className="text-gray-600">
            Poslední aktualizace: {new Date().toLocaleDateString('cs-CZ')}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Úvod</h2>
            <p className="text-gray-700 leading-relaxed">
              Vítejte na platformě <strong>Oznam to!</strong>. Vážíme si vašeho soukromí a zavazujeme se chránit vaše osobní údaje.
              Tento dokument popisuje, jaké informace shromažďujeme, jak je používáme a jak je chráníme.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Správce osobních údajů</h2>
            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>Vlastimil Novotný</strong><br />
                Kontakt: <a href="mailto:admin@oznam-to.cz" className="text-indigo-600 hover:underline">admin@oznam-to.cz</a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Jaké údaje shromažďujeme</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-2">📧 Registrační údaje</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>E-mailová adresa</li>
                  <li>Heslo (šifrované)</li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-2">📝 Obsah vytvořený uživateli</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Názvy kanálů a jejich adresy (slugy)</li>
                  <li>Příspěvky a oznámení</li>
                  <li>Kategorie příspěvků</li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-2">🔍 Technické údaje</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>IP adresa (pro bezpečnostní účely)</li>
                  <li>Informace o prohlížeči a zařízení</li>
                  <li>Časové značky aktivit</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Jak používáme vaše údaje</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <span>Poskytování a provoz služby Oznam to!</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <span>Autentizace a autorizace uživatelů</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <span>Správa kanálů a příspěvků</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <span>Komunikace s uživateli (např. potvrzení registrace, obnova hesla)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <span>Zabezpečení platformy a prevence zneužití</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Sdílení údajů s třetími stranami</h2>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
              <p className="text-gray-700 mb-3">
                <strong>Vaše údaje NEPRODÁVÁME třetím stranám.</strong> Používáme však následující služby pro provoz platformy:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li><strong>Supabase</strong> - hosting databáze a autentizace</li>
                <li><strong>Vercel/vlastní server</strong> - hosting aplikace</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Vaše práva (GDPR)</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-2">🔍 Právo na přístup</h3>
                <p className="text-sm text-gray-600">Můžete požádat o kopii svých údajů</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-2">✏️ Právo na opravu</h3>
                <p className="text-sm text-gray-600">Můžete požádat o opravu nesprávných údajů</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-2">🗑️ Právo na výmaz</h3>
                <p className="text-sm text-gray-600">Můžete požádat o smazání svého účtu</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-2">📦 Právo na přenositelnost</h3>
                <p className="text-sm text-gray-600">Můžete získat své údaje ve strojově čitelném formátu</p>
              </div>
            </div>
            <p className="text-gray-700 mt-4">
              Pro uplatnění svých práv nás kontaktujte na: <a href="mailto:admin@oznam-to.cz" className="text-indigo-600 hover:underline font-medium">admin@oznam-to.cz</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Používáme pouze nezbytné cookies pro fungování autentizace (session cookies). Nepoužíváme reklamní ani analytické cookies třetích stran.
            </p>
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
              <p className="text-gray-700">
                ✓ <strong>Pouze nezbytné cookies</strong> - žádné sledování, žádná reklama
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Zabezpečení údajů</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-indigo-600">🔒</span>
                <span>Všechna hesla jsou hashována pomocí moderních algoritmů</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-600">🔒</span>
                <span>Komunikace probíhá přes šifrované HTTPS spojení</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-600">🔒</span>
                <span>Pravidelné bezpečnostní aktualizace</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-600">🔒</span>
                <span>Omezený přístup k osobním údajům (role-based access control)</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Doba uchování údajů</h2>
            <p className="text-gray-700 leading-relaxed">
              Vaše údaje uchováváme po dobu, po kterou máte aktivní účet. Po smazání účtu dojde k nevratnému odstranění všech vašich osobních údajů
              a souvisejících příspěvků do <strong>30 dnů</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Změny těchto zásad</h2>
            <p className="text-gray-700 leading-relaxed">
              Vyhrazujeme si právo aktualizovat tyto zásady. O významných změnách vás budeme informovat prostřednictvím e-mailu nebo oznámení na platformě.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Kontakt</h2>
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">
                Máte-li jakékoli dotazy ohledně ochrany vašich osobních údajů, neváhejte nás kontaktovat:
              </p>
              <div className="space-y-2">
                <p className="text-gray-900">
                  📧 <strong>E-mail:</strong> <a href="mailto:admin@oznam-to.cz" className="text-indigo-600 hover:underline">admin@oznam-to.cz</a>
                </p>
                <p className="text-gray-900">
                  🌐 <strong>Web:</strong> Oznam to!
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <div className="flex justify-center gap-6 text-sm">
            <Link href="/" className="text-indigo-600 hover:underline">
              Hlavní stránka
            </Link>
            <Link href="/donate" className="text-indigo-600 hover:underline">
              Podpořit projekt
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
