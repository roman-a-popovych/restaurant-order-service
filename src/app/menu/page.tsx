import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

function getCategoryImage(slug: string) {
  return `/categories/cat_${slug}.png`;
}

export default async function MenuPage() {
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("id", { ascending: true });

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 text-black">
      <h1 className="mb-6 text-3xl font-bold text-white">Меню</h1>

      <p className="mb-8 text-gray-700">
         {/* Оберіть категорію, щоб переглянути доступні страви та напої. */}
      </p>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {categories?.map((category) => (
          <Link
            key={category.id}
            href={`/menu/${category.slug}`}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="relative aspect-[2/1] w-full bg-gray-200">
              <Image
                src={getCategoryImage(category.slug)}
                alt={category.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>

            <div className="p-4">
              <h2 className="text-2xl font-bold text-black">
                {category.name}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}