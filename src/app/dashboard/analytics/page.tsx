'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, Timestamp, orderBy } from 'firebase/firestore'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { getUserProfile } from '@/lib/firebase/schema'
import type { UserProfile } from '@/lib/firebase/schema'

interface MonthlyUsage {
  month: string
  searches: number
}

export default function Analytics() {
  const { user } = useAuth()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [monthlyData, setMonthlyData] = useState<MonthlyUsage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalSearches, setTotalSearches] = useState(0)

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.uid) return
      try {
        const profile = await getUserProfile(user.uid)
        setUserProfile(profile)
      } catch (error) {
        console.error('Error fetching user profile:', error)
      }
    }

    fetchUserProfile()
  }, [user?.uid])

  useEffect(() => {
    const fetchUsageData = async () => {
      if (!user?.uid) return

      try {
        // Get data for the last 6 months
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
        
        const reportsRef = collection(db, 'reports')
        const q = query(
          reportsRef,
          where('userId', '==', user.uid),
          where('searchedAt', '>=', Timestamp.fromDate(sixMonthsAgo)),
          orderBy('searchedAt', 'desc'),
          orderBy('__name__', 'desc')
        )

        const querySnapshot = await getDocs(q)
        const reports = querySnapshot.docs.map(doc => ({
          searchedAt: doc.data().searchedAt.toDate()
        }))

        // Group by month
        const monthlyUsage = reports.reduce((acc: { [key: string]: number }, report) => {
          const monthYear = report.searchedAt.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
          })
          acc[monthYear] = (acc[monthYear] || 0) + 1
          return acc
        }, {})

        // Format data for chart
        const formattedData = Object.entries(monthlyUsage).map(([month, searches]) => ({
          month,
          searches
        })).sort((a, b) => {
          const dateA = new Date(a.month)
          const dateB = new Date(b.month)
          return dateA.getTime() - dateB.getTime()
        })

        setMonthlyData(formattedData)
        setTotalSearches(reports.length)
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsageData()
  }, [user?.uid])

  // Only show analytics if user is admin
  if (userProfile?.role !== 'admin') {
    return (
      <div className="text-center mt-8">
        <p>You don't have permission to access analytics.</p>
      </div>
    )
  }

  if (isLoading) {
    return <div className="text-center mt-8">Loading analytics...</div>
  }

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Usage Analytics
          </h2>
        </div>
      </div>

      {/* Summary Card */}
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:p-6">
          <dt className="text-base font-normal text-gray-900">Total Searches (Last 6 Months)</dt>
          <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
            <div className="flex items-baseline text-2xl font-semibold text-blue-600">
              {totalSearches}
              <span className="ml-2 text-sm font-medium text-gray-500">searches</span>
            </div>
          </dd>
        </div>
      </div>

      {/* Monthly Chart */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900 mb-4">
          Monthly Search Activity
        </h3>
        
        {monthlyData.length > 0 ? (
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 60,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="searches" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No search activity in the last 6 months
          </div>
        )}
      </div>

      {/* Monthly Breakdown Table */}
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900 mb-4">
            Monthly Breakdown
          </h3>
          
          <div className="mt-4 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                        Month
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Searches
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {monthlyData.map((month) => (
                      <tr key={month.month}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                          {month.month}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {month.searches}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 