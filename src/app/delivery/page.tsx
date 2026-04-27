export default function DeliveryPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 text-white">
      <h1 className="mb-6 text-3xl font-bold">
        Оплата і доставка
      </h1>

      <div className="space-y-6 text-gray-300">
        <section>
          <h2 className="text-xl font-semibold mb-2 text-white">
            Доставка
          </h2>
          <p>
            Ми здійснюємо доставку по місту протягом 30–60 хвилин
            залежно від завантаженості кухні та відстані.
          </p>
          <p>
            Мінімальна сума замовлення для доставки — 200 грн.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-white">
            Самовивіз
          </h2>
          <p>
            Ви можете забрати замовлення самостійно з нашого
            закладу після підтвердження.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-white">
            Оплата
          </h2>
          <p>
            Оплата здійснюється онлайн за допомогою платіжної системи
            або при отриманні замовлення.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-white">
            Час роботи
          </h2>
          <p>
            Ми працюємо щодня з 10:00 до 22:00.
          </p>
        </section>
      </div>
    </main>
  );
}