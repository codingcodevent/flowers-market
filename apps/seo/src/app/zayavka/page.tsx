import type { Metadata } from 'next';
import { MobileShell } from '@/components/MobileShell';
import { WebOrderForm } from '@/components/WebOrderForm';

export const metadata: Metadata = {
  title: 'Zayavka qoldirish — Tezkor buyurtma',
  description:
    "Individual gul buketi yoki tezkor qayta qo'ng'iroq uchun onlayn zayavka formasi.",
  alternates: { canonical: '/zayavka' },
};

export default function OrderPage() {
  return (
    <MobileShell activeHref="/zayavka">
      <div className="mb-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3.5">
        <h1 className="text-lg font-bold">Onlayn Zayavka</h1>
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          Raqamingizni qoldiring — floristimiz 5 daqiqada bog'lanib guldasta variantlarini
          ko'rsatadi.
        </p>
      </div>
      <WebOrderForm />
    </MobileShell>
  );
}
