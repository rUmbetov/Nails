import { Hero } from '@/components/sections/Hero';
import { Portfolio } from '@/components/sections/Portfolio';
import { StickyCTA } from '@/components/layout/StickyCTA';

export default function Home() {
  return (
    <main className="relative">
      <div className="mx-auto w-full max-w-5xl px-4 pt-6 pb-28 sm:px-6 sm:pt-10">
        <Hero />
        <Portfolio />
      </div>

      <StickyCTA />
    </main>
  );
}
