'use client'

import { sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils'
import { Home, PieChart, TrendingUp, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Footer from './Footer'

const iconMap = {
  Home,
  PieChart,
  TrendingUp,
  User,
} as const

const Sidebar = () => {
  const pathname = usePathname()

  return (
    <section className="sticky left-0 top-0 flex h-screen w-fit flex-col justify-between border-r border-sb-border 
                        bg-sb-bg text-sb-fg pt-4 md:p-4 xl:p-6 max-md:hidden">
      <nav className="flex flex-col gap-5">
        <Link href="/" className="flex flex-row justify-center items-center gap-2 mb-2">
          <Image
            src="/icons/logo.svg"
            width={35}
            height={35}
            alt="Fiagram logo"
            className="size-8 max-xl:size-12"
          />
          <h1 className="xl:text-26 font-ibm-plex-serif 
            font-bold text-sb-fg max-xl:hidden">Fiagram</h1>
        </Link>

        {sidebarLinks.map((item) => {
          const isActive =
            item.route === '/'
              ? pathname === '/'
              : pathname === item.route || pathname.startsWith(`${item.route}/`)

          const Icon = iconMap[item.icon]

          return (
            <Link
              href={item.route}
              key={item.label}
              className={cn(
                'flex flex-row items-center justify-start max-xl:justify-center gap-3 py-2 md:p-3 2xl:p-4 rounded-lg transition-colors',
                { 'bg-sb-item-bg-active': isActive }
              )}
            >
              <Icon
                className={cn('size-6 text-sb-fg', {
                  'text-sb-item-fg-active': isActive,
                })}
              />
              <p
                className={cn('text-16 font-semibold text-sb-fg max-xl:hidden', {
                  'text-sb-item-fg-active!': isActive,
                })}
              >
                {item.label}
              </p>
            </Link>
          )
        })}
      </nav>

      <Footer />
    </section>
  )
}

export default Sidebar