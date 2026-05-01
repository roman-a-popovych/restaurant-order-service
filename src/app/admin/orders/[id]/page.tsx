import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import OrderStatusSelect from "@/components/OrderStatusSelect";
import StatusBadge from "@/components/StatusBadge";

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  const { data: items } = await supabase
    .from("order_items")
    .select(`
      id,
      dish_id,
      quantity,
      price,
      subtotal,
      dishes (
        name
      )
    `)
    .eq("order_id", id);

  if (!order) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-10 text-black">
        <div className="rounded-lg border bg-white p-6">
          <h1 className="mb-4 text-2xl font-bold text-white">Замовлення не знайдено</h1>
          <Link href="/admin/orders" className="text-blue-600 hover:underline">
            Повернутися до списку замовлень
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 text-black">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">
          Замовлення №{order.id}
        </h1>

        <Link href="/admin/orders" className="text-blue-600 hover:underline text-white" >
          ← Назад до списку
        </Link>
      </div>

      <div className="space-y-4 rounded-lg border bg-white p-6">
        <p>
          <b>Клієнт:</b> {order.customer_name}
        </p>

        <p>
          <b>Телефон:</b> {order.customer_phone}
        </p>

        <p>
          <b>Тип:</b>{" "}
          {order.delivery_type === "delivery" ? "Доставка" : "Самовивіз"}
        </p>

        {order.delivery_type === "delivery" && (
          <p>
            <b>Адреса:</b> {order.address || "Не вказано"}
          </p>
        )}

        <p>
          <b>Коментар:</b> {order.comment || "Без коментаря"}
        </p>

        <div className="flex items-center gap-2">
          <b>Оплата:</b>
          <StatusBadge value={order.payment_status} type="payment" />
        </div>

        <div>
          <b>Статус замовлення:</b>

          <div className="mt-2 flex items-center gap-3">
            <StatusBadge value={order.order_status} type="order" />

            <OrderStatusSelect
              orderId={order.id}
              currentStatus={order.order_status}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-xl font-bold">Склад замовлення</h2>

        {items && items.length > 0 ? (
          <div className="space-y-3">
            {items.map((item) => {
              const dishName =
                (item.dishes as { name?: string } | null)?.name ||
                `Товар #${item.dish_id}`;

              return (
                <div
                  key={item.id}
                  className="flex justify-between rounded border bg-gray-50 p-3"
                >
                  <div>
                    <p className="font-medium text-black">
                      {dishName} × {item.quantity}
                    </p>

                    <p className="text-sm text-gray-600">
                      Ціна за одиницю: {Number(item.price)} грн
                    </p>
                  </div>

                  <span className="font-semibold text-black">
                    {Number(item.subtotal)} грн
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-600">У цьому замовленні немає товарів.</p>
        )}
      </div>
    </main>
  );
}