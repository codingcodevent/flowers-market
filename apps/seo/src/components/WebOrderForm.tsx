'use client';

import { useState, type FormEvent } from 'react';
import { CheckCircle2, Send } from 'lucide-react';
import { DELIVERY_ZONES, isValidUzPhone, type OrderResponse } from '@gul/shared';

export function WebOrderForm() {
  const [phone, setPhone] = useState('+998 ');
  const [address, setAddress] = useState('');
  const [zoneId, setZoneId] = useState('tashkent-center');
  const [occasion, setOccasion] = useState("Tug'ilgan kun uchun guldasta");
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OrderResponse | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isValidUzPhone(phone)) {
      setError("Iltimos, to'g'ri O'zbekiston raqamini kiriting (+998 90 ...).");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderType: 'custom',
          phone,
          address,
          deliveryZoneId: zoneId,
          deliveryTime: 'Eng yaqin 60–90 daqiqa',
          customOccasion: occasion,
          comment,
          items: [],
          source: 'seo-web',
        }),
      });
      const data = (await res.json()) as OrderResponse & { error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Zayavka yuborishda xatolik');
      }
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xatolik yuz berdi');
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="rounded-2xl border border-[var(--leaf)]/40 bg-[var(--surface)] p-5 text-center">
        <CheckCircle2 className="mx-auto h-9 w-9 text-[var(--leaf)]" />
        <h2 className="mt-2 text-base font-bold">Zayavka qabul qilindi</h2>
        <p className="mt-1 font-mono text-sm font-semibold text-[var(--brand)]">
          #{result.orderId}
        </p>
        <p className="mt-2 text-xs text-[var(--text-muted)]">{result.message}</p>
        <button
          type="button"
          onClick={() => setResult(null)}
          className="mt-4 h-10 rounded-xl bg-[var(--brand)] px-4 text-xs font-semibold text-white"
        >
          Yana zayavka qoldirish
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
    >
      <label className="block space-y-1">
        <span className="text-xs font-medium text-[var(--text-muted)]">Telefon raqamingiz *</span>
        <input
          required
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+998 90 123 45 67"
          className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 text-sm focus:border-[var(--brand)] focus:outline-none"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-xs font-medium text-[var(--text-muted)]">Hudud</span>
        <select
          value={zoneId}
          onChange={(e) => setZoneId(e.target.value)}
          className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 text-sm focus:border-[var(--brand)] focus:outline-none"
        >
          {DELIVERY_ZONES.map((z) => (
            <option key={z.id} value={z.id}>
              {z.name} ({z.eta})
            </option>
          ))}
        </select>
      </label>

      <label className="block space-y-1">
        <span className="text-xs font-medium text-[var(--text-muted)]">Manzil *</span>
        <input
          required
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Tuman, ko'cha yoki mo'ljal"
          className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 text-sm focus:border-[var(--brand)] focus:outline-none"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-xs font-medium text-[var(--text-muted)]">Qanday gul yoki tadbir?</span>
        <input
          type="text"
          value={occasion}
          onChange={(e) => setOccasion(e.target.value)}
          className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 text-sm focus:border-[var(--brand)] focus:outline-none"
        />
      </label>

      <textarea
        rows={2}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Qo'shimcha izoh..."
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 text-sm focus:border-[var(--brand)] focus:outline-none"
      />

      {error && <p className="text-xs font-medium text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand)] text-sm font-semibold text-white disabled:opacity-60"
      >
        <Send className="h-4 w-4" />
        <span>{submitting ? 'Yuborilmoqda...' : 'Zayavka yuborish'}</span>
      </button>
    </form>
  );
}
