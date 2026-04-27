import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        {/*
        <Link href="/" className="text-xl font-bold text-black">
          Restaurant Service
        </Link>
        */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Перекус Плюс"
            width={160}
            height={50}
            className="h-14 w-auto"
          />
        </Link>
        
        <nav className="flex gap-6 items-end">
          <Link href="/menu" className="font-semibold text-gray-800 hover:text-black transition">
            Меню
          </Link>
          <Link href="/delivery" className="font-semibold text-gray-800 hover:text-black transition">
            Доставка
          </Link>  
          <Link href="/cart" className="font-semibold text-gray-800 hover:text-black transition">
            Кошик
          </Link>
          {/*
          <Link href="/admin/orders" className="text-gray-800 hover:text-black">
            Адмінка
          </Link>
          */}
        </nav>
      </div>
    </header>
  );
}