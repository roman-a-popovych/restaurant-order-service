type StatusBadgeProps = {
  type: "payment" | "order";
  value: string;
};

export default function StatusBadge({ type, value }: StatusBadgeProps) {
  const map: Record<string, { label: string; color: string }> = {
    // payment
    pending: { label: "Очікує оплату", color: "bg-yellow-100 text-yellow-800" },
    paid: { label: "Оплачено", color: "bg-green-100 text-green-800" },
    failed: { label: "Помилка", color: "bg-red-100 text-red-800" },

    // order
    new: { label: "Нове", color: "bg-gray-200 text-gray-800" },
    confirmed: { label: "Підтверджено", color: "bg-blue-100 text-blue-800" },
    preparing: { label: "Готується", color: "bg-orange-100 text-orange-800" },
    ready: { label: "Готове", color: "bg-purple-100 text-purple-800" },
    completed: { label: "Видане", color: "bg-green-200 text-green-900" },
    cancelled: { label: "Скасоване", color: "bg-red-200 text-red-900" },
  };

  const item = map[value];

  if (!item) return <span>{value}</span>;

  return (
    <span
      className={`px-2 py-1 rounded text-sm font-medium ${item.color}`}
    >
      {item.label}
    </span>
  );
}