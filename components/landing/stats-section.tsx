"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Trophy, Users, Star, Target, TrendingUp, Award } from 'lucide-react'

interface StatCard {
  id: string
  title: string
  value: string
  description: string
  icon: string
  color: string
  bgColor: string
}

interface StatsSectionProps {
  stats?: StatCard[]
}

export function StatsSection({ stats }: StatsSectionProps) {
  const [fetchedStats, setFetchedStats] = useState<StatCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setFetchedStats(data.stats || [])
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  // Default statistics if none provided
  const defaultStats: StatCard[] = [
    {
      id: '1',
      title: 'Нийт сурагч',
      value: '3,200+',
      description: 'Идэвхтэй суралцаж буй сурагчид',
      icon: 'Users',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: '2',
      title: 'Дундаж үнэлгээ',
      value: '4.8/5',
      description: 'Сурагчдын сэтгэгдэл',
      icon: 'Star',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      id: '3',
      title: 'Хичээл дуусгасан',
      value: '15,000+',
      description: 'Амжилттай төгссөн хичээлүүд',
      icon: 'Trophy',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  ]

  // Use provided stats or fetched stats, fallback to defaults
  const displayStats = stats || (fetchedStats.length > 0 ? fetchedStats : defaultStats)

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      Users,
      Star,
      Trophy,
      Target,
      TrendingUp,
      Award
    }
    return iconMap[iconName] || Users
  }

  if (loading) {
    return (
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Статистик уншиж байна...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            New Era статистик
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Манай платформ дээр суралцаж буй сурагчдын амжилт
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {displayStats.map((stat) => {
            const IconComponent = getIconComponent(stat.icon)
            return (
              <Card key={stat.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-white">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${stat.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </h3>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    {stat.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>


      </div>
    </section>
  )
}
