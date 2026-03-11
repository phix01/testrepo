import HeroSection from '@/components/home/HeroSection';
import FeaturedEvents from '@/components/home/FeaturedEvents';
import CategoryBar from '@/components/home/CategoryBar';
import AllEvents from '@/components/home/AllEvents';
import Testimonials from '@/components/home/Testimonials';
import HowItWorks from '@/components/home/HowItWorks';
import BlogSection from '@/components/home/BlogSection';
import Newsletter from '@/components/home/Newsletter';
import MobileAppSection from '@/components/home/MobileAppSection';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <HeroSection />

      <CategoryBar />

      <FeaturedEvents />
      
      <AllEvents />

      {/*<Testimonials />*/}

      <HowItWorks />

      <BlogSection />

      {/*<Newsletter />*/}

      <MobileAppSection />

      <div className="py-20"></div>
    </main>
  );
}