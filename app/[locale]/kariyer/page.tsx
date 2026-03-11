"use client";

import React from 'react';
import { Heart, Zap, Users, Sparkles, Mail, ArrowRight } from 'lucide-react';
import { useTranslations } from "next-intl";

export default function KariyerPage() {
  const t = useTranslations("KariyerPage");

  return (
    <div className="w-full min-h-screen bg-white pt-32 pb-16">
      
      {/* HERO SECTION (Üst Karşılama Alanı) */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-50 via-white to-white rounded-3xl"></div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
          {t('heroTitle1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">{t('heroTitleHighlight')}</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-500">
          {t('heroSubtitle')}   
        </p>
      </section>

      {/* DEĞERLERİMİZ (Neden Bulbi?) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-orange-600">{t('whyBulbiTitle')}</h2>
          <p className="mt-4 text-gray-500">{t('whyBulbiSubtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Kart 1 */}
          <div className="bg-purple-50 rounded-3xl p-8 hover:shadow-lg transition-shadow duration-300 border border-gray-100 group">
            <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Heart className="w-7 h-7 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('card1Title')}</h3>
            <p className="text-gray-600 leading-relaxed">
              {t('card1Desc')}
            </p>
          </div>

          {/* Kart 2 */}
          <div className="bg-orange-50 rounded-3xl p-8 hover:shadow-lg transition-shadow duration-300 border border-gray-100 group">
            <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-7 h-7 text-pink-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('card2Title')}</h3>
            <p className="text-gray-600 leading-relaxed">
              {t('card2Desc')}
            </p>
          </div>

          {/* Kart 3 */}
          <div className="bg-pink-50 rounded-3xl p-8 hover:shadow-lg transition-shadow duration-300 border border-gray-100 group">
            <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Users className="w-7 h-7 text-purple-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('card3Title')}</h3>
            <p className="text-gray-600 leading-relaxed">
              {t('card3Desc')}
            </p>
          </div>
        </div>
      </section>

      {/* AÇIK POZİSYONLAR & BAŞVURU (Mail Yönlendirmesi) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-orange-500 to-pink-500 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Arka plan süslemeleri */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-pink-500 opacity-20 blur-3xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-left">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-white" />
                <h2 className="text-2xl md:text-3xl font-bold text-white">{t('applyTitle')}</h2>
              </div>
              <p className="text-white text-lg max-w-xl">
                {t('applyDesc')}
              </p>
            </div>
            
            <div className="shrink-0 w-full md:w-auto">
              <a 
                href={`mailto:ik@bulbi.co?subject=${t('emailSubject')}`} 
                className="group flex items-center justify-center w-full md:w-auto gap-2 bg-white text-pink-700 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-pink-500/30 transition-all duration-300 hover:-translate-y-1"
              >
                <Mail className="w-5 h-5" />
                {t('applyButton')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}