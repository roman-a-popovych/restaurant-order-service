"use client";

import { useParams } from "next/navigation";

export default function PaymentPage() {
  const params = useParams();
  const orderId = params.orderId;

  async function updatePaymentStatus(status: "paid" | "failed") {
    const response = await fetch(`/api/orders/${orderId}/payment`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentStatus: status,
      }),
    });

    if (!response.ok) {
      alert("Не вдалося оновити статус оплати");
      return;
    }

    if (status === "paid") {
      window.location.href = `/payment/success?orderId=${orderId}`;
    } else {
      window.location.href = `/payment/failed?orderId=${orderId}`;
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10 text-black">
      <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
        <h1 className="mb-4 text-3xl font-bold">Тестова оплата</h1>

        <p className="mb-6 text-gray-700">
          Замовлення №{orderId}. На цьому етапі імітуємо роботу платіжної
          системи.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => updatePaymentStatus("paid")}
            className="rounded bg-green-600 px-5 py-3 text-white hover:bg-green-700"
          >
            Оплата успішна
          </button>

          <button
            onClick={() => updatePaymentStatus("failed")}
            className="rounded bg-red-600 px-5 py-3 text-white hover:bg-red-700"
          >
            Оплата неуспішна
          </button>
        </div>
      </div>
    </main>
  );
}