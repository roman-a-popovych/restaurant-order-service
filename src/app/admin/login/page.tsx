"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Помилка входу");
      return;
    }

    window.location.href = "/admin/orders";
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md items-center px-6 text-black">
      <form
        onSubmit={handleSubmit}
        className="w-full rounded-lg border bg-white p-6 shadow-sm"
      >
        <h1 className="mb-6 text-2xl font-bold">Вхід адміністратора</h1>

        <div className="mb-4">
          <label className="mb-1 block font-medium">Пароль</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded border px-3 py-2 text-black"
            placeholder="Введіть пароль"
          />
        </div>

        {error && (
          <p className="mb-4 rounded bg-red-100 p-3 text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded bg-black px-5 py-3 text-white hover:bg-gray-800"
        >
          Увійти
        </button>
      </form>
    </main>
  );
}