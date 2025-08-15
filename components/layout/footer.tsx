'use client';

import { Facebook, Instagram, MessageCircle } from 'lucide-react';
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
              <Link href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors duration-300">
                <MessageCircle className="w-5 h-5" />
              </Link>
            </div>
          </div>



          {/* Platform Features */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Платформын онцлогууд</h4>
            <ul className="space-y-3">
              <li className="text-gray-300">
                <span className="text-blue-400 mr-2">✓</span>
                HD чанартай видео хичээлүүд
              </li>
              <li className="text-gray-300">
                <span className="text-blue-400 mr-2">✓</span>
                Мэргэжлийн багш нар
              </li>

              <li className="text-gray-300">
                <span className="text-blue-400 mr-2">✓</span>
                24/7 дэмжлэг
              </li>
              <li className="text-gray-300">
                <span className="text-blue-400 mr-2">✓</span>
                Уян хатан үнэ
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Холбоо барих</h4>
            <div className="space-y-3">
              <div className="text-gray-300">
                <span className="text-blue-400 mr-2">📧</span>
                info@newera.mn
              </div>
              <div className="text-gray-300">
                <span className="text-blue-400 mr-2">📱</span>
                +976 9999 9999
              </div>
              <div className="text-gray-300">
                <span className="text-blue-400 mr-2">📍</span>
                Улаанбаатар, Монгол
              </div>
              <div className="text-gray-300">
                <span className="text-blue-400 mr-2">🕒</span>
                Даваа-Баасан: 9:00-18:00
              </div>
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
