"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { getCityList } from "@/lib/api";
import { Search, Menu, Handshake, HelpCircle, Globe, MapPin, X, ChevronDown } from "lucide-react"; 
import { useRouter, usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";



export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  
  const t = useTranslations("Navbar");
  const locale = useLocale();

  const [q, setQ] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [onlineCats, setOnlineCats] = useState<any[]>([]);
  const [faceCats, setFaceCats] = useState<any[]>([]);

  const [selectedCity, setSelectedCity] = useState("");
  const [cities, setCities] = useState<string[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(true);
  const [openCity, setOpenCity] = useState(false);

  const [openOnline, setOpenOnline] = useState(false);
  const [openFace, setOpenFace] = useState(false);

  // MOBİL MENÜ STATELERİ
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileOnlineOpen, setMobileOnlineOpen] = useState(false);
  const [mobileFaceOpen, setMobileFaceOpen] = useState(false);

  const closeOnlineRef = useRef<number | null>(null);
  const closeFaceRef = useRef<number | null>(null);

  useEffect(() => {
    const savedCity = localStorage.getItem("userCity");
    if (savedCity) setSelectedCity(savedCity);
  }, []);

  useEffect(() => {
    async function loadCitiesFromEvents() {
      try {
        const token = localStorage.getItem("token") || "";
        const res = await fetch("https://user-api-gw.bulbi.co/event/list", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            language: locale,
            token,
          },
          body: JSON.stringify({ page: 0, limit: 1000, eventType: [2] }),
        });

        const json = await res.json();
        const events = json?.data?.events || [];

        const cityIds = new Set(events.map((e: any) => e.city).filter(Boolean));

        const cityRes = await getCityList();
        const allCities = cityRes?.data?.cities || cityRes?.cities || [];

        const matched = allCities
          .filter((c: any) => cityIds.has(c.id))
          .map((c: any) => c.title || c.name || c.label || "").filter(Boolean);

        setCities(matched);
      } catch (err) {
        console.error("loadCitiesFromEvents error:", err);
      } finally {
        setCitiesLoading(false);
      }
    }

    loadCitiesFromEvents();
  }, [locale]);

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    if (city) {
      localStorage.setItem("userCity", city);
    } else {
      localStorage.removeItem("userCity"); 
    }
    setOpenCity(false);

    
    const currentParams = new URLSearchParams(window.location.search);
    if (city) {
      currentParams.set('city', city);
    } else {
      currentParams.delete('city'); 
    }
    router.push(`${pathname}?${currentParams.toString()}`);
  };

  const submitSearch = () => {
    const tStr = q.trim();
    if (!tStr) return;
    router.push(`/search?q=${encodeURIComponent(tStr)}`);
    setMobileMenuOpen(false); // Arama yapınca mobil menüyü kapat
  };

  useEffect(() => {
    if (!pathname.includes("/search")) {
      setQ("");
      // Sayfa değiştiğinde mobil menüyü otomatik kapat
    setMobileMenuOpen(false);
    }
  }, [pathname]);

  const switchLanguage = () => {
    const nextLocale = locale === "tr" ? "en" : "tr";
    let newPath = pathname;
    
    if (nextLocale === "en") {
      newPath = `/en${pathname.replace(/^\/tr/, '')}`;
    } else {
      newPath = `/tr${pathname.replace(/^\/en/, '')}`;
    }
    
    window.location.href = newPath; 
  };

  async function loadCategories() {
    const res = await fetch("https://user-api-gw.bulbi.co/event/categories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        language: locale,
        token: localStorage.getItem("token") || "",
      },
    });
    const json = await res.json();
    setCategories(json?.data?.categories || []);
  }

  async function loadEventTypeCategories(eventType: number) {
    const res = await fetch("https://user-api-gw.bulbi.co/event/list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        language: locale,
        token: localStorage.getItem("token") || "",
      },
      body: JSON.stringify({ page: 0, limit: 200, eventType: [eventType] }),
    });
    const json = await res.json();
    const events = json?.data?.events || [];
    return [...new Set(events.map((e: any) => e.parentCategoryId))];
  }

  useEffect(() => {
    async function init() {
      await loadCategories();
      const onlineIds = await loadEventTypeCategories(1);
      const faceIds = await loadEventTypeCategories(2);

      setOnlineCats(categories.filter((c) => onlineIds.includes(c.id)));
      setFaceCats(categories.filter((c) => faceIds.includes(c.id)));
    }
    init();
  }, [locale]);

  useEffect(() => {
    async function refilter() {
      const onlineIds = await loadEventTypeCategories(1);
      const faceIds = await loadEventTypeCategories(2);
      setOnlineCats(categories.filter((c) => onlineIds.includes(c.id)));
      setFaceCats(categories.filter((c) => faceIds.includes(c.id)));
    }
    if (categories.length > 0) refilter();
  }, [categories]);

  const openPartner = useCallback((e: any) => { e.preventDefault(); window.dispatchEvent(new CustomEvent("openPartnerModal")); }, []);
  const openDownload = useCallback((e: any) => { e.preventDefault(); window.dispatchEvent(new CustomEvent("openAppDownloadModal")); }, []);
  const openSignup = useCallback((e: any) => { e.preventDefault(); window.dispatchEvent(new CustomEvent("openSignupModal")); }, []);

  const openOnlineMenu = () => { if (closeOnlineRef.current) clearTimeout(closeOnlineRef.current); setOpenOnline(true); };
  const scheduleCloseOnline = () => { closeOnlineRef.current = window.setTimeout(() => setOpenOnline(false), 150); };
  const openFaceMenu = () => { if (closeFaceRef.current) clearTimeout(closeFaceRef.current); setOpenFace(true); };
  const scheduleCloseFace = () => { closeFaceRef.current = window.setTimeout(() => setOpenFace(false), 150); };


  // Scroll Kilidi (Mobil menü açıldığında arkadaki sitenin kaymasını engeller)
  useEffect(() => {
    if (mobileMenuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  return (
    <div className="absolute top-0 left-0 w-full z-[9999]">
      
        {/* 1. DÜZELTME: TOP BAR TAŞMA SORUNU (flex-wrap eklendi, padding ve fontlar mobile uyarlandı) */}
      <div className="w-full py-2 sm:py-3 bg-transparent">
        <div className="max-w-7xl mx-auto flex justify-center sm:justify-end items-center px-2 sm:px-5 gap-2 sm:gap-4 flex-wrap">
          
          <button 
            onClick={switchLanguage} 
            className="flex items-center text-gray-800 hover:text-primary text-[11px] sm:text-sm font-bold bg-white/80 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow backdrop-blur-sm transition-all hover:bg-white"
          >
            <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
            <span className="hidden sm:inline">{locale === 'tr' ? 'English' : 'Türkçe'}</span>
            <span className="sm:hidden">{locale === 'tr' ? 'EN' : 'TR'}</span>
          </button>

           <a onClick={openPartner} className="flex items-center bg-white text-primary px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow text-[11px] sm:text-sm font-bold cursor-pointer">
            <Handshake className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="whitespace-nowrap">{t('partner')}</span>
          </a>

           <Link href="/yardim" className="flex items-center text-gray-700 hover:text-primary text-[11px] sm:text-sm font-medium drop-shadow bg-white/50 sm:bg-transparent px-3 sm:px-0 py-1.5 sm:py-0 rounded-full sm:rounded-none">
            <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
            <span className="whitespace-nowrap">{t('help')}</span>
          </Link>

           <a onClick={openSignup} className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-full shadow font-semibold text-[11px] sm:text-sm cursor-pointer whitespace-nowrap">
            {t('login')}
          </a>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <nav className="bg-white border-b shadow relative z-[9999]">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 flex justify-between h-16 sm:h-20 items-center">
          <Link href="/" className="flex items-center shrink-0 hover:opacity-90 transition-opacity">
            <img 
              src="/images/logo.png" 
              alt="Bulbi Logo" 
              className="h-7 sm:h-8 md:h-10 w-auto object-contain" 
            />
          </Link>

          <div className="hidden lg:flex items-center space-x-8">
            
            <div className="relative" onMouseEnter={openOnlineMenu} onMouseLeave={scheduleCloseOnline}>
              <button onClick={() => { router.push('/etkinlikler?eventType=1'); setOpenOnline(false); }} className="text-gray-600 hover:text-primary font-medium flex items-center">
                {t('online')} <span className="ml-2 text-xs">▾</span>
              </button>
              {openOnline && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-[9999999] pt-2 pb-2" onMouseEnter={openOnlineMenu} onMouseLeave={scheduleCloseOnline}>
                  <ul className="py-1">
                    {onlineCats.map((cat) => (
                      <li key={cat.id}>
                        <Link href={`/etkinlikler?eventType=1&categoryId=${cat.id}`} onClick={() => setOpenOnline(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-primary transition-colors">
                          {cat.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="relative" onMouseEnter={openFaceMenu} onMouseLeave={scheduleCloseFace}>
              <button 
                onClick={() => { 
                  const url = `/etkinlikler?eventType=2${selectedCity ? `&city=${encodeURIComponent(selectedCity)}` : ''}`;
                  router.push(url); 
                  setOpenFace(false); 
                }} 
                className="text-gray-600 hover:text-secondary font-medium flex items-center"
              >
                {t('faceToFace')} <span className="ml-2 text-xs">▾</span>
              </button>
              {openFace && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-[9999999] pt-2 pb-2" onMouseEnter={openFaceMenu} onMouseLeave={scheduleCloseFace}>
                  <ul className="py-1">
                    {faceCats.map((cat) => (
                      <li key={cat.id}>
                        <Link 
                          href={`/etkinlikler?eventType=2&categoryId=${cat.id}${selectedCity ? `&city=${encodeURIComponent(selectedCity)}` : ''}`} 
                          onClick={() => setOpenFace(false)} 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-secondary transition-colors"
                        >
                          {cat.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <Link href="/blog" className="text-gray-600 hover:text-primary font-medium relative group">
              {t('blog')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
          </div>

           {/* DESKTOP SAĞ KISIM (ŞEHİR, ARAMA, KAYIT OL) */}
          <div className="hidden lg:flex items-center gap-4">
            
           
            <div className="relative">
              <button 
                onClick={() => setOpenCity(!openCity)} 
                className="flex items-center text-orange-500 hover:text-orange-600 text-sm font-medium bg-gray-50 px-4 py-2 rounded-full border border-gray-200 transition-all"
              >
                <MapPin className="w-4 h-4 mr-1.5 text-orange-500" />
                {selectedCity || "Şehir Seçin"}
              </button>

              {openCity && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl z-[9999999] py-2 border border-gray-100 max-h-64 overflow-y-auto">
                  <button onClick={() => handleCityChange("")} className={`block w-full text-left px-4 py-2 text-sm transition-colors ${!selectedCity ? "bg-orange-50 text-orange-600 font-bold" : "text-gray-700 hover:bg-gray-50"}`}>
                    Şehir Seçimi Temizle
                  </button>
                  {citiesLoading ? (
                    <div className="px-4 py-2 text-sm text-gray-500">Yükleniyor...</div>
                  ) : cities.length > 0 ? (
                    cities.map((city) => (
                      <button key={city} onClick={() => handleCityChange(city)} className={`block w-full text-left px-4 py-2 text-sm transition-colors ${selectedCity === city ? "bg-orange-50 text-orange-600 font-bold" : "text-gray-700 hover:bg-gray-50"}`}>
                        {city}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500">Şehir bulunamadı</div>
                  )}
                </div>
              )}
            </div>

            <div className="relative">
              <Search className="h-4 w-4 text-gray-400 absolute top-2.5 left-3" />
              <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submitSearch()} placeholder={t('searchPlaceholder')} className="pl-10 pr-3 py-2 bg-gray-50 border rounded-full text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none" />
            </div>

            <a onClick={openDownload} className="bg-gradient-to-r from-primary to-pink-500 text-white px-6 py-2.5 rounded-full font-bold shadow text-sm cursor-pointer hover:scale-105 transition-transform">
              {t('register')}
            </a>
          </div>

            {/* 2. DÜZELTME: ÇALIŞAN MOBİL HAMBURGER BUTONU */}
            {/* 2. DÜZELTME: ÇALIŞAN MOBİL HAMBURGER BUTONU */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="lg:hidden text-gray-700 p-2 bg-gray-50 rounded-lg border border-gray-100 transition-colors focus:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>


        {/* 3. DÜZELTME: KUSURSUZ MOBİL AÇILIR MENÜ EKRANI */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-2xl border-t border-gray-100 z-[999999]">
            <div className="flex flex-col px-5 py-6 space-y-6 overflow-y-auto max-h-[80vh] pb-10">
              
              {/* MOBİL ARAMA */}
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute top-3.5 left-4" />
                <input 
                  value={q} 
                  onChange={(e) => setQ(e.target.value)} 
                  onKeyDown={(e) => e.key === "Enter" && submitSearch()} 
                  placeholder={t('searchPlaceholder')} 
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full text-sm focus:ring-2 focus:ring-primary outline-none" 
                />
              </div>

              {/* MOBİL ŞEHİR SEÇİMİ */}
              <div className="relative">
                <button 
                  onClick={() => setOpenCity(!openCity)} 
                  className="w-full flex items-center justify-between text-orange-600 font-bold bg-orange-50 px-5 py-3.5 rounded-2xl border border-orange-100"
                >
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    {selectedCity || "Şehir Seçin"}
                  </div>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openCity ? 'rotate-180' : ''}`} />
                </button>
                {openCity && (
                  <div className="mt-2 bg-white border border-gray-100 rounded-xl shadow-lg py-2 flex flex-col">
                    <button
                      onClick={() => { handleCityChange(""); setMobileMenuOpen(false); setOpenCity(false); }}
                      className="text-left px-5 py-3 text-sm text-orange-600 font-bold hover:bg-orange-50"
                    >
                      Şehir Seçimi Temizle
                    </button>
                    {cities.map((city) => (
                      <button
                        key={city}
                        onClick={() => { handleCityChange(city); setMobileMenuOpen(false); setOpenCity(false); }}
                        className="text-left px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 font-medium"
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <hr className="border-gray-100" />

              {/* MOBİL MENÜ LİNKLERİ */}
              <div className="space-y-4">
                {/* Çevrim İçi Açılır Menü */}
                <div>
                  <button onClick={() => setMobileOnlineOpen(!mobileOnlineOpen)} className="w-full flex items-center justify-between text-gray-800 font-extrabold text-lg py-2">
                    <span>{t('online')}</span>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${mobileOnlineOpen ? 'rotate-180 text-primary' : ''}`} />
                  </button>
                  {mobileOnlineOpen && (
                    <div className="mt-3 ml-2 flex flex-col space-y-4 border-l-2 border-pink-100 pl-4 py-1">
                      <Link href="/etkinlikler?eventType=1" onClick={() => setMobileMenuOpen(false)} className="text-gray-800 font-bold">Tüm Çevrim İçi Etkinlikler</Link>
                      {onlineCats.map(cat => (
                        <Link key={cat.id} href={`/etkinlikler?eventType=1&categoryId=${cat.id}`} onClick={() => setMobileMenuOpen(false)} className="text-gray-600 font-medium hover:text-primary">
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Yüz Yüze Açılır Menü */}
                <div>
                  <button onClick={() => setMobileFaceOpen(!mobileFaceOpen)} className="w-full flex items-center justify-between text-gray-800 font-extrabold text-lg py-2">
                    <span>{t('faceToFace')}</span>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${mobileFaceOpen ? 'rotate-180 text-secondary' : ''}`} />
                  </button>
                  {mobileFaceOpen && (
                    <div className="mt-3 ml-2 flex flex-col space-y-4 border-l-2 border-orange-100 pl-4 py-1">
                      <Link href={`/etkinlikler?eventType=2${selectedCity ? `&city=${encodeURIComponent(selectedCity)}` : ''}`} onClick={() => setMobileMenuOpen(false)} className="text-gray-800 font-bold">Tüm Yüz Yüze Etkinlikler</Link>
                      {faceCats.map(cat => (
                        <Link key={cat.id} href={`/etkinlikler?eventType=2&categoryId=${cat.id}${selectedCity ? `&city=${encodeURIComponent(selectedCity)}` : ''}`} onClick={() => setMobileMenuOpen(false)} className="text-gray-600 font-medium hover:text-secondary">
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="block text-gray-800 font-extrabold text-lg py-2">
                  {t('blog')}
                </Link>
              </div>

              <hr className="border-gray-100" />

              {/* MOBİL KAYIT OL BUTONU */}
              <button onClick={(e) => { openDownload(e); setMobileMenuOpen(false); }} className="w-full bg-gradient-to-r from-primary to-pink-500 text-white px-6 py-4 rounded-2xl font-bold shadow-lg text-lg tracking-wide">
                {t('register')}
              </button>

            </div>
          </div>
        )}
        
      </nav>
    </div>
  );
}