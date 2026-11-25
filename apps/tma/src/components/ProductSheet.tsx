import { Clock, Minus, Plus, X } from 'lucide-react';
import { formatSum, getDiscountPercent, type Product } from '@gul/shared';

interface ProductSheetProps {
  product: Product;
  quantity: number;
  onClose: () => void;
  onAdd: (id: string) => void;
  onDecrement: (id: string) => void;
  onQuickOrder: (product: Product) => void;
}

export function ProductSheet({
  product,
  quantity,
  onClose,
  onAdd,
  onDecrement,
  onQuickOrder,
}: ProductSheetProps) {
  const discount = getDiscountPercent(product.price, product.oldPrice);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={product.title}
    >
      <div
        className="animate-sheet-up max-h-[88dvh] w-full max-w-[480px] overflow-y-auto rounded-t-3xl bg-[var(--surface)] p-4 pb-safe shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="rounded-full bg-[var(--surface-muted)] px-2.5 py-1 text-xs font-medium text-[var(--text-muted)]">
            {product.stemCount || product.category}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-muted)] text-[var(--text)]"
            aria-label="Yopish"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl bg-[var(--surface-muted)]">
          <img
            src={product.image}
            alt={product.title}
            width={600}
            height={600}
            className="aspect-square w-full object-cover"
          />
        </div>

        <div className="mt-3.5 space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-[var(--text)]">{product.title}</h2>
              <p className="text-xs text-[var(--text-muted)]">{product.subtitle}</p>
            </div>
            {discount && (
              <span className="shrink-0 rounded-full bg-[var(--brand-soft)] px-2.5 py-1 text-xs font-bold text-[var(--brand)]">
                -{discount}%
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--leaf-soft)] px-2.5 py-1 text-xs font-medium text-[var(--leaf)]">
              <Clock className="h-3.5 w-3.5" />
              ~{product.deliveryMinutes} daqiqada yetkaziladi
            </span>
            {product.occasions.map((occ) => (
              <span
                key={occ}
                className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--text-muted)]"
              >
                {occ}
              </span>
            ))}
          </div>

          <p className="text-sm leading-relaxed text-[var(--text-muted)]">
            {product.description}
          </p>

          <div className="flex items-center justify-between border-t border-[var(--border)] pt-3">
            <div>
              {product.oldPrice && (
                <div className="text-xs text-[var(--text-muted)] line-through">
                  {formatSum(product.oldPrice)}
                </div>
              )}
              <div className="text-xl font-bold tabular-nums text-[var(--text)]">
                {formatSum(product.price)}
              </div>
            </div>

            {quantity > 0 && (
              <div className="flex items-center gap-2 rounded-2xl bg-[var(--brand-soft)] px-2 py-1">
                <button
                  type="button"
                  onClick={() => onDecrement(product.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--brand)]"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-[20px] text-center text-sm font-bold text-[var(--brand)]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => onAdd(product.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--brand)] text-white"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => onAdd(product.id)}
              className="h-12 rounded-2xl border border-[var(--brand)] bg-[var(--brand-soft)] text-sm font-semibold text-[var(--brand)] active:scale-[0.98]"
            >
              Savatga qo'shish
            </button>
            <button
              type="button"
              onClick={() => onQuickOrder(product)}
              className="h-12 rounded-2xl bg-[var(--brand)] text-sm font-semibold text-white shadow-sm active:scale-[0.98]"
            >
              Tez buyurtma →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
