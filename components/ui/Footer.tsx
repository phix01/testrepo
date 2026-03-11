"use client"
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Linkedin, Youtube, HelpCircle } from 'lucide-react';
import { useCallback } from 'react';
import { useTranslations } from "next-intl";

const Footer = () => {
  const t = useTranslations("Footer");

  const openPartner = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('openPartnerModal'));
  }, []);
  
  return (
    <footer className="bg-[#0f172a] text-gray-400 py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-800 pb-10 mb-10 gap-8 md:gap-0">
          <Link href="/" className="text-3xl font-extrabold tracking-tight hover:opacity-90 transition-opacity">
            <span className="bg-gradient-to-r from-primary  to-secondary bg-clip-text text-transparent">
              Bulbi
            </span>
          </Link>
          <div className="text-white font-medium text-lg">
            {t('slogan')}
          </div>
          {/* Sosyal Medya İkonları */}
          <div className="flex space-x-4">
            {[
              { Icon: Facebook, url: "https://www.facebook.com/bulbi.co" },
              { Icon: Instagram, url: "https://www.instagram.com/bulbi.co/" },
              { Icon: Twitter, url: "https://x.com/bulbi_co" },
              { Icon: Linkedin, url: "https://www.linkedin.com/company/bulbi-co/" },
              { Icon: Youtube, url: "https://www.youtube.com/@bulbi-app" }
            ].map((social, index) => (
              <a 
                key={index} 
                href={social.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300"
              >
                <social.Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          {/* Sütun 1: Etkinlikler */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">{t('col1Title')}</h3>
            <ul className="space-y-3">
              <li><Link href="/etkinlikler?eventType=1" className="hover:text-primary transition-colors">{t('col1Link1')}</Link></li>
              <li><Link href="/etkinlikler?eventType=2" className="hover:text-primary transition-colors">{t('col1Link2')}</Link></li>
              <li><Link href="/etkinlikler" className="hover:text-primary transition-colors">{t('col1Link3')}</Link></li>
              <li>
                <Link 
                  href="/#etkinlikler" 
                  onClick={(e) => {
                    // Sayfada 'etkinlikler' id'li bölüm var mı diye bakıyoruz
                    const element = document.getElementById('etkinlikler');
                    if (element) {
                      // Eğer anasayfadaysak (element varsa) normal link gitmesini durdurup yumuşakça kaydırıyoruz
                      e.preventDefault();
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="hover:text-primary transition-colors"
                >
                  {t('col1Link4')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Sütun 2: Kategoriler */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">{t('col2Title')}</h3>
            <ul className="space-y-3">
              {/* Sanat & Yaratıcılık */}
              <li>
                <Link href="/category/6668003cc5a0e0f944837af9" className="hover:text-primary transition-colors">
                  {t('col2Link1')}
                </Link>
              </li>
              
              {/* Müzik & Dans (Sahne) */}
              <li>
                <Link href="/category/6666bc794df9966cb0865e28" className="hover:text-primary transition-colors">
                  {t('col2Link2')}
                </Link>
              </li>
              
              {/* Spor */}
              <li>
                <Link href="/category/6666bc0b4df9966cb0865e23" className="hover:text-primary transition-colors">
                  {t('col2Link3')}
                </Link>
              </li>
              
              {/* Bilim (Eğitim) */}
              <li>
                <Link href="/category/66b1d4549880a9de5b0efffe" className="hover:text-primary transition-colors">
                  {t('col2Link4')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Sütun 3: Şirket */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">{t('col3Title')}</h3>
            <ul className="space-y-3">
              <li><Link href="/hakkimizda" className="hover:text-primary transition-colors">{t('col3Link1')}</Link></li>
              <li><a href="#" onClick={openPartner} className="hover:text-primary transition-colors cursor-pointer">{t('col3Link2')}</a></li>
              <li><Link href="/kariyer" className="hover:text-primary transition-colors">{t('col3Link3')}</Link></li>
              <li><Link href="/iletisim" className="hover:text-primary transition-colors">{t('col3Link4')}</Link></li>
            </ul>
          </div>

          {/* Sütun 4: Destek */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">{t('col4Title')}</h3>
            <ul className="space-y-3">
              <li><Link href="/yardim" className="hover:text-primary transition-colors">{t('col4Link1')}</Link></li>
              <li><Link href="/sss" className="hover:text-primary transition-colors">{t('col4Link2')}</Link></li>
              <li><Link href="/iptal-ve-iade" className="hover:text-primary transition-colors">{t('col4Link3')}</Link></li>
              <li><Link href="/guvenlik" className="hover:text-primary transition-colors">{t('col4Link4')}</Link></li>
            </ul>
          </div>

          {/* Sütun 5: Yasal */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">{t('col5Title')}</h3>
            <ul className="space-y-3">
              <li><Link href="/gizlilik-politikasi" className="hover:text-primary transition-colors">{t('col5Link1')}</Link></li>
              <li><Link href="/kullanim-sartlari" className="hover:text-primary transition-colors">{t('col5Link2')}</Link></li>
              <li><Link href="/cerez-politikasi" className="hover:text-primary transition-colors">{t('col5Link3')}</Link></li>
              <li><Link href="/kvkk" className="hover:text-primary transition-colors">{t('col5Link4')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          {t('copyright')}
        </div>
      </div>

      <div className="fixed bottom-5 right-5 z-50">
        <Link 
          href="/yardim" 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg transition-all transform hover:scale-105 text-sm font-semibold"
        >
          <HelpCircle className="w-4 h-4" />
          <span>{t('helpBtn')}</span>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;