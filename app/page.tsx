import { HeroSection } from '@/components/landing/hero-section'
import { TopCoursesSection } from '@/components/landing/top-courses-section'
import { GridFeatureSection } from '@/components/landing/grid-feature-section'
import { WhyUsSection } from '@/components/landing/why-us-section'
import { StatsSection } from '@/components/landing/stats-section'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <TopCoursesSection />
      <GridFeatureSection />
      <WhyUsSection />
      <StatsSection />
    </div>
  )
}
