'use client'

import { usePathname } from 'next/navigation'
import Footer from './Footer'

export default function FooterWrapper() {
  const pathname = usePathname()
  const isDashboardPage = pathname?.startsWith('/dashboard')

  if (isDashboardPage) {
    return null
  }

  return <Footer />
} 