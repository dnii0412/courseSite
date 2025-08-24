import Link from "next/link"
import { Facebook, Instagram, Send } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">New Era</h3>
            <p className="text-gray-600 mb-4">
              Чанартай хичээллүүд, мэргэжлийн багш нартай таны суралцах хүслийг бүрэн хангана.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-blue-600 hover:text-blue-700">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-pink-600 hover:text-pink-700">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-blue-500 hover:text-blue-600">
                <Send className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Платформын онцлогууд</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• HD чанартай видео хичээллүүд</li>
              <li>• Мэргэжлийн багш нар</li>
              <li>• 24/7 дэмжлэг</li>
              <li>• Үнэ хятад үнэ</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Холбоо барих</h3>
            <ul className="space-y-2 text-gray-600">
              <li>📧 asanchir59@gmail.com</li>
              <li>📞 +976 99638369</li>
              <li>📍 Улаанбаатар, Монгол</li>
              <li>🕒 24/7</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-gray-500">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-4 mb-4 md:mb-0">
              <Link href="#" className="hover:text-gray-700">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-gray-700">
                Data Deletion
              </Link>
            </div>
            <p>© 2025 New Era. All rights reserved. Made by XP Team</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
