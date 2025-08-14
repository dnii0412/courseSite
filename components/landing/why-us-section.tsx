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

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
                <Card
                    key={index}
                    className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white text-center"
                >
                    <CardHeader className="pb-4">
                        <div className={`w-16 h-16 bg-gradient-to-br ${benefit.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                            <benefit.icon className={`w-8 h-8 ${benefit.iconColor}`} />
                        </div>
                        <CardTitle className="text-lg text-gray-900">
                            {benefit.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <p className="text-gray-600 leading-relaxed">
                            {benefit.description}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>

        {/* CTA section */}
        <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
                <h3 className="text-3xl font-bold mb-4">
                    Өнөөдөр эхлээрэй
                </h3>
                <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                    Үнэгүй бүртгэлтэй болж, манай платформын
                    бүх боломжуудыг туршаарай
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg">
                        Үнэгүй эхлэх
                    </button>
                    <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300">
                        Дэлгэрэнгүй мэдэх
                    </button>
                </div>
            </div>
        </div>
      </div>
    </section>
  )
}
