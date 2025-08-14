"use client"

import { Video, DollarSign, Users, Clock, Target, Trophy, Handshake } from 'lucide-react'

export function GridFeatureSection() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Яагаад бидэнтэй суралцах вэ?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            New Era платформ нь таны суралцах хүслийг бүрэн хангаж, амжилттай болгоход туслана
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Top Row - 4 cards */}
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Чанартай видео & аудио</h3>
            <p className="text-gray-600 text-sm">HD чанартай видео, тод аудио, мөн интерактив элементүүдтэй хичээлүүд</p>
          </div>

          <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Уян хатан & хямд үнэ</h3>
            <p className="text-gray-600 text-sm">Өөр өөр төлөвлөгөөтэй, таны хэмжээнд тохирсон үнэтэй сургалтууд</p>
          </div>

          <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Мэргэжлийн багш нар</h3>
            <p className="text-gray-600 text-sm">Тус салбарын мэргэжлийн багш нартай, практик туршлагатай сургалтууд</p>
          </div>

          <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Өөрийн хурдаар суралцах</h3>
            <p className="text-gray-600 text-sm">Хугацаа, байршлаас үл хамааран, өөрийн хурдаар суралцаарай</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Bottom Row - 3 cards */}
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Зорилготой сургалт</h3>
            <p className="text-gray-600 text-sm">Хүссэн зорилгодоо хүрэхийн тулд зорилготой, системтэй сургалтын хөтөлбөр</p>
          </div>

          <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Гэрчилгээ & урамшуулал</h3>
            <p className="text-gray-600 text-sm">Хичээл дуусгахад гэрчилгээ, онцлох амжилтад урамшуулал</p>
          </div>

          <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Handshake className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Нийгэмлэг & дэмжлэг</h3>
            <p className="text-gray-600 text-sm">Бусад сурагчидтай холбогдож, багш нараас дэмжлэг авах боломж</p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105">
            Өнөөдөр эхлээрэй
          </button>
        </div>
      </div>
    </section>
  )
}
