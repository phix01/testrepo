"use client";
import { useTranslations } from "next-intl";
import { ShieldCheck } from "lucide-react";

export default function SecurityPage() {
  const t = useTranslations("SecurityPage");

  return (
    <div className="min-h-screen bg-gray-50 pt-40 pb-20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-green-100/50 to-transparent -z-10"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 sm:p-12 md:p-16">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                {t("title")}
              </h1>
              <p className="text-sm font-medium text-gray-500 mt-2">
                {t("date")}
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-gray-200 via-gray-100 to-transparent mb-10"></div>

          <div className="prose prose-lg max-w-none text-gray-600 space-y-8">
            <p className="text-lg leading-relaxed text-gray-700 font-medium">
              {t("p1")}
            </p>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                {t("h2_1")}
              </h2>
              <p className="leading-relaxed">{t("p2")}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                {t("h2_2")}
              </h2>
              <p className="leading-relaxed">{t("p3")}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500 inline-block"></span>
                {t("h2_3")}
              </h2>
              <p className="leading-relaxed">{t("p4")}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}