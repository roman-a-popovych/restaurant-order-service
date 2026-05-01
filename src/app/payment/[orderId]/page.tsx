"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Order = {
  id: number;
  customer_name: string;
  customer_phone: string;
  total_amount: number;
  payment_status: string;
  order_status: string;
};

export default function PaymentPage() {
  const params = useParams();
  const orderId = String(params.orderId);

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPreparingPayment, setIsPreparingPayment] = useState(false);

  useEffect(() => {
    async function loadOrder() {
      try {
        const response = await fetch(`/api/orders/${orderId}`);

        const data = await response.json();

        if (!response.ok) {
          alert("Не вдалося завантажити замовлення: " + data.error);
          return;
        }

        setOrder(data.order);
      } catch {
        alert("Помилка завантаження замовлення");
      } finally {
        setIsLoading(false);
      }
    }

    loadOrder();
  }, [orderId]);

async function prepareWayForPayPayment() {
  if (!order) {
    return;
  }

  setIsPreparingPayment(true);

  try {
    const response = await fetch("/api/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: order.id,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert("Помилка підготовки платежу: " + data.error);
      return;
    }

    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://secure.wayforpay.com/pay";

    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = `${key}[]`;
          input.value = String(item);
          form.appendChild(input);
        });
      } else {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      }
    });

    document.body.appendChild(form);
    form.submit();
  } catch {
    alert("Не вдалося перейти до оплати");
  } finally {
    setIsPreparingPayment(false);
  }
}

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

  if (isLoading) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-10 text-black">
        <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
          <p className="text-gray-700">Завантаження замовлення...</p>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-10 text-black">
        <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
          <h1 className="mb-4 text-2xl font-bold">Замовлення не знайдено</h1>
          <p className="text-gray-700">
            Перевірте посилання або створіть нове замовлення.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10 text-black">
      <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
        <h1 className="mb-4 text-3xl font-bold">Оплата замовлення</h1>

        <div className="mb-6 space-y-2 text-gray-700">
          <p>
            Замовлення №<span className="font-semibold">{order.id}</span>
          </p>

          <p>
            Клієнт:{" "}
            <span className="font-semibold">{order.customer_name}</span>
          </p>

          <p>
            Сума до оплати:{" "}
            <span className="font-bold text-black">
              {Number(order.total_amount)} грн
            </span>
          </p>

          <p>
            Статус оплати:{" "}
            <span className="font-semibold">{order.payment_status}</span>
          </p>
        </div>

        <button
          onClick={prepareWayForPayPayment}
          disabled={isPreparingPayment}
          className="mb-6 w-full rounded bg-black px-5 py-3 text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {isPreparingPayment
            ? "Підготовка платежу..."
            : "Підготувати оплату WayForPay"}
        </button>

        <div className="rounded-lg border bg-gray-50 p-4">
          <p className="mb-4 text-sm text-gray-600">
            Навчальний тестовий режим. Ці кнопки імітують відповідь платіжної
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
      </div>
    </main>
  );
}