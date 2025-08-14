'use client';

import { Button } from '@/components/ui/button';
import { Play, Lock } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function TopCoursesSection() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleVideoClick = () => {
    setShowPaymentModal(true);
  };

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Топ хичээлүүд
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Хамгийн их суралцагддаг хичээлүүд
          </p>
        </div>

        <div className="flex justify-center">
          {/* Single AI Course Card with Media Player */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 p-10 rounded-3xl shadow-lg max-w-2xl w-full">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm mb-4">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Featured Course
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">AI Course</h3>
              <p className="text-gray-600 text-lg mb-4">Machine Learning & Deep Learning</p>
              <div className="flex items-center justify-center gap-6 mb-6">
                <span className="text-blue-600 font-bold text-xl">₮200,000</span>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">4.9 ⭐</span>
              </div>
            </div>

            {/* Media Player Preview */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-8">
              <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center cursor-pointer hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300 border border-gray-200" onClick={handleVideoClick}>
                <Play className="w-20 h-20 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600 mt-3 text-center font-medium">Click to preview</p>
            </div>

            {/* Course Info */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-sm text-gray-700 font-medium">Machine Learning</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-sm text-gray-700 font-medium">Neural Networks</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-sm text-gray-700 font-medium">Deep Learning</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-sm text-gray-700 font-medium">AI Applications</p>
              </div>
            </div>

            <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <Link href="/courses">Хичээлд бүртгүүлэх</Link>
            </Button>
          </div>
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link href="/courses">Бүх хичээлүүдийг харах</Link>
          </Button>
        </div>
      </div>

      {/* Payment Requirement Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Required</h3>
            <p className="text-gray-600 mb-6">
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
    </section>
  )
}
