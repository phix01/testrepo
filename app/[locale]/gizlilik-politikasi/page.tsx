"use client";
import { useTranslations } from "next-intl";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  const t = useTranslations("PrivacyPolicyPage");

  // Liste elemanlarının içindeki kalın (bold) yazılması gereken başlıkları (ör: Cihaz bilgileri:) otomatik ayıran küçük bir yardımcı fonksiyon.
  const renderListItem = (text: string) => {
    if (text.includes(":")) {
      const parts = text.split(":");
      return (
        <>
          <strong className="text-gray-900">{parts[0]}:</strong>
          {parts.slice(1).join(":")}
        </>
      );
    }
    return text;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 md:pt-40 pb-20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-purple-100/50 to-transparent -z-10"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 sm:p-12 md:p-16">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-10">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 shrink-0 shadow-inner">
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
          
          <div className="prose prose-lg prose-purple max-w-none text-gray-600">
            
            <p className="text-xl font-medium text-gray-800 mb-10 leading-relaxed">
              {t("intro_1")}<strong className="text-gray-900">{t("intro_bold_1")}</strong>{t("intro_2")}<strong className="text-gray-900">{t("intro_bold_2")}</strong>{t("intro_3")}<strong className="text-gray-900">{t("intro_bold_3")}</strong>{t("intro_4")}
            </p>

            <div className="space-y-12">
              {/* Madde 1 */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-sm shrink-0">1</span>
                  {t("s1_title")}
                </h2>
                <p className="mb-4">{t("s1_desc")}</p>
                <ul className="list-disc pl-6 space-y-2 marker:text-purple-400">
                  {t("s1_items").split("||").map((item, idx) => (
                    <li key={idx}>{renderListItem(item)}</li>
                  ))}
                </ul>
                <p className="mt-4 text-sm bg-gray-50 p-4 rounded-xl border border-gray-100">
                  {t("s1_note")}
                </p>
              </section>

              {/* Madde 2 */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-sm shrink-0">2</span>
                  {t("s2_title")}
                </h2>
                <p className="mb-4">{t("s2_desc")}</p>
                <ul className="list-disc pl-6 space-y-2 marker:text-purple-400 mb-4">
                  {t("s2_items").split("||").map((item, idx) => (
                    <li key={idx}>{renderListItem(item)}</li>
                  ))}
                </ul>
                <p>{t("s2_note")}</p>
              </section>

              {/* Madde 3 & 4 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">3. {t("s3_title")}</h2>
                  <p>{t("s3_desc")}</p>
                </section>
                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">4. {t("s4_title")}</h2>
                  <p>{t("s4_desc")}</p>
                </section>
              </div>

              {/* Madde 5 & 6 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">5. {t("s5_title")}</h2>
                  <p>{t("s5_desc")}</p>
                </section>
                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">6. {t("s6_title")}</h2>
                  <p className="mb-2">{t("s6_desc")}</p>
                  <ul className="list-disc pl-6 space-y-1 marker:text-purple-400 mb-3 text-sm">
                    {t("s6_items").split("||").map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                  <p className="text-sm text-gray-500">{t("s6_note")}</p>
                </section>
              </div>

              {/* Madde 7, 8, 9 */}
              <div className="space-y-8">
                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">7. {t("s7_title")}</h2>
                  <p>{t("s7_desc")}</p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">8. {t("s8_title")}</h2>
                  <p>{t("s8_desc")}</p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">9. {t("s9_title")}</h2>
                  <p>{t("s9_desc")}</p>
                </section>
              </div>

              {/* Madde 10 */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-sm shrink-0">10</span>
                  {t("s10_title")}
                </h2>
                <p className="mb-4">{t("s10_desc")}</p>
                <ul className="list-disc pl-6 space-y-2 marker:text-purple-400 mb-4">
                  {t("s10_items").split("||").map((item, idx) => (
                    <li key={idx}>{renderListItem(item)}</li>
                  ))}
                </ul>
                <p>{t("s10_note")}</p>
              </section>

              {/* Madde 11 */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-sm shrink-0">11</span>
                  {t("s11_title")}
                </h2>
                <p className="mb-4">{t("s11_desc")}</p>
                <ul className="list-disc pl-6 space-y-2 marker:text-purple-400 mb-4">
                  {t("s11_items").split("||").map((item, idx) => (
                    <li key={idx}>{renderListItem(item)}</li>
                  ))}
                </ul>
                <p className="font-bold text-gray-900 mb-2">{t("s11_note1")}</p>
                <p>{t("s11_note2")}</p>
              </section>

              {/* Madde 12 & 13 (İletişim) */}
              <div className="bg-purple-50 rounded-3xl p-8 border border-purple-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">12. {t("s12_title")}</h2>
                    <p className="mb-4">{t("s12_desc")}</p>
                    <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-purple-100 w-max shadow-sm">
                      <span className="text-xl">📧</span>
                      <div>
                        <a href="mailto:info@bulbi.co" className="font-bold text-purple-600 hover:text-purple-800 transition-colors">info@bulbi.co</a>
                        <p className="text-xs text-gray-500">{t("s12_subject")}</p>
                      </div>
                    </div>
                  </section>
                  <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">13. {t("s13_title")}</h2>
                    <p className="mb-4">{t("s13_desc")}</p>
                    <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-purple-100 w-max shadow-sm">
                      <span className="text-xl">📧</span>
                      <a href="mailto:info@bulbi.co" className="font-bold text-purple-600 hover:text-purple-800 transition-colors">info@bulbi.co</a>
                    </div>
                  </section>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}