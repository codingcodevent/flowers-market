import type { TelegramUser } from '@gul/shared';

interface TelegramWebApp {
  initData: string;
  initDataUnsafe?: {
    user?: TelegramUser;
    start_param?: string;
    auth_date?: number;
  };
  colorScheme?: 'light' | 'dark';
  themeParams?: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
  };
  viewportStableHeight?: number;
  ready: () => void;
  expand: () => void;
  close: () => void;
  openTelegramLink?: (url: string) => void;
  openLink?: (url: string) => void;
  onEvent?: (eventType: string, cb: () => void) => void;
  offEvent?: (eventType: string, cb: () => void) => void;
  HapticFeedback?: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  BackButton?: {
    show: () => void;
    hide: () => void;
    onClick: (cb: () => void) => void;
    offClick: (cb: () => void) => void;
  };
  MainButton?: {
    setText: (text: string) => void;
    show: () => void;
    hide: () => void;
    onClick: (cb: () => void) => void;
    offClick: (cb: () => void) => void;
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

export const DEMO_TELEGRAM_USERS: TelegramUser[] = [
  {
    id: 584920144,
    first_name: 'Dilnoza',
    last_name: 'Rahimova',
    username: 'dilnoza_r',
    language_code: 'uz',
    is_premium: true,
  },
  {
    id: 912440812,
    first_name: 'Azizbek',
    last_name: 'Tursunov',
    username: 'aziz_tursunov',
    language_code: 'uz',
  },
];

export interface TelegramSession {
  user: TelegramUser;
  initData: string;
  isInsideTelegram: boolean;
  startParam?: string;
  colorScheme: 'light' | 'dark';
}

function getWebApp(): TelegramWebApp | undefined {
  if (typeof window === 'undefined') return undefined;
  return window.Telegram?.WebApp;
}

export function applyTelegramTheme(): 'light' | 'dark' {
  const tg = getWebApp();
  const isDark = tg?.colorScheme === 'dark';
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('tg-dark', isDark);
    if (tg?.viewportStableHeight) {
      document.documentElement.style.setProperty(
        '--tg-viewport-stable-height',
        `${tg.viewportStableHeight}px`,
      );
    }
    const tp = tg?.themeParams;
    if (tp && isDark) {
      if (tp.bg_color) document.documentElement.style.setProperty('--tg-theme-bg-color', tp.bg_color);
      if (tp.text_color) document.documentElement.style.setProperty('--tg-theme-text-color', tp.text_color);
      if (tp.hint_color) document.documentElement.style.setProperty('--tg-theme-hint-color', tp.hint_color);
      if (tp.button_color) document.documentElement.style.setProperty('--tg-theme-button-color', tp.button_color);
      if (tp.secondary_bg_color) {
        document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', tp.secondary_bg_color);
      }
    }
  }
  return isDark ? 'dark' : 'light';
}

export function initTelegramApp(): () => void {
  const tg = getWebApp();
  if (tg) {
    try {
      tg.ready();
      tg.expand();
    } catch {
      // Tashqi brauzerda xavfsiz e'tiborsiz qoldiriladi
    }
  }

  applyTelegramTheme();

  const onTheme = () => applyTelegramTheme();
  const onViewport = () => applyTelegramTheme();

  tg?.onEvent?.('themeChanged', onTheme);
  tg?.onEvent?.('viewportChanged', onViewport);

  return () => {
    tg?.offEvent?.('themeChanged', onTheme);
    tg?.offEvent?.('viewportChanged', onViewport);
  };
}

export function getTelegramSession(demoIndex = 0): TelegramSession {
  const tg = getWebApp();
  const realUser = tg?.initDataUnsafe?.user;
  const startParam =
    tg?.initDataUnsafe?.start_param ||
    (typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('startapp') ?? undefined
      : undefined);

  if (realUser && realUser.id) {
    return {
      user: realUser,
      initData: tg?.initData || '',
      isInsideTelegram: true,
      startParam,
      colorScheme: tg?.colorScheme === 'dark' ? 'dark' : 'light',
    };
  }

  const fallbackUser = DEMO_TELEGRAM_USERS[demoIndex % DEMO_TELEGRAM_USERS.length];
  return {
    user: fallbackUser,
    initData: '',
    isInsideTelegram: false,
    startParam,
    colorScheme: 'light',
  };
}

export function hapticImpact(style: 'light' | 'medium' = 'light'): void {
  try {
    getWebApp()?.HapticFeedback?.impactOccurred(style);
  } catch {
    // ignore outside Telegram
  }
}

export function hapticNotify(type: 'success' | 'error' | 'warning'): void {
  try {
    getWebApp()?.HapticFeedback?.notificationOccurred(type);
  } catch {
    // ignore outside Telegram
  }
}

export function openTelegramChat(username: string): void {
  const url = `https://t.me/${username.replace(/^@/, '')}`;
  const tg = getWebApp();
  if (tg?.openTelegramLink) {
    tg.openTelegramLink(url);
  } else if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

export function setTelegramBackButton(visible: boolean, onBack?: () => void): () => void {
  const tg = getWebApp();
  const btn = tg?.BackButton;
  if (!btn) return () => {};

  if (visible && onBack) {
    btn.show();
    btn.onClick(onBack);
    return () => {
      btn.offClick(onBack);
      btn.hide();
    };
  }

  btn.hide();
  return () => {};
}
