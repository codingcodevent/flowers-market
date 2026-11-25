import type { Metadata } from 'next';
import { Clock, Truck } from 'lucide-react';
import { DELIVERY_ZONES, formatSum } from '@gul/shared';
import { MobileShell } from '@/components/MobileShell';

export const metadata: Metadata = {
  title: 'Dostavka va yetkazib berish shartlari',
  description:
    "Toshkent markazi va barcha tumanlarga 45-90 daqiqada gullar yetkazib berish tariflari.",
  alternates: { canonical: '/dostavka' },
};

export default function DeliveryPage() {
  return (
    <MobileShell activeHref="/dostavka">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <div className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-[var(--brand)]" />
          <h1 className="text-lg font-bold">Dostavka shartlari</h1>
        </div>
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          Buyurtmangiz maxsus suv kapsulasi va himoya o'ramida yetkaziladi.
        </p>
      </div>

      <div className="mt-3 space-y-2.5">
        {DELIVERY_ZONES.map((z) => (
          <div
            key={z.id}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3.5"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold">{z.name}</h2>
              <span className="rounded-full bg-[var(--surface-muted)] px-2.5 py-0.5 text-xs font-semibold">
                {z.price === 0 ? 'Bepul' : formatSum(z.price)}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs text-[var(--brand)]">
              <Clock className="h-3.5 w-3.5" />
              {z.eta}
            </div>
            <p className="mt-1.5 text-xs text-[var(--text-muted)]">{z.note}</p>
          </div>
        ))}
      </div>
    </MobileShell>
  );
}
