"use client";

import { useEffect, useState } from "react";
import { getCart, CartItem } from "@/utils/cart";

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [deliveryType, setDeliveryType] = useState("delivery");

  useEffect(() => {
    setCart(getCart());
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  if (cart.length === 0) {
    alert("Кошик порожній");
    return;
  }

  const formData = new FormData(event.currentTarget);

  const customerName = String(formData.get("customerName") || "");
  const customerPhone = String(formData.get("customerPhone") || "");
  const address = String(formData.get("address") || "");
  const comment = String(formData.get("comment") || "");

  if (!customerName.trim()) {
    alert("Введіть ім’я");
    return;
  }

  if (!customerPhone.trim()) {
    alert("Введіть номер телефону");
    return;
  }

  if (deliveryType === "delivery" && !address.trim()) {
    alert("Введіть адресу доставки");
    return;
  }

  const response = await fetch("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customerName,
      customerPhone,
      deliveryType,
      address,
      comment,
      cart,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    alert("Помилка: " + data.error);
    return;
  }

  localStorage.removeItem("restaurant_cart");
  window.location.href = `/payment/${data.orderId}`;
}

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 text-black">
      <h1 className="mb-6 text-3xl font-bold text-white">Оформлення замовлення</h1>

      {cart.length === 0 ? (
        <div className="rounded-lg border bg-white p-6">
          <p className="text-gray-700">Кошик порожній.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <form
            onSubmit={handleSubmit}
            className="rounded-lg border bg-white p-6 space-y-4"
          >
            <div>
              <label className="mb-1 block font-medium">Ім’я</label>
              <input
                name="customerName"
                className="w-full rounded border px-3 py-2 text-black"
                placeholder="Ваше ім’я"
              />
            </div>

            <div>
              <label className="mb-1 block font-medium">Телефон</label>
              <input
                name="customerPhone"
                className="w-full rounded border px-3 py-2 text-black"
                placeholder="+380..."
              />
            </div>

            <div>
              <label className="mb-1 block font-medium">Тип отримання</label>

              <select
                name="deliveryType"
                value={deliveryType}
                onChange={(event) => setDeliveryType(event.target.value)}
                className="w-full rounded border px-3 py-2 text-black"
              >
                <option value="delivery">Доставка</option>
                <option value="pickup">Самовивіз</option>
              </select>
            </div>

            {deliveryType === "delivery" && (
              <div>
                <label className="mb-1 block font-medium">Адреса</label>
                <input
                  name="address"
                  className="w-full rounded border px-3 py-2 text-black"
                  placeholder="Вулиця, будинок, квартира"
                />
              </div>
            )}

            <div>
              <label className="mb-1 block font-medium">Коментар</label>
              <textarea
                name="comment"
                className="w-full rounded border px-3 py-2 text-black"
                placeholder="Побажання до замовлення"
                rows={4}
              />
            </div>

            <button
              type="submit"
              className="w-full rounded bg-black px-5 py-3 text-white hover:bg-gray-800"
            >
              Підтвердити замовлення
            </button>
          </form>

          <div className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">Ваше замовлення</h2>

            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>{item.price * item.quantity} грн</span>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t pt-4 text-right text-xl font-bold">
              Разом: {total} грн
            </div>
          </div>
        </div>
      )}
    </main>
  );
}