"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FaqPage() {
  const t = useTranslations("FaqPage");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { q: t("q1"), a: t("a1") },
    { q: t("q2"), a: t("a2") },
    { q: t("q3"), a: t("a3") },
    { q: t("q4"), a: t("a4") },
    { q: t("q5"), a: t("a5") },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-40 pb-20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-pink-100/50 to-transparent -z-10"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center text-pink-600 mx-auto mb-6">
            <HelpCircle className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{t("title")}</h1>
          <p className="text-lg text-gray-600">{t("subtitle")}</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)} 
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="text-lg font-bold text-gray-800">{faq.q}</span>
                <ChevronDown className={`w-6 h-6 text-purple-500 transition-transform duration-300 shrink-0 ${openIndex === index ? "rotate-180" : ""}`} />
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
              >
                <p className="p-6 pt-0 text-gray-600 leading-relaxed border-t border-gray-50 mt-2">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}