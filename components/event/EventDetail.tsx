"use client";

import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom"; 
import Image from "next/image";
import {
  getEventDetail,
  addFavorite,
  removeFavorite,
  checkCanBuyTicket,
  createTicket,
  getEventsByCategory,
} from "../../lib/api";
import Link from "next/link";
import { Calendar, Clock, MapPin, Heart, Ticket, Video, Smartphone, ScanLine, Share2, ChevronDown, CheckCircle2 } from "lucide-react";

type Props = {
  eventId: string;
  locale?: string;
};

// FİYAT DÜZELTMESİ
function formatPrice(amount: number | undefined) {
  if (!amount || amount === 0) return "Ücretsiz";
  return amount % 1 === 0 ? `${amount.toFixed(0)} ₺` : `${amount.toFixed(2)} ₺`;
}

// TÜRKÇE GÜN HESAPLAYICI (Örn: 25 Ağustos 2025 -> Pazartesi)
const MONTH_MAP: Record<string, string> = {
  "Ocak": "01", "Şubat": "02", "Mart": "03", "Nisan": "04", "Mayıs": "05", "Haziran": "06",
  "Temmuz": "07", "Ağustos": "08", "Eylül": "09", "Ekim": "10", "Kasım": "11", "Aralık": "12"
};
const DAYS = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

function getDayName(day?: number | string, month?: string, year?: number | string) {
  if (!day || !month || !year) return "";
  const m = MONTH_MAP[month];
  if (!m) return "";
  const d = new Date(`${year}-${m}-${String(day).padStart(2, '0')}`);
  if (isNaN(d.getTime())) return "";
  return DAYS[d.getDay()];
}

export default function EventDetail({ eventId }: Props) {
  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);
  const [qty, setQty] = useState(1);
  const [similar, setSimilar] = useState<any[]>([]);
  const [showQRModal, setShowQRModal] = useState(false);

  // YENİ: Seçili tarihin index'ini tutan state ve Dropdown durumu
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      const ev = await getEventDetail(eventId);
      if (!mounted) return;
      setEventData(ev);
      setFavorite(ev?.isFavorite || false);

      try {
        if (ev?.parentCategory?.id) {
          const list = await getEventsByCategory(ev.parentCategory.id);
          if (mounted) setSimilar(list?.data?.events || []);
        }
      } catch (_) {
        // ignore
      }

      setLoading(false);
    }
    load();
    return () => {
      mounted = false;
    };
  }, [eventId]);

  // Otomatik deeplink: sayfa açılıp `eventData` yüklendiğinde sadece mobilde tetikle
  const autoDeepLinkTried = useRef(false);
  useEffect(() => {
    if (autoDeepLinkTried.current) return;
    if (!eventData) return;

    const ua = navigator.userAgent || navigator.vendor || '';
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    const isAndroid = /android/i.test(ua);

    if (!isIOS && !isAndroid) return; // desktop: do nothing

    autoDeepLinkTried.current = true;

    // iOS flow: scheme -> 2500ms -> App Store
    if (isIOS) {
      const appStoreUrl = "https://apps.apple.com/tr/app/bulbi-%C3%A7ocuk-etkinlikleri/id6749323823";
      try { window.location.href = `bulbi://event/${eventId}`; } catch (e) {}

      const storeTimer = window.setTimeout(() => {
        try { if (!document.hidden) window.location.href = appStoreUrl; } catch (e) {}
      }, 2500);

      const onVis = () => { if (document.hidden) clearTimeout(storeTimer); };
      document.addEventListener('visibilitychange', onVis, { once: true });
    }

    // Android flow: intent -> 1500ms scheme -> 2500ms Play Store
    if (isAndroid) {
      const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.sheydo.bulbi';
      const intentUrl = `intent://bulbi.co/event/${eventId}#Intent;scheme=https;package=com.sheydo.bulbi;S.browser_fallback_url=${encodeURIComponent(playStoreUrl)};end`;

      try { window.location.href = intentUrl; } catch (e) {}

      const schemeTimer = window.setTimeout(() => {
        try { window.location.href = `bulbi://event/${eventId}`; } catch (e) {}
      }, 0);

      const storeTimer = window.setTimeout(() => {
        try { if (!document.hidden) window.location.href = playStoreUrl; } catch (e) {}
      }, 800);

      const onVis = () => {
        if (document.hidden) {
          clearTimeout(schemeTimer);
          clearTimeout(storeTimer);
        }
      };

      document.addEventListener('visibilitychange', onVis, { once: true });
    }
  }, [eventData, eventId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Etkinlik Bulunamadı</h2>
          <p className="text-gray-500">Bu etkinlik yayından kaldırılmış veya mevcut olmayabilir.</p>
        </div>
      </div>
    );
  }

  const priceNum = eventData?.price?.amount || 0;
  //const priceLabel = formatPrice(priceNum);
  const total = priceNum * qty;

  const isOnline = eventData?.eventType === 1;
  const eventTypeLabel = isOnline ? "Çevrim İçi" : "Yüz Yüze";
/*
  async function toggleFavorite() {
    if (favorite) {
      await removeFavorite(eventId);
      setFavorite(false);
    } else {
      await addFavorite(eventId);
      setFavorite(true);
    }
  }
*/
  function handleBuyClick() {
    setShowQRModal(true);
  }

  async function handleShare() {
    const shareData = {
      title: eventData?.name || "Bulbi Etkinliği",
      text: "Bu harika etkinliğe göz atmalısın!",
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
       // console.log("Paylaşım iptal edildi veya desteklenmiyor.");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Etkinlik linki panoya kopyalandı!");
    }
  }

  const banner = eventData?.images?.[0] || eventData?.thumbnail || "/placeholder.png";
  
  // SEÇİLİ TARİHE GÖRE DİNAMİK BİLGİLER
  const currentEventDate = eventData?.eventDates?.[selectedDateIndex];
  const dayStr = getDayName(currentEventDate?.day, currentEventDate?.month, currentEventDate?.year);
  
  const displayDate = currentEventDate
    ? `${currentEventDate.day} ${currentEventDate.month} ${currentEventDate.year}${dayStr ? `, ${dayStr}` : ''}`
    : eventData.startDate
    ? new Date(eventData.startDate).toLocaleDateString("tr-TR")
    : "";
    
  const displayTime = currentEventDate 
    ? `${currentEventDate.startTime || "-"} ${currentEventDate.endTime ? `- ${currentEventDate.endTime}` : ""}`
    : "-";

  return (
    <div className="bg-gray-50 min-h-screen pb-20 pt-28 md:pt-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* === ÜST KISIM: RESİM VE ANA BİLGİ KARTI YAN YANA === */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 mb-8 items-stretch">
          
          <div className="lg:col-span-5 bg-white rounded-3xl md:rounded-[2.5rem] shadow-sm border border-gray-100 p-4 md:p-6 flex items-center justify-center min-h-[300px] md:min-h-[350px]">
            <img src={banner} alt={eventData?.name} className="w-full h-full max-h-[350px] md:max-h-[450px] object-contain rounded-xl" />
          </div>

          {/* SAĞ TARAFTAKİ ANA BİLGİ KARTI */}
          <div className="lg:col-span-7 bg-white rounded-3xl md:rounded-[2.5rem] shadow-xl p-6 md:p-10 border border-gray-100 flex flex-col justify-center">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
              
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-xs font-bold px-4 py-1.5 rounded-full ${isOnline ? 'bg-green-100 text-green-700' : 'bg-teal-100 text-teal-700'}`}>
                  {eventTypeLabel}
                </span>
                {eventData?.categories?.map((c: any) => (
                  <span key={c.id} className="text-xs font-bold bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full">
                    {c.name}
                  </span>
                ))}
                {eventData?.ageRange?.minAge != null && eventData?.ageRange?.maxAge != null && (
                  <span className="text-xs font-bold bg-blue-100 text-blue-600 px-4 py-1.5 rounded-full">
                    {`${eventData.ageRange.minAge}-${eventData.ageRange.maxAge} Yaş`}
                  </span>
                )}
              </div>
              
             <button onClick={handleShare} title="Paylaş" className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-500 hover:bg-orange-50 hover:text-orange-500 transition-all duration-300 shrink-0">
                <Share2 className="w-5 h-5" />
              </button>

            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
              {eventData?.name}
            </h1>
            
            {eventData?.organization?.name && (
               <div className="text-base md:text-lg text-gray-500 font-medium flex items-center gap-2">
                <span>Düzenleyen:</span>
                <span className="text-pink-600 font-bold">{eventData.organization.name}</span>
              </div>
            )}

            {/* BİLGİ KUTULARI (Dinamik Seçili Tarih) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mt-8 md:mt-10">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-pink-100 border border-gray-100">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-pink-200 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 md:w-6 md:h-6 text-pink-600" />
                </div>
                <div>
                  <div className="text-[10px] md:text-xs font-bold text-pink-600 uppercase tracking-wider">Tarih</div>
                  <div className="font-bold text-gray-800 transition-all text-sm md:text-base">{displayDate || "-"}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-blue-100 border border-gray-100">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-200 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-[10px] md:text-xs font-bold text-blue-600 uppercase tracking-wider">Saat</div>
                  <div className="font-bold text-gray-800 transition-all text-sm md:text-base">{displayTime}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-orange-100 border border-gray-100">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-orange-200 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-[10px] md:text-xs font-bold text-orange-600 uppercase tracking-wider">Süre</div>
                  <div className="font-bold text-gray-800 text-sm md:text-base">{eventData?.duration || "Tek Oturum"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === ALT KISIM: AÇIKLAMA, KONUM VE BİLET === */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* SOL TARAF: AÇIKLAMA VE KONUM */}
          <div className="lg:col-span-2">
             {/* ETKİNLİK AÇIKLAMASI BÖLÜMÜ */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 border-b pb-4">
                Etkinlik Hakkında
              </h2>
              <div className="prose prose-base md:prose-lg prose-pink max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap"  dangerouslySetInnerHTML={{ __html: eventData?.description || "Bu etkinlik için açıklama girilmemiştir." }} />
            </div>

            {isOnline ? (
               <div className="bg-white rounded-3xl md:rounded-[2.5rem] shadow-sm p-6 md:p-10 border border-gray-100">
                <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-6">Katılım Bilgileri</h3>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <Video className="w-7 h-7 text-green-600" />
                  </div>
                  <div>
                     <p className="text-base md:text-lg text-gray-800 font-bold mb-1">Bu etkinlik çevrim içi (online) gerçekleştirilecektir.</p>
                    <p className="text-sm md:text-base text-gray-600">Katılım bağlantısı ve detaylar, biletinizi satın aldıktan sonra e-posta adresinize gönderilecektir.</p>
                  </div>
                </div>
              </div>
            ) : null}
            </div>

            {/* Sağda gösterilecek Konum kartı (aside) */}
            <aside className="lg:col-span-1">
              {!isOnline && eventData?.address && (
                 <div className="bg-white rounded-3xl md:rounded-[2.5rem] shadow-sm p-6 md:p-10 border border-gray-100">
                  <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-6">Konum</h3>
                  <div className="flex items-start gap-3 mb-4">
                    <MapPin className="w-5 h-5 text-orange-600 shrink-0 mt-1" />
                    <p className="text-base md:text-lg text-gray-700 font-medium leading-relaxed">{eventData.address}</p>
                  </div>

                  <div className="w-full h-48 md:h-80 rounded-2xl md:rounded-3xl overflow-hidden border border-gray-200 shadow-inner relative">
                    <iframe width="100%" height="100%" frameBorder="0" loading="lazy" className="w-full h-full" src={`https://maps.google.com/maps?q=${encodeURIComponent(eventData.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`} />
                  </div>

                  <a target="_blank" rel="noreferrer" href={`https://maps.google.com/maps?q=${encodeURIComponent(eventData.address)}`} className="inline-flex items-center justify-center w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold transition-colors">
                    Google Haritalar'da Aç
                  </a>
                </div>
              )}
            </aside>
        </div>
             {/* === BENZER ETKİNLİKLER: IZGARANIN DIŞINA ÇIKARILDI === */}
        {similar && similar.length > 0 && (
          <section className="mt-16 md:mt-24 border-t border-gray-200 pt-10 md:pt-16">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 md:mb-10 text-center lg:text-left">Benzer Etkinlikler</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similar.slice(0, 4).map((s: any) => (
                <Link key={s.id} href={`/${s.locale || "tr"}/event/${s.id}`} className="group space-y-4">
                  <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-gray-100">
                    <Image src={s.thumbnail || s.images?.[0] || "/placeholder.png"} alt={s.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 line-clamp-1 group-hover:text-pink-600 transition-colors text-base md:text-lg">{s.name}</h4>
                    <p className="text-pink-600 font-extrabold mt-1 text-sm md:text-base">{formatPrice(s.price?.amount)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
        {/* === YENİ: DAHA İNCE VE KİBAR YÜZEN SATIN ALMA BARI === */}
      {/* - p-2.5 ve gap-2.5 gibi daha sıkı (compact) değerler kullanıldı 
          - bottom-12 yapılarak Yardım butonunun hemen üstünde ama çok yukarıda da durmayacak şekilde sabitlendi */}
      <div className="fixed bottom-12 xl:bottom-8 left-0 w-full z-[99990] pointer-events-none">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pointer-events-auto bg-gradient-to-r from-orange-500/95 to-orange-600/95 backdrop-blur-xl shadow-[0_10px_30px_-10px_rgba(249,115,22,0.5)] border border-orange-400/50 rounded-3xl p-2.5 sm:p-5 transition-all">
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 sm:gap-4 w-full">
              
              {/* SOL: TARİH VE ADET SEÇİMİ */}
              <div className="flex items-center gap-2 sm:gap-3 w-full lg:w-auto flex-1">
                
                {/* Tarih Seçici */}
                {eventData?.eventDates && eventData.eventDates.length > 1 ? (
                  <div className="relative flex-1 lg:max-w-[280px]">
                    <div onClick={() => setIsDropdownOpen(!isDropdownOpen)} className={`bg-white/20 border ${isDropdownOpen ? 'border-white ring-2 ring-white/30' : 'border-white/30 hover:bg-white/30'} rounded-xl p-1.5 lg:p-3 px-3 flex justify-between items-center cursor-pointer transition-all`}>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-xs lg:text-base font-bold text-white truncate">{currentEventDate.day} {currentEventDate.month} {currentEventDate.year}</span>
                        <span className="text-[9px] lg:text-xs text-orange-100 font-extrabold truncate">{currentEventDate.startTime || "Saat Belirtilmemiş"}</span>
                      </div>
                      <ChevronDown className={`w-3 h-3 lg:w-4 lg:h-4 text-white transition-transform shrink-0 ml-1 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {/* YUKARI AÇILAN DROPDOWN */}
                    {isDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                        <div className="absolute bottom-[calc(100%+0.75rem)] left-0 w-full min-w-[240px] lg:min-w-[260px] bg-white border border-gray-100 rounded-2xl lg:rounded-3xl shadow-[0_-15px_40px_-10px_rgba(0,0,0,0.15)] z-50 max-h-52 overflow-y-auto custom-scrollbar">
                          {eventData.eventDates.map((date: any, index: number) => {
                            const isSelected = selectedDateIndex === index;
                            return (
                              <div key={index} onClick={() => { setSelectedDateIndex(index); setIsDropdownOpen(false); }} className={`p-3 lg:p-4 border-b border-gray-50 last:border-0 cursor-pointer transition-all group flex items-center justify-between ${isSelected ? 'bg-orange-50' : 'hover:bg-gray-50'}`}>
                                <div>
                                  <div className={`font-bold text-xs sm:text-sm md:text-base transition-colors ${isSelected ? 'text-orange-600' : 'text-gray-800 group-hover:text-orange-600'}`}>
                                    {date.day} {date.month} {date.year}
                                  </div>
                                  <div className="text-[10px] sm:text-xs text-gray-500 font-bold mt-0.5">{date.startTime || "Belirtilmemiş"}</div>
                                </div>
                                <div className={`w-4 h-4 lg:w-5 lg:h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-orange-500 bg-orange-500' : 'border-gray-200 group-hover:border-orange-300'}`}>
                                  {isSelected && <CheckCircle2 className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-white" />}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 lg:max-w-[280px] flex flex-col justify-center px-2 lg:px-4 overflow-hidden">
                    <span className="text-xs lg:text-base font-bold text-white truncate">{displayDate || "Tarih Belirtilmemiş"}</span>
                    <span className="text-[9px] lg:text-xs text-orange-100 font-extrabold truncate">{displayTime}</span>
                  </div>
                )}

                {/* Adet Seçici */}
                <div className="flex items-center justify-between bg-white/20 border border-white/30 rounded-xl p-1 lg:p-1.5 shrink-0">
                  <span className="text-[10px] lg:text-sm font-bold text-white mr-1.5 lg:mr-2 ml-1.5 lg:ml-3 hidden sm:block">Adet:</span>
                  <div className="flex items-center">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-6 h-6 lg:w-10 lg:h-10 rounded-md lg:rounded-xl bg-white shadow-sm flex items-center justify-center font-bold text-orange-600 active:scale-95 transition-transform">-</button>
                    <span className="font-extrabold text-white w-6 lg:w-10 text-center text-xs lg:text-base">{qty}</span>
                    <button onClick={() => setQty(qty + 1)} className="w-6 h-6 lg:w-10 lg:h-10 rounded-md lg:rounded-xl bg-white shadow-sm flex items-center justify-center font-bold text-orange-600 active:scale-95 transition-transform">+</button>
                  </div>
                </div>
              </div>

              {/* SAĞ: FİYAT VE BUTON */}
              <div className="flex items-center justify-between lg:justify-end w-full lg:w-auto gap-3 lg:gap-8 pt-2 lg:pt-0 border-t border-white/20 lg:border-t-0">
                <div className="flex flex-col ml-1 md:ml-0 shrink-0">
                  <span className="text-[8px] lg:text-[10px] text-orange-100 font-bold uppercase tracking-wider mb-0.5">Toplam</span>
                  <span className="text-base lg:text-3xl font-extrabold text-white leading-none">{total % 1 === 0 ? `${total.toFixed(0)} ₺` : `${total.toFixed(2)} ₺`}</span>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <button onClick={handleBuyClick} className="bg-white text-orange-600 hover:bg-gray-50 px-4 sm:px-6 lg:px-8 py-2 lg:py-3 rounded-lg lg:rounded-xl font-extrabold text-xs sm:text-sm lg:text-lg flex items-center gap-1.5 sm:gap-2 shadow-lg shadow-orange-900/20 active:scale-95 transition-all whitespace-nowrap">
                    <Ticket className="w-3.5 h-3.5 lg:w-5 lg:h-5 text-orange-500" />
                    Hemen Satın Al
                  </button>
                  <span className="text-[7px] sm:text-[8px] lg:text-[10px] text-orange-100 font-medium mt-1 lg:mt-1.5 pr-1">*Uygulama üzerinden alınır.</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>      

      {/* QR MODALI */}
      {showQRModal && (
        <AppRedirectModal
          eventId={eventId}
          onClose={() => setShowQRModal(false)}
        />
      )}
    </div>
  );
}

// UYGULAMAYA YÖNLENDİREN QR MODAL BİLEŞENİ
export function AppRedirectModal({ eventId, onClose }: { eventId: string; onClose: () => void }) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=bulbi://event/${eventId}`;
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const ua = navigator.userAgent || navigator.vendor || '';
    if (/android/i.test(ua) || /iPad|iPhone|iPod/.test(ua)) setIsMobile(true);
    return () => { setMounted(false); };
  }, []);

  const handleMobileRedirect = () => {
    const userAgent = navigator.userAgent || navigator.vendor || '';
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
    const isAndroid = /android/i.test(userAgent);

    if (isIOS) {
      const appStoreUrl = "https://apps.apple.com/tr/app/bulbi-%C3%A7ocuk-etkinlikleri/id6749323823";

      try {
        window.location.href = `bulbi://event/${eventId}`;
      } catch (e) {}

      // Fallback timer to App Store after 2.5s if app didn't open
      const fallbackTimer = window.setTimeout(() => {
        try {
          if (!document.hidden) window.location.href = appStoreUrl;
        } catch (e) {}
      }, 2500);

      const handleVisibility = () => {
        if (document.hidden) {
          clearTimeout(fallbackTimer);
        }
      };

      document.addEventListener('visibilitychange', handleVisibility, { once: true });
    } else if (isAndroid) {
      const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.sheydo.bulbi';

      // 1) Try intent://bulbi.co/event/EVENTID with browser fallback param
      const intentUrl = `intent://bulbi.co/event/${eventId}#Intent;scheme=https;package=com.sheydo.bulbi;S.browser_fallback_url=${encodeURIComponent(playStoreUrl)};end`;

      try {
        window.location.href = intentUrl;
      } catch (e) {}

      // 2) After 1.5s try the scheme as a second attempt
      const schemeTimer = window.setTimeout(() => {
        try {
          window.location.href = `bulbi://event/${eventId}`;
        } catch (e) {}
      }, 1500);

      // 3) After 2.5s fallback to Play Store (in case intent+scheme both didn't open)
      const storeTimer = window.setTimeout(() => {
        try {
          if (!document.hidden) window.location.href = playStoreUrl;
        } catch (e) {}
      }, 2500);

      const handleVisibility = () => {
        if (document.hidden) {
          clearTimeout(schemeTimer);
          clearTimeout(storeTimer);
        }
      };

      document.addEventListener('visibilitychange', handleVisibility, { once: true });
    }
  };

  if (!mounted) return null;

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[999999999] flex items-center justify-center px-4 backdrop-blur-md" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="absolute inset-0 bg-black/70 transition-opacity" onClick={onClose} />
      <div className="relative bg-white rounded-[2.5rem] w-full max-w-md p-8 md:p-10 shadow-2xl transform transition-all">
        <div className="flex flex-col items-center text-center">

          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center mb-6 shadow-inner">
            <Smartphone className="w-10 h-10 text-pink-500" />
          </div>

          <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Uygulamadan Devam Et</h3>
          <p className="text-gray-500 font-medium mb-6">
            Bilet satın alma işlemlerine hızlı ve güvenli bir şekilde <strong className="text-pink-600">Bulbi</strong> mobil uygulamasından devam edebilirsin.
          </p>

          {isMobile ? (
            // Mobile: show only the button that triggers deeplink
            <>
              <button
                onClick={handleMobileRedirect}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold text-lg py-4 rounded-2xl transition-all shadow-lg mb-4"
              >
                Uygulamayı Aç / İndir
              </button>
              <button
                onClick={onClose}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-lg py-3 rounded-2xl transition-colors shadow-sm"
              >
                Vazgeç
              </button>
            </>
          ) : (
            // Desktop: show QR code and instructions
            <>
              <div className="bg-white p-4 rounded-3xl border-2 border-dashed border-gray-200 inline-block mb-6 relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-20 blur transition-opacity"></div>
                <img src={qrUrl} alt="App Yönlendirme QR Kodu" className="w-48 h-48 object-contain relative z-10 rounded-xl" />
                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                  <ScanLine className="w-16 h-16 text-pink-500/20" />
                </div>
              </div>

              <p className="text-sm text-gray-400 font-medium mb-6">Telefonunuzun kamerasını açarak QR kodu okutun.</p>

              <button onClick={onClose} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-base md:text-lg py-3 md:py-4 rounded-2xl transition-colors shadow-sm">
                Vazgeç
              </button>
            </>
          )}

        </div>
      </div>
    </div>,
    document.body
  );
}