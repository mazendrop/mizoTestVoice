import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import WaitlistSection from "@/components/landing/WaitlistSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30 flex flex-col">
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <WaitlistSection />
    </main>
  );
}
