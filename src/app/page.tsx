
import { NavBar } from "@/components/blocks/nav-bar";
import { HeroSection } from "@/components/blocks/hero-section";
import { FeaturesSection } from "@/components/blocks/features-section";
import { ShowcaseSection } from "@/components/blocks/showcase-section";
import { TestimonialsSection } from "@/components/blocks/testimonials-with-marquee";
import { PricingBlock } from "@/components/blocks/pricing-block";
import { FAQAccordionBlock } from "@/components/blocks/faq-accordion-block";
import { FooterSection } from "@/components/blocks/footer-section";
import { testimonials } from "@/data/testimonials";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground dark selection:bg-primary/30 font-sans">
      <NavBar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <ShowcaseSection />
        <TestimonialsSection
          title="Loved by Users"
          description="Join thousands gaining confidence in their daily conversations."
          testimonials={testimonials}
        />
        <PricingBlock />
        <FAQAccordionBlock />
        <FooterSection />
      </main>
    </div>
  );
}
