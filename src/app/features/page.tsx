'use client'

import Link from 'next/link'
// import Image from 'next/image' // Will need this later
import { MagnifyingGlassIcon, DocumentChartBarIcon } from '@heroicons/react/24/outline'

export default function Features() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
              Transparency Data & Analytics
              <br />
              <span className="text-blue-600">The new era of healthcare pricing</span>
            </h1>
            <p className="mt-8 text-xl text-gray-600 max-w-3xl mx-auto">
              Cove Lane Health provides the most scrutinized data on the market. We make it easy to run quick searches 
              and detailed reports to solve pricing discrepancies across the United States. Using only the most relevant 
              and recent data, our reports are unmatched in quality and value.
            </p>
            <div className="mt-10">
              <Link
                href="/signup"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Search Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex flex-col items-start lg:w-1/2">
              <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-blue-100 mb-6">
                <MagnifyingGlassIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Search</h2>
              <p className="text-lg text-gray-600 mb-6">
                Instantly access healthcare pricing data with our powerful search engine. Compare prices 
                across providers, insurance carriers, and locations in real-time. Perfect for quick 
                price checks and immediate insights.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Real-time price comparisons
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Location-based results
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Insurance carrier filtering
                </li>
              </ul>
            </div>
            <div className="lg:w-1/2 relative h-[400px] w-full rounded-xl overflow-hidden shadow-xl bg-gray-100">
              <div className="flex items-center justify-center h-full text-gray-400">
                Quick Search Demo Image
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Reports Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
            <div className="flex flex-col items-start lg:w-1/2">
              <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-blue-100 mb-6">
                <DocumentChartBarIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Detailed Reports</h2>
              <p className="text-lg text-gray-600 mb-6">
                Generate comprehensive healthcare pricing reports with deep analytics and insights. 
                Our detailed reports provide thorough analysis of pricing trends, variations, and 
                opportunities across markets.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Market trend analysis
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Price variation insights
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Custom report generation
                </li>
              </ul>
            </div>
            <div className="lg:w-1/2 relative h-[400px] w-full rounded-xl overflow-hidden shadow-xl bg-gray-100">
              <div className="flex items-center justify-center h-full text-gray-400">
                Detailed Reports Demo Image
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 