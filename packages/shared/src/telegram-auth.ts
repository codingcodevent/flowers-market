import { createHmac, timingSafeEqual } from 'node:crypto';
import { getProductById } from './search.ts';
import { isValidUzPhone, normalizeUzPhone } from './format.ts';
import type { OrderPayload, TelegramUser } from './types.ts';

export interface TelegramInitDataVerification {
  valid: boolean;
  user?: TelegramUser;
  authDate?: number;
  reason?: string;
}

/**
 * Telegram Mini App initData satrini rasmiy HMAC-SHA256 algoritmi bilan tekshiradi.
 * https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
export function verifyTelegramInitData(
  initData: string,
  botToken: string,
  maxAgeSeconds = 86400,
): TelegramInitDataVerification {
  if (!initData || !botToken) {
    return { valid: false, reason: 'initData yoki botToken mavjud emas' };
  }

  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) {
    return { valid: false, reason: 'hash topilmadi' };
  }

  const pairs: string[] = [];
  params.forEach((value, key) => {
    if (key !== 'hash') {
      pairs.push(`${key}=${value}`);
    }
  });
  pairs.sort();
  const dataCheckString = pairs.join('\n');

  const secretKey = createHmac('sha256', 'WebAppData').update(botToken).digest();
  const computedHex = createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  const providedBuf = Buffer.from(hash, 'hex');
  const computedBuf = Buffer.from(computedHex, 'hex');
  if (providedBuf.length !== computedBuf.length || !timingSafeEqual(providedBuf, computedBuf)) {
    return { valid: false, reason: 'HMAC imzo mos kelmadi' };
  }

  const authDateRaw = params.get('auth_date');
  const authDate = authDateRaw ? Number(authDateRaw) : 0;
  if (maxAgeSeconds > 0 && authDate > 0) {
    const nowSec = Math.floor(Date.now() / 1000);
    if (nowSec - authDate > maxAgeSeconds) {
      return { valid: false, reason: 'initData muddati tugagan' };
    }
  }

  let user: TelegramUser | undefined;
  const userJson = params.get('user');
  if (userJson) {
    try {
      user = JSON.parse(userJson) as TelegramUser;
    } catch {
      return { valid: false, reason: 'user JSON noto‘g‘ri' };
    }
  }

  return { valid: true, user, authDate };
}

export interface ValidatedOrder {
  ok: true;
  normalizedPhone: string;
  totalAmount: number;
  sanitizedPayload: OrderPayload;
}

export interface OrderValidationError {
  ok: false;
  error: string;
}

export function validateOrderPayload(
  raw: Partial<OrderPayload>,
): ValidatedOrder | OrderValidationError {
  if (!raw || (raw.orderType !== 'cart' && raw.orderType !== 'custom')) {
    return { ok: false, error: "Buyurtma turi noto'g'ri ko'rsatilgan." };
  }
  if (!raw.phone || !isValidUzPhone(raw.phone)) {
    return {
      ok: false,
      error: "Iltimos, to'g'ri O'zbekiston telefon raqamini kiriting (masalan: +998 90 123 45 67).",
    };
  }
  if (!raw.address || raw.address.trim().length < 4) {
    return { ok: false, error: "Yetkazib berish manzili yoki mo'ljalni kiriting." };
  }

  const items = Array.isArray(raw.items) ? raw.items : [];
  if (raw.orderType === 'cart' && items.length === 0) {
    return { ok: false, error: "Savat bo'sh. Kamida bitta mahsulot tanlang." };
  }

  let totalAmount = 0;
  const verifiedItems = [];

  for (const item of items) {
    const product = getProductById(item.productId);
    const qty = Math.max(1, Math.min(99, Math.round(Number(item.quantity) || 1)));
    if (product) {
      totalAmount += product.price * qty;
      verifiedItems.push({
        productId: product.id,
        title: product.title,
        price: product.price,
        quantity: qty,
      });
    }
  }

  const normalizedPhone = normalizeUzPhone(raw.phone);

  return {
    ok: true,
    normalizedPhone,
    totalAmount,
    sanitizedPayload: {
      orderType: raw.orderType,
      phone: normalizedPhone,
      address: raw.address.trim(),
      deliveryZoneId: raw.deliveryZoneId || 'tashkent-center',
      deliveryTime: raw.deliveryTime || 'Eng yaqin vaqtda (60-90 daqiqa)',
      recipientName: raw.recipientName?.trim(),
      cardMessage: raw.cardMessage?.trim(),
      comment: raw.comment?.trim(),
      customBudget: raw.customBudget?.trim(),
      customOccasion: raw.customOccasion?.trim(),
      items: verifiedItems,
      telegramUser: raw.telegramUser ?? null,
      initData: raw.initData,
      source: raw.source === 'seo-web' ? 'seo-web' : 'tma',
    },
  };
}
