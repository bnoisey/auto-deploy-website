'use client'

import { useState, Fragment, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { KeyIcon, CreditCardIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { getUserProfile } from '@/lib/firebase/schema'
import type { UserProfile } from '@/lib/firebase/schema'

interface PasswordError {
  length?: string;
  uppercase?: string;
  lowercase?: string;
  number?: string;
  special?: string;
  match?: string;
  current?: string;
  new?: string;
  confirm?: string;
}

export default function Account() {
  const router = useRouter()
  const { user, logout, deleteAccount, updatePassword } = useAuth()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState<PasswordError>({})
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

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

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      await deleteAccount()
      await logout()
      router.push('/')
    } catch (error) {
      console.error('Error deleting account:', error)
      alert('Failed to delete account. Please try again.')
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const validatePassword = (password: string): PasswordError => {
    const errors: PasswordError = {};
    
    if (password.length < 8) {
      errors.length = 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      errors.uppercase = 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      errors.lowercase = 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      errors.number = 'Password must contain at least one number';
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.special = 'Password must contain at least one special character (!@#$%^&*)';
    }

    return errors;
  };

  const handlePasswordChange = async () => {
    setIsChangingPassword(true);
    setPasswordErrors({});

    const errors: PasswordError = {}

    // Validation checks
    if (!currentPassword) {
      errors.current = 'Current password is required'
    }
    if (!newPassword) {
      errors.new = 'New password is required'
    }
    if (!confirmPassword) {
      errors.confirm = 'Please confirm your new password'
    }
    if (newPassword !== confirmPassword) {
      errors.match = 'Passwords do not match'
    }

    setPasswordErrors(errors)

    try {
      // Validate new password
      const passwordErrors = validatePassword(newPassword);
      if (Object.keys(passwordErrors).length > 0) {
        setPasswordErrors(passwordErrors);
        return;
      }

      await updatePassword(currentPassword, newPassword);
      setShowChangePassword(false);
      alert('Password updated successfully');
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Failed to update password. Please check your current password and try again.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-10 divide-y divide-gray-900/10">
      {/* Account Information */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">Account Information</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>View your account details.</p>
          </div>
          <div className="mt-5">
            <div className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Role</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {userProfile?.role ? userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1) : 'Loading...'}
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {/* Change Password */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">Change Password</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Update your password to maintain account security.</p>
            </div>
            <div className="mt-5">
              <button
                type="button"
                onClick={() => setShowChangePassword(true)}
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <KeyIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Billing Management */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">Billing Management</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Manage your subscription and billing information.</p>
            </div>
            <div className="mt-5">
              <button
                type="button"
                onClick={() => window.open('/billing', '_blank')}
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <CreditCardIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                Manage Billing
              </button>
            </div>
          </div>
        </div>

        {/* Delete Account */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">Delete Account</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Permanently delete your account and all associated data.</p>
            </div>
            <div className="mt-5">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                <TrashIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Transition.Root show={showDeleteConfirm} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setShowDeleteConfirm}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        Delete Account
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete your account? This action cannot be undone.
                          All of your data will be permanently removed from our servers forever.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      disabled={isDeleting}
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleDeleteAccount}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete Account'}
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Change Password Modal */}
      <Transition.Root show={showChangePassword} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setShowChangePassword}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                      onClick={() => setShowChangePassword(false)}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        Change Password
                      </Dialog.Title>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                            Current Password
                          </label>
                          <input
                            type="password"
                            id="current-password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                            New Password
                          </label>
                          <input
                            type="password"
                            id="new-password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            id="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                          />
                        </div>

                        {/* Password Requirements */}
                        {Object.keys(passwordErrors).length > 0 && (
                          <div className="rounded-md bg-red-50 p-4">
                            <div className="flex">
                              <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Password requirements:</h3>
                                <div className="mt-2 text-sm text-red-700">
                                  <ul role="list" className="list-disc space-y-1 pl-5">
                                    {Object.values(passwordErrors).map((error, index) => (
                                      <li key={index}>{error}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      disabled={isChangingPassword}
                      className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handlePasswordChange}
                    >
                      {isChangingPassword ? 'Updating...' : 'Update Password'}
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setShowChangePassword(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  )
} 