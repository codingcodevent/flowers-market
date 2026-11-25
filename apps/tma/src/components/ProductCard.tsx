import { Minus, Plus } from 'lucide-react';
import { formatSum, type Product } from '@gul/shared';

interface ProductCardProps {
  product: Product;
  quantity: number;
  priority?: boolean;
  onSelect: (product: Product) => void;
  onAdd: (id: string) => void;
  onDecrement: (id: string) => void;
}

export function ProductCard({
  product,
  quantity,
  priority = false,
  onSelect,
  onAdd,
  onDecrement,
}: ProductCardProps) {
  return (
    <article className="product-card-cv flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-[0_1px_3px_rgba(31,23,26,0.04)]">
      <div>
        <button
          type="button"
          onClick={() => onSelect(product)}
          className="relative block aspect-square w-full overflow-hidden rounded-xl bg-[var(--surface-muted)] text-left"
        >
          <img
            src={product.image}
            alt={product.title}
            width={400}
            height={400}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding="async"
            className="h-full w-full object-cover transition duration-300 active:scale-[1.02]"
          />
          {product.badge && (
            <span className="absolute left-2 top-2 rounded-full bg-[var(--brand)] px-2 py-0.5 text-[11px] font-semibold text-white shadow-sm">
              {product.badge}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onSelect(product)}
          className="mt-2 block w-full text-left"
        >
          <h3 className="line-clamp-1 text-sm font-semibold text-[var(--text)]">
            {product.title}
          </h3>
          <p className="mt-0.5 line-clamp-1 text-xs text-[var(--text-muted)]">
            {product.subtitle}
          </p>
        </button>
      </div>

      <div className="mt-2.5 flex items-end justify-between gap-1.5 border-t border-[var(--border)] pt-2">
        <div className="min-w-0">
          {product.oldPrice && (
            <div className="text-[11px] text-[var(--text-muted)] line-through">
              {formatSum(product.oldPrice)}
            </div>
          )}
          <div className="truncate text-sm font-bold tabular-nums text-[var(--text)]">
            {formatSum(product.price)}
          </div>
        </div>

        {quantity === 0 ? (
          <button
            type="button"
            onClick={() => onAdd(product.id)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--brand)] text-white shadow-sm transition active:scale-90"
            aria-label={`${product.title} savatga qo'shish`}
          >
            <Plus className="h-4 w-4" />
          </button>
        ) : (
          <div className="flex h-9 shrink-0 items-center gap-1 rounded-xl bg-[var(--brand-soft)] px-1">
            <button
              type="button"
              onClick={() => onDecrement(product.id)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--brand)] active:bg-[var(--surface)]"
              aria-label="Kamaytirish"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="min-w-[16px] text-center text-xs font-bold tabular-nums text-[var(--brand)]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => onAdd(product.id)}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--brand)] text-white active:scale-90"
              aria-label="Ko'paytirish"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
