'use client'

import { useAuth } from '@/contexts/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User'

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome Back, {displayName}
        </h1>
      </div>
      
      {/* Embedded Vercel App with responsive container */}
      <div className="flex-1 w-full min-h-[600px] h-[calc(100vh-240px)] rounded-lg overflow-hidden border border-gray-200 bg-white">
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