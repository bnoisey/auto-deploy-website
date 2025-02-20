import { Geist } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import FooterWrapper from '@/components/FooterWrapper'
import { AuthProvider } from '@/contexts/AuthContext'

const geist = Geist({ subsets: ['latin'] })

export const metadata = {
  title: 'Cove Lane Health - Healthcare Price Transparency',
  description: 'Compare healthcare costs across providers and insurance carriers.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light">
      <body className={`${geist.className} light`}>
        <AuthProvider>
          <Navbar />
          {children}
          <FooterWrapper />
        </AuthProvider>
      </body>
    </html>
  )
}