export type NavItem = {
  href: string
  label: string
  disabled?: boolean
}

export type MainNavItem = NavItem

export type UserNavItem = NavItem

export const mainNavItems: MainNavItem[] = [
  {
    href: '/',
    label: 'Нүүр'
  },
  {
    href: '/courses',
    label: 'Хичээлүүд'
  }
]

export const userNavItems: UserNavItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard'
  },
  {
    href: '/orders',
    label: 'Orders'
  },
  {
    href: '/logout',
    label: 'Logout'
  }
]

export const i18n = {
  mn: {
    nav: {
      home: 'Нүүр',
      courses: 'Хичээлүүд',
      login: 'Нэвтрэх',
      register: 'Бүртгүүлэх',
      dashboard: 'Dashboard',
      orders: 'Orders',
      logout: 'Logout'
    },
    search: {
      placeholder: 'Хайх...',
      noResults: 'Үр дүн олдсонгүй',
      recent: 'Сүүлийн хайлтууд',
      courses: 'Хичээлүүд',
      lessons: 'Хичээлүүд'
    }
  },
  en: {
    nav: {
      home: 'Home',
      courses: 'Courses',
      login: 'Login',
      register: 'Register',
      dashboard: 'Dashboard',
      orders: 'Orders',
      logout: 'Logout'
    },
    search: {
      placeholder: 'Search...',
      noResults: 'No results found',
      recent: 'Recent searches',
      courses: 'Courses',
      lessons: 'Lessons'
    }
  }
}

export type Language = keyof typeof i18n
export type I18nKey = 'nav.home' | 'nav.courses' | 'nav.login' | 'nav.register' | 'nav.dashboard' | 'nav.orders' | 'nav.logout' | 'search.placeholder' | 'search.noResults' | 'search.recent' | 'search.courses' | 'search.lessons'

export function getI18nText(lang: Language, key: I18nKey): string {
  const [section, item] = key.split('.')
  if (section && item) {
    return i18n[lang][section as keyof typeof i18n[typeof lang]]?.[item as any] || key
  }
  return key
}
