import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import test from 'node:test';
import {
  CATALOG,
  formatSum,
  isValidUzPhone,
  normalizeUzPhone,
  normalizeUzbekText,
  searchCatalog,
} from '../src/index.ts';
import { validateOrderPayload, verifyTelegramInitData } from '../src/server.ts';

test('normalizeUzbekText handles apostrophes and Cyrillic transliteration', () => {
  assert.equal(normalizeUzbekText("Sovg'a"), 'sovga');
  assert.equal(normalizeUzbekText('Sovgʻa'), 'sovga');
  assert.equal(normalizeUzbekText('Атиргул'), 'atirgul');
});

test('searchCatalog finds products across Uzbek variants and category filter', () => {
  assert.equal(CATALOG.length, 12);

  const roseResult = searchCatalog('atirgul');
  assert.ok(roseResult.items.length >= 2);
  assert.ok(roseResult.items[0].title.toLowerCase().includes('atirgul'));

  const apostropheResult = searchCatalog('sovga', { category: 'sovgalar' });
  assert.ok(apostropheResult.items.length >= 1);
  assert.ok(apostropheResult.items.every((i) => i.category === 'sovgalar'));

  const cyrillicResult = searchCatalog('лола');
  assert.equal(cyrillicResult.items[0]?.slug, 'gollandiya-pushti-lola-21');
});

test('formatSum and phone validation format correctly', () => {
  assert.equal(formatSum(260000), "260 000 so'm");
  assert.equal(formatSum(1490000), "1 490 000 so'm");
  assert.equal(isValidUzPhone('+998 90 123 45 67'), true);
  assert.equal(isValidUzPhone('901234567'), true);
  assert.equal(isValidUzPhone('12345'), false);
  assert.equal(normalizeUzPhone('901234567'), '+998901234567');
});

test('verifyTelegramInitData validates authentic HMAC-SHA256 signatures and rejects tampered data', () => {
  const botToken = '123456:TEST-BOT-TOKEN';
  const userJson = JSON.stringify({ id: 777001, first_name: 'Dilnoza', username: 'dilnoza_r' });
  const authDate = String(Math.floor(Date.now() / 1000));

  const params = new URLSearchParams({
    auth_date: authDate,
    query_id: 'AAHdF6IQAAAAAN0XohDhrOrc',
    user: userJson,
  });

  const pairs: string[] = [];
  params.forEach((v, k) => pairs.push(`${k}=${v}`));
  pairs.sort();
  const dataCheckString = pairs.join('\n');

  const secret = createHmac('sha256', 'WebAppData').update(botToken).digest();
  const hash = createHmac('sha256', secret).update(dataCheckString).digest('hex');
  params.set('hash', hash);

  const verified = verifyTelegramInitData(params.toString(), botToken);
  assert.equal(verified.valid, true);
  assert.equal(verified.user?.id, 777001);
  assert.equal(verified.user?.username, 'dilnoza_r');

  const tampered = verifyTelegramInitData(params.toString().replace('Dilnoza', 'Malika'), botToken);
  assert.equal(tampered.valid, false);
});

test('validateOrderPayload enforces phone/address and recomputes prices from catalog', () => {
  const valid = validateOrderPayload({
    orderType: 'cart',
    phone: '90 123 45 67',
    address: 'Chilonzor 5-mavze, 12-uy',
    deliveryZoneId: 'tashkent-city',
    deliveryTime: 'Bugun 18:00',
    items: [{ productId: 'g1', title: 'Tampered', price: 1, quantity: 2 }],
    source: 'tma',
  });
  assert.equal(valid.ok, true);
  if (valid.ok) {
    assert.equal(valid.normalizedPhone, '+998901234567');
    assert.equal(valid.totalAmount, 520000);
  }

  const invalid = validateOrderPayload({
    orderType: 'cart',
    phone: '90 123 45 67',
    address: 'Toshkent',
    items: [],
    source: 'tma',
  });
  assert.equal(invalid.ok, false);
});
