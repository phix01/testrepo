import { Apple, Play } from 'lucide-react';
import { useTranslations } from "next-intl";

const MobileAppSection = () => {
  const t = useTranslations("MobileApp");

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* DÜZELTME 1: "overflow-hidden" buradan kaldırıldı. Görsel artık kesilmeyecek. */}
        <div className="bg-pink-50 rounded-[2.5rem] p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between relative shadow-sm border border-purple-100">
          
          {/* DÜZELTME 2: Arka plandaki yuvarlak renkli blur efektleri kutudan taşmasın diye kendi gizli kapsayıcılarına alındı */}
          <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 lg:w-96 lg:h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 lg:w-96 lg:h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 translate-y-1/3 -translate-x-1/3"></div>
          </div>

          <div className="w-full md:w-1/2 z-10 mb-16 md:mb-0 text-center md:text-left">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
              {t('title1')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                {t('title2')}
              </span>
            </h2>
            <p className="text-lg text-gray-600 mb-10 max-w-lg mx-auto md:mx-0 leading-relaxed font-medium">{t('desc')}</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a href="https://apps.apple.com/tr/app/bulbi-%C3%A7ocuk-etkinlikleri/id6749323823" target="_blank" rel="noreferrer" className="group flex items-center bg-white text-gray-900 px-6 py-3.5 rounded-2xl hover:bg-gray-50 transition-all shadow-md hover:shadow-xl hover:-translate-y-1 border-2 border-transparent hover:border-purple-100">
                <Apple className="w-8 h-8 mr-3 text-gray-900 group-hover:text-purple-600 transition-colors" />
                <div className="text-left">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t('appStore')}</div>
                  <div className="text-lg font-bold leading-none font-sans">App Store</div>
                </div>
              </a>

              <a href="https://play.google.com/store/apps/details?id=com.sheydo.bulbi" target="_blank" rel="noreferrer" className="group flex items-center bg-white text-gray-900 px-6 py-3.5 rounded-2xl hover:bg-gray-50 transition-all shadow-md hover:shadow-xl hover:-translate-y-1 border-2 border-transparent hover:border-purple-100">
                <Play className="w-7 h-7 mr-3 text-gray-900 group-hover:text-pink-500 fill-current transition-colors" />
                <div className="text-left">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t('googlePlay')}</div>
                  <div className="text-lg font-bold leading-none font-sans">Google Play</div>
                </div>
              </a>
            </div>
          </div>

          {/* DÜZELTME 3: Görsel alanı ciddi şekilde büyütüldü */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end relative z-10 mt-8 md:mt-0">
            <div className="relative w-full max-w-sm md:max-w-lg lg:max-w-[600px] xl:max-w-[700px] transition-transform duration-700 hover:scale-[1.30] scale-110 md:scale-125 origin-center md:origin-right md:translate-x-4 lg:translate-x-8">
              <img 
                src="/images/mobileapppreview.png" 
                alt="Bulbi Mobil Uygulama Ekranı" 
                className="w-full h-auto object-contain drop-shadow-2xl" 
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default MobileAppSection;