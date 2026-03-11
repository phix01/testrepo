"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import { getBlogs } from "@/lib/api";
import { Share2 } from "lucide-react";
import { Send } from "lucide-react";
import { Share } from "lucide-react";
import { tryOpenDeepLink, tryOpenBlogDeepLinkAndroid } from "@/components/DeepLinkHandler";


function formatContent(html: string) {
  if (!html) return "";

  return html
    // Cümle ortasındaki newline → boşluk
    .replace(/([^\n])\n([^\n])/g, "$1 $2")

    // 2 veya daha fazla newline → yeni paragraf
    .replace(/\n{2,}/g, "</p><p>")

    // En başa <p> en sona </p>
    .replace(/^/, "<p>")
    .replace(/$/, "</p>");
}

/* ----------------------------------------------------- */
/*        2) İÇERİKTE TEKRAR EDEN BAŞLIĞI SİL            */
/* ----------------------------------------------------- */
function removeTitleFromContent(content: string, title: string) {
  if (!content || !title) return content;

  try {
    // Eğer tarayıcı ortamındaysak DOMParser ile parse edip DOM node'larını kontrol edelim.
    if (typeof window !== "undefined" && typeof DOMParser !== "undefined") {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "text/html");

      const norm = (s: string) => (s || "").replace(/\s+/g, " ").trim().toLowerCase();
      const target = norm(title);

      // Başlıklardaki (h1-h6) ve yalnız <p> içindeki başlık benzerlerini kaldır
      for (let i = 1; i <= 6; i++) {
        doc.querySelectorAll("h" + i).forEach((n) => {
          if (norm(n.textContent || "") === target) n.remove();
        });
      }

      doc.querySelectorAll("p").forEach((p) => {
        if (norm(p.textContent || "") === target) p.remove();
      });

      // Ayrıca içeriğin en başındaki düz metin olarak başlık varsa temizle
      const bodyHtml = doc.body.innerHTML || "";
      const cleanedStart = bodyHtml.replace(new RegExp("^\\s*" + title.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&") + "\\s*", "i"), "");

      return cleanedStart.trim();
    }
  } catch (err) {
    // On failure, düşecek ve regex tabanlı eski temizlemeyi uygulayacağız
  }

  // Fallback: regex tabanlı temizleme (daha basit)
  const safe = title.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");

  return content
    .replace(new RegExp(`<h1[^>]*>\\s*${safe}\\s*</h1>`, "gi"), "")
    .replace(new RegExp(`<h[2-6][^>]*>\\s*${safe}\\s*</h[2-6]>`, "gi"), "")
    .replace(new RegExp(`<p[^>]*>\\s*${safe}\\s*</p>`, "gi"), "")
    .replace(new RegExp(`^\\s*${safe}\\s*`, "i"), "")
    .trim();
}

function removeDateFromContent(content: string) {
  if (!content) return content;

  // İçerikteki 14.02.2026 gibi tarihleri kaldırır
  return content.replace(/\b\d{2}\.\d{2}\.\d{4}\b/g, "").trim();
}


function extractDateFromContent(content: string) {
  if (!content) return "";

  // İçindeki 14.02.2026 gibi tarihleri yakalar
  const match = content.match(/(\d{2}\.\d{2}\.\d{4})/);

  return match ? match[1] : "";
}

function formatBackendDate(dateStr: string) {
  if (!dateStr) return "";

  const [day, month, year] = dateStr.split(".");
  if (!day || !month || !year) return "";

  const jsDate = new Date(`${year}-${month}-${day}`);
  if (isNaN(jsDate.getTime())) return dateStr;

  return jsDate.toLocaleDateString("tr-TR");
}

function getBlogDate(blog: any) {
  return (
    blog.createdAt ||
    blog.created_at ||
    blog.date ||
    blog.publishDate ||
    blog.published ||
    blog.createdDate ||
    ""
  );
}

export default function BlogDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const locale = useLocale();
  const [blog, setBlog] = useState<any>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [triedDeepLink, setTriedDeepLink] = useState(false);

  useEffect(() => {
    async function load() {
      const all = await getBlogs(0, 999, locale);
      const found = all.find((b: any) => String(b.id) === String(id));
      setBlog(found || null);
    }
    load();
  }, [id]);

  useEffect(() => {
    try {
      if (!triedDeepLink && blog) {
        const ua = typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';
        const isAndroid = /Android/i.test(ua);
        if (isAndroid) {
          tryOpenBlogDeepLinkAndroid(id as string);
        } else if (/iPhone|iPad|iPod/i.test(ua)) {
          // iOS / others: use universal link sequence
          tryOpenDeepLink(`blog/${id}`);
        }
        setTriedDeepLink(true);
      }
    } catch (err) {}
  }, [blog, triedDeepLink, id]);

  // Eğer kullanıcı doğrudan bu sayfaya geldiyse (referrer blog listesi değilse),
  // geri tuşuna basıldığında blog listesine yönlendir.
  useEffect(() => {
  try {
    const ref = document.referrer || "";
    const isFromBlogList =
      ref.includes(window.location.hostname) && ref.includes("/blog");

    const onPop = (e: PopStateEvent) => {
      if (!isFromBlogList) {
        router.replace(`/${locale || "tr"}/blog`);
      }
    };

    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  } catch (_) {}
}, [router, locale]);

  if (!blog) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 pt-[200px]">
        
      </div>
    );
  }

  const pageUrl = typeof window !== "undefined" ? window.location.href : "";
  const readTime = Math.max(1, Math.round((blog.content?.length || 500) / 1000 * 4)); // yaklaşık hesap
  const rawDate = extractDateFromContent(blog.content);
  const formattedDate = formatBackendDate(rawDate);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ☑️ İçerikte başlık tekrarını kaldır
  let cleanedContent = removeTitleFromContent(blog.content, blog.title);
  cleanedContent = removeDateFromContent(cleanedContent);
  // Eğer hâlâ içerikte başlık ilk 400 karakter içinde görünüyorsa, ekstra bir güvenlik temizliği yap
  try {
    const safe = blog.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(safe, "i");
    const m = cleanedContent.match(re);
    if (m && typeof m.index === "number" && m.index < 400) {
      cleanedContent = cleanedContent.replace(re, "");
    }
  } catch (err) {
    // ignore
  }

  return (
    <div className="max-w-3xl mx-auto py-20 px-4 pt-[200px]">

      <div className="mb-4">
        <button onClick={() => router.push(`/${locale || "tr"}/blog`)}   className="text-lg font-semibold text-primary hover:text-primary/80 transition inline-flex items-center gap-2 mb-4"
>← Tüm Bloglar</button>
      </div>

      {/* BAŞLIK */}
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-gray-900 mb-4">
        {blog.title}
      </h1>

      {/* 📌 META BİLGİLERİ (BOZULMADAN) */}
      <div className="flex items-center gap-3 text-gray-500 text-sm mb-10 relative">
        {(() => {
          const parts = ["Bulbi"];
          if (formattedDate) parts.push(formattedDate);
          return parts.map((p, i) => (
            <span key={i} className="inline-flex items-center">
              <span>{p}</span>
              {i < parts.length - 1 && <span className="mx-2">•</span>}
            </span>
          ));
        })()}

        {/* PAYLAŞ BUTONU – YAZI + İKON */}
        <button
  onClick={() => setShowMenu(!showMenu)}
  className="ml-auto flex items-center gap-2 text-gray-600 hover:text-black transition"
>
  <Share className="w-5 h-5" />
  <span className="text-sm">Paylaş</span>
</button>

        {/* PAYLAŞ MENÜSÜ */}
        {showMenu && (
          <div className="absolute right-0 top-8 w-60 bg-white shadow-lg border rounded-xl py-2 z-50">

            <button
              onClick={handleCopy}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
            >
              🔗 Copy link
            </button>

            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}`}
              target="_blank"
              className="block px-4 py-2 hover:bg-gray-100"
            >
              ❌ Share on X
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              className="block px-4 py-2 hover:bg-gray-100"
            >
              📸 Share on Instagram
            </a>

            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
              target="_blank"
              className="block px-4 py-2 hover:bg-gray-100"
            >
              👍 Share on Facebook
            </a>

            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`}
              target="_blank"
              className="block px-4 py-2 hover:bg-gray-100"
            >
              💼 Share on LinkedIn
            </a>
          </div>
        )}
      </div>

      {/* BİLDİRİM */}
      {copied && (
        <div className="fixed bottom-5 right-5 bg-black text-white px-4 py-2 rounded-lg shadow-lg z-50">
          Link kopyalandı! 🎉
        </div>
      )}

      {/* GÖRSEL */}
      {(blog.imageUrl || blog.thumbnail) && (
        <img
          src={blog.imageUrl || blog.thumbnail}
          className="w-full rounded-2xl shadow mb-10"
          alt={blog.title}
        />
      )}

      {/* İÇERİK — YAZI STİLİNE DOKUNMADIM */}
      <div
        className="medium-article"
            dangerouslySetInnerHTML={{ __html: formatContent(cleanedContent) }}      />
    </div>
  );
}