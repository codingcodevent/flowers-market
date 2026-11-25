import { Camera, Clock, ShieldCheck, Truck } from 'lucide-react';
import { DELIVERY_ZONES, formatSum } from '@gul/shared';

interface DeliveryViewProps {
  selectedZoneId: string;
  cartTotal: number;
  onSelectZone: (zoneId: string) => void;
  onProceedOrder: () => void;
}

export function DeliveryView({
  selectedZoneId,
  cartTotal,
  onSelectZone,
  onProceedOrder,
}: DeliveryViewProps) {
  return (
    <section className="space-y-3 px-3.5 py-3" aria-label="Dostavka shartlari">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3.5">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)]">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[var(--text)]">Tezkor Dostavka</h1>
            <p className="text-xs text-[var(--text-muted)]">
              Toshkent bo'ylab 45–90 daqiqada ehtiyotkor kuryerlik
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          Hududni tanlang
        </h2>
        {DELIVERY_ZONES.map((zone) => {
          const isSelected = selectedZoneId === zone.id;
          const isFree =
            zone.price === 0 || (zone.freeFrom !== undefined && cartTotal >= zone.freeFrom);

          return (
            <button
              key={zone.id}
              type="button"
              onClick={() => onSelectZone(zone.id)}
              className={`w-full rounded-2xl border p-3 text-left transition active:scale-[0.99] ${
                isSelected
                  ? 'border-[var(--brand)] bg-[var(--brand-soft)]/50'
                  : 'border-[var(--border)] bg-[var(--surface)]'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-[var(--text)]">{zone.name}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    isFree
                      ? 'bg-[var(--leaf-soft)] text-[var(--leaf)]'
                      : 'bg-[var(--surface-muted)] text-[var(--text)]'
                  }`}
                >
                  {isFree ? 'Bepul' : formatSum(zone.price)}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-[var(--brand)]">
                <Clock className="h-3.5 w-3.5" />
                <span>{zone.eta}</span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-muted)]">{zone.note}</p>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
          <Camera className="h-4 w-4 text-[var(--brand)]" />
          <h3 className="mt-1.5 text-xs font-bold text-[var(--text)]">Yuborishdan oldin rasm</h3>
          <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">
            Tayyor buket rasmi Telegramingizga tashlanadi.
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
          <ShieldCheck className="h-4 w-4 text-[var(--leaf)]" />
          <h3 className="mt-1.5 text-xs font-bold text-[var(--text)]">Suv kapsulasi</h3>
          <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">
            Yo'lda gullar so'lib qolmasligi uchun himoya o'rami.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onProceedOrder}
        className="h-12 w-full rounded-2xl bg-[var(--brand)] text-sm font-semibold text-white shadow-sm active:scale-[0.98]"
      >
        Tanlangan hudud bilan zayavka berish →
      </button>
    </section>
  );
}
