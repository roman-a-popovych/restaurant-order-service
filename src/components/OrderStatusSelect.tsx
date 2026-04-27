"use client";

import { useState } from "react";

type OrderStatusSelectProps = {
  orderId: number;
  currentStatus: string;
};

const statuses = [
  { value: "new", label: "Нове" },
  { value: "confirmed", label: "Підтверджено" },
  { value: "preparing", label: "Готується" },
  { value: "ready", label: "Готове" },
  { value: "completed", label: "Видане" },
  { value: "cancelled", label: "Скасоване" },
];

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: OrderStatusSelectProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isSaving, setIsSaving] = useState(false);

  async function handleChange(newStatus: string) {
    setStatus(newStatus);
    setIsSaving(true);

    const response = await fetch(`/api/orders/${orderId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderStatus: newStatus,
      }),
    });

    setIsSaving(false);

    if (!response.ok) {
      alert("Не вдалося оновити статус");
      setStatus(currentStatus);
      return;
    }

    alert("Статус оновлено");
  }

  return (
    <div className="flex items-center gap-3">
      <select
        value={status}
        onChange={(event) => handleChange(event.target.value)}
        disabled={isSaving}
        className="rounded border px-3 py-2 text-black"
      >
        {statuses.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>

      {isSaving && <span className="text-sm text-gray-600">Збереження...</span>}
    </div>
  );
}