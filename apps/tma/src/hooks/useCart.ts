import { useCallback, useEffect, useMemo, useState } from 'react';
import { getProductById, type CartLineItem } from '@gul/shared';
import { hapticImpact } from '../lib/telegram';

const STORAGE_KEY = 'flora_tma_cart_v1';

type CartQuantities = Record<string, number>;

function readInitialCart(): CartQuantities {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const clean: CartQuantities = {};
    for (const [id, qty] of Object.entries(parsed)) {
      if (typeof qty === 'number' && qty > 0 && getProductById(id)) {
        clean[id] = Math.min(99, Math.round(qty));
      }
    }
    return clean;
  } catch {
    return {};
  }
}

export function useCart() {
  const [quantities, setQuantities] = useState<CartQuantities>(readInitialCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(quantities));
    } catch {
      // storage full or restricted
    }
  }, [quantities]);

  const add = useCallback((productId: string) => {
    hapticImpact('light');
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.min(99, (prev[productId] || 0) + 1),
    }));
  }, []);

  const decrement = useCallback((productId: string) => {
    hapticImpact('light');
    setQuantities((prev) => {
      const current = prev[productId] || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[productId];
        return next;
      }
      return { ...prev, [productId]: current - 1 };
    });
  }, []);

  const remove = useCallback((productId: string) => {
    setQuantities((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setQuantities({});
  }, []);

  const items: CartLineItem[] = useMemo(() => {
    const list: CartLineItem[] = [];
    for (const [productId, quantity] of Object.entries(quantities)) {
      const product = getProductById(productId);
      if (product && quantity > 0) {
        list.push({
          productId: product.id,
          title: product.title,
          price: product.price,
          quantity,
        });
      }
    }
    return list;
  }, [quantities]);

  const totalCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  return {
    quantities,
    items,
    totalCount,
    totalPrice,
    add,
    decrement,
    remove,
    clear,
  };
}
