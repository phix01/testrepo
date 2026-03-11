"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

export default function SignupModal() {
  const t = useTranslations("SignupModal");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handler() { setOpen(true); }
    window.addEventListener("openSignupModal", handler as EventListener);
    return () => window.removeEventListener("openSignupModal", handler as EventListener);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />

      <div className="relative w-full max-w-sm bg-[#1f1f1f] rounded-xl shadow-2xl p-6 text-center text-white mx-4">
        <button onClick={() => setOpen(false)} className="absolute top-3 right-3 text-gray-300 hover:text-white">
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-lg font-semibold mb-4">{t('title')}</h3>

        <button className="w-full flex items-center justify-center gap-3 border border-gray-600 rounded-md px-3 py-2 bg-transparent hover:bg-white/5 mb-3">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="google" className="w-4 h-4" />
          <span className="text-sm">{t('continueGoogle')}</span>
        </button>

        <div className="text-xs text-gray-400 uppercase mb-2">{t('or')}</div>

        <input placeholder={t('emailPlaceholder')} className="w-full px-3 py-2 rounded-md bg-[#111] border border-gray-700 text-sm placeholder-gray-400 mb-3 outline-none" />

        <button className="w-full bg-white text-black rounded-md py-2 font-semibold">{t('continueEmail')}</button>
      </div>
    </div>
  );
}