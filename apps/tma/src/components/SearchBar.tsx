import { ArrowUpDown, Search, X } from 'lucide-react';
import { QUICK_SEARCH_TAGS } from '@gul/shared';

interface SearchBarProps {
  value: string;
  onChange: (next: string) => void;
  sortBy: 'relevance' | 'price-asc' | 'price-desc';
  onSortChange: (next: 'relevance' | 'price-asc' | 'price-desc') => void;
  resultCount: number;
  elapsedMs: number;
}

export function SearchBar({
  value,
  onChange,
  sortBy,
  onSortChange,
  resultCount,
  elapsedMs,
}: SearchBarProps) {
  const cycleSort = () => {
    if (sortBy === 'relevance') onSortChange('price-asc');
    else if (sortBy === 'price-asc') onSortChange('price-desc');
    else onSortChange('relevance');
  };

  const sortLabel =
    sortBy === 'relevance' ? 'Tavsiya' : sortBy === 'price-asc' ? 'Arzonroq' : 'Qimmatroq';

  return (
    <section className="space-y-2 px-3.5 pt-3 pb-1" aria-label="Katalog qidiruvi">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="search"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Gul, buket, 101 yoki sovg'a qidiring..."
            className="h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] pl-9 pr-9 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-[var(--brand)] focus:outline-none"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--surface-muted)] text-[var(--text-muted)]"
              aria-label="Qidiruvni tozalash"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={cycleSort}
          className="flex h-11 shrink-0 items-center gap-1.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 text-xs font-medium text-[var(--text)] active:scale-95"
        >
          <ArrowUpDown className="h-3.5 w-3.5 text-[var(--brand)]" />
          <span>{sortLabel}</span>
        </button>
      </div>

      {/* Tezkor qidiruv teglari va qidiruv tezligi */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {QUICK_SEARCH_TAGS.map((tag) => {
            const active = value.toLowerCase() === tag.toLowerCase();
            return (
              <button
                key={tag}
                type="button"
                onClick={() => onChange(active ? '' : tag)}
                className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium transition ${
                  active
                    ? 'border-[var(--brand)] bg-[var(--brand)] text-white'
                    : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)]'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        <span className="shrink-0 font-mono text-[11px] tabular-nums text-[var(--text-muted)]">
          {resultCount} ta · {elapsedMs}ms
        </span>
      </div>
    </section>
  );
}
