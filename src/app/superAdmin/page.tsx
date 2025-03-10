'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react';

export default function superAdmin() {
  const { user } = useAuth()
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User'
  
  const [postalCode, setPostalCode] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulating an API request (replace with actual API call)
    setTimeout(() => {
      setData([]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome, {displayName}
        </h1>
      </div>
      
      {/* Embedded Vercel App with responsive container */}
      <div className="flex-1 w-full min-h-[600px] h-[calc(100vh-240px)] rounded-lg overflow-hidden border border-gray-200 bg-white">
        {/* <iframe
          src="https://app.covelane.health"
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        /> */}
 {/* created Dashboard Component Manually */}
 <div className=" mx-auto p-6 rounded-lg">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-center sm:space-x-2 space-y-2 sm:space-y-0"
      >
        <label className="text-gray-700 text-sm sm:text-base text-center sm:text-left">
          Enter any US postal code to view average in-network negotiated rates
          for a sample of procedures from major providers in the region, across
          four comparable plans from leading carriers:
        </label>

        <div className="flex flex-col sm:flex-row w-full sm:w-auto space-y-2 sm:space-y-0 sm:space-x-2">
          <input
            type="text"
            placeholder="Enter Postal Code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-60"
          />
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition w-full sm:w-auto"
          >
            Submit
          </button>
        </div>
      </form>

      <div className="mt-4 border rounded-lg p-6 h-[500px] overflow-auto flex items-center justify-center">
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : data ? (
          data.length > 0 ? (
            <p>Data goes here</p>
          ) : (
            <p className="text-gray-500">No data to display.</p>
          )
        ) : (
          <p className="text-gray-500">Enter a postal code to get results.</p>
        )}
      </div>
    </div>

      </div>
    </div>
  )
} 