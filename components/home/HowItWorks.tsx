import { MousePointerClick, Ticket, Smile } from 'lucide-react';
import { useTranslations } from "next-intl";

const HowItWorks = () => {
  const t = useTranslations("HowItWorks");

  const steps = [
    {
      id: 1,
      title: t('step1Title'),
      description: t('step1Desc'),
      icon: MousePointerClick,
      color: "text-purple-600",
      bg: "bg-purple-100",
      border: "border-purple-200"
    },
    {
      id: 2,
      title: t('step2Title'),
      description: t('step2Desc'),
      icon: Ticket,
      color: "text-orange-600",
      bg: "bg-orange-100",
      border: "border-orange-200"
    },
    {
      id: 3,
      title: t('step3Title'),
      description: t('step3Desc'),
      icon: Smile,
      color: "text-green-600",
      bg: "bg-green-100",
      border: "border-green-200"
    }
  ];

  return (
    <section className="py-24 bg-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900">{t('title')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-0.5 bg-pink-200 -z-10"></div>
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center text-center group">
              <div className={`w-20 h-20 rounded-full ${step.bg} ${step.color} flex items-center justify-center mb-6 shadow-sm border-4 border-white ${step.border} transition-transform group-hover:scale-110`}>
                <step.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed max-w-xs">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;