'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Company info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <h3 className="text-2xl font-bold">New Era</h3>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Монголын хамгийн том онлайн сургалтын платформ.
              Чанартай хичээлүүд, мэргэжлийн багш нартай таны
              суралцах хүслийг бүрэн хангана.
            </p>

            {/* Social media */}
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-300">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-400 transition-colors duration-300">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors duration-300">
                <Youtube className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors duration-300">
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Холбоосууд</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Бидний тухай
                </Link>
              </li>
              <li>
                <Link href="/courses" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Хичээлүүд
                </Link>
              </li>
              <li>
                <Link href="/instructors" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Багш нар
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Үнэ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Холбоо барих
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Дэмжлэг & Эрх</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/help" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Тусламж
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Түгээмэл асуултууд
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Үйлчилгээний нөхцөл
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Нууцлалын бодлого
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Буцаалтын бодлого
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter signup */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="text-center mb-8">
            <h4 className="text-xl font-semibold mb-2">
              Шинэ хичээлүүдийн мэдээлэл авах
            </h4>
            <p className="text-gray-300">
              Имэйл хаягаа оруулж, шинэ хичээлүүд, онцлох санал болон
              мэдээллийг хамгийн түрүүнд аваарай
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="email"
                  placeholder="Имэйл хаягаа оруулна уу"
                  className="pl-10 pr-4 py-3 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 rounded-xl"
                />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl whitespace-nowrap">
                Бүртгүүлэх
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400">
            © 2025 New Era. All rights reserved. Made by{' '}
            <Link 
              href="https://xp-hazel-eta.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors duration-300 font-medium"
            >
              XP Team
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
