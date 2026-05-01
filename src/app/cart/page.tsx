"use client";

import { useEffect, useState } from "react";
import { CartItem, getCart, saveCart } from "@/utils/cart";

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    setCart(getCart());
  }, []);

  function updateQuantity(id: number, quantity: number) {
    const updatedCart = cart
      .map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
      .filter((item) => item.quantity > 0);

    setCart(updatedCart);
    saveCart(updatedCart);
  }

  function removeItem(id: number) {
    const updatedCart = cart.filter((item) => item.id !== id);

    setCart(updatedCart);
    saveCart(updatedCart);
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="mb-6 text-3xl font-bold text-white">Кошик</h1>

      {cart.length === 0 ? (
        <div className="rounded-lg border bg-white p-6">
          <p className="text-gray-600">Кошик поки що порожній.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg border bg-white p-4"
            >
              <div>
                <h2 className="text-lg font-semibold text-black">{item.name}</h2>
                <p className="text-gray-700">{item.price} грн</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="rounded bg-gray-200 px-3 py-1 text-black hover:bg-gray-300"
                >
                  -
                </button>

                <span className="text-black font-semibold min-w-[20px] text-center">{item.quantity}</span>

                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="rounded bg-gray-200 px-3 py-1 text-black hover:bg-gray-300"
                >
                  +
                </button>

                <button
                  onClick={() => removeItem(item.id)}
                  className="rounded bg-red-600 px-3 py-1 text-white"
                >
                  Видалити
                </button>
              </div>
            </div>
          ))}

          <div className="rounded-lg border bg-white p-6 text-right">
            <p className="text-xl font-bold text-black">Разом: {total} грн</p>

            <a
              href="/checkout"
              className="mt-4 inline-block rounded bg-black px-5 py-2 text-white hover:bg-gray-800"
            >
              Оформити замовлення
            </a>
          </div>
        </div>
      )}
    </main>
  );
}