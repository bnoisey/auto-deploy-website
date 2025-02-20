'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { db, storage } from '@/lib/firebase'
import { collection, query, where, orderBy, limit, getDocs, Timestamp, addDoc } from 'firebase/firestore'
import { CloudArrowUpIcon } from '@heroicons/react/24/outline'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { getUserProfile } from '@/lib/firebase/schema'
import type { UserProfile } from '@/lib/firebase/schema'

interface Report {
  id: string
  postalCode: string
  searchedAt: Timestamp
  userId: string
}

interface FileUpload {
  id: string
  fileName: string
  uploadedAt: Timestamp
  downloadUrl: string
  userId: string
}

export default function Reports() {
  const { user } = useAuth()
  const [recentReports, setRecentReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
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

  useEffect(() => {
    const fetchRecentReports = async () => {
      if (!user?.uid) return

      try {
        const thirtyDaysAgo = Timestamp.fromDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
        
        const reportsRef = collection(db, 'reports')
        const q = query(
          reportsRef,
          where('userId', '==', user.uid),
          where('searchedAt', '>=', thirtyDaysAgo),
          orderBy('searchedAt', 'desc'),
          limit(10)
        )

        const querySnapshot = await getDocs(q)
        const reports = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Report[]

        setRecentReports(reports)
      } catch (error) {
        console.error('Error fetching reports:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecentReports()
  }, [user?.uid])

  const formatDate = (timestamp: Timestamp) => {
    return new Date(timestamp.seconds * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.name.endsWith('.csv')) {
      return 'Only CSV files are allowed'
    }
    
    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return 'File size must be less than 10MB'
    }

    return null
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      const error = validateFile(file)
      
      if (error) {
        alert(error)
        event.target.value = '' // Clear the input
        setSelectedFile(null)
        return
      }
      
      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !user?.uid) return

    setIsUploading(true)
    try {
      // Upload to Firebase Storage
      const storageRef = ref(storage, `uploads/${user.uid}/${selectedFile.name}`)
      await uploadBytes(storageRef, selectedFile)
      const downloadUrl = await getDownloadURL(storageRef)

      // Save metadata to Firestore
      await addDoc(collection(db, 'fileUploads'), {
        fileName: selectedFile.name,
        uploadedAt: Timestamp.now(),
        downloadUrl,
        userId: user.uid
      })

      setSelectedFile(null)
      alert('File uploaded successfully!')
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Failed to upload file. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Reports
          </h2>
        </div>
      </div>

      {/* File Upload Section - Only show for admins */}
      {userProfile?.role === 'admin' && (
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Upload Report</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Upload your CSV file to analyze the data.</p>
            </div>
            <div className="mt-5">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <CloudArrowUpIcon className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">CSV files only (max. 10MB)</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={handleFileSelect}
                    accept=".csv"  // Only allow CSV files
                  />
                </label>
              </div>
              {selectedFile && (
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Selected file: {selectedFile.name}
                    </div>
                    <button
                      type="button"
                      onClick={handleUpload}
                      disabled={isUploading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {isUploading ? 'Uploading...' : 'Upload File'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recent Searches Section */}
      <div className="mt-8">
        <div className="mx-auto">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Recent Searches
          </h3>
          
          {isLoading ? (
            <div className="mt-6 text-center text-gray-500">Loading...</div>
          ) : recentReports.length > 0 ? (
            <ul role="list" className="mt-6 divide-y divide-gray-100 border-t border-gray-200">
              {recentReports.map((report) => (
                <li key={report.id} className="flex items-center justify-between gap-x-6 py-5">
                  <div className="min-w-0">
                    <div className="flex items-start gap-x-3">
                      <p className="text-sm font-semibold leading-6 text-gray-900">
                        {report.postalCode}
                      </p>
                    </div>
                    <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                      <p className="whitespace-nowrap">
                        Searched on {formatDate(report.searchedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-none items-center gap-x-4">
                    <button
                      onClick={() => window.open(`https://app.covelane.health?postalCode=${report.postalCode}`, '_blank')}
                      className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
                    >
                      View Results
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-6 text-center text-gray-500">
              No recent searches found
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 