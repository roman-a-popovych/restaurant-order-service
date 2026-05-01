import Link from "next/link";

type SuccessPaymentPageProps = {
  searchParams: Promise<{
    orderId?: string;
  }>;
};

export default async function SuccessPaymentPage({
  searchParams,
}: SuccessPaymentPageProps) {
  const params = await searchParams;
  const orderId = params.orderId;

  return (
    <main className="mx-auto max-w-2xl px-6 py-10 text-black">
      <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
          ✓
        </div>

        <h1 className="mb-4 text-3xl font-bold text-green-700">
          Оплату успішно виконано
        </h1>

        {orderId && (
          <p className="mb-4 text-gray-700">
            Номер замовлення:{" "}
            <span className="font-semibold">#{orderId}</span>
          </p>
        )}

        <p className="mb-6 text-gray-700">
          Дякуємо! Ваше замовлення прийнято в обробку.
        </p>

        <Link
          href="/menu"
          className="inline-block rounded bg-black px-5 py-3 text-white hover:bg-gray-800"
        >
          Повернутися до меню
        </Link>
      </div>
    </main>
  );
}