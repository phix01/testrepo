"use client";
import { useTranslations } from "next-intl";
import { FileText, Download } from "lucide-react";

export default function TermsOfUsePage() {
  const t = useTranslations("TermsOfUsePage");
  const pdfUrl = "/pdfs/bulbi-platform-kullanici-sozlesmesi.pdf";

  return (
    <div className="min-h-screen bg-gray-50 pt-40 pb-20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50/50 to-transparent -z-10"></div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 sm:p-12">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mb-8">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">{t("title")}</h1>
                <p className="text-sm font-medium text-gray-500 mt-2">{t("date")}</p>
              </div>
            </div>
            <a href={pdfUrl} download className="flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 px-5 py-2.5 rounded-xl font-bold transition-colors">
              <Download className="w-5 h-5" />
              {t("downloadBtn")}
            </a>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-gray-200 via-gray-100 to-transparent mb-10"></div>
          
          <div className="w-full h-[75vh] bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-inner">
            <iframe src={`${pdfUrl}#toolbar=0`} className="w-full h-full" title={t("title")}>
              <p>{t("fallbackText")} <a href={pdfUrl} className="text-blue-500 underline">{t("downloadBtn")}</a></p>
            </iframe>
          </div>

        </div>
      </div>
    </div>
  );
}