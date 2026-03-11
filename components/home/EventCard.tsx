"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Users, MapPin, Video } from "lucide-react";
import { useTranslations } from "next-intl";

const EventCard = ({ data }: { data: any }) => {
  const t = useTranslations("EventCard");
  const isOnline = data.eventType === 1 || (!data.eventType && data.typeOfParticipation === 1); 

  const theme = {
    badgeBg: isOnline ? "bg-primary" : "bg-secondary",
    text: isOnline ? "text-primary" : "text-secondary",
    buttonGradient: isOnline
      ? "bg-gradient-to-r from-primary to-pink-500"
      : "bg-gradient-to-r from-secondary to-orange-400",
    lightBg: isOnline ? "bg-pink-50" : "bg-orange-50",
  };

  const locale = typeof window !== 'undefined' && window.location.pathname.startsWith('/en') ? 'en' : 'tr';

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative h-48 w-full">
        <Image src={data.thumbnail || data.images?.[0] || "/placeholder.png"} alt={data.name || "Etkinlik Görseli"} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
        <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-lg text-xs font-bold text-white ${theme.badgeBg} flex items-center gap-1.5`}>
          {isOnline ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
          {isOnline ? t('online') : t('inPerson')}
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">{data.name}</h3>

        <div className="space-y-2 mb-5">
          <div className="flex items-center text-sm text-gray-600">
            <div className={`p-1.5 rounded-md ${theme.lightBg} mr-2.5`}>
              <Calendar className={`w-4 h-4 ${theme.text}`} />
            </div>
            <span>{data.startDate ? new Date(data.startDate).toLocaleDateString("tr-TR") : t('noDate')}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <div className={`p-1.5 rounded-md ${theme.lightBg} mr-2.5`}>
              <Users className={`w-4 h-4 ${theme.text}`} />
            </div>
            <span>{data.ageRange?.minAge} - {data.ageRange?.maxAge} {t('age')}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium mb-0.5">{t('perPerson')}</span>
            <span className={`text-xl font-bold ${theme.text}`}>
              {data.isFree ? t('free') : `${data.price?.amount} ${data.price?.currency}`}
            </span>
          </div>
          <Link href={`/${locale}/event/${data.id || data._id}`} className={`${theme.buttonGradient} text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300 text-center`}>
            {t('details')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;