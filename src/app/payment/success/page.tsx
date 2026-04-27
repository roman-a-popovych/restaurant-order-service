import Link from "next/link";

export default function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  return (
    <main className="mx-auto max-w-2xl px-6 py-10 text-black">
      <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
        <h1 className="mb-4 text-3xl font-bold text-green-700">
          Оплата успішна
        </h1>

        <p className="mb-6 text-gray-700">
          Замовлення оплачено. Дякуємо!
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