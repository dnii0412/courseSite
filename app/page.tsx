import { Footer } from '@/components/layout/footer'
import { HeroSection } from '@/components/landing/hero-section'
import { StatsSection } from '@/components/landing/stats-section'
import { TopCoursesSection } from '@/components/landing/top-courses-section'
import { GridFeatureSection } from '@/components/landing/grid-feature-section'
import { WhyUsSection } from '@/components/landing/why-us-section'
import Navbar from '@/components/Navbar'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F8F4F1]">
      <main>
        <Navbar />
        <HeroSection />
        <StatsSection />
        <TopCoursesSection />
        <GridFeatureSection slug="home-hero" />
        <WhyUsSection />
      </main>

      <Footer />
    </div>
  )
}
