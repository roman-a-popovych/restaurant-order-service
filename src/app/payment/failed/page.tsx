import Link from "next/link";

export default function PaymentFailedPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-10 text-black">
      <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
        <h1 className="mb-4 text-3xl font-bold text-red-700">
          Оплата неуспішна
        </h1>

        <p className="mb-6 text-gray-700">
          На жаль, оплату не вдалося завершити.
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