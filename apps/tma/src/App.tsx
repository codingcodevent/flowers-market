import { Suspense, lazy, useDeferredValue, useEffect, useMemo, useState } from 'react';
import { CATEGORY_MAP, formatSum, getProductById, searchCatalog, type CategorySlug, type Product } from '@gul/shared';
import { BottomNav } from './components/BottomNav';
import { ProductCard } from './components/ProductCard';
import { SearchBar } from './components/SearchBar';
import { TopHeader, type ActiveTab } from './components/TopHeader';
import { useCart } from './hooks/useCart';
import { useDebouncedValue } from './hooks/useDebouncedValue';
import {
  getTelegramSession,
  initTelegramApp,
  setTelegramBackButton,
} from './lib/telegram';

// Ikkilamchi sahifa va modallar lazy-load qilinadi (initial JS yuklanishini kamaytirish uchun)
const ProductSheet = lazy(() =>
  import('./components/ProductSheet').then((m) => ({ default: m.ProductSheet })),
);
const CartSheet = lazy(() =>
  import('./components/CartSheet').then((m) => ({ default: m.CartSheet })),
);
const ProfileSheet = lazy(() =>
  import('./components/ProfileSheet').then((m) => ({ default: m.ProfileSheet })),
);
const DeliveryView = lazy(() =>
  import('./views/DeliveryView').then((m) => ({ default: m.DeliveryView })),
);
const ContactsView = lazy(() =>
  import('./views/ContactsView').then((m) => ({ default: m.ContactsView })),
);
const OrderFormView = lazy(() =>
  import('./views/OrderFormView').then((m) => ({ default: m.OrderFormView })),
);

function SectionFallback() {
  return (
    <div className="space-y-2.5 px-3.5 py-4" aria-busy="true">
      <div className="h-24 animate-pulse rounded-2xl bg-[var(--surface-muted)]" />
      <div className="h-24 animate-pulse rounded-2xl bg-[var(--surface-muted)]" />
    </div>
  );
}

export function App() {
  const [demoUserIdx, setDemoUserIdx] = useState(0);
  const session = useMemo(() => getTelegramSession(demoUserIdx), [demoUserIdx]);

  const [activeTab, setActiveTab] = useState<ActiveTab>('gullar');
  const [searchInput, setSearchInput] = useState('');
  const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc'>('relevance');
  const [selectedZoneId, setSelectedZoneId] = useState('tashkent-center');

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const cart = useCart();

  // Telegram WebApp SDK ni ishga tushirish va deep-link mahsulotini tekshirish
  useEffect(() => {
    const cleanup = initTelegramApp();
    if (session.startParam?.startsWith('product_')) {
      const id = session.startParam.replace('product_', '');
      const linked = getProductById(id);
      if (linked) {
        setActiveTab(linked.category);
        setSelectedProduct(linked);
      }
    }
    return cleanup;
  }, [session.startParam]);

  // Telegram native BackButton boshqaruvi
  useEffect(() => {
    if (selectedProduct) {
      return setTelegramBackButton(true, () => setSelectedProduct(null));
    }
    if (cartOpen) {
      return setTelegramBackButton(true, () => setCartOpen(false));
    }
    if (profileOpen) {
      return setTelegramBackButton(true, () => setProfileOpen(false));
    }
    if (activeTab !== 'gullar') {
      return setTelegramBackButton(true, () => setActiveTab('gullar'));
    }
    return setTelegramBackButton(false);
  }, [selectedProduct, cartOpen, profileOpen, activeTab]);

  // Qidiruv optimizatsiyasi: debounce + React 19 useDeferredValue
  const debouncedSearch = useDebouncedValue(searchInput, 120);
  const deferredSearch = useDeferredValue(debouncedSearch);

  const isCatalogTab =
    activeTab === 'gullar' || activeTab === 'buketlar' || activeTab === 'sovgalar';

  const searchResult = useMemo(() => {
    const hasQuery = deferredSearch.trim().length > 0;
    const categoryFilter: CategorySlug | 'all' = hasQuery
      ? 'all'
      : isCatalogTab
        ? (activeTab as CategorySlug)
        : 'all';
    return searchCatalog(deferredSearch, { category: categoryFilter, sortBy });
  }, [deferredSearch, isCatalogTab, activeTab, sortBy]);

  const handleQuickOrder = (product: Product) => {
    if (!cart.quantities[product.id]) {
      cart.add(product.id);
    }
    setSelectedProduct(null);
    setActiveTab('zayavka');
  };

  return (
    <div className="mx-auto min-h-[100dvh] w-full max-w-[480px] bg-[var(--bg)] pb-24 shadow-[0_0_40px_rgba(0,0,0,0.04)]">
      <TopHeader
        user={session.user}
        isInsideTelegram={session.isInsideTelegram}
        cartCount={cart.totalCount}
        activeTab={activeTab}
        onOpenProfile={() => setProfileOpen(true)}
        onOpenCart={() => setCartOpen(true)}
        onSelectContacts={() => setActiveTab('kontaktlar')}
      />

      {/* Katalog menyulari (Gullar, Buketlar, Sovg'alar) yoki global qidiruv */}
      {isCatalogTab && (
        <>
          <SearchBar
            value={searchInput}
            onChange={setSearchInput}
            sortBy={sortBy}
            onSortChange={setSortBy}
            resultCount={searchResult.totalCount}
            elapsedMs={searchResult.elapsedMs}
          />

          <main className="px-3.5 pt-2">
            {/* Bo'lim sarlavhasi */}
            <div className="mb-2.5 flex items-center justify-between gap-2">
              <div>
                <h1 className="text-base font-bold text-[var(--text)]">
                  {deferredSearch.trim()
                    ? 'Qidiruv natijalari'
                    : CATEGORY_MAP[activeTab as CategorySlug].label}
                </h1>
                <p className="text-xs text-[var(--text-muted)]">
                  {deferredSearch.trim()
                    ? `"${deferredSearch.trim()}" bo'yicha barcha bo'limlardan`
                    : CATEGORY_MAP[activeTab as CategorySlug].tagline}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('zayavka')}
                className="shrink-0 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-xs font-semibold text-[var(--brand)]"
              >
                Maxsus zayavka
              </button>
            </div>

            {searchResult.items.length === 0 ? (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
                <p className="text-sm font-semibold text-[var(--text)]">
                  Hech narsa topilmadi
                </p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Boshqa so'z bilan qidiring yoki floristimizga individual zayavka qoldiring.
                </p>
                <div className="mt-3 flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSearchInput('')}
                    className="rounded-xl border border-[var(--border)] px-3 py-1.5 text-xs font-medium"
                  >
                    Qidiruvni tozalash
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('zayavka')}
                    className="rounded-xl bg-[var(--brand)] px-3 py-1.5 text-xs font-medium text-white"
                  >
                    Zayavka qoldirish
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                {searchResult.items.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    quantity={cart.quantities[product.id] || 0}
                    priority={index < 4}
                    onSelect={setSelectedProduct}
                    onAdd={cart.add}
                    onDecrement={cart.decrement}
                  />
                ))}
              </div>
            )}
          </main>
        </>
      )}

      {activeTab === 'dostavka' && (
        <Suspense fallback={<SectionFallback />}>
          <DeliveryView
            selectedZoneId={selectedZoneId}
            cartTotal={cart.totalPrice}
            onSelectZone={setSelectedZoneId}
            onProceedOrder={() => setActiveTab('zayavka')}
          />
        </Suspense>
      )}

      {activeTab === 'kontaktlar' && (
        <Suspense fallback={<SectionFallback />}>
          <ContactsView onGoOrderForm={() => setActiveTab('zayavka')} />
        </Suspense>
      )}

      {activeTab === 'zayavka' && (
        <Suspense fallback={<SectionFallback />}>
          <OrderFormView
            user={session.user}
            initData={session.initData}
            isInsideTelegram={session.isInsideTelegram}
            cartItems={cart.items}
            cartTotal={cart.totalPrice}
            selectedZoneId={selectedZoneId}
            onSelectZone={setSelectedZoneId}
            onClearCart={cart.clear}
            onBrowseCatalog={() => setActiveTab('gullar')}
          />
        </Suspense>
      )}

      {/* Savatda mahsulot bo'lsa katalog ustida suzuvchi mobil bar */}
      {isCatalogTab && cart.totalCount > 0 && (
        <div className="fixed bottom-[68px] left-1/2 z-20 w-full max-w-[480px] -translate-x-1/2 px-3.5 pb-safe">
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="flex h-12 w-full items-center justify-between rounded-2xl bg-[var(--brand)] px-4 text-sm font-semibold text-white shadow-lg transition active:scale-[0.98]"
          >
            <span>Savat ({cart.totalCount} ta)</span>
            <span className="font-mono tabular-nums">{formatSum(cart.totalPrice)} →</span>
          </button>
        </div>
      )}

      <BottomNav
        activeTab={activeTab}
        cartCount={cart.totalCount}
        onChange={(tab) => {
          setSearchInput('');
          setActiveTab(tab);
        }}
      />

      {selectedProduct && (
        <Suspense fallback={null}>
          <ProductSheet
            product={selectedProduct}
            quantity={cart.quantities[selectedProduct.id] || 0}
            onClose={() => setSelectedProduct(null)}
            onAdd={cart.add}
            onDecrement={cart.decrement}
            onQuickOrder={handleQuickOrder}
          />
        </Suspense>
      )}

      {cartOpen && (
        <Suspense fallback={null}>
          <CartSheet
            items={cart.items}
            totalPrice={cart.totalPrice}
            onClose={() => setCartOpen(false)}
            onAdd={cart.add}
            onDecrement={cart.decrement}
            onClear={cart.clear}
            onCheckout={() => {
              setCartOpen(false);
              setActiveTab('zayavka');
            }}
          />
        </Suspense>
      )}

      {profileOpen && (
        <Suspense fallback={null}>
          <ProfileSheet
            user={session.user}
            isInsideTelegram={session.isInsideTelegram}
            onClose={() => setProfileOpen(false)}
            onSwitchDemoUser={() => setDemoUserIdx((i) => i + 1)}
          />
        </Suspense>
      )}
    </div>
  );
}
