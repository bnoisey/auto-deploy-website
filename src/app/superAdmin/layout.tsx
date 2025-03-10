'use client'

import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  HomeIcon,
  DocumentChartBarIcon,
  ChartBarIcon,
  UserGroupIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/24/outline'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const navigation = [
  { name: 'Dashboard', href: '/superAdmin/userManagement', icon: DocumentChartBarIcon },
  { name: 'Account', href: '/superAdmin/account', icon: UserCircleIcon },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/')
    } catch (error) {
      console.error('Failed to logout:', error)
    }
  }

  const renderNavigation = () => (
    <ul role="list" className="-mx-2 space-y-1">
      {navigation.map((item) => (
        <li key={item.name}>
          <Link
            href={item.href}
            className={`
              group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
              ${pathname === item.href
                ? 'bg-gray-50 text-blue-600'
                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }
            `}
          >
            <item.icon
              className={`h-6 w-6 shrink-0 ${
                pathname === item.href ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'
              }`}
              aria-hidden="true"
            />
            {!sidebarCollapsed && <span>{item.name}</span>}
          </Link>
        </li>
      ))}
      <li>
        <button
          onClick={handleLogout}
          className="group flex w-full gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:text-blue-600 hover:bg-gray-50"
        >
          <ArrowRightOnRectangleIcon
            className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-blue-600"
            aria-hidden="true"
          />
          {!sidebarCollapsed && <span>Logout</span>}
        </button>
      </li>
    </ul>
  )

  return (
    <div className="min-h-screen flex">
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center">
                    <Link href="/" className="text-xl font-bold text-gray-900">
                      Cove Lane Health
                    </Link>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        {renderNavigation()}
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className={`hidden lg:flex flex-col ${sidebarCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 ease-in-out`}>
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
          <div className="h-16"></div>
          
          {/* Centered collapse button */}
          <div className="flex items-center -mx-2">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`
                p-2 rounded-md hover:bg-gray-100 transition-colors
                ${sidebarCollapsed ? 'w-full flex justify-center' : 'ml-auto'}
              `}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? (
                <ChevronDoubleRightIcon className="h-6 w-6 text-gray-400" />
              ) : (
                <ChevronDoubleLeftIcon className="h-6 w-6 text-gray-400" />
              )}
            </button>
          </div>
          
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                {renderNavigation()}
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Top nav */}
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
          <button
            type="button"
            className="lg:hidden px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                Cove Lane Health
              </Link>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 
