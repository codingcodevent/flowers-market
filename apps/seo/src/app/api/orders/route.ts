import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import {
  DELIVERY_ZONES,
  formatSum,
  formatTelegramDisplayName,
  type OrderPayload,
  type OrderResponse,
  type TelegramUser,
} from '@gul/shared';
import { validateOrderPayload, verifyTelegramInitData } from '@gul/shared/server';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const DATA_FILE = path.join(process.cwd(), 'data', 'orders.json');

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

function buildAdminTelegramMessage(
  orderId: string,
  payload: OrderPayload,
  verifiedUser: TelegramUser | null | undefined,
  verifiedAuth: boolean,
  totalAmount: number,
): string {
  const zone = DELIVERY_ZONES.find((z) => z.id === payload.deliveryZoneId);
  const userLabel = verifiedUser
    ? `${formatTelegramDisplayName(verifiedUser)}${verifiedUser.username ? ` (@${verifiedUser.username})` : ''} [ID: ${verifiedUser.id}]`
    : 'Veb sayt mijozi';

  const lines: string[] = [
    `🌸 <b>Yangi Zayavka #${orderId}</b>`,
    `📌 Turi: ${payload.orderType === 'cart' ? 'Savat buyurtmasi' : 'Individual zayavka'}`,
    `👤 Mijoz: ${userLabel}${verifiedAuth ? ' ✅' : ''}`,
    `📞 Telefon: ${payload.phone}`,
    `📍 Hudud: ${zone?.name ?? payload.deliveryZoneId}`,
    `🏠 Manzil: ${payload.address}`,
    `⏰ Vaqt: ${payload.deliveryTime}`,
  ];

  if (payload.items.length > 0) {
    lines.push('');
    lines.push('🛍 <b>Mahsulotlar:</b>');
    for (const item of payload.items) {
      lines.push(`• ${item.title} × ${item.quantity} = ${formatSum(item.price * item.quantity)}`);
    }
    lines.push(`💰 <b>Mahsulotlar jami:</b> ${formatSum(totalAmount)}`);
  }

  if (payload.customOccasion) lines.push(`🎀 Tadbir: ${payload.customOccasion}`);
  if (payload.customBudget) lines.push(`💵 Byudjet: ${payload.customBudget}`);
  if (payload.recipientName) lines.push(`🎁 Qabul qiluvchi: ${payload.recipientName}`);
  if (payload.cardMessage) lines.push(`💌 Tabriknoma: ${payload.cardMessage}`);
  if (payload.comment) lines.push(`📝 Izoh: ${payload.comment}`);

  return lines.join('\n');
}

async function persistDemoOrder(record: Record<string, unknown>) {
  try {
    await mkdir(path.dirname(DATA_FILE), { recursive: true });
    let existing: unknown[] = [];
    try {
      const raw = await readFile(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) existing = parsed;
    } catch {
      existing = [];
    }
    existing.unshift(record);
    await writeFile(DATA_FILE, JSON.stringify(existing.slice(0, 100), null, 2), 'utf-8');
  } catch {
    // Lokal faylga yozishda xatolik bo'lsa ham buyurtma javobini bloklamaymiz
  }
}

export async function POST(request: Request) {
  let body: Partial<OrderPayload>;
  try {
    body = (await request.json()) as Partial<OrderPayload>;
  } catch {
    return NextResponse.json(
      { ok: false, error: "JSON ma'lumot noto'g'ri yuborildi." },
      { status: 400, headers: CORS_HEADERS },
    );
  }

  const validation = validateOrderPayload(body);
  if (!validation.ok) {
    return NextResponse.json(
      { ok: false, error: validation.error },
      { status: 400, headers: CORS_HEADERS },
    );
  }

  const { sanitizedPayload, totalAmount } = validation;
  const botToken = process.env.TELEGRAM_BOT_TOKEN || '';
  const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID || '';

  let verifiedTelegramAuth = false;
  let effectiveUser = sanitizedPayload.telegramUser;

  if (botToken && sanitizedPayload.initData) {
    const check = verifyTelegramInitData(sanitizedPayload.initData, botToken);
    if (!check.valid) {
      return NextResponse.json(
        { ok: false, error: `Telegram initData tekshiruvi muvaffaqiyatsiz: ${check.reason}` },
        { status: 401, headers: CORS_HEADERS },
      );
    }
    verifiedTelegramAuth = true;
    if (check.user) effectiveUser = check.user;
  }

  const orderId = `FL-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`;
  const adminMessage = buildAdminTelegramMessage(
    orderId,
    sanitizedPayload,
    effectiveUser,
    verifiedTelegramAuth,
    totalAmount,
  );

  let mode: OrderResponse['mode'] = 'local-demo';

  if (botToken && adminChatId) {
    try {
      const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: adminChatId,
          text: adminMessage,
          parse_mode: 'HTML',
        }),
      });
      if (tgRes.ok) {
        mode = 'telegram-bot';
      }
    } catch {
      // Bot API vaqtincha javob bermasa lokal saqlashga o'tadi
    }
  }

  await persistDemoOrder({
    orderId,
    createdAt: new Date().toISOString(),
    mode,
    verifiedTelegramAuth,
    totalAmount,
    payload: { ...sanitizedPayload, initData: undefined, telegramUser: effectiveUser },
  });

  const response: OrderResponse = {
    ok: true,
    orderId,
    mode,
    verifiedTelegramAuth,
    totalAmount,
    message:
      mode === 'telegram-bot'
        ? "Zayavka Telegram bot orqali menejerimizga yuborildi. Tez orada bog'lanamiz."
        : "Zayavka qabul qilindi (lokal demo rejim). Haqiqiy botga ulash uchun .env fayliga TELEGRAM_BOT_TOKEN kiriting.",
  };

  return NextResponse.json(response, { status: 201, headers: CORS_HEADERS });
}
