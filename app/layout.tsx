// Uložte jako: app/layout.jsx
import './globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/Header'; // Importujeme hlavičku
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Oznam to! - Digitální oznámková deska pro SVJ a bytová družstva',
  description: 'Moderní online nástěnka pro společenství vlastníků jednotek a správu bytových domů. Sdílejte oznámení, události a důležité informace s obyvateli rychle a zdarma.',
  keywords: [
    'oznámková deska',
    'digitální nástěnka',
    'SVJ',
    'společenství vlastníků jednotek',
    'bytové družstvo',
    'správa bytového domu',
    'oznámení pro SVJ',
    'veřejná nástěnka',
    'bulletin board',
    'online oznámení',
    'správce bytového domu',
    'komunikace SVJ',
    'bytová komunita'
  ],
  authors: [{ name: 'Vlastimil Novotný' }],
  openGraph: {
    type: 'website',
    locale: 'cs_CZ',
    url: 'https://oznam-to.cyn.cz',
    siteName: 'Oznam to!',
    title: 'Oznam to! - Digitální oznámková deska pro SVJ a bytová družstva',
    description: 'Moderní online nástěnka pro společenství vlastníků jednotek a správu bytových domů. Sdílejte oznámení, události a důležité informace s obyvateli rychle a zdarma.',
    images: [
      {
        url: 'https://s3-server.ente.odjezdy.online/raw/VIzXaV.png',
        width: 1200,
        height: 630,
        alt: 'Oznam to! - Digitální oznámková deska pro SVJ a bytová družstva',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oznam to! - Digitální oznámková deska pro SVJ',
    description: 'Moderní online nástěnka pro společenství vlastníků jednotek a správu bytových domů.',
    images: ['https://s3-server.ente.odjezdy.online/raw/VIzXaV.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://oznam-to.cyn.cz',
  },
  verification: {
    google: 'sKboGFNTVOwNvpoM5SfOsT7VQX1eZ7VYTHcPsQ6i8_M',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://oznam-to.cyn.cz/#website',
        url: 'https://oznam-to.cyn.cz',
        name: 'Oznam to!',
        description: 'Digitální oznámková deska pro SVJ a bytová družstva',
        inLanguage: 'cs',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://oznam-to.cyn.cz/{slug}'
          },
          'query-input': 'required name=slug'
        }
      },
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://oznam-to.cyn.cz/#software',
        name: 'Oznam to!',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'CZK'
        },
        description: 'Moderní online nástěnka pro společenství vlastníků jednotek a správu bytových domů',
        featureList: [
          'Rich text editor pro formátování oznámení',
          'Připínání důležitých příspěvků',
          'Kategorizace oznámení',
          'Týmová spolupráce s více administrátory',
          'Bezpečné a chráněné před XSS útoky',
          'Veřejný přístup bez registrace'
        ],
        screenshot: 'https://s3-server.ente.odjezdy.online/raw/VIzXaV.png',
        author: {
          '@type': 'Person',
          name: 'Vlastimil Novotný'
        }
      },
      {
        '@type': 'Organization',
        '@id': 'https://oznam-to.cyn.cz/#organization',
        name: 'Oznam to!',
        url: 'https://oznam-to.cyn.cz',
        logo: {
          '@type': 'ImageObject',
          url: 'https://s3-server.ente.odjezdy.online/raw/VIzXaV.png'
        },
        description: 'Poskytovatel digitální oznámkové desky pro SVJ a bytová družstva'
      }
    ]
  };

  return (
    <html lang="cs">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${inter.className} bg-indigo-50 min-h-screen`}>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-39628891CJ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-39628891CJ');
          `}
        </Script>

        {/* Google AdSense */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4322553744082836"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />

        <Header /> {/* Hlavička na každé stránce */}
        <main>{children}</main>
      </body>
    </html>
  );
}