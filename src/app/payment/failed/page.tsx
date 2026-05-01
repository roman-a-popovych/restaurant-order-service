import Link from "next/link";

type FailedPaymentPageProps = {
  searchParams: Promise<{
    orderId?: string;
  }>;
};

export default async function FailedPaymentPage({
  searchParams,
}: FailedPaymentPageProps) {
  const params = await searchParams;
  const orderId = params.orderId;

  return (
    <main className="mx-auto max-w-2xl px-6 py-10 text-black">
      <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl">
          ✕
        </div>

        <h1 className="mb-4 text-3xl font-bold text-red-700">
          Оплата не була підтверджена
        </h1>

        {orderId && (
          <p className="mb-4 text-gray-700">
            Номер замовлення:{" "}
            <span className="font-semibold">#{orderId}</span>
          </p>
        )}

        <p className="mb-4 text-gray-700">
          Платіжна система повернула неуспішний результат оплати.
        </p>

        <p className="mb-6 rounded-lg bg-gray-100 p-4 text-sm text-gray-700">
          У тестовому режимі WayForPay тестові картки завжди повертають
          неуспішний результат. Це означає, що інтеграція працює коректно:
          сервіс отримав відповідь від платіжної системи та оновив статус
          платежу.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/menu"
            className="rounded bg-black px-5 py-3 text-white hover:bg-gray-800"
          >
            Повернутися до меню
          </Link>

          <Link
            href="/admin/orders"
            className="rounded border px-5 py-3 text-black hover:bg-gray-100"
          >
            Перейти в адмінку
          </Link>
        </div>
      </div>
    </main>
  );
}