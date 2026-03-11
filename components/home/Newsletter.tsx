import { Send } from 'lucide-react';
import { useTranslations } from "next-intl";

const Newsletter = () => {
  const t = useTranslations("Newsletter");

  return (
    <section className="py-20 bg-gradient-to-r from-orange-600 to-pink-500 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-white/5 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">{t('title')}</h2>
        <p className="text-lg text-white/90 mb-10 font-medium">{t('subtitle')}</p>

        <form className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-2xl mx-auto">
          <input type="email" placeholder={t('placeholder')} className="w-full sm:w-80 px-6 py-4 rounded-full text-gray-700 bg-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all text-base shadow-lg" required />
          <button type="button" className="w-full sm:w-auto bg-white text-pink-600 hover:bg-pink-50 font-bold px-8 py-4 rounded-full flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 group">
            <Send className="w-5 h-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            <span>{t('button')}</span>
          </button>
        </form>

        <p className="mt-6 text-sm text-white/80 font-medium">{t('footer')}</p>
      </div>
    </section>
  );
};

export default Newsletter;