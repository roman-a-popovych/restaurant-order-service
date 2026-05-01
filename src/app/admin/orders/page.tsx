export const dynamic = "force-dynamic";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";

export default async function AdminOrdersPage() {
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 text-black">
      <h1 className="mb-6 text-3xl font-bold text-white">Замовлення</h1>

      <div className="rounded-lg border bg-white overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Клієнт</th>
              <th className="p-3">Телефон</th>
              <th className="p-3">Сума</th>
              <th className="p-3">Оплата</th>
              <th className="p-3">Статус</th>
              <th className="p-3"></th>
            </tr>
          </thead>

          <tbody>
            {orders?.map((order) => (
              <tr key={order.id} className="border-t hover:bg-gray-50 transition">
                <td className="p-3">{order.id}</td>
                <td className="p-3">{order.customer_name}</td>
                <td className="p-3">{order.customer_phone}</td>
                <td className="p-3">{order.total_amount} грн</td>
                <td className="p-3">
                  <StatusBadge type="payment" value={order.payment_status} />
                </td>
                <td className="p-3">
                  <StatusBadge type="order" value={order.order_status} />
                </td>

                <td className="p-3">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Деталі
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}