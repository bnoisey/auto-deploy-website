'use client'

import { useAuth } from '@/contexts/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User'

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">
        Welcome Back, {displayName}
      </h1>
      
      {/* Embedded Vercel App */}
      <div className="w-full h-[800px] rounded-lg overflow-hidden border border-gray-200 bg-white">
        <iframe
          src="https://app.covelane.health"
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  )
} 