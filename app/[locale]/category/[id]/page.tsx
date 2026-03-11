"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { getEventList, getCityList } from "@/lib/api"; 
import AllEvents from "@/components/home/AllEvents";
import CategoryBar from "@/components/home/CategoryBar"; 
import { useTranslations } from "next-intl";

const FALLBACK_CITY_MAP: Record<string, string> = {
  "İstanbul": "6540ad8ca86f177dc93edbdd",
  "Ankara": "6540ad8ca86f177dc93edbc1",
  "İzmir": "6540ad8ca86f177dc93edbde",
};

function CategoryPageContent() {
  const t = useTranslations("CategoryPage");
  const params = useParams();
  const searchParams = useSearchParams();
  
  const id = params?.id as string; 
  const cityParam = searchParams.get("city"); 

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCity, setActiveCity] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    // KUSURSUZ HAFIZA
    const currentCity = cityParam || localStorage.getItem("userCity");
    setActiveCity(currentCity);

    async function load() {
      setLoading(true);
      
      let targetCityId: string | undefined = undefined;
      
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

      const body: any = {
        page: 0,
        limit: 200,
        categories: [id] 
      };

      if (targetCityId) {
        body.cityId = targetCityId; 
        body.city = targetCityId;
      }

      try {
        const res = await getEventList(body);
        const list = res?.data?.events || [];
        setEvents(list);
      } catch (error) {
        console.error("Kategori etkinlikleri çekilemedi:", error);
      } finally {
        setLoading(false);
      }
    }
    
    load();
  }, [id, cityParam]);

  if (!id) return null;

  let pageTitle = t("title");
  if (activeCity) {
    pageTitle = `${activeCity} - ${t("title")}`;
  }

  return (
    <main className="w-full min-h-screen bg-gray-50 pt-32 pb-16">
      <CategoryBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
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
    </main>
  );
}

export default function CategoryPage() {
  const t = useTranslations("CategoryPage");
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 pt-32 text-center text-gray-500">{t("loading") || "Yükleniyor..."}</div>}>
      <CategoryPageContent />
    </Suspense>
  );
}