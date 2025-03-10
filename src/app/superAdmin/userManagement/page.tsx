'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function Dashboard() {
  const [userCount, setUserCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const usersRef = collection(db, 'users')
        const querySnapshot = await getDocs(usersRef)
        setUserCount(querySnapshot.size)
      } catch (error) {
        console.error('Error fetching user count:', error)
      }
    }

    fetchUserCount()
  }, [])

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className="cursor-pointer p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition"
          onClick={() => router.push('/superAdmin/dashboard')}
        >
          <h3 className="text-xl font-semibold text-gray-800">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{userCount-1}</p>
        </div>
        {/* <div className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition">
          <h3 className="text-xl font-semibold text-gray-800">Another Card</h3>
          <p className="text-gray-600 mt-2">Placeholder content</p>
        </div> */}
      </div>
    </div>
  )
}
