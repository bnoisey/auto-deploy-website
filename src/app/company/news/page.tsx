import Link from 'next/link'
import Image from 'next/image'

export default function News() {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900">Latest News</h1>
            <p className="mt-4 text-xl text-gray-600">
              Stay updated with healthcare price transparency news and Cove Lane Health updates
            </p>
          </div>
        </div>
      </section>

      {/* Market News Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Recent Market News</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Market News Cards */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              <div className="aspect-w-16 aspect-h-9 relative">
                <Image
                  src="/images/placeholder-news.jpg"
                  alt="Healthcare News"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <p className="text-sm text-blue-600 mb-2">March 15, 2024</p>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  CMS Finalizes Price Transparency Rules
                </h3>
                <p className="text-gray-600 mb-4">
                  New regulations require hospitals to provide clear, accessible pricing information...
                </p>
                <a 
                  href="https://www.cms.gov/newsroom" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-semibold hover:text-blue-700"
                >
                  Read More →
                </a>
              </div>
            </div>

            {/* Add more market news cards */}
          </div>
        </div>
      </section>

      {/* Company News Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Cove Lane Health Updates</h2>
          <div className="space-y-8">
            {/* Company News Items */}
            <div className="flex flex-col md:flex-row gap-8 items-center bg-gray-50 rounded-xl p-6">
              <div className="w-full md:w-1/3 aspect-w-16 aspect-h-9 relative rounded-lg overflow-hidden">
                <Image
                  src="/images/placeholder-company.jpg"
                  alt="Cove Lane Health News"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="w-full md:w-2/3">
                <p className="text-sm text-blue-600 mb-2">March 1, 2024</p>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  Cove Lane Health Launches Enhanced Analytics Platform
                </h3>
                <p className="text-gray-600 mb-4">
                  Our latest platform update brings advanced analytics capabilities, 
                  enabling healthcare providers to better understand market dynamics...
                </p>
                <Link 
                  href="/company/news/analytics-platform-launch"
                  className="text-blue-600 font-semibold hover:text-blue-700"
                >
                  Read Full Article →
                </Link>
              </div>
            </div>

            {/* Add more company news items */}
          </div>
        </div>
      </section>

      {/* Press Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Press Contact</h2>
          <p className="text-gray-600 mb-6">
            For press inquiries, please contact our media relations team
          </p>
          <a 
            href="mailto:press@covelanehealth.com"
            className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700"
          >
            press@covelanehealth.com
          </a>
        </div>
      </section>
    </div>
  )
} 