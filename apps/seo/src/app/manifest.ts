import type { MetadataRoute } from 'next';
import { STORE_CONTACTS } from '@gul/shared';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${STORE_CONTACTS.brandName} — Gul Do'koni`,
    short_name: STORE_CONTACTS.brandName,
    description: "Toshkentda gullar, buketlar va sovg'alar yetkazib berish.",
    start_url: '/',
    display: 'standalone',
    background_color: '#fbf8f6',
    theme_color: '#be3e5d',
    icons: [
      {
        src: '/images/rose-ecuador.webp',
        sizes: '560x560',
        type: 'image/webp',
      },
    ],
  };
}
