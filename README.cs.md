# 📢 Oznam to! - Digitální oznámková deska

**Verze:** `v0.2-beta-claude-fixes`

🇨🇿 Česká verze | [🇬🇧 English version](./README.md)

**Oznam to!** je moderní platforma pro digitální oznámkové desky určená pro společenství vlastníků jednotek (SVJ), bytová družstva, správce domů a komunity. Vytvářejte veřejné kanály s vlastními URL adresami, spravujte příspěvky s formátovaným textem a automaticky upozorněte odběratele e-mailem.

🌐 **Live demo**: [https://oznam-to.cyn.cz](https://oznam-to.cyn.cz)

---

## ✨ Funkce

### Základní funkce
- **📋 Veřejné oznámkové kanály** - Vytvářejte kanály s vlastními slogy (např. `/vas-kanal`)
- **✍️ Textový editor** - Formátujte příspěvky s nadpisy, seznamy, odkazy, kódem a dalším
- **📧 E-mailová oznámení na kanál** - Odběr jednotlivých kanálů s filtrováním kategorií
- **🔐 Řízení přístupu na základě rolí** - Role vlastníka a administrátora pro správu kanálů
- **📌 Připnutí důležitých příspěvků** - Zvýrazněte důležitá oznámení v horní části
- **🏷️ Kategorie příspěvků** - Organizujte příspěvky: Informace, Upozornění, Událost, Údržba
- **👥 Správa uživatelů** - Autentizace přes e-mail a heslo s Supabase
- **🎨 Krásný design** - Responzivní rozhraní s moderním stylováním
- **🔒 Bezpečnost** - Ochrana proti XSS s DOMPurify HTML sanitizací

### 🆕 Novinky ve verzi v0.2-beta-claude-fixes

#### Správa příspěvků
- **✏️ Úprava příspěvků** - Aktualizace obsahu, kategorie a expirace po publikování
- **🗑️ Mazání příspěvků** - Odstranění příspěvků s potvrzením (vlastníci + autoři)
- **⏰ Expirace příspěvků** - Volitelné datum expirace pro automatické skrytí příspěvků
- **📅 Sledování expirace** - Vizuální indikátory expirovaných příspěvků v dashboardu

#### Přizpůsobení kanálu
- **📝 Popisy kanálů** - Přidejte text záhlaví zobrazený na veřejných stránkách
- **🎨 Barevná témata** - Vyberte si z 6 barevných schémat (Indigo, Modrá, Zelená, Červená, Fialová, Oranžová)
- **⚙️ Pokročilá nastavení** - Vyhrazená stránka nastavení pro přizpůsobení vzhledu

#### Vylepšení e-mailového systému
- **📬 Odběry na kanál** - Přihlaste se k odběru libovolného kanálu nezávisle
- **🔔 Filtrování kategorií** - Vyberte, jaké typy příspěvků chcete dostávat (info, varování, událost, údržba)
- **📊 Správa odběrů** - Centralizovaný dashboard pro správu všech odběrů
- **✉️ Krásné e-mailové šablony** - Responzivní HTML e-maily s českou lokalizací

#### Vylepšení mobilní verze a UX
- **📱 Hamburger menu** - Mobilně responzivní navigace s plynulými animacemi
- **🎯 Lepší navigace** - Vylepšené záhlaví s dedikovaným odkazem na správu odběrů
- **💅 Vylepšené UI** - Vylepšené formuláře a lepší vizuální hierarchie

#### Vylepšení pro vývojáře
- **📦 Nastavení databáze jedním kliknutím** - Jeden SQL soubor (`00_COMPLETE_SETUP.sql`) pro okamžité nasazení
- **📚 Komplexní dokumentace** - Aktualizovaný CLAUDE.md se všemi novými funkcemi
- **🔒 Posílení zabezpečení** - Opravená autentizace, validace vstupu, prevence XSS
- **🛡️ Bezpečnostní pokyny** - Kompletní SECURITY.md s osvědčenými postupy

---

## 🛠️ Technologie

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Jazyk**: [TypeScript](https://www.typescriptlang.org/) + React 19
- **Databáze**: [Supabase](https://supabase.com/) (PostgreSQL + Auth)
- **Textový editor**: [TipTap](https://tiptap.dev/) WYSIWYG editor
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **E-mail**: [Resend](https://resend.com/) nebo vlastní SMTP (nodemailer)
- **Bezpečnost**: [DOMPurify](https://github.com/cure53/DOMPurify) pro ochranu proti XSS

---

## 🚀 Rychlý start

### Požadavky

- Node.js 18+ a npm
- Supabase účet (zdarma funguje skvěle)
- E-mailová služba: Resend účet NEBO vlastní SMTP server

### 1. Klonování a instalace

```bash
git clone https://github.com/VlastikYoutubeKo/gemini-oznam_to.cz
cd gemini-oznam_to.cz
npm install
```

### 2. Konfigurace prostředí

Vytvořte soubor `.env.local`:

```env
# Supabase konfigurace
NEXT_PUBLIC_SUPABASE_URL=vase_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=vas_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=vas_supabase_service_role_key

# E-mailová služba (vyberte jednu)
EMAIL_SERVICE=smtp  # nebo 'resend'

# Možnost A: Vlastní SMTP (doporučeno pro self-hosting)
SMTP_HOST=smtp.seznam.cz
SMTP_PORT=465
SMTP_USER=vas_email@seznam.cz
SMTP_PASS=vase_heslo
SMTP_SECURE=false
SMTP_FROM_EMAIL=noreply@example.cz
SMTP_FROM_NAME=Oznam to!

# Možnost B: Resend (doporučeno pro cloud)
# RESEND_API_KEY=re_vas_api_klic
# RESEND_FROM_EMAIL=noreply@example.cz
```

### 3. Nastavení databáze

**Novinka ve v0.2**: Nastavení jedním kliknutím!

1. Přejděte do svého Supabase projektu → SQL Editor
2. Zkopírujte celý soubor `database/00_COMPLETE_SETUP.sql`
3. Vložte a spusťte
4. Hotovo! ✅

Tím se vytvoří:
- Všechny tabulky (channels, posts, channel_members, channel_subscriptions)
- Indexy pro výkon
- Row Level Security politiky
- Databázové funkce (toggle_pin_post, add_member_by_email)
- Triggery pro automatickou aktualizaci časových razítek

📖 **Viz `database/README.md` pro detailní dokumentaci schématu**

### 4. Spuštění vývojového serveru

```bash
npm run dev
```

Otevřete [http://localhost:3000](http://localhost:3000)

### 5. Test e-mailové konfigurace

```bash
npm run test:email vas@email.cz
```

---

## 📖 Použití

### Vytvoření kanálu

1. Zaregistrujte se a přihlaste se
2. Přejděte na **Dashboard**
3. Klikněte na **Vytvořit nový kanál**
4. Zadejte název kanálu a unikátní slug
5. Sdílejte veřejnou URL: `https://oznam-to.cyn.cz/vas-slug`

### Publikování oznámení

1. Přejděte na **Dashboard** → Váš kanál
2. Vyberte kategorii (Informace, Upozornění, Událost, Údržba)
3. (Volitelně) Nastavte datum expirace pro časově omezené příspěvky
4. Napište své oznámení s formátovaným textem
5. Klikněte na **Publikovat**
6. Odběratelé obdrží e-mailové oznámení na základě jejich nastavení

### Úprava a mazání příspěvků

**Novinka ve v0.2**:
- Klikněte na tlačítko **✏️ Upravit** u libovolného příspěvku (vlastníci + autoři příspěvků)
- Aktualizujte obsah, kategorii nebo datum expirace
- Klikněte na **💾 Uložit** nebo **❌ Zrušit**
- Klikněte na **🗑️ Smazat** pro odstranění příspěvků (s potvrzením)

### Přizpůsobení kanálu

**Novinka ve v0.2**:
1. Přejděte na **Dashboard** → Váš kanál → **⚙️ Nastavení**
2. V sekci **🎨 Vzhled**:
   - Přidejte popis kanálu (zobrazený na veřejné stránce)
   - Vyberte barevné téma z 6 možností
3. Klikněte na **💾 Uložit** pro použití změn

### Správa e-mailových odběrů

**Novinka ve v0.2 - Odběry na kanál**:

**Pro uživatele:**
1. Klikněte na **🔔 Odběry** v hlavičce
2. Zobrazte všechny kanály, které odebíráte
3. Přepněte oznámení ZAP/VYP pro každý kanál
4. Vyberte, jaké kategorie chcete dostávat (nebo "Vše")
5. Odhlaste se z kanálů, které vás nezajímají

**Přihlášení k odběru kanálu:**
1. Navštivte libovolnou veřejnou stránku kanálu (např. `/vas-kanal`)
2. Najděte box odběru na stránce
3. Zadejte svůj e-mail a vyberte kategorie
4. Klikněte na **Přihlásit k odběru**

### Uživatelské role

- **Vlastník (Owner)** - Plná kontrola, může připínat příspěvky, spravovat administrátory
- **Administrátor (Admin)** - Může vytvářet a mazat příspěvky

---

## 📧 Možnosti e-mailové služby

### Možnost 1: Vlastní SMTP (doporučeno pro self-hosting)

Použijte svůj stávající e-mailový server:

```env
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.seznam.cz
SMTP_PORT=587
SMTP_USER=vas_email@seznam.cz
SMTP_PASS=vase_heslo
SMTP_SECURE=false
SMTP_FROM_EMAIL=noreply@example.cz
SMTP_FROM_NAME=Oznam to!
```

#### Populární SMTP poskytovatelé

**Gmail** (500 e-mailů/den zdarma, 2 000/den s Workspace)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=vas_email@gmail.com
SMTP_PASS=vase_16_znakove_heslo_aplikace  # Vyžaduje 2FA + heslo aplikace
SMTP_SECURE=false
```
[Jak vytvořit heslo aplikace Gmail](https://myaccount.google.com/apppasswords)

**Outlook / Office 365**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=vas_email@outlook.com
SMTP_PASS=vase_heslo
SMTP_SECURE=false
```

**SendGrid** (100 e-mailů/den zdarma)
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey  # Doslova "apikey"
SMTP_PASS=vas_sendgrid_api_klic
SMTP_SECURE=false
```

**cPanel / Sdílený hosting** (Wedos, Forpsi, Hostinger)
```env
SMTP_HOST=mail.vase-domena.cz
SMTP_PORT=465
SMTP_USER=oznamto@vase-domena.cz
SMTP_PASS=vase_heslo_emailu
SMTP_SECURE=true  # Povinné pro port 465
```

**Seznam.cz**
```env
SMTP_HOST=smtp.seznam.cz
SMTP_PORT=465
SMTP_USER=vas_email@seznam.cz
SMTP_PASS=vase_heslo
SMTP_SECURE=true
```

**Reference portů:**
- Port 587 (STARTTLS) - Doporučeno, použijte `SMTP_SECURE=false`
- Port 465 (SSL) - Použijte `SMTP_SECURE=true`
- Port 25 - Často blokován poskytovateli internetu

### Možnost 2: Resend (doporučeno pro cloud hosting)

Moderní e-mailová API služba:

```env
EMAIL_SERVICE=resend
RESEND_API_KEY=re_vas_api_klic
RESEND_FROM_EMAIL=noreply@vase-domena.cz
```

**Výhody:**
- 3 000 e-mailů/měsíc zdarma
- Snadné ověření domény na [resend.com](https://resend.com)
- Vestavěný analytický dashboard
- Vynikající doručitelnost
- Žádná údržba serveru

**Kroky nastavení:**
1. Zaregistrujte se na [resend.com](https://resend.com)
2. Přidejte svou doménu a ověřte DNS záznamy
3. Vytvořte API klíč (začíná na `re_`)
4. Přidejte do `.env.local`

### Tipy pro doručitelnost e-mailů

Aby se e-maily nedostávaly do spamu:

1. **Nakonfigurujte SPF záznam** (přidejte do DNS):
   ```
   Typ: TXT
   Název: @
   Hodnota: v=spf1 include:_spf.google.com ~all
   ```
   (Nahraďte SPF záznamem vašeho poskytovatele)

2. **Povolte DKIM** - Viz dokumentace vašeho poskytovatele e-mailů

3. **Přidejte DMARC záznam** (přidejte do DNS):
   ```
   Typ: TXT
   Název: _dmarc
   Hodnota: v=DMARC1; p=quarantine; rua=mailto:admin@vasedomena.cz
   ```

4. **Používejte ověřené adresy odesílatele** - `SMTP_FROM_EMAIL` musí odpovídat vaší ověřené doméně

---

## 🏗️ Struktura projektu

```
oznam-to/
├── app/
│   ├── api/
│   │   ├── notifications/send/        # API pro e-mailová oznámení (zabezpečeno)
│   │   └── subscriptions/             # API pro správu odběrů
│   ├── dashboard/
│   │   ├── [slug]/                    # Administrační stránky kanálu
│   │   │   └── settings/              # Přizpůsobení kanálu
│   │   ├── settings/                  # Uživatelská nastavení (přesměruje na odběry)
│   │   └── subscriptions/             # Správa odběrů uživatele
│   ├── [slug]/                        # Veřejné zobrazení kanálu
│   ├── about/                         # O projektu & FAQ
│   ├── admin/                         # Administrátorský panel (omezený přístup)
│   ├── donate/                        # Stránka s podporou projektu
│   ├── privacy/                       # Zásady ochrany soukromí & GDPR
│   ├── forgot-password/               # Žádost o obnovení hesla
│   ├── reset-password/                # Potvrzení obnovení hesla
│   ├── jak-funguje/                   # Návod jak to funguje
│   ├── login/                         # Přihlašovací stránka
│   ├── signup/                        # Registrace uživatele
│   ├── layout.tsx                     # Hlavní layout s metadaty
│   ├── page.tsx                       # Úvodní stránka
│   ├── robots.ts                      # Generátor robots.txt
│   └── sitemap.ts                     # Generátor sitemap
├── components/
│   ├── Header.tsx                     # Navigace (s hamburger menu)
│   ├── RichTextEditor.tsx             # TipTap editor
│   ├── SafeHTML.tsx                   # Sanitizovaný HTML renderer
│   └── ChannelSubscription.tsx        # Widget odběru
├── lib/
│   ├── supabaseClient.js              # Supabase singleton
│   ├── emailService.ts                # Jednotná e-mailová služba
│   ├── emailTemplates.ts              # HTML šablony e-mailů (XSS-safe)
│   └── sanitize.ts                    # Konfigurace DOMPurify
├── database/
│   ├── 00_COMPLETE_SETUP.sql          # 🆕 Nastavení databáze jedním kliknutím
│   └── README.md                      # Dokumentace databáze
├── SECURITY.md                        # 🆕 Bezpečnostní pokyny
├── CLAUDE.md                          # 🆕 Aktualizovaný průvodce pro vývojáře
└── .env.local                         # Proměnné prostředí (v .gitignore)
```

### 🗺️ Mapa stránek

**Veřejné stránky:**
- `/` - Úvodní stránka s funkcemi a FAQ
- `/jak-funguje` - Návod jak to funguje
- `/about` - O projektu & rozšířené FAQ
- `/privacy` - Zásady ochrany soukromí & GDPR
- `/donate` - Podpora projektu (Ko-fi, PayPal)
- `/[slug]` - Veřejné zobrazení kanálu (např. `/muj-kanal`)

**Autentizace:**
- `/login` - Přihlášení uživatele
- `/signup` - Registrace uživatele
- `/forgot-password` - Žádost o obnovení hesla
- `/reset-password` - Potvrzení obnovení hesla

**Uživatelský dashboard:**
- `/dashboard` - Seznam kanálů & vytvoření kanálu
- `/dashboard/subscriptions` - Správa e-mailových odběrů
- `/dashboard/[slug]` - Správa kanálu (vytváření/úprava/mazání příspěvků)
- `/dashboard/[slug]/settings` - Přizpůsobení kanálu

**Administrátorský panel:**
- `/admin` - Zobrazení všech kanálů (omezený přístup na admin email)

---

## 🔒 Bezpečnost

### Co je zabezpečeno ve v0.2

✅ **Ochrana proti XSS**
- Veškerý uživatelem generovaný HTML sanitizován pomocí DOMPurify
- Escapování HTML v e-mailových šablonách
- Přísný whitelist povolených tagů a atributů

✅ **Ochrana proti SQL injection**
- Všechny dotazy používají parametrizaci klienta Supabase
- Validace vstupu pro slugy kanálů (pouze alfanumerické znaky + pomlčky)

✅ **Autentizace a autorizace**
- API routy ověřují členství uživatele před odesláním oznámení
- Kontroly relací na všech chráněných routách
- Vynucované řízení přístupu na základě rolí

✅ **Zabezpečení databáze**
- Row Level Security (RLS) povoleno na všech tabulkách
- Uživatelé mají přístup pouze k datům svých kanálů

✅ **Zabezpečení e-mailů**
- SMTP přihlašovací údaje uloženy v proměnných prostředí
- TLS/SSL šifrování pro přenos e-mailů
- Žádná citlivá data v těle e-mailu

📖 **Viz `SECURITY.md` pro:**
- Průvodce implementací rate limitingu
- Nastavení Content Security Policy
- Konfigurace SPF/DKIM/DMARC
- Kontrolní seznam pro produkci

---

## 🚢 Nasazení

### Kontrolní seznam pro produkci

1. **Migrace databáze**
   - Spusťte `database/00_COMPLETE_SETUP.sql` v Supabase SQL Editoru ✅

2. **Proměnné prostředí**
   - Nastavte všechny požadované proměnné na vaší hostingové platformě
   - Ověřte, že `.env.local` je v `.gitignore` ✅

3. **Build aplikace**
   ```bash
   npm run build
   npm run start
   ```

4. **Konfigurace e-mailové služby**
   - Ověřte doménu pro Resend (pokud používáte)
   - Otestujte SMTP připojení: `npm run test:email`

5. **Posílení zabezpečení** (volitelné, ale doporučené)
   - Implementujte rate limiting (viz `SECURITY.md`)
   - Přidejte CSP headery (viz `SECURITY.md`)
   - Nakonfigurujte SPF/DKIM/DMARC pro e-mailovou doménu

6. **Monitoring**
   - Kontrolujte logy doručování e-mailů
   - Sledujte využití Supabase
   - Kontrolujte error logy

### Platformy pro nasazení

**Vercel (doporučeno)**
```bash
vercel --prod
```

**Self-hosted**
```bash
npm run build
pm2 start npm --name oznam-to -- start
```

**Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 📚 Dokumentace

### Začínáme
- **`README.md`** - Tento soubor, průvodce rychlým startem
- **`database/README.md`** - Schéma a nastavení databáze
- **`SECURITY.md`** - Osvědčené postupy zabezpečení

### Průvodce nastavením
- Konfigurace e-mailů - viz sekce "📧 Možnosti e-mailové služby" výše

### Vývojářská dokumentace
- **`CLAUDE.md`** - Kompletní průvodce pro vývojáře se všemi funkcemi

---

## 🧪 Testování

### Spuštění testu e-mailu
```bash
npm run test:email vas@email.cz
```

### Kontrolní seznam manuálního testování (v0.2)
- [ ] Registrace a přihlášení uživatele
- [ ] Vytvoření kanálu
- [ ] Přizpůsobení kanálu (popis + barevné téma)
- [ ] Publikování příspěvku s formátovaným textem
- [ ] Úprava existujícího příspěvku
- [ ] Mazání příspěvku
- [ ] Nastavení data expirace příspěvku
- [ ] Připnutí/odepnutí příspěvků (jako vlastník)
- [ ] Přihlášení k odběru kanálu z veřejné stránky
- [ ] Správa odběrů v dashboardu
- [ ] E-mailové oznámení obdrženo
- [ ] Responzivní design pro mobily (hamburger menu)
- [ ] Stránka nastavení funguje

---

## 🤝 Příspěvky

Toto je vlastní projekt pro SVJ/bytová družstva. Pokud chcete přispět:

1. Forkněte repozitář
2. Vytvořte feature branch
3. Proveďte své změny
4. Důkladně otestujte
5. Odešlete pull request

---

## 📄 Licence

Tento projekt je proprietární software. Všechna práva vyhrazena.

---

## 🆘 Podpora

Pro problémy nebo dotazy:

1. Zkontrolujte dokumentační soubory (zejména `SECURITY.md` a `database/README.md`)
2. Přečtěte si sekci "📧 Možnosti e-mailové služby" pro problémy s e-maily
3. Zkontrolujte Supabase logy pro chyby databáze
4. Otestujte e-mail pomocí `npm run test:email`
5. Hledejte chybové zprávy v konzoli prohlížeče

### Běžné problémy

**Migrace databáze selhávají?**
→ Použijte `database/00_COMPLETE_SETUP.sql` pro čisté nastavení

**E-maily se neodesílají?**
→ Spusťte `npm run test:email` a zkontrolujte SMTP přihlašovací údaje

**Příspěvky se nezobrazují?**
→ Zkontrolujte, zda nevypršely (`expires_at` pole)

**Nelze upravovat příspěvky?**
→ Ověřte, že jste autor příspěvku nebo vlastník kanálu

---

## 🎯 Případy použití

Perfektní pro:
- 🏢 Společenství vlastníků jednotek (SVJ)
- 🏘️ Bytová družstva
- 👨‍💼 Správce domů
- 🏘️ Rezidenční komunity
- 🏫 Vzdělávací instituce
- 🏛️ Místní organizace
- 📢 Jakoukoli skupinu potřebující veřejná oznámení

---

## 🌟 Poděkování

### Projektový tým

- **💡 Koncept a nápad**: Vlastimil Novotný - Inspirováno dostupnou doménou oznam-to.cz
- **🚀 Vývoj MVP**: Google Gemini - Počáteční struktura aplikace a základní funkce
- **✨ Rozšíření funkcí a e-mailový systém**: Anthropic Claude (Sonnet 3.5) - E-mailová oznámení, podpora SMTP, dokumentace
- **🔧 Vylepšení v0.2**: Anthropic Claude (Sonnet 4.5) - Úprava příspěvků, expirace, přizpůsobení kanálů, posílení zabezpečení, mobilní UX

### Technologie

Postaveno s:
- [Next.js](https://nextjs.org/) od Vercel
- [Supabase](https://supabase.com/) pro backend
- [TipTap](https://tiptap.dev/) pro úpravu formátovaného textu
- [Tailwind CSS](https://tailwindcss.com/) pro styling
- [Resend](https://resend.com/)/[nodemailer](https://nodemailer.com/) pro e-maily
- [DOMPurify](https://github.com/cure53/DOMPurify) pro ochranu proti XSS

### Speciální poděkování

Tento projekt demonstruje sílu AI-asistovaného vývoje, který kombinuje lidskou kreativitu se schopnostmi AI pro budování praktických řešení skutečných komunitních potřeb.

---

## 📊 Historie verzí

### v0.2-beta-claude-fixes (2025-11-08)
- ✏️ Úprava a mazání příspěvků
- ⏰ Data expirace příspěvků
- 🎨 Přizpůsobení kanálu (popisy, barevná témata)
- 📱 Mobilní hamburger menu
- 🔒 Posílení zabezpečení (autentizace API, validace vstupu, prevence XSS)
- 📧 Systém odběrů na kanál
- 📦 Nastavení databáze jedním kliknutím
- 📚 Aktualizace komplexní dokumentace

### v0.1-beta (Počáteční vydání)
- 📋 Veřejné oznámkové kanály
- ✍️ Textový editor
- 📧 E-mailová oznámení (globální)
- 🔐 Řízení přístupu na základě rolí
- 📌 Připínání příspěvků
- 🏷️ Kategorie příspěvků

---

## 📞 Kontakt

Web: [https://oznam-to.cyn.cz](https://oznam-to.cyn.cz)

Bezpečnostní problémy: Viz `SECURITY.md` pro odpovědné zveřejnění

---

Vytvořeno s ❤️ pro lepší komunitní komunikaci
