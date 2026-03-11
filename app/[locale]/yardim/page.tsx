"use client";
import { useTranslations } from "next-intl";
import { HelpCircle, MessageCircle, ShieldCheck, RefreshCcw } from "lucide-react";
import Link from "next/link";

export default function HelpPage() {
  const t = useTranslations("HelpPage");

  const cards = [
    { title: t("faqTitle"), desc: t("faqDesc"), icon: HelpCircle, href: "/sss", color: "text-blue-500", bg: "bg-blue-100" },
    { title: t("contactTitle"), desc: t("contactDesc"), icon: MessageCircle, href: "/iletisim", color: "text-pink-500", bg: "bg-pink-100" },
    { title: t("securityTitle"), desc: t("securityDesc"), icon: ShieldCheck, href: "/guvenlik", color: "text-green-500", bg: "bg-green-100" },
    { title: t("refundTitle"), desc: t("refundDesc"), icon: RefreshCcw, href: "/iptal-ve-iade", color: "text-red-500", bg: "bg-red-100" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-40 pb-20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-100/50 to-transparent -z-10"></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">{t("title")}</h1>
        <p className="text-lg text-gray-600 mb-16 max-w-2xl mx-auto">{t("subtitle")}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cards.map((card, idx) => (
            <Link key={idx} href={card.href} className="flex items-start bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group text-left">
              <div className={`w-16 h-16 ${card.bg} rounded-2xl flex items-center justify-center ${card.color} shrink-0 group-hover:scale-110 transition-transform`}>
                <card.icon className="w-8 h-8" />
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{card.title}</h3>
                <p className="text-gray-500 leading-relaxed">{card.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}