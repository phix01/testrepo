"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Mail, MessageCircle, MapPin, Send, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  const t = useTranslations("ContactPage");

  // YENİ: Form girdilerini tutan State'ler
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  // YENİ: Mail uygulamasına yönlendiren fonksiyon
  const handleSendEmail = () => {
    // Basit bir boş alan kontrolü
    if (!name.trim() || !message.trim()) {
      alert("Lütfen adınızı ve mesajınızı giriniz.");
      return;
    }

    const mailTo = "info@bulbi.co"; // Formun gideceği adres
    // Türkçe karakterlerin mail uygulamasında bozulmaması için encodeURIComponent kullanıyoruz
    const mailSubject = encodeURIComponent(`Siteden Yeni Mesaj: ${subject || "Konu Belirtilmemiş"}`);
    const mailBody = encodeURIComponent(
      `Gönderen: ${name}\nE-Posta: ${email}\n\nMesaj:\n${message}`
    );

    // Kullanıcının varsayılan e-posta uygulamasını (Outlook, Mail, vb.) açar
    window.location.href = `mailto:${mailTo}?subject=${mailSubject}&body=${mailBody}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-40 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Üst Başlık Kısmı */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            {t("title1")}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
              {t("title2")}
            </span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* SOL TARAF: İletişim Bilgileri & Yardım */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t("infoTitle")}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* E-posta Kartı */}
              <a href="mailto:info@bulbi.co" className="flex items-center justify-between bg-[#fff5ef] p-6 rounded-2xl border border-[#ffe0d1] hover:shadow-md transition-all group">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700">{t("emailLabel")}</h3>
                  <p className="mt-1 text-lg font-bold text-[#ff5722]">{t("emailValue")}</p>
                </div>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#ff5722] shadow-sm group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
              </a>

              {/* YENİ: WhatsApp Yönlendirmeli İletişim Hattı */}
              <a 
                href="https://api.whatsapp.com/send?phone=905335746392" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center justify-between bg-[#f0fdf4] p-6 rounded-2xl border border-[#dcfce7] hover:shadow-md transition-all group"
              >
                <div>
                  <h3 className="text-sm font-semibold text-gray-700">{t("phoneLabel")}</h3>
                  <p className="mt-1 text-lg font-bold text-[#16a34a]">{t("phoneValue")}</p>
                </div>
                <div className="w-10 h-10 bg-[#16a34a] rounded-full flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-5 h-5" />
                </div>
              </a>
            </div>

            {/* Adres Kartı */}
            <div className="flex items-start bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow mt-6">
              <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="ml-5">
                <h3 className="text-lg font-bold text-gray-900">{t("addressTitle")}</h3>
                <p className="mt-1 text-gray-500 leading-relaxed text-sm">{t("addressValue")}</p>
              </div>
            </div>

            <div className="mt-10 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              <HelpCircle className="w-10 h-10 mb-4 text-white/90" />
              <h3 className="text-xl font-bold mb-2">{t("helpTitle")}</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                {t("helpText")}
              </p>
              <Link href="/sss" className="inline-block bg-white text-gray-900 font-bold px-6 py-3 rounded-full text-sm hover:bg-gray-50 transition-colors shadow-sm">
                {t("helpBtn")}
              </Link>
            </div>
          </div>

          {/* SAĞ TARAF: İletişim Formu */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 border-l-[6px] border-[#ff5722] pl-4 rounded-sm">
              {t("formTitle")}
            </h2>
            
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {t("nameLabel")}
                </label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("namePlaceholder")}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-[#ff5722]/50 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {t("emailFormLabel")}
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("emailPlaceholder")}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-[#ff5722]/50 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {t("subjectLabel")}
                </label>
                <input 
                  type="text" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={t("subjectPlaceholder")}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-[#ff5722]/50 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {t("messageLabel")}
                </label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t("messagePlaceholder")}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-[#ff5722]/50 focus:bg-white transition-all min-h-[160px] resize-y"
                />
              </div>

              {/* YENİ: Tıklandığında handleSendEmail fonksiyonunu çalıştıran buton */}
              <button 
                type="button" 
                onClick={handleSendEmail}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#ff5722] to-[#ff784e] text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
              >
                <Send className="w-5 h-5" />
                {t("submitBtn")}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}