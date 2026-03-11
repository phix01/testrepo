"use client";

import { useEffect, useState, useMemo, Suspense } from 'react';
import EventCard from './EventCard';
import { getHomepageData, getCityList } from '@/lib/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

const FALLBACK_CITY_MAP: Record<string, string> = {
  "İstanbul": "6540ad8ca86f177dc93edbdd",
  "Ankara": "6540ad8ca86f177dc93edbc1",
  "İzmir": "6540ad8ca86f177dc93edbde",
};

function FeaturedEventsContent() {
  const t = useTranslations("FeaturedEvents");
  const searchParams = useSearchParams();
  const cityParam = searchParams.get("city");

  const [events, setEvents] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'price'>('date');
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [cityParam]);

  useEffect(() => {
    async function fetchFeatured() {
      setLoading(true);
      try {
        let targetCityId: string | undefined = undefined;
        
        // KUSURSUZ HAFIZA KONTROLÜ
        const currentCity = cityParam || localStorage.getItem("userCity");

        if (currentCity) {
          let foundId: string | undefined = undefined;
          
          const cityRes = await getCityList();
          if (cityRes?.data?.cities) {
            const matchedCity = cityRes.data.cities.find(
              (c: any) => c.title.toLocaleLowerCase('tr-TR') === currentCity.toLocaleLowerCase('tr-TR')
            );
            if (matchedCity) {
              foundId = matchedCity.id;
            }
          }

          if (!foundId) {
            foundId = FALLBACK_CITY_MAP[currentCity];
            if (!foundId) {
              const fallbackMatch = Object.keys(FALLBACK_CITY_MAP).find(
                key => key.toLocaleLowerCase('tr-TR') === currentCity.toLocaleLowerCase('tr-TR')
              );
              if (fallbackMatch) foundId = FALLBACK_CITY_MAP[fallbackMatch];
            }
          }
          
          targetCityId = foundId;
        }

        const response = await getHomepageData(targetCityId);
        const sections = response?.data?.homepage || response?.data || [];
        let featuredSection = null;
        
        if (Array.isArray(sections)) {
          featuredSection = sections.find((sec: any) => sec.sectionType === 4);
        }
        
        if (featuredSection && featuredSection.events) {
          setEvents(featuredSection.events);
        } else {
          setEvents([]); 
        }
      } catch (error) {
        console.error("Öne çıkan etkinlikler yüklenirken hata oluştu:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchFeatured();
  }, [cityParam]);

  const sortedEvents = useMemo(() => {
    const cloned = [...events];
    if (sortBy === 'date') cloned.sort((a, b) => (a.startDate || 0) - (b.startDate || 0));
    else cloned.sort((a, b) => (a.price?.amount || 0) - (b.price?.amount || 0));
    return cloned;
  }, [events, sortBy]);

  const next = () => {
    if (sortedEvents.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % sortedEvents.length);
  };
  
  const prev = () => {
    if (sortedEvents.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + sortedEvents.length) % sortedEvents.length);
  };

  return (
    <section id="etkinlikler" className="py-16 bg-white scroll-mt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">{t('title')}</h2>
            <p className="mt-2 text-gray-600">{t('subtitle')}</p>
          </div>
        </div>

        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-500 font-medium">{t('loading')}</p>
          </div>
        )}

        {!loading && sortedEvents.length > 0 && (
          <div className="relative w-full flex flex-col items-center">
            <div className="relative w-full h-[450px] flex items-center justify-center group">
              <button onClick={prev} className="absolute left-0 md:left-4 z-40 flex items-center justify-center w-12 h-12 bg-gradient-to-r from-primary to-pink-500 text-white rounded-full shadow-lg hover:scale-110 hover:shadow-pink-500/40 hover:opacity-90 transition-all duration-300">
                <ChevronLeft className="w-6 h-6 -ml-0.5" />
              </button>

              {sortedEvents.map((event, index) => {
                const diff = (index - activeIndex + sortedEvents.length) % sortedEvents.length;
                const offset = diff > Math.floor(sortedEvents.length / 2) ? diff - sortedEvents.length : diff;
                const isCenter = offset === 0;
                const isVisible = Math.abs(offset) <= 1;

                return (
                  <div key={event.id || event._id} onClick={() => !isCenter && setActiveIndex(index)} 
                    className={`absolute top-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out w-[280px] sm:w-[320px] lg:w-[340px] ${isCenter ? 'cursor-default' : 'cursor-pointer'} ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    style={{ transform: `translate(calc(-50% + ${offset * 110}%), -50%) scale(${1 - Math.abs(offset) * 0.15})`, left: '50%', zIndex: 30 - Math.abs(offset) }}>
                    <div className={`transition-all duration-700 rounded-2xl ${isCenter ? 'shadow-2xl ring-4 ring-orange-50' : 'shadow-md opacity-50 hover:opacity-80'}`}>
                      <EventCard data={event} />
                    </div>
                  </div>
                )
              })}

              <button onClick={next} className="absolute right-0 md:right-4 z-40 flex items-center justify-center w-12 h-12 bg-gradient-to-r from-primary to-pink-500 text-white rounded-full shadow-lg hover:scale-110 hover:shadow-pink-500/40 hover:opacity-90 transition-all duration-300">
                <ChevronRight className="w-6 h-6 ml-0.5" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 mt-6">
              {sortedEvents.map((_, index) => {
                const dotColors = ['bg-purple-600', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-400'];
                return (
                  <button key={index} onClick={() => setActiveIndex(index)}
                    className={`transition-all duration-300 rounded-full ${dotColors[index % dotColors.length]} ${activeIndex === index ? 'w-8 h-2.5 opacity-100 shadow-md scale-100' : 'w-2.5 h-2.5 opacity-30 hover:opacity-70 hover:scale-110'}`}
                    aria-label={`${t('slide')} ${index + 1}`}
                  />
                );
              })}
            </div>
          </div>
        )}

        {!loading && sortedEvents.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500">{t('notFound')}</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default function FeaturedEvents() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-gray-500">Yükleniyor...</div>}>
      <FeaturedEventsContent />
    </Suspense>
  );
}