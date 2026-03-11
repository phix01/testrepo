"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

export default function AppDownloadModal() {
  const t = useTranslations("AppDownloadModal");
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState<string>(`https://bulbi.co`);

  useEffect(() => {
    function handler(e: Event) {
      const ev = e as CustomEvent;
      const incoming = ev?.detail?.url;
      if (incoming && typeof incoming === "string") setUrl(incoming);
      else {
        try {
          const p = window.location.pathname + window.location.search;
          setUrl(`https://bulbi.co${p}`);
        } catch (err) {
          setUrl(`https://bulbi.co`);
        }
      }
      setOpen(true);
    }

    window.addEventListener("openAppDownloadModal", handler as EventListener);
    return () => window.removeEventListener("openAppDownloadModal", handler as EventListener);
  }, []);

   // Arka Plan Kaydırma Kilidi
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[99999999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 mx-4 text-center">
        <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center mb-3">
            <div className="text-white font-bold">📱</div>
          </div>
          <h2 className="text-lg font-bold">{t('title')}</h2>
          <p className="text-sm text-gray-500 mt-1">{t('subtitle')}</p>

          <div className="mt-4 bg-gray-100 rounded-lg p-4 inline-block">
            <a href={url} target="_blank" rel="noreferrer" className="inline-block">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(url)}`} alt="QR" className="w-40 h-40 bg-white rounded-md shadow-inner" />
            </a>
            <div className="text-xs text-gray-400 mt-2">{t('scanQR')}</div>
          </div>

          <div className="mt-4 text-sm text-gray-500">{t('orDownload')}</div>
          <div className="mt-3 flex gap-3 justify-center">
            <a href="https://apps.apple.com/tr/app/bulbi-%C3%A7ocuk-etkinlikleri/id6749323823" className="px-4 py-2 bg-black text-white rounded-full text-sm" target="_blank" rel="noreferrer">App Store</a>
            <a href="https://play.google.com/store/apps/details?id=com.sheydo.bulbi" className="px-4 py-2 bg-black text-white rounded-full text-sm" target="_blank" rel="noreferrer">Google Play</a>
          </div>
        </div>
      </div>
    </div>
  );
}