'use client';

import { Button } from '@/components/ui/button';
import { Play, Lock, Rocket, Star, Users, Shield } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function HeroSection() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleVideoClick = () => {
    setShowPaymentModal(true);
  };

  return (
    <section className="bg-white py-12 md:py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content - Text */}
          <div className="space-y-6 md:space-y-8 order-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-3 md:px-4 py-2 rounded-full text-sm">
              <Rocket className="w-4 h-4 text-red-500" />
              <span>AI сургалт</span>
            </div>

            {/* Headline */}
            <div className="space-y-3 md:space-y-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                Чанартай хичээлүүд.
                <br />
                <span className="text-blue-600">Хэзээ ч, хаанаас ч.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
                Мэргэжлийн багш нартай, чанартай видео хичээлүүдээр таны ур чадварыг хөгжүүлнэ. Хугацаа, байршлаас үл хамааран суралцаарай.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-6 md:px-8 py-3 rounded-xl">
                <Link href="/auth/register">Бүртгүүлэх</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-gray-300 text-gray-700 px-6 md:px-8 py-3 rounded-xl">
                <Link href="/courses">Хичээлүүдийг үзэх</Link>
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap items-center gap-4 md:gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>3,200+ сурагч</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>4.8/5 үнэлгээ</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>14 хоногийн буцаалт</span>
              </div>
            </div>
          </div>

          {/* Right Content - Enhanced AI Course Card with Media Player */}
          <div className="order-2 lg:order-2 flex justify-center lg:justify-end mb-8 lg:mb-0">
            {/* Enhanced AI Course Card */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-lg w-full max-w-sm md:max-w-md lg:max-w-lg">
              <div className="text-center mb-6 md:mb-8">
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs mb-3 md:mb-4">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  Featured Course
                </div>
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 md:mb-3">AI Course</h3>
                <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4">Machine Learning & Deep Learning</p>
                <div className="flex items-center justify-center gap-3 md:gap-4 mb-4 md:mb-6">
                  <span className="text-blue-600 font-bold text-base md:text-lg lg:text-xl">₮200,000</span>
                  <span className="text-xs md:text-sm text-gray-500 bg-gray-100 px-2 md:px-3 py-1 rounded-full">4.9 ⭐</span>
                </div>
              </div>

              {/* Enhanced Media Player Preview */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl md:rounded-2xl p-4 md:p-6 mb-5 md:mb-8">
                <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg md:rounded-xl flex items-center justify-center cursor-pointer hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300 border border-gray-200" onClick={handleVideoClick}>
                  <Play className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-blue-600" />
                </div>
                <p className="text-xs md:text-sm text-gray-600 mt-2 md:mt-3 text-center font-medium">Click to preview</p>
              </div>

              {/* Course Info */}
              <div className="grid grid-cols-2 gap-2 md:gap-3 mb-5 md:mb-8">
                <div className="bg-gray-50 rounded-lg p-2 md:p-3 text-center">
                  <p className="text-xs md:text-sm text-gray-700 font-medium">Machine Learning</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 md:p-3 text-center">
                  <p className="text-xs md:text-sm text-gray-700 font-medium">Neural Networks</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 md:p-3 text-center">
                  <p className="text-xs md:text-sm text-gray-700 font-medium">Deep Learning</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 md:p-3 text-center">
                  <p className="text-xs md:text-sm text-gray-700 font-medium">AI Applications</p>
                </div>
              </div>

              <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 md:py-4 rounded-xl font-semibold text-sm md:text-base lg:text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <Link href="/courses">Хичээлд бүртгүүлэх</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Requirement Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full mx-4 text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Payment Required</h3>
            <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
              This course requires a subscription. Please login or register to access the full content.
            </p>
            <div className="flex flex-col gap-3">
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild variant="outline" className="border-gray-300 text-gray-700">
                <Link href="/auth/register">Register</Link>
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Background Decorative Dots */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-200 rounded-full"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-blue-200 rounded-full"></div>
        <div className="absolute bottom-32 left-32 w-1.5 h-1.5 bg-blue-200 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-1 h-1 bg-blue-200 rounded-full"></div>
      </div>
    </section>
  )
}
