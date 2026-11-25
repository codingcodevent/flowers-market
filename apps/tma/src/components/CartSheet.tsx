import { Minus, Plus, Trash2, X } from 'lucide-react';
import { formatSum, getProductById, type CartLineItem } from '@gul/shared';

interface CartSheetProps {
  items: CartLineItem[];
  totalPrice: number;
  onClose: () => void;
  onAdd: (id: string) => void;
  onDecrement: (id: string) => void;
  onClear: () => void;
  onCheckout: () => void;
}

const FREE_DELIVERY_THRESHOLD = 350000;

export function CartSheet({
  items,
  totalPrice,
  onClose,
  onAdd,
  onDecrement,
  onClear,
  onCheckout,
}: CartSheetProps) {
  const remainingForFree = Math.max(0, FREE_DELIVERY_THRESHOLD - totalPrice);
  const progress = Math.min(100, Math.round((totalPrice / FREE_DELIVERY_THRESHOLD) * 100));

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Savat"
    >
      <div
        className="animate-sheet-up max-h-[85dvh] w-full max-w-[480px] overflow-y-auto rounded-t-3xl bg-[var(--surface)] p-4 pb-safe shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between border-b border-[var(--border)] pb-2.5">
          <div>
            <h2 className="text-base font-bold text-[var(--text)]">Savat</h2>
            <p className="text-xs text-[var(--text-muted)]">
              {items.length} xil mahsulot tanlangan
            </p>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                type="button"
                onClick={onClear}
                className="flex h-8 items-center gap-1 rounded-full bg-[var(--surface-muted)] px-2.5 text-xs text-[var(--text-muted)]"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Tozalash
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-muted)] text-[var(--text)]"
              aria-label="Yopish"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Bepul dostavka progressi */}
        <div className="mb-3 rounded-2xl bg-[var(--surface-muted)] p-3">
          <div className="flex items-center justify-between text-xs font-medium">
            {remainingForFree === 0 ? (
              <span className="text-[var(--leaf)]">
                Toshkent markaziga bepul yetkazib berish faollashdi!
              </span>
            ) : (
              <span className="text-[var(--text-muted)]">
                Bepul dostavkagacha yana{' '}
                <strong className="text-[var(--text)]">{formatSum(remainingForFree)}</strong>
              </span>
            )}
            <span className="font-mono text-[var(--text-muted)]">{progress}%</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--border)]">
            <div
              className="h-full rounded-full bg-[var(--leaf)] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {items.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm font-medium text-[var(--text)]">Savatingiz hozircha bo'sh</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Gullar, buketlar yoki sovg'alardan tanlab + tugmasini bosing.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {items.map((item) => {
              const product = getProductById(item.productId);
              return (
                <div
                  key={item.productId}
                  className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-2.5"
                >
                  {product && (
                    <img
                      src={product.image}
                      alt={item.title}
                      width={56}
                      height={56}
                      className="h-14 w-14 shrink-0 rounded-xl object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-[var(--text)]">
                      {item.title}
                    </h3>
                    <p className="text-xs font-medium text-[var(--brand)]">
                      {formatSum(item.price * item.quantity)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onDecrement(item.productId)}
                      className="flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)]"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-[18px] text-center text-xs font-bold tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onAdd(item.productId)}
                      className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--brand)] text-white"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="mt-3 flex items-center justify-between border-t border-[var(--border)] pt-3">
              <span className="text-sm text-[var(--text-muted)]">Jami mahsulotlar:</span>
              <span className="text-lg font-bold tabular-nums text-[var(--text)]">
                {formatSum(totalPrice)}
              </span>
            </div>

            <button
              type="button"
              onClick={onCheckout}
              className="mt-2 h-12 w-full rounded-2xl bg-[var(--brand)] text-sm font-semibold text-white shadow-sm active:scale-[0.98]"
            >
              Zayavka / Buyurtma berish →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
