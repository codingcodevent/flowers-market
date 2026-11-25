import type { Metadata, Viewport } from 'next';
import { STORE_CONTACTS } from '@gul/shared';
import { getSiteUrl } from '@/lib/seo-helpers';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#fbf8f6',
};

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${STORE_CONTACTS.brandName} — Toshkentda Gullar, Buketlar va Sovg'alar Yetkazib Berish`,
    template: `%s | ${STORE_CONTACTS.brandName}`,
  },
  description:
    "Toshkentda yangi uzilgan gullar, mualliflik buketlari, 101 atirgul va sovg'alar 60 daqiqada yetkazib beriladi. Telegram Web App orqali ro'yxatdan o'tishsiz tezkor buyurtma.",
  keywords: [
    'gul dokoni toshkent',
    'gullar yetkazib berish',
    'buket buyurtma',
    '101 atirgul narxi',
    'telegram gul dokoni',
    'flora uz',
  ],
  openGraph: {
    type: 'website',
    locale: 'uz_UZ',
    siteName: STORE_CONTACTS.brandName,
    title: `${STORE_CONTACTS.brandName} — Gullar, Buketlar va Sovg'alar`,
    description:
      "60 daqiqada tezkor dostavka. Telegram Mini App'da ro'yxatdan o'tmasdan buyurtma bering.",
    images: [{ url: '/images/bouquet-bahor.webp', width: 560, height: 560 }],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body className="antialiased">{children}</body>
    </html>
  );
}
