import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
<<<<<<< HEAD
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/user'
import { Course } from '@/lib/models/course'
// Enrollment model removed

async function getStats() {
  try {
    await connectDB()

    const totalStudents = await User.countDocuments()
    const totalCourses = await Course.countDocuments()

    // Derive total enrollments from users' enrolledCourses
    const totalEnrollmentsAgg = await User.aggregate([
      { $project: { count: { $size: { $ifNull: ['$enrolledCourses', []] } } } },
      { $group: { _id: null, total: { $sum: '$count' } } },
    ])
    const totalEnrollments = totalEnrollmentsAgg?.[0]?.total || 0
    const completedEnrollments = 0
    const completionRate = 0

    return {
      totalStudents,
      totalCourses,
      totalEnrollments,
      completedEnrollments,
      completionRate
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    return {
      totalStudents: 0,
      totalCourses: 0,
      totalEnrollments: 0,
      completedEnrollments: 0,
      completionRate: 0
    }
  }
}

async function getPopularCourses() {
  try {
    await connectDB()

    // Get top 5 courses by number of users enrolled
    const courses = await Course.find().limit(20).select('_id title')
    const popularCoursesAgg = await User.aggregate([
      { $unwind: '$enrolledCourses' },
      { $group: { _id: '$enrolledCourses', enrollments: { $sum: 1 } } },
      { $sort: { enrollments: -1 } },
      { $limit: 5 },
    ])
    const map = new Map<string, number>(popularCoursesAgg.map((x: any) => [String(x._id), x.enrollments]))
    const popularCourses = courses
      .map((c: any) => ({ name: c.title, enrollments: map.get(String(c._id)) || 0 }))
      .sort((a, b) => b.enrollments - a.enrollments)
      .slice(0, 5)
    return popularCourses
  } catch (error) {
    console.error('Error fetching popular courses:', error)
    return []
  }
}

export default async function HomePage() {
  const stats = await getStats()
  const popularCourses = await getPopularCourses()
=======
import { HeroSection } from '@/components/landing/hero-section'
import { StatsSection } from '@/components/landing/stats-section'
import { TopCoursesSection } from '@/components/landing/top-courses-section'
import { GridFeatureSection } from '@/components/landing/grid-feature-section'
import { WhyUsSection } from '@/components/landing/why-us-section'
>>>>>>> 79faf284cd144d863415c51351790810ab6504a1

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F8F4F1]">
      <Navbar />

      <main>
        <HeroSection />
        <StatsSection />
        <TopCoursesSection />
        <GridFeatureSection />
        <WhyUsSection />
      </main>

      <Footer />
    </div>
  )
}
