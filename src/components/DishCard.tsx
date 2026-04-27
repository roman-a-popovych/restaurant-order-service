"use client";

import Image from "next/image";
import { useState } from "react";
import { addToCart } from "@/utils/cart";

type DishCardProps = {
  id: number;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
};

export default function DishCard({
  id,
  name,
  price,
  description,
  image_url,
}: DishCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  function handleAddToCart() {
    addToCart({ id, name, price });
    alert("Страву додано в кошик");
  }

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
      >
        <div className="relative aspect-[2/1] w-full bg-gray-200">
          {image_url && (
            <Image
              src={image_url}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          )}
        </div>

        <div className="p-4">
          <h2 className="text-lg font-bold text-black">{name}</h2>

          {description && (
            <p className="mt-1 line-clamp-2 text-sm text-gray-600">
              {description}
            </p>
          )}

          <div className="mt-4 flex items-center justify-between">
            <span className="text-lg font-semibold text-black">
              {price} грн
            </span>

            <button
              onClick={(event) => {
                event.stopPropagation();
                handleAddToCart();
              }}
              className="rounded bg-black px-4 py-2 text-white hover:bg-gray-800"
            >
              Додати
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-xl"
          >
            <div className="relative aspect-[2/1] w-full bg-gray-200">
              {image_url && (
                <Image
                  src={image_url}
                  alt={name}
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-cover"
                />
              )}
            </div>

            <div className="p-6 text-black">
              <div className="mb-3 flex items-start justify-between gap-4">
                <h2 className="text-2xl font-bold">{name}</h2>

                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded bg-gray-100 px-3 py-1 text-black hover:bg-gray-200"
                >
                  ×
                </button>
              </div>

              {description && (
                <p className="mb-5 text-gray-700">{description}</p>
              )}

              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{price} грн</span>

                <button
                  onClick={() => {
                    handleAddToCart();
                    setIsOpen(false);
                  }}
                  className="rounded bg-black px-5 py-3 text-white hover:bg-gray-800"
                >
                  Додати в кошик
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}