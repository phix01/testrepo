/*"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Category = {
  id: string;
  name: string;
};

// Sabit kategori listesi (istersen API’den dinamik alabilirim)
const categories: Category[] = [
  { id: "6668003cc5a0e0f944837af9", name: "Sanat" },
  { id: "66b1d4549880a9de5b0efffe", name: "Eğitim" },
  { id: "6666bc0b4df9966cb0865e23", name: "Spor" },
  { id: "668b8fe84a54ac452cb7d07d", name: "Sahne" },
  { id: "66c33352062c5af70bb3bab0", name: "Aktivite" },
];

export default function CategoryBar() {
  const pathname = usePathname();

  return (
    <nav className="w-full flex gap-4 overflow-x-auto py-3 border-b border-gray-800">
      {categories.map((c: Category) => {
        const active = pathname === `/category/${c.id}`;
        return (
          <Link
            key={c.id}
            href={`/category/${c.id}`}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
              active
                ? "bg-gray-700 text-white"
                : "bg-gray-900 text-gray-300 hover:bg-gray-800"
            }`}
          >
            {c.name}
          </Link>
        );
      })}
    </nav>
  );
}*/
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCategories } from "@/lib/api";
import { useTranslations } from "next-intl";

type Category = {
  id: string;
  name: string;
  picUrl?: string;
  color?: string;
};

export default function CategoryBar() {
  const t = useTranslations("CategoryBar");
  const pathname = usePathname();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res: any = await getCategories();
      let fetched: Category[] = [];

      if (Array.isArray(res)) fetched = res;
      else if (Array.isArray(res?.data?.categories)) fetched = res.data.categories;
      else if (Array.isArray(res?.categories)) fetched = res.categories;

      setCategories(fetched);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <div className="py-6 text-sm text-gray-400 text-center w-full">{t('loading')}</div>;
  }

  return (
    <div className="w-full bg-white">
      <nav className="max-w-7xl mx-auto flex justify-start md:justify-center gap-10 overflow-x-auto py-10 px-4 md:px-8 custom-scrollbar">
       {categories.map((c: Category) => {
          const active = pathname.includes(`/category/${c.id}`);

          return (
            <Link 
              key={c.id} 
              href={`/category/${c.id}`} 
              className={`flex flex-col items-center justify-center gap-2 p-4 w-24 h-28 md:w-32 md:h-32 rounded-[2rem] transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105
                ${active ? "ring-2 ring-pink-500 font-extrabold text-gray-900" : "font-extrabold text-gray-700 hover:text-pink-600"}
              `} 
              style={{ backgroundColor: c.color || "#f3f4f6" }}
            >
              {c.picUrl && (
                <Image 
                  src={c.picUrl} 
                  width={100} 
                  height={100} 
                  alt={c.name} 
                  // Senin gönderdiğin mükemmel ikon stili:
                  className="rounded-full bg-white p-1 shadow-sm object-cover w-20 h-20" 
                />
              )}
              {/* Yazı metni (İsimler belirgin ve resmin altında) */}
              <span className="text-m md:text-sm text-center leading-tight whitespace-nowrap">
                {c.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}