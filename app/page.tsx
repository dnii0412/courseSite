import { Footer } from '@/components/layout/footer'
import { HeroSection } from '@/components/landing/hero-section'
import { StatsSection } from '@/components/landing/stats-section'
import { GridFeatureSection } from '@/components/landing/grid-feature-section'
import { WhyUsSection } from '@/components/landing/why-us-section'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <HeroSection />
        <StatsSection />
        <GridFeatureSection />
        <WhyUsSection />
      </main>

      <Footer />
    </div>
  )
}
