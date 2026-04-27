import { supabase } from "@/lib/supabase/client";
import OrderStatusSelect from "@/components/OrderStatusSelect";

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
    .select("*")
    .eq("order_id", id);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 text-black">
      <h1 className="mb-6 text-3xl font-bold">
        Замовлення №{order?.id}
      </h1>

      <div className="space-y-4 rounded-lg border bg-white p-6">
        <p><b>Клієнт:</b> {order?.customer_name}</p>
        <p><b>Телефон:</b> {order?.customer_phone}</p>
        <p><b>Тип:</b> {order?.delivery_type}</p>
        <p><b>Адреса:</b> {order?.address}</p>
        <p><b>Коментар:</b> {order?.comment}</p>
        <p><b>Оплата:</b> {order?.payment_status}</p>
        <div>
          <b>Статус:</b>
          {order && (
            <div className="mt-2">
              <OrderStatusSelect
                orderId={order.id}
                currentStatus={order.order_status}
              />
            </div>
        )}
        </div>
      </div>

      <div className="mt-6 rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-xl font-bold">Склад замовлення</h2>

        {items?.map((item) => (
          <div key={item.id} className="flex justify-between border-b py-2">
            <span>Товар #{item.dish_id} × {item.quantity}</span>
            <span>{item.subtotal} грн</span>
          </div>
        ))}
      </div>
    </main>
  );
}