"use client";

import { useState, useMemo, useEffect } from "react";
import EventCard from "./EventCard";
import { getEventList, getCityList } from "@/lib/api"; 
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation"; 

interface AllEventsProps {
  events?: any[];
  title?: string;
}

const FALLBACK_CITY_MAP: Record<string, string> = {
  "İstanbul": "6540ad8ca86f177dc93edbdd",
  "Ankara": "6540ad8ca86f177dc93edbc1",
  "İzmir": "6540ad8ca86f177dc93edbde",
};

const AllEvents = ({ events: externalEvents, title }: AllEventsProps) => {
  const t = useTranslations("AllEvents");
  const searchParams = useSearchParams();
  const cityParam = searchParams.get("city"); 

  const SORT_TYPES = [
    { key: "date", label: t("sortDateAsc") },
    { key: "date_desc", label: t("sortDateDesc") },
    { key: "price", label: t("sortPriceAsc") },
    { key: "price_desc", label: t("sortPriceDesc") },
  ];

  const [events, setEvents] = useState<any[]>(externalEvents || []);
  const [visibleCount, setVisibleCount] = useState(8);
  const [sortBy, setSortBy] = useState<string>(SORT_TYPES[0].key);

  const displayTitle = title === "Tüm Etkinlikleri Keşfet" || !title ? t("defaultTitle") : title;

  useEffect(() => {
    if (externalEvents !== undefined) {
      setEvents(externalEvents);
    } else {
      async function loadEvents() {
        try {
          const body: any = { page: 0, limit: 200 };
          
          // KUSURSUZ HAFIZA KONTROLÜ
          const currentCity = cityParam || localStorage.getItem("userCity");
          let targetCityId: string | undefined = undefined;
          
          if (currentCity) {
            let foundId: string | undefined = undefined;
            const cityRes = await getCityList();
            if (cityRes?.data?.cities) {
              const matchedCity = cityRes.data.cities.find(
                (c: any) => c.title.toLocaleLowerCase('tr-TR') === currentCity.toLocaleLowerCase('tr-TR')
              );
              if (matchedCity) foundId = matchedCity.id;
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

          if (targetCityId) {
            body.cityId = targetCityId;
            body.city = targetCityId;
          }

          const response = await getEventList(body);
          setEvents(response?.data?.events || []);
        } catch (error) {
          console.error("Event yükleme hatası:", error);
          setEvents([]);
        }
      }
      loadEvents();
    }
  }, [externalEvents, cityParam]); 

  const loadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  const sorted = useMemo(() => {
    let cloned = [...events];
    if (sortBy === "price") cloned.sort((a, b) => (a.price?.amount || 0) - (b.price?.amount || 0));
    if (sortBy === "price_desc") cloned.sort((a, b) => (b.price?.amount || 0) - (a.price?.amount || 0));
    if (sortBy === "date") cloned.sort((a, b) => (a.startDate || 0) - (b.startDate || 0));
    if (sortBy === "date_desc") cloned.sort((a, b) => (b.startDate || 0) - (a.startDate || 0));
    return cloned;
  }, [sortBy, events]); 

  if (events.length === 0 && externalEvents !== undefined) return null;

  return (
    <section className="py-16 bg-gray-50 border-t border-gray-200 rounded-3xl mt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-3xl font-extrabold text-gray-900">{displayTitle}</h2>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-500">{t("sortLabel")}</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 cursor-pointer"
            >
              {SORT_TYPES.map((type) => (
                <option key={type.key} value={type.key}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {sorted.slice(0, visibleCount).map((event: any) => (
            <EventCard key={event.id || event._id} data={event} />
          ))}
        </div>

        {visibleCount < sorted.length && (
          <div className="mt-16 text-center pb-8">
            <button onClick={loadMore} className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-pink-500 text-white px-12 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0">
              <span className="relative z-10 flex items-center justify-center gap-2">
                {t("loadMore")}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </span>
              <div className="absolute inset-0 h-full w-full scale-0 rounded-full transition-all duration-300 group-hover:scale-100 group-hover:bg-white/20"></div>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default AllEvents;