"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { getEventList, getCityList } from "@/lib/api"; 
import AllEvents from "@/components/home/AllEvents";
import { useTranslations } from "next-intl";

const FALLBACK_CITY_MAP: Record<string, string> = {
  "İstanbul": "6540ad8ca86f177dc93edbdd",
  "Ankara": "6540ad8ca86f177dc93edbc1",
  "İzmir": "6540ad8ca86f177dc93edbde",
};

function EtkinliklerContent() {
  const t = useTranslations("EtkinliklerPage");
  const searchParams = useSearchParams();
  
  const eventType = searchParams.get("eventType");
  const categoryId = searchParams.get("categoryId");
  const cityParam = searchParams.get("city"); 

  const [events, setEvents] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  
  // YENİ: Başlıkta göstermek için hafızadaki şehri tutuyoruz
  const [activeCity, setActiveCity] = useState<string | null>(null);

  useEffect(() => {
    // KUSURSUZ HAFIZA: URL'de şehir yoksa, daha önce Navbarda seçilen şehri al
    const currentCity = cityParam || localStorage.getItem("userCity");
    setActiveCity(currentCity);

    async function load() {
      setLoading(true);
      const body: any = {
        page: 0,
        limit: 200,
      };

      if (eventType) body.eventType = [Number(eventType)];
      if (categoryId) body.categories = [categoryId];
      
      let targetCityId: string | undefined = undefined;
      
      // cityParam yerine currentCity kullanıyoruz
      if (currentCity) {
        let foundId: string | undefined = undefined;
        
        try {
          const cityRes = await getCityList();
          if (cityRes?.data?.cities) {
            const matchedCity = cityRes.data.cities.find(
              (c: any) => c.title.toLocaleLowerCase('tr-TR') === currentCity.toLocaleLowerCase('tr-TR')
            );
            if (matchedCity) foundId = matchedCity.id;
          }
        } catch (e) {}

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

      try {
        const response = await getEventList(body);
        let fetchedEvents = response?.data?.events || [];

        if (eventType === "1") {
          fetchedEvents = fetchedEvents.filter(
            (e: any) => e.eventType === 1 || e.typeOfParticipation === 1
          );
        } else if (eventType === "2") {
          fetchedEvents = fetchedEvents.filter(
            (e: any) => e.eventType === 2 || e.typeOfParticipation === 0
          );
        }

        setEvents(fetchedEvents); 
      } catch (error) {
        console.error("Filtreli etkinlikler çekilemedi", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [eventType, categoryId, cityParam]); 

  let pageTitle = t("titleAll");
  if (eventType === "1") pageTitle = t("titleOnline");
  if (eventType === "2") pageTitle = t("titleFace");
  
  // Başlıkta currentCity kullanılsın
  if (eventType === "2" && activeCity) {
    pageTitle = `${activeCity} ${t("titleFace")}`; 
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {loading ? (
          <div className="text-center py-32">
             <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-pink-600"></div>
             <p className="mt-4 text-gray-500 font-medium">{t("loading")}</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300 shadow-sm mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t("notFoundTitle")}</h3>
            <p className="text-gray-500">{t("notFoundDesc")}</p>
          </div>
        ) : (
          <AllEvents events={events} title={pageTitle} />
        )}

      </div>
    </div>
  );
}

export default function EtkinliklerPage() {
  const t = useTranslations("EtkinliklerPage");
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 pt-32 text-center text-gray-500">{t("suspenseLoading")}</div>}>
      <EtkinliklerContent />
    </Suspense>
  );
}