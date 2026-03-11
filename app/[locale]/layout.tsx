import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

// DİKKAT: layout artık [locale] içinde olduğu için CSS dosyasını bir üstten (../) çağırıyoruz
import '../globals.css'; 

import Navbar from '@/components/ui/Navbar'; 
import Footer from '@/components/ui/Footer'; 
import PartnerModal from '@/components/ui/PartnerModal';
import AppDownloadModal from '@/components/ui/AppDownloadModal';
import SignupModal from '@/components/ui/SignupModal';
import InitProvider from "@/components/InitProvider";
import QueryNotification from '@/components/ui/QueryNotification';

// YENİ: Dil sağlayıcıları
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bulbi - Çocuklar İçin En İyi Etkinlikler',
  description: 'Eğlenceli ve eğitici çocuk etkinlikleri platformu.',
};

export default async function RootLayout({
  children,
  params // DÜZELTME 1: Parametreleri doğrudan parçalamadan alıyoruz
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // DÜZELTME 2: Tipini Promise olarak ayarlıyoruz
}) {
  
  // DÜZELTME 3: params'ı await ile bekleyip locale değişkenini içinden çıkarıyoruz
  const { locale } = await params;

  // YENİ: O anki dile ait kelimeleri yüklüyoruz
  const messages = await getMessages();

  return (
    // YENİ: lang özelliği dinamik oldu
    <html lang={locale}>
      <body className={inter.className}>
        {/* YENİ: Bütün bileşenleri (modallar, navbar vb.) dil okuyucusuyla sarmalıyoruz */}
        <NextIntlClientProvider messages={messages}>
          <InitProvider />
          <QueryNotification />
          <Navbar />
          <PartnerModal />
          <AppDownloadModal />
          <SignupModal />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}