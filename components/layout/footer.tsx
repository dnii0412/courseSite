import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">New Era</h3>
            <p className="text-gray-400">
              Онлайн сургалтын тэргүүлэгч платформ
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Хичээлүүд</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/courses" className="hover:text-white">Бүх хичээлүүд</Link></li>
              <li><Link href="/courses?category=tech" className="hover:text-white">Технологи</Link></li>
              <li><Link href="/courses?category=business" className="hover:text-white">Бизнес</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Тусламж</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/help" className="hover:text-white">Тусламж</Link></li>
              <li><Link href="/contact" className="hover:text-white">Холбоо барих</Link></li>
              <li><Link href="/faq" className="hover:text-white">Түгээмэл асуулт</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Холбоо барих</h4>
            <ul className="space-y-2 text-gray-400">
              <li>И-мэйл: info@training.mn</li>
              <li>Утас: +976 1234-5678</li>
              <li>Хаяг: Улаанбаатар хот</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 New Era. Бүх эрх хуулиар хамгаалагдсан.</p>
        </div>
      </div>
    </footer>
  )
}
