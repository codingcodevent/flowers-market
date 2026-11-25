# Flora.uz — Gul Do'koni (Telegram Mini App + Next.js SEO)

Mobil-first tamoyilida qurilgan gul do'koni monorepo loyihasi:

- **`apps/tma`** (`React + Vite + Tailwind CSS v4`): Telegram Web App uchun o'ta yengil mobil ilova. Foydalanuvchi ro'yxatdan o'tmaydi — Telegram profil ma'lumotlari (`initDataUnsafe.user`) avtomatik ko'rsatiladi va zayavka formasiga ulanadi.
- **`apps/seo`** (`Next.js App Router + Tailwind CSS v4`): Google/Yandex uchun SSR/SSG katalog sahifalari, `sitemap.xml`, `robots.txt`, JSON-LD (`Florist` va `Product`) hamda `POST /api/orders` backend API.
- **`packages/shared`**: Umumiy katalog, o'zbekcha lotin/kirill qidiruv dvigateli, so'm/telefon formatlash va Telegram `initData` HMAC-SHA256 imzo tekshiruvi.

## Ishga tushirish

1. Paketlarni o'rnatish:
   ```cmd
   cmd /c "npm install"
   ```
2. `.env.example` dan `.env` nusxalab, (ixtiyoriy) `TELEGRAM_BOT_TOKEN` va `TELEGRAM_ADMIN_CHAT_ID` kiriting.
3. Ikkala ilovani ishga tushirish:
   ```cmd
   cmd /c "npm run dev:seo"
   cmd /c "npm run dev:tma"
   ```
   - `apps/seo`: `http://localhost:3000`
   - `apps/tma`: `http://localhost:5173` (`/api` so'rovlari avtomatik `3000` portga proksi qilinadi)

## Test va Build

```cmd
cmd /c "npm test && npm run typecheck && npm run build"
```
