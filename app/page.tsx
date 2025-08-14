import { HeroSection } from '@/components/landing/hero-section'
import { TopCoursesSection } from '@/components/landing/top-courses-section'
import { GridFeatureSection } from '@/components/landing/grid-feature-section'
import { WhyUsSection } from '@/components/landing/why-us-section'
import { StatsSection } from '@/components/landing/stats-section'
import UserMenu from '@/components/navbar/user-menu'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <div className="absolute top-4 right-4 z-50">
        <UserMenu />
      </div>
      <HeroSection />
      <TopCoursesSection />
      <GridFeatureSection />
      <WhyUsSection />
      <StatsSection />
    </div>
  )
}
