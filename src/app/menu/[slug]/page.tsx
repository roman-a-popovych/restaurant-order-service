import Link from "next/link";
import DishCard from "@/components/DishCard";
import { supabase } from "@/lib/supabase/client";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!category) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10 text-white">
        <h1 className="mb-4 text-3xl font-bold text-white">Категорію не знайдено</h1>

        <Link href="/menu" className="text-blue-600 hover:underline">
          Повернутися до меню
        </Link>
      </main>
    );
  }

  const { data: dishes } = await supabase
    .from("dishes")
    .select("*")
    .eq("category_id", category.id)
    .eq("is_available", true)
    .order("id", { ascending: true });

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 text-white">
      <Link href="/menu" className="mb-6 inline-block text-white hover:underline">
        ← Назад до категорій
      </Link>

      <h1 className="mb-6 text-3xl font-bold">{category.name}</h1>

      {dishes && dishes.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {dishes.map((dish) => (
            <DishCard
              key={dish.id}
              id={dish.id}
              name={dish.name}
              price={dish.price}
              description={dish.description}
              image_url={dish.image_url}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border bg-white p-6">
          <p className="text-gray-700">
            У цій категорії поки що немає доступних позицій.
          </p>
        </div>
      )}
    </main>
  );
}   