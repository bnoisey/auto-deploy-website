'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { BuildingOfficeIcon, NewspaperIcon, QuestionMarkCircleIcon, EnvelopeIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { Fragment } from 'react'
import { useAuth } from '@/contexts/AuthContext'

const companyLinks = {
  about: [
    { name: 'Cove Lane Health', href: '/company/about', icon: BuildingOfficeIcon },
    { name: 'News', href: '/company/news', icon: NewspaperIcon },
  ],
  resources: [
    { name: 'Help Center', href: '/company/help', icon: QuestionMarkCircleIcon },
    { name: 'Contact Us', href: '/company/contact', icon: EnvelopeIcon },
  ]
}

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 w-full bg-white z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              {/* Replace with your logo */}
              <span className="text-xl font-bold text-gray-900">Cove Lane Health</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/features" className="text-gray-600 hover:text-gray-900">Features</Link>
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button as="button" className="inline-flex items-center text-gray-600 hover:text-gray-900">
                Company
                <ChevronDownIcon className="ml-2 h-4 w-4" aria-hidden="true" />
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
                <Menu.Items className="absolute right-0 mt-2 w-[480px] origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="p-4 flex">
                    <div className="flex-1 pr-4 border-r border-gray-100">
                      <div className="mb-2">
                        <p className="text-sm font-semibold text-gray-900">About</p>
                      </div>
                      <div className="space-y-2">
                        {companyLinks.about.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <Link
                                href={item.href}
                                className={`${
                                  active ? 'bg-gray-50' : ''
                                } group flex items-center gap-3 rounded-lg p-2 text-sm text-gray-700 hover:text-gray-900`}
                              >
                                <item.icon className="h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                                {item.name}
                              </Link>
                            )}
                          </Menu.Item>
                        ))}
                      </div>
                    </div>
                    <div className="flex-1 pl-4">
                      <div className="mb-2">
                        <p className="text-sm font-semibold text-gray-900">Resources</p>
                      </div>
                      <div className="space-y-2">
                        {companyLinks.resources.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <Link
                                href={item.href}
                                className={`${
                                  active ? 'bg-gray-50' : ''
                                } group flex items-center gap-3 rounded-lg p-2 text-sm text-gray-700 hover:text-gray-900`}
                              >
                                <item.icon className="h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                                {item.name}
                              </Link>
                            )}
                          </Menu.Item>
                        ))}
                      </div>
                    </div>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <Menu as="div" className="relative inline-block text-left">
                <Menu.Button className="inline-flex items-center gap-2">
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <UserCircleIcon className="h-8 w-8 text-gray-600" />
                  )}
                  <ChevronDownIcon className="h-4 w-4 text-gray-600" aria-hidden="true" />
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
                  <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="p-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {user.displayName || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>

                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/dashboard"
                              className={`${
                                active ? 'bg-gray-50' : ''
                              } flex items-center px-4 py-2 text-sm text-gray-700 rounded-lg`}
                            >
                              Dashboard
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={logout}
                              className={`${
                                active ? 'bg-gray-50' : ''
                              } flex w-full items-center px-4 py-2 text-sm text-gray-700 rounded-lg`}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <>
                <Link href="/login" 
                  className="text-gray-600 hover:text-gray-900 font-medium">
                  Login
                </Link>
                <Link href="/signup" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 