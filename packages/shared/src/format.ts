/**
 * Narxni o'zbek so'miga formatlaydi (masalan: "260 000 so'm").
 */
export function formatSum(amount: number): string {
  const rounded = Math.max(0, Math.round(amount));
  const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${formatted} so'm`;
}

/**
 * Chegirma foizini hisoblaydi.
 */
export function getDiscountPercent(price: number, oldPrice?: number): number | null {
  if (!oldPrice || oldPrice <= price) return null;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

/**
 * Foydalanuvchi kiritgan telefon raqamidan faqat raqamlarni ajratib tekshiradi.
 */
export function normalizeUzPhone(input: string): string {
  const digits = input.replace(/\D/g, '');
  if (digits.startsWith('998') && digits.length >= 12) {
    return `+${digits.slice(0, 12)}`;
  }
  if (digits.length === 9) {
    return `+998${digits}`;
  }
  return input.trim();
}

export function isValidUzPhone(input: string): boolean {
  const digits = input.replace(/\D/g, '');
  return (digits.startsWith('998') && digits.length === 12) || digits.length === 9;
}

/**
 * Foydalanuvchi Telegram profilidan to'liq ism va qisqa bosh harflarni yasaydi.
 */
export function formatTelegramDisplayName(user?: {
  first_name: string;
  last_name?: string;
} | null): string {
  if (!user) return 'Mehmon';
  return [user.first_name, user.last_name].filter(Boolean).join(' ').trim() || 'Foydalanuvchi';
}

export function getTelegramInitials(user?: {
  first_name: string;
  last_name?: string;
} | null): string {
  if (!user) return 'TG';
  const a = user.first_name?.trim()[0] ?? '';
  const b = user.last_name?.trim()[0] ?? '';
  return (a + b).toUpperCase() || 'TG';
}
