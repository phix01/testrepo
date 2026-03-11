"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { getCityList } from "@/lib/api";
import { Search, Menu, Handshake, HelpCircle, Globe, MapPin } from "lucide-react"; 
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
  };

  useEffect(() => {
    if (!pathname.includes("/search")) {
      setQ("");
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

  return (
    <div className="absolute top-0 left-0 w-full z-[9999]">
      
      <div className="w-full py-3 bg-transparent">
        <div className="max-w-7xl mx-auto flex justify-end items-center px-5 gap-4">
          
          <button 
            onClick={switchLanguage} 
            className="flex items-center text-gray-800 hover:text-primary text-sm font-bold bg-white/80 px-4 py-1.5 rounded-full shadow backdrop-blur-sm transition-all hover:bg-white"
          >
            <Globe className="w-4 h-4 mr-1.5" />
            {locale === 'tr' ? 'English' : 'Türkçe'}
          </button>

          <a onClick={openPartner} className="flex items-center bg-white text-primary px-4 py-1.5 rounded-full shadow text-sm font-bold cursor-pointer">
            <Handshake className="w-4 h-4 mr-2" />
            {t('partner')}
          </a>

          <Link href="/yardim" className="flex items-center text-gray-700 hover:text-primary text-sm font-medium drop-shadow">
            <HelpCircle className="w-4 h-4 mr-1.5" />
            {t('help')}
          </Link>

          <a onClick={openSignup} className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-3 py-1.5 rounded-full shadow font-semibold text-sm cursor-pointer">
            {t('login')}
          </a>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <nav className="bg-white border-b shadow relative z-[9999]">
        <div className="max-w-7xl mx-auto px-5 flex justify-between h-20 items-center">
          <Link href="/" className="flex items-center shrink-0 hover:opacity-90 transition-opacity">
            <img 
              src="/images/logo.png" 
              alt="Bulbi Logo" 
              className="h-8 md:h-10 w-auto object-contain" 
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

          <div className="hidden md:flex items-center gap-4">
            
           
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
                  <button
                    onClick={() => handleCityChange("")}
                    className={`block w-full text-left px-4 py-2 text-sm transition-colors ${!selectedCity ? "bg-orange-50 text-orange-600 font-bold" : "text-gray-700 hover:bg-gray-50"}`}
                  >
                    Şehir Seçimi Temizle
                  </button>
                  {citiesLoading ? (
                    <div className="px-4 py-2 text-sm text-gray-500">Yükleniyor...</div>
                  ) : cities.length > 0 ? (
                    cities.map((city) => (
                      <button
                        key={city}
                        onClick={() => handleCityChange(city)}
                        className={`block w-full text-left px-4 py-2 text-sm transition-colors ${selectedCity === city ? "bg-orange-50 text-orange-600 font-bold" : "text-gray-700 hover:bg-gray-50"}`}
                      >
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
              <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submitSearch()} placeholder={t('searchPlaceholder')} className="pl-10 pr-3 py-2 bg-gray-50 border rounded-full text-sm focus:ring-1 focus:ring-primary focus:border-primary" />
            </div>

            <a onClick={openDownload} className="bg-gradient-to-r from-primary to-pink-500 text-white px-6 py-2.5 rounded-full font-bold shadow text-sm cursor-pointer">
              {t('register')}
            </a>
          </div>

          <button className="lg:hidden text-gray-600">
            <Menu className="h-7 w-7" />
          </button>
        </div>
      </nav>
    </div>
  );
}