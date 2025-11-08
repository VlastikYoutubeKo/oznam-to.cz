import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Jak funguje Oznam to! - Průvodce pro SVJ a bytová družstva',
  description: 'Kompletní návod, jak používat digitální oznámkovou desku pro společenství vlastníků jednotek, bytová družstva a správce bytových domů.',
  keywords: [
    'návod oznámková deska',
    'jak používat SVJ nástěnku',
    'průvodce bytové družstvo',
    'instrukce správce domu',
    'digitální nástěnka návod'
  ],
};

export default function JakFungujePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Jak funguje Oznam to!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Kompletní průvodce pro vytvoření a správu digitální oznámkové desky pro vaše SVJ nebo bytové družstvo
          </p>
        </div>

        {/* Step-by-step Guide */}
        <div className="space-y-12">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-indigo-600">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                1
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Registrace a vytvoření účtu
                </h2>
                <p className="text-gray-600 mb-4">
                  Začněte tím, že si vytvoříte bezplatný účet. Stačí email a heslo - žádné složité formuláře nebo ověřování.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Klikněte na tlačítko "Začít zdarma" na hlavní stránce</li>
                  <li>Vyplňte váš email a zvolte si bezpečné heslo</li>
                  <li>Okamžitě získáte přístup k dashboardu</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-purple-600">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                2
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Vytvoření kanálu pro vaše SVJ nebo družstvo
                </h2>
                <p className="text-gray-600 mb-4">
                  Kanál je vaše vlastní oznámková deska s unikátní adresou. Můžete jich vytvořit více - například jeden pro každou budovu.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Na dashboardu klikněte na "Nový kanál"</li>
                  <li>Zadejte název (např. "SVJ Dlouhá 123")</li>
                  <li>Zvolte slug - krátké URL (např. "svj-dlouha-123")</li>
                  <li>Váš kanál je okamžitě dostupný na oznam-to.cyn.cz/vas-slug</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-blue-600">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                3
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Přidání prvního oznámení
                </h2>
                <p className="text-gray-600 mb-4">
                  Použijte rich text editor k vytvoření profesionálně vypadajících oznámení s formátováním, odkazy a strukturou.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>V dashboardu kanálu klikněte na "Přidat nový příspěvek"</li>
                  <li>Napište obsah oznámení - můžete používat tučné písmo, seznamy, odkazy</li>
                  <li>Vyberte kategorii (Informace, Upozornění, Událost, Údržba)</li>
                  <li>Klikněte na "Vytvořit příspěvek"</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-green-600">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                4
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Sdílení s obyvateli
                </h2>
                <p className="text-gray-600 mb-4">
                  Veřejná stránka vašeho kanálu je přístupná bez přihlášení. Jednoduše sdílejte odkaz s obyvateli budovy.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Zkopírujte URL vašeho kanálu (oznam-to.cyn.cz/vas-slug)</li>
                  <li>Sdílejte odkaz emailem, v komunitní skupině nebo vylepte QR kód v budově</li>
                  <li>Obyvatelé mohou číst všechna oznámení bez nutnosti registrace</li>
                  <li>Stránka se automaticky aktualizuje při přidání nového oznámení</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-amber-600">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-amber-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                5
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Pokročilé funkce
                </h2>
                <p className="text-gray-600 mb-4">
                  Využijte další funkce pro efektivnější správu oznámení a spolupráci s dalšími členy výboru.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Připínání příspěvků:</strong> Důležitá oznámení můžete připnout nahoru pro lepší viditelnost</li>
                  <li><strong>Kategorie:</strong> Organizujte oznámení podle typu pro snadnější orientaci</li>
                  <li><strong>Více administrátorů:</strong> Přidejte další členy výboru jako adminy v nastavení kanálu</li>
                  <li><strong>Editace a mazání:</strong> Můžete upravit nebo smazat jakékoli oznámení</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Use Cases Section */}
        <div className="mt-16 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Praktické příklady použití
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6">
              <div className="text-3xl mb-3">📅</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Pozvánky na schůze SVJ</h3>
              <p className="text-gray-600 text-sm">
                Zveřejněte pozvánku na valnou hromadu s programem, datem a místem konání. Připněte ji nahoru pro maximální viditelnost.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6">
              <div className="text-3xl mb-3">🔧</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Plánované údržby a revize</h3>
              <p className="text-gray-600 text-sm">
                Informujte obyvatele o výlukách vody, elektřiny, revizích výtahů nebo čištění společných prostor s předstihem.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Změny v poplatcích</h3>
              <p className="text-gray-600 text-sm">
                Sdílejte informace o změnách v zálohách na služby, fondech oprav nebo mimořádných platbách.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6">
              <div className="text-3xl mb-3">⚠️</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Důležitá upozornění</h3>
              <p className="text-gray-600 text-sm">
                Rychlé informace o bezpečnostních incidentech, haváriích, změnách v pravidlech domu nebo domácího řádu.
              </p>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            💡 Tipy pro efektivní používání
          </h2>
          <div className="space-y-4 text-gray-700">
            <div className="flex items-start gap-3">
              <span className="text-green-600 text-xl">✓</span>
              <p><strong>Používejte kategorie konzistentně:</strong> Pomůže to obyvatelům rychle rozpoznat typ oznámení</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 text-xl">✓</span>
              <p><strong>Připínejte jen skutečně důležité věci:</strong> Příliš mnoho připnutých příspěvků snižuje jejich účinnost</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 text-xl">✓</span>
              <p><strong>Buďte struční a jasní:</strong> Lidé si přečtou krátká, dobře formátovaná oznámení spíše než dlouhé texty</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 text-xl">✓</span>
              <p><strong>Využívejte formátování:</strong> Nadpisy, seznamy a tučné písmo zlepšují čitelnost</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 text-xl">✓</span>
              <p><strong>Archivujte staré příspěvky:</strong> Pravidelně mažte neaktuální oznámení pro přehlednost</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 text-xl">✓</span>
              <p><strong>Sdílejte odpovědnost:</strong> Přidejte další členy výboru jako administrátory</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Připraveni začít?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Vytvořte si vlastní digitální oznámkovou desku během minuty
            </p>
            <Link
              href="/signup"
              className="inline-block px-10 py-4 text-lg font-bold text-indigo-600 bg-white rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl"
            >
              Začít zdarma
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
          >
            ← Zpět na hlavní stránku
          </Link>
        </div>
      </div>
    </div>
  );
}
