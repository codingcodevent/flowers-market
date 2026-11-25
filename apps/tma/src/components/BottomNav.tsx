import { ClipboardList, Flower2, Gift, Sparkles, Truck } from 'lucide-react';
import type { ActiveTab } from './TopHeader';

interface BottomNavProps {
  activeTab: ActiveTab;
  cartCount: number;
  onChange: (tab: ActiveTab) => void;
}

const NAV_ITEMS: Array<{
  id: ActiveTab;
  label: string;
  Icon: typeof Flower2;
}> = [
  { id: 'gullar', label: 'Gullar', Icon: Flower2 },
  { id: 'buketlar', label: 'Buketlar', Icon: Sparkles },
  { id: 'sovgalar', label: "Sovg'alar", Icon: Gift },
  { id: 'dostavka', label: 'Dostavka', Icon: Truck },
  { id: 'zayavka', label: 'Zayavka', Icon: ClipboardList },
];

export function BottomNav({ activeTab, cartCount, onChange }: BottomNavProps) {
  return (
    <nav
      aria-label="Pastki mobil menyu"
      className="fixed bottom-0 left-1/2 z-30 w-full max-w-[480px] -translate-x-1/2 border-t border-[var(--border)] bg-[var(--surface)]/95 px-2 pt-1.5 pb-safe backdrop-blur-md"
    >
      <div className="grid grid-cols-5 gap-1">
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`relative flex flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 text-[11px] font-medium transition active:scale-95 ${
                active
                  ? 'bg-[var(--brand-soft)] text-[var(--brand)]'
                  : 'text-[var(--text-muted)]'
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.3 : 1.9} />
              <span>{label}</span>
              {id === 'zayavka' && cartCount > 0 && (
                <span className="absolute right-3 top-1 h-2 w-2 rounded-full bg-[var(--brand)]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
