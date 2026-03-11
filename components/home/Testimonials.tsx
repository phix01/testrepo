import { Star, Quote } from 'lucide-react';
import { useTranslations } from "next-intl";

const Testimonials = () => {
  const t = useTranslations("Testimonials");

  const testimonials = [
    {
      id: 1,
      name: "Ayşe Yılmaz",
      role: t('role1'),
      content: t('content1'),
      avatar: "bg-pink-100 text-pink-600",
      initial: "A"
    },
    {
      id: 2,
      name: "Mehmet Kaya",
      role: t('role2'),
      content: t('content2'),
      avatar: "bg-blue-100 text-blue-600",
      initial: "M"
    },
    {
      id: 3,
      name: "Zeynep Demir",
      role: t('role3'),
      content: t('content3'),
      avatar: "bg-purple-100 text-purple-600",
      initial: "Z"
    }
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-purple-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-orange-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">{t('title')}</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div key={item.id} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <Quote className="h-8 w-8 text-purple-200 fill-current" />
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />)}
                </div>
              </div>
              <p className="text-gray-700 italic mb-6 flex-grow leading-relaxed">"{item.content}"</p>
              <div className="flex items-center mt-auto pt-6 border-t border-gray-50">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg ${item.avatar} mr-3`}>{item.initial}</div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{item.name}</h4>
                  <p className="text-xs text-gray-500">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-4 border-t border-gray-100 pt-10">
          <div className="text-center">
            <div className="text-4xl font-extrabold text-primary">5000+</div>
            <div className="mt-2 text-sm font-medium text-gray-500">{t('stat1')}</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-extrabold text-secondary">1200+</div>
            <div className="mt-2 text-sm font-medium text-gray-500">{t('stat2')}</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-extrabold text-blue-500">350+</div>
            <div className="mt-2 text-sm font-medium text-gray-500">{t('stat3')}</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-extrabold text-green-500">98%</div>
            <div className="mt-2 text-sm font-medium text-gray-500">{t('stat4')}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;