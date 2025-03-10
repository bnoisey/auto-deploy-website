'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { db, storage } from '@/lib/firebase'
import { collection, query, getDocs, orderBy, where, Timestamp, deleteDoc, doc } from 'firebase/firestore'
import { ref, getDownloadURL, deleteObject } from 'firebase/storage'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
  role: string
}

export default function Reports() {
  const { user } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, 'users')
        const querySnapshot = await getDocs(usersRef)
        const usersList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as User[]

        setUsers(usersList)
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
        User Management
      </h2>

      {isLoading ? (
        <div className="mt-6 text-center text-gray-500">Loading...</div>
      ) : (
        <ul role="list" className="mt-6 divide-y divide-gray-100 border-t border-gray-200 overflow-auto" style={{height:"80vh"}}>
          {users.map((userItem) => (
            userItem.role !== 'superadmin' && (
              <li key={userItem.id} className="py-5 flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold text-gray-900">{userItem.name} ({userItem.email})</p>
                  <p className="text-sm text-gray-500">Role: {userItem.role}</p>
                </div>
                <button
                  onClick={() => router.push(`/superAdmin/userReport?userId=${userItem.id}`)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  View Report
                </button>
              </li>
            )
          ))}
        </ul>
      )}
    </div>
  )
}