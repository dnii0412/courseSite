'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, TrendingUp } from 'lucide-react';

export function StatsSection() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-gray-900 mb-2">100+</div>
            <div className="text-gray-600">Хичээл</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-gray-900 mb-2">1000+</div>
            <div className="text-gray-600">Сурагч</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-gray-900 mb-2">50+</div>
            <div className="text-gray-600">Багш</div>
          </div>
        </div>
      </div>
    </section>
  )
}
