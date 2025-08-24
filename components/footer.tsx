import Link from "next/link"
import { Facebook, Instagram, Send } from "lucide-react"
import { Logo } from "@/components/logo"

export function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Logo className="w-8 h-8 text-primary" />
              <h3 className="font-bold text-lg">New Era</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Чанартай хичээллүүд, мэргэжлийн багш нартай таны суралцах хүслийг бүрэн хангана.
            </p>
            <div className="flex space-x-4">
              <Link 
                href="https://www.facebook.com/profile.php?id=61550966794682" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link 
                href="https://www.instagram.com/newera_mn/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-pink-600 hover:text-pink-700 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              <Link 
                href="https://t.me/+iLJnSiDesicxMjU1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 transition-colors"
                aria-label="Telegram"
              >
                <Send className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Платформын онцлогууд</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• HD чанартай видео хичээллүүд</li>
              <li>• Мэргэжлийн багш</li>
              <li>• 24/7 дэмжлэг</li>
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
            </div>
            <p>© 2025 New Era. All rights reserved. Made by <a href="https://xp-hazel-eta.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 transition-colors">XP Team</a></p>
          </div>
        </div>
      </div>
    </footer>
  )
}
