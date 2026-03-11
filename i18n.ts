import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

const locales = ['tr', 'en'];

export default getRequestConfig(async ({requestLocale}) => {
  const locale = await requestLocale;

  // 1. ADIM: Locale değerinin hem var olduğunu hem de desteklenen dillerde olduğunu doğrula
  if (!locale || !locales.includes(locale as any)) {
    notFound();
  }

  // 2. ADIM: Manuel import yerine daha temiz bir dinamik import kullanabiliriz
  // TypeScript artık 'locale' değişkeninin string olduğunu biliyor
  return {
    locale: locale, // Buradaki hata artık kaybolacak
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
