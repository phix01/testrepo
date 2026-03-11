"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Palette, Music, Activity, Globe, MonitorPlay, Rocket, Users, Tent, Paintbrush, Dumbbell, BookOpen, Heart } from "lucide-react";
import { Apple, Play } from 'lucide-react';

export default function AboutPage() {
  const t = useTranslations("AboutPage");

  // Yüz Yüze Eğitim İkonları
  const faceIcons = [
    { icon: Palette, title: "Sanat ve El İşi", color: "bg-teal-100 text-teal-600" },
    { icon: Music, title: "Müzik Dersleri", color: "bg-purple-100 text-purple-600" },
    { icon: Activity, title: "Dans Kursları", color: "bg-orange-100 text-orange-600" },
    { icon: Dumbbell, title: "Spor Etkinlikleri", color: "bg-pink-100 text-pink-600" },
    { icon: Tent, title: "Açık Hava Maceraları", color: "bg-blue-100 text-blue-600" },
    { icon: BookOpen, title: "Hikaye Saatleri", color: "bg-fuchsia-100 text-fuchsia-600" },
    { icon: Users, title: "Ebeveyn-Çocuk", color: "bg-green-100 text-green-600" },
    { icon: Paintbrush, title: "Tema Parkı", color: "bg-yellow-100 text-yellow-600" },
  ];

  // Çevrim İçi Eğitim İkonları
  const onlineIcons = [
    { icon: MonitorPlay, title: "Sanal Hikaye", color: "bg-indigo-100 text-indigo-600" },
    { icon: Palette, title: "Sanat Atölyeleri", color: "bg-rose-100 text-rose-600" },
    { icon: Music, title: "Müzik Dersleri", color: "bg-cyan-100 text-cyan-600" },
    { icon: Rocket, title: "STEM Sınıfları", color: "bg-amber-100 text-amber-600" },
    { icon: Globe, title: "Dil Öğrenme", color: "bg-emerald-100 text-emerald-600" },
    { icon: Heart, title: "Fitness ve Yoga", color: "bg-red-100 text-red-600" },
  ];

  return (
    <div className="min-h-screen bg-white pt-28 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">

        {/* 2. BÖLÜM: MİSYON VE VİZYON  */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start relative mt-12">
          {/* Arka plan süsleri */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-orange-100 rounded-full blur-3xl -z-10"></div>
          
          {/* Misyon: text-center yapıldı */}
          <div className="text-center space-y-4 lg:pt-10">
            <h2 className="text-3xl font-extrabold text-[#ff4f3b]">{t('missionTitle')}</h2>
            <div className="text-gray-600 leading-relaxed text-sm lg:text-base space-y-3">
              <p>{t('missionText1')}</p>
              <p>{t('missionText2')}</p>
            </div>
          </div>

          {/* Merkez: Astronot Görseli */}
          <div className="flex justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-400 to-red-500 rounded-full scale-105 -z-10"></div>
            <img 
              src="\images\ourstoryimg.png" 
              alt="Astronot Çocuk" 
              className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-full border-8 border-white shadow-xl"
            />
          </div>

          {/* Vizyon: text-center yapıldı */}
          <div className="text-center space-y-4 lg:pt-10">
            <h2 className="text-3xl font-extrabold text-[#ff4f3b]">{t('visionTitle')}</h2>
            <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
              {t('visionText')}
            </p>
          </div>
        </section>

        {/* ARA BAŞLIK */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl font-extrabold text-[#ff4f3b]">{t('discoverTitle')}</h2>
          <p className="text-gray-600 font-medium">
            {t('discoverSubtitle')}
          </p>
        </div>

        {/* 3. BÖLÜM: YÜZ YÜZE DERSLER */}
        <section className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/3">
            <h2 className="text-3xl font-extrabold text-gray-800 border-l-[6px] border-[#ff4f3b] pl-5 mb-6 leading-tight">
              {t('faceToFaceTitle')}
            </h2>
            <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
              <p>{t('faceToFaceDesc1')}</p>
              <p>{t('faceToFaceDesc2')}</p>
            </div>
          </div>
          <div className="lg:w-2/3 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {faceIcons.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center space-y-3 group cursor-default">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform ${item.color}`}>
                  <item.icon className="w-8 h-8" />
                </div>
                <span className="text-xs font-bold text-gray-500">{item.title}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 4. BÖLÜM: DİJİTAL ÖĞRENME */}
        <section className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/3">
            <h2 className="text-3xl font-extrabold text-gray-800 border-l-[6px] border-[#ff4f3b] pl-5 mb-6 leading-tight">
              {t('onlineTitle')}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {t('onlineDesc')}
            </p>
          </div>
          <div className="lg:w-2/3 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {onlineIcons.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center space-y-3 group cursor-default">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform ${item.color}`}>
                  <item.icon className="w-8 h-8" />
                </div>
                <span className="text-xs font-bold text-gray-500">{item.title}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 5. BÖLÜM: BUL Bİ BİLGİ (Blog Kartları) */}
        <section className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/3">
            <h2 className="text-3xl font-extrabold text-gray-800 border-l-[6px] border-[#ff4f3b] pl-5 mb-6 leading-tight">
              {t('blogTitle')}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {t('blogDesc')}
            </p>
          </div>
          
          <div className="lg:w-2/3 flex flex-wrap justify-center lg:justify-end gap-6 relative">
            {/* Temsili Blog Kartları (Görseldeki gibi üst üste binen yapı) */}
            {[
              { title: "Çocukların Yaş Gruplarına Göre Afet Sonrası Tepkileri", img: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=400&auto=format&fit=crop" },
              { title: "Ebeveyn İlişkilerinin Çocuklar Üzerindeki Etkisi", img: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=400&auto=format&fit=crop" },
              { title: "Çocuklarla Kamp Yapacaklar İçin Tavsiyeler", img: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=400&auto=format&fit=crop" }
            ].map((blog, idx) => (
              <div key={idx} className={`w-60 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transform transition-transform hover:-translate-y-2 hover:shadow-2xl ${idx === 1 ? 'lg:-translate-y-6' : ''}`}>
                <div className="h-32 w-full">
                  <img src={blog.img} alt={blog.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold text-gray-800 leading-tight">{blog.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}