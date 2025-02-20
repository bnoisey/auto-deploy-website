import Image from "next/image";
import Link from 'next/link'
import { EnvelopeIcon } from '@heroicons/react/24/outline'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-gray-900">
              Healthcare Price 
              <br />
              Transparency
              <br />
              <span className="text-blue-600">Instantly & Automatically</span>
            </h1>
            <p className="mt-8 text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              Compare healthcare costs across providers and insurance carriers.
            </p>
            <div className="mt-12 flex justify-center gap-4">
              <Link href="/signup" 
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-base font-semibold hover:bg-blue-700 transition-colors">
                Get Started
              </Link>
              <Link href="/company/contact" 
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-base font-semibold hover:bg-gray-50 transition-colors">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Which Insurance Carrier is Winning your Market?
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Everything you need to understand and manage healthcare costs
            </p>
          </div>
          
          <div className="space-y-10">
            {/* Feature 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Market Dynamics</h3>
                <p className="mt-2 text-gray-600">Private Insurance Carriers negotiate rates for services from Healthcare providers.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Market Leadership</h3>
                <p className="mt-2 text-gray-600">In most regions, one or two carriers hold all the cards. Who these carriers are changes over time and across markets.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Price Variation</h3>
                <p className="mt-2 text-gray-600">Rates for the SAME SERVICES from the SAME PROVIDERS vary dramatically across carriers, and until recently, these rates were not public. Carriers have gone to great lengths to keep it that way.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Platform Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Our Platform
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Comprehensive healthcare price transparency solution
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Price Transparency</h3>
              <p className="text-gray-600">Access real-time pricing data across providers and insurance carriers.</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Market Analysis</h3>
              <p className="text-gray-600">Understand market dynamics and competitive positioning.</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Strategic Insights</h3>
              <p className="text-gray-600">Make data-driven decisions with comprehensive analytics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why Cove Lane Health?</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Cove Lane Health provides simple, secure, and comprehensive healthcare price transparency
              infrastructure for businesses everywhere:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-xl">
              <div className="w-12 h-12 mb-6">
                <svg className="w-full h-full text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Comprehensive Data</h3>
              <p className="text-gray-600">Access to complete, up-to-date pricing information from multiple sources, ensuring you have the most accurate data.</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-xl">
              <div className="w-12 h-12 mb-6">
                <svg className="w-full h-full text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Real-Time Updates</h3>
              <p className="text-gray-600">Stay current with automatic updates and immediate price change notifications.</p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-xl">
              <div className="w-12 h-12 mb-6">
                <svg className="w-full h-full text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Advanced Analytics</h3>
              <p className="text-gray-600">Powerful tools for market analysis and strategic planning, helping you make data-driven decisions.</p>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-8 rounded-xl">
              <div className="w-12 h-12 mb-6">
                <svg className="w-full h-full text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Best Value</h3>
              <p className="text-gray-600">Competitive pricing with maximum return on investment for your healthcare data needs.</p>
            </div>

            {/* Card 5 */}
            <div className="bg-white p-8 rounded-xl">
              <div className="w-12 h-12 mb-6">
                <svg className="w-full h-full text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Passed On Savings</h3>
              <p className="text-gray-600">Direct cost benefits that improve your bottom line with transparent pricing.</p>
            </div>

            {/* Card 6 */}
            <div className="bg-white p-8 rounded-xl">
              <div className="w-12 h-12 mb-6">
                <svg className="w-full h-full text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Competitive Advantage</h3>
              <p className="text-gray-600">Stay ahead with insights that position you as a market leader in healthcare.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-6">
            Ready to get started with transparent healthcare pricing?
          </h2>
          <div className="flex justify-center gap-4">
            <Link href="/signup" 
              className="bg-white text-blue-600 px-6 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors">
              Create Account
            </Link>
            <Link href="/contact" 
              className="border border-white text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
