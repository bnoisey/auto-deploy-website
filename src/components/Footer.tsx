import Link from 'next/link'
import Image from 'next/image'
import Logo from './Logo'
import XLogo from './icons/XLogo'
import LinkedInLogo from './icons/LinkedInLogo'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
          {/* Logo Section */}
          <div className="col-span-1">
            <Logo />
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-white text-lg mb-4">Solutions</h3>
            <ul className="space-y-3">
              <li><Link href="/solutions/overview" className="hover:text-white transition-colors">Solutions Overview</Link></li>
              <li><Link href="/solutions/integrations" className="hover:text-white transition-colors">Integrations</Link></li>
              <li><Link href="/solutions/analytics" className="hover:text-white transition-colors">Analytics</Link></li>
              <li><Link href="/solutions/security" className="hover:text-white transition-colors">Security & Protection</Link></li>
            </ul>
          </div>

          {/* Developers */}
          <div>
            <h3 className="text-white text-lg mb-4">Developers</h3>
            <ul className="space-y-3">
              <li><Link href="/developers/api" className="hover:text-white transition-colors">API Overview</Link></li>
              <li><Link href="/developers/documentation" className="hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="/developers/guides" className="hover:text-white transition-colors">Implementation Guides</Link></li>
              <li><Link href="/developers/status" className="hover:text-white transition-colors">Platform Status</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/company/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/company/customers" className="hover:text-white transition-colors">Customers</Link></li>
              <li><Link href="/company/partners" className="hover:text-white transition-colors">Partners</Link></li>
              <li><Link href="/company/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/company/news" className="hover:text-white transition-colors">News</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white text-lg mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><Link href="/resources/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/resources/help" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/resources/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/resources/research" className="hover:text-white transition-colors">Research</Link></li>
              <li><Link href="/company/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Social Links */}
          <div className="flex gap-6">
            <a href="https://x.com/covelanehealth" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              <XLogo />
            </a>
            <a href="https://linkedin.com/company/covelanehealth" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              <LinkedInLogo />
            </a>
          </div>

          {/* Legal Links */}
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  )
} 