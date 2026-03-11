"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import EventCard from "@/components/home/EventCard";
import { getEventList } from "@/lib/api";
import { useTranslations } from "next-intl";

function SearchContent() {
  const t = useTranslations("SearchPage");
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [events, setEvents] = useState<any[]>([]);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSearchResults() {
      setLoading(true);
      try {
        const response = await getEventList(""); 
        const allEvents = response?.data?.events || [];
        const allOrgs = response?.data?.organizations || [];

        if (query) {
          const lowerQuery = query.toLocaleLowerCase('tr-TR');
          
          // 1. Etkinlikleri Filtrele
          const filteredEvents = allEvents.filter((event: any) => {
            const eventName = (event.name || event.title || "").toLocaleLowerCase('tr-TR');
            return eventName.includes(lowerQuery);
          });
          setEvents(filteredEvents);

          // 2. Organizasyonları Filtrele
          const filteredOrgs = allOrgs.filter((org: any) => {
            const orgName = (org.name || org.title || org.brandName || "").toLocaleLowerCase('tr-TR');
            return orgName.includes(lowerQuery);
          });
          setOrganizations(filteredOrgs);

        } else {
          setEvents(allEvents);
          setOrganizations(allOrgs);
        }

      } catch (error) {
        console.error("Arama sonuçları yüklenemedi:", error);
        setEvents([]);
        setOrganizations([]);
      } finally {
        setLoading(false);
      }
    }

    fetchSearchResults();
  }, [query]);

  const noResults = !loading && events.length === 0 && organizations.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-48 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Başlık */}
        <div className="mb-10 border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">
            {t("title")}
          </h1>
          <p className="mt-2 text-gray-600">
            {/* YENİ: Rich Text ile hem değişken gönderdik hem de HTML (gradient) ile süsledik */}
            {t.rich("subtitle", {
              query: query,
              gradient: (chunks) => (
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                  {chunks}
                </span>
              )
            })}
          </p>
        </div>

        {/* Yükleniyor Durumu */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-pink-600"></div>
            <p className="mt-4 text-gray-500 font-medium">{t("loading")}</p>
          </div>
        )}

        {/* --- ORGANİZASYONLAR BÖLÜMÜ --- */}
        {!loading && organizations.length > 0 && (
          <div className="mb-16">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">
                {organizations.length}
              </span>
              {t("organizationsTitle")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {organizations.map((org: any) => (
                <div key={org.id || org._id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer group">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold text-xl shrink-0 group-hover:scale-110 transition-transform">
                    {(org.name || org.title || org.brandName || "O").charAt(0).toUpperCase()}
                  </div>
                  <h3 className="font-bold text-gray-800 line-clamp-2 group-hover:text-pink-600 transition-colors">
                    {org.name || org.title || org.brandName}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- ETKİNLİKLER BÖLÜMÜ --- */}
        {!loading && events.length > 0 && (
          <div>
             <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-sm">
                {events.length}
              </span>
              {t("eventsTitle")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {events.map((event: any) => (
                <EventCard key={event.id || event._id} data={event} />
              ))}
            </div>
          </div>
        )}

        {/* Sonuç Bulunamama Durumu */}
        {noResults && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t("notFoundTitle")}</h3>
            <p className="text-gray-500">{t("notFoundDesc")}</p>
          </div>
        )}

      </div>
    </div>
  );
}

// YENİ: useSearchParams kullanan bileşenlerin Suspense ile sarmalanması SEO ve performans için şarttır.
export default function SearchPage() {
  const t = useTranslations("SearchPage");
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 pt-48 text-center text-gray-500">{t("suspenseLoading")}</div>}>
      <SearchContent />
    </Suspense>
  );
}