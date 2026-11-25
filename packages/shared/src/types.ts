export type CategorySlug = 'gullar' | 'buketlar' | 'sovgalar';

export type OccasionTag =
  | "Tug'ilgan kun"
  | 'Sevgi'
  | 'Tabrik'
  | "To'y"
  | 'Rahmat'
  | 'VIP';

export interface Product {
  id: string;
  slug: string;
  category: CategorySlug;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  oldPrice?: number;
  image: string;
  tags: string[];
  occasions: OccasionTag[];
  badge?: string;
  inStock: boolean;
  deliveryMinutes: number;
  stemCount?: string;
}

export interface CategoryMeta {
  slug: CategorySlug;
  label: string;
  seoTitle: string;
  seoDescription: string;
  tagline: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  eta: string;
  price: number;
  freeFrom?: number;
  note: string;
}

export interface StoreContacts {
  brandName: string;
  legalName: string;
  phoneDisplay: string;
  phoneHref: string;
  telegramUsername: string;
  botUsername: string;
  address: string;
  landmark: string;
  workingHours: string;
  instagramHandle: string;
}

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
  is_premium?: boolean;
}

export interface CartLineItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
}

export interface OrderPayload {
  orderType: 'cart' | 'custom';
  phone: string;
  address: string;
  deliveryZoneId: string;
  deliveryTime: string;
  recipientName?: string;
  cardMessage?: string;
  comment?: string;
  customBudget?: string;
  customOccasion?: string;
  items: CartLineItem[];
  telegramUser?: TelegramUser | null;
  initData?: string;
  source: 'tma' | 'seo-web';
}

export interface OrderResponse {
  ok: boolean;
  orderId: string;
  mode: 'telegram-bot' | 'local-demo';
  verifiedTelegramAuth: boolean;
  message: string;
  totalAmount: number;
}
