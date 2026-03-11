"use client";

import { useEffect, useState } from "react";
import { getBlogs } from "@/lib/api";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

type Blog = {
  id: string;
  title: string;
  content?: string;
  summary?: string;
  imageUrl?: string;
  thumbnail?: string;
  createdAt?: string;
};

function stripHtml(html: string) {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "").replace(/&nbsp;/g, " ");
}

export default function BlogPage() {
  const t = useTranslations("BlogPage");
  const locale = useLocale();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getBlogs(0, 100, locale)
      .then((res: any) => {
        if (mounted) setBlogs(res || []);
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-gray-50 pt-40"><div className="max-w-7xl mx-auto px-4">{t('loading')}</div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-40 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 border-b border-gray-200 pb-6 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-gray-900">{t("headerTitle")}</h1>
          <p className="mt-3 text-lg text-gray-600">{t("headerDesc")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map((blog) => {
            const img = blog.imageUrl || blog.thumbnail || "/placeholder.png";
            const excerpt = stripHtml(blog.summary || blog.content || "").slice(0, 160);

            return (
              <article key={blog.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 overflow-hidden">
                  <img src={img} alt={blog.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 line-clamp-2">{blog.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{excerpt}...</p>
                  <Link href={`${locale ? `/${locale}` : ""}/blog/${blog.id}`} className="text-pink-600 hover:text-pink-500 transition-colors font-semibold inline-flex items-center">
                    {t('readMore')} <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
