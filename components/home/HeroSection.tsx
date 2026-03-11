"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

export default function HeroSection() {
  const locale = useLocale();
  
  const [banners, setBanners] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBanners() {
      try {
        const res = await fetch("https://user-api-gw.bulbi.co/homepage", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "language": locale, 
            "token": localStorage.getItem("token") || "",
          },
        });
        
        const text = await res.text();
        if (!text) {
          setLoading(false);
          return;
        }

        try {
          const json = JSON.parse(text);
          const bannerSection = json?.data?.homepage?.find((sec: any) => sec.sectionType === 5);
          
          if (bannerSection && bannerSection.banners) {
            const activeBanners = bannerSection.banners.filter((b: any) => b.status === 1);
            setBanners(activeBanners);
          }
        } catch (parseError) {
          console.error("API JSON döndürmedi. Gelen yanıt:", text.substring(0, 150));
        }

      } catch (error) {
        console.error("Bağlantı hatası veya Bannerlar yüklenemedi:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBanners();
  }, [locale]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000); 
    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));

  const scrollToEvents = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById("etkinlikler");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `/${locale}/#etkinlikler`; 
    }
  };

  if (loading) {
    return (
      // MOBİL İÇİN BOŞLUK (mt-28) VE ORAN (aspect-video) DÜZELTİLDİ
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-28 md:mt-36">
        <div className="w-full aspect-video md:aspect-[21/9] bg-gray-200 animate-pulse rounded-3xl md:rounded-[2.5rem]"></div>
      </div>
    );
  }

  if (banners.length === 0) return null;

  return (
    // MOBİL İÇİN YUKARIDAN BOŞLUK (mt-28) DÜZELTİLDİ
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-32 md:mt-40 relative group z-10">
      
      {/* MOBİL İÇİN ASPECT RATIO DÜZELTİLDİ (4/3 yerine 16/9 yani aspect-video yapıldı. Köşeler biraz yumuşatıldı) */}
      <div className="relative w-full aspect-video md:aspect-[21/9] bg-gray-50 rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-2xl">
        
        {banners.map((banner, index) => {
          const isEvent = banner.type === 1;
          const isActive = index === currentIndex;

          if (isEvent && banner.event) {
            const event = banner.event;
            const imageUrl = event.thumbnail || event.images?.[0];

            return (
              <div
                key={banner.id || index}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out bg-gray-50 ${
                  isActive ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <Link href={`/${locale}/event/${event.id || event._id}`} className="block w-full h-full relative cursor-pointer">
                  {/* Resimler artık ekrana yayvan olarak oturacak, kenarlardan kesilmeyecek */}
                  <img src={imageUrl} alt={event.name} className="w-full h-full object-cover object-center" />
                </Link>
              </div>
            );
          } 
          
          else if (!isEvent && banner.other) {
            const other = banner.other;
            return (
              <div
                key={banner.id || index}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                  isActive ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <img src={other.imageUrl} alt={other.title} className="w-full h-full object-cover object-center" />
                
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/60 to-orange-500/60 z-10"></div>

                <div className="absolute inset-0 flex flex-col items-center justify-end text-center pb-6 md:pb-12 px-4 md:px-16 z-20">
                  <h1 className="text-xl sm:text-3xl md:text-5xl font-extrabold text-white mb-2 md:mb-4 drop-shadow-xl max-w-4xl leading-tight">
                    {other.title}
                  </h1>
                  
                  <p className="text-xs sm:text-base md:text-lg text-white/95 mb-4 md:mb-8 max-w-2xl drop-shadow-md font-medium line-clamp-2 md:line-clamp-none">
                    {other.content}
                  </p>

                  <button 
                    onClick={scrollToEvents}
                    className="bg-white text-pink-700 px-5 py-2.5 md:px-8 md:py-3.5 rounded-full font-extrabold text-xs md:text-base shadow-2xl hover:bg-gray-50 hover:scale-105 hover:shadow-pink-500/30 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <CalendarDays className="w-4 h-4 md:w-5 md:h-5" />
                    <span>Etkinlikleri Keşfet</span>
                  </button>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>

      <button 
        onClick={prevSlide} 
        className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 bg-black/10 hover:bg-black/30 backdrop-blur-md text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 shadow-lg"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      <button 
        onClick={nextSlide} 
        className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 bg-black/10 hover:bg-black/30 backdrop-blur-md text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 shadow-lg"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      <div className="absolute bottom-3 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-30">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-300 rounded-full shadow-sm ${
              idx === currentIndex ? "w-6 md:w-8 h-2 md:h-2.5 bg-white" : "w-2 h-2 md:w-2.5 md:h-2.5 bg-white/60 hover:bg-white/90"
            }`}
          />
        ))}
      </div>

    </div>
  );
}