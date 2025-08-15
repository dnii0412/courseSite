import { Footer } from '@/components/layout/footer'
import { HeroSection } from '@/components/landing/hero-section'
import { GridFeatureSection } from '@/components/landing/grid-feature-section'
import { StatsSection } from '@/components/landing/stats-section'
import { WhyUsSection } from '@/components/landing/why-us-section'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <HeroSection />
        
        <GridFeatureSection />

        <WhyUsSection />

        <StatsSection />
      </main>

      <Footer />
    </div>
  )
}
