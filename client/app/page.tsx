import Header from '@/component/layout/Header';
import HeroSection from '@/component/home/HeroSection';
import FeaturedHorses from '@/component/home/FeaturedHorses';
import SecuritySection from '@/component/home/SecuritySection';
import Footer from '@/component/layout/Footer';

export default function LandingPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased font-display min-h-screen">
      <main>
        <HeroSection />
        <FeaturedHorses />
        <SecuritySection />
      </main>
    </div>
  );
}