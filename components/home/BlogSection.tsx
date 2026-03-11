"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { getBlogs } from "@/lib/api";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

type Blog = {
  id: string;
  title: string;
  content?: string;
  summary?: string;
  imageUrl?: string;
  thumbnail?: string;
  createdAt?: string;
  authorName?: string;
  author?: { name?: string };
};

function stripHtml(html: string) {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "").replace(/&nbsp;/g, " ");
}

export default function BlogSection() {
  const t = useTranslations("BlogSection");
  const locale = useLocale();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await getBlogs(0, 3, locale); 
        setBlogs(res || []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <section id="blog-section" className="py-20 bg-gray-50">
        <div className="text-center text-gray-400">{t('loading')}</div>
      </section>
    );
  }

  if (!blogs.length) return null;

  const visibleBlogs = blogs.slice(0, 3);

  return (
    <section id="blog-section" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">{t('title')}</h2>
          <p className="text-lg text-gray-600 mt-3">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {visibleBlogs.map((blog) => {
            const img = blog.imageUrl || blog.thumbnail || "/placeholder.png";
            const excerpt = stripHtml(blog.summary || blog.content || "").slice(0, 140);

            return (
              <article key={blog.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 overflow-hidden">
                  <img src={img} alt={blog.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 line-clamp-2">{blog.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{excerpt}...</p>
                  <Link href={`${locale ? `/${locale}` : ""}/blog/${blog.id}`} className="text-orange-600 hover:text-pink-500 transition-colors font-semibold inline-flex items-center">
                    {t('readMore')} <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link href={`${locale ? `/${locale}` : ""}/blog`} className="inline-block px-10 py-3.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-bold text-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
            {t('allBlogs')}
          </Link>
        </div>
      </div>
    </section>
  );
}