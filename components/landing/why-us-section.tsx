'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, DollarSign, Users, Clock, BookOpen } from 'lucide-react';

const benefits = [
    {
        icon: Video,
        title: 'Чанартай видео & аудио',
        description: 'HD чанартай видео, тод аудио, мөн интерактив элементүүдтэй хичээлүүд',
        color: 'from-blue-500 to-blue-600',
        bgColor: 'from-blue-50 to-blue-100',
        iconColor: 'text-blue-600',
    },
    {
        icon: DollarSign,
        title: 'Уян хатан & хямд үнэ',
        description: 'Өөр өөр төлөвлөгөөтэй, таны хэмжээнд тохирсон үнэтэй сургалтууд',
        color: 'from-green-500 to-green-600',
        bgColor: 'from-green-50 to-green-100',
        iconColor: 'text-green-600',
    },
    {
        icon: Users,
        title: 'Мэргэжлийн багш нар',
        description: 'Тус салбарын мэргэжлийн багш нартай, практик туршлагатай сургалтууд',
        color: 'from-purple-500 to-purple-600',
        bgColor: 'from-purple-50 to-purple-100',
        iconColor: 'text-purple-600',
    },
    {
        icon: Clock,
        title: 'Өөрийн хурдаар суралцах',
        description: 'Хугацаа, байршлаас үл хамааран, өөрийн хурдаар суралцаарай',
        color: 'from-orange-500 to-orange-600',
        bgColor: 'from-orange-50 to-orange-100',
        iconColor: 'text-orange-600',
    },
];

export function WhyUsSection() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Яагаад бид?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Манай платформын давуу талууд
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Чанартай хичээл</h3>
            <p className="text-gray-600">Мэргэжлийн багш нартай, чанартай видео хичээлүүд</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Хугацааны уян хатан байдал</h3>
            <p className="text-gray-600">Хэзээ ч, хаанаас ч суралцах боломж</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Хамтын суралцал</h3>
            <p className="text-gray-600">Бусад сурагчтай хамт суралцах, асуулт асуух</p>
          </div>
        </div>
      </div>
    </section>
  )
}
