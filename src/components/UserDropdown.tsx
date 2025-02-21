import { useAuth } from '@/contexts/AuthContext'
import { useState, useEffect } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { getUserProfile } from '@/lib/firebase/schema'
import type { UserProfile } from '@/lib/firebase/schema'
import { UserCircleIcon } from '@heroicons/react/24/solid'

export default function UserDropdown() {
  const { user, logout } = useAuth()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.uid) {
        setIsLoading(false)
        return
      }
      
      try {
        setIsLoading(true)
        const profile = await getUserProfile(user.uid)
        setUserProfile(profile)
      } catch (error) {
        console.error('Error fetching user profile:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [user?.uid])

  if (isLoading) {
    return (
      <Menu as="div" className="relative">
        <Menu.Button className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          <UserCircleIcon className="h-8 w-8 text-gray-400 animate-pulse" aria-hidden="true" />
        </Menu.Button>
      </Menu>
    )
  }

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
        {user?.photoURL ? (
          <img
            className="h-8 w-8 rounded-full"
            src={user.photoURL}
            alt={user.displayName || 'User avatar'}
          />
        ) : (
          <UserCircleIcon className="h-8 w-8 text-gray-400" aria-hidden="true" />
        )}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-4 py-2">
            <p className="text-sm text-gray-900">{user?.email}</p>
            <p className="text-sm text-gray-500">
              {userProfile?.role ? userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1) : 'Loading...'}
            </p>
          </div>
          <div className="border-t border-gray-100" />
          {/* ... rest of your menu items ... */}
        </Menu.Items>
      </Transition>
    </Menu>
  )
} 