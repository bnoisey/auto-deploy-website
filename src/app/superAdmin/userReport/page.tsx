"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db, storage } from "@/lib/firebase";
import {
  collection,
  query,
  getDocs,
  orderBy,
  where,
  addDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import {
  ref,
  deleteObject,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { useRouter, useSearchParams } from "next/navigation";
import { CloudArrowUpIcon, TrashIcon } from "@heroicons/react/24/outline";

interface Report {
  id: string;
  fileName: string;
  uploadedAt?: { seconds: number };
  downloadUrl: string;
  userId?: string;
  adminId?: string;
}

export default function UserReports() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId"); // Admin ID to assign the report
  const [reports, setReports] = useState<Report[]>([]);
  const [processedReports, setProcessedReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [processedFile, setProcessedFile] = useState<File | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchReports = async () => {
      setIsLoading(true);
      try {
        // Fetch uploaded reports
        const reportsRef = collection(db, "fileUploads");
        const reportsQuery = query(
          reportsRef,
          where("userId", "==", userId),
          orderBy("uploadedAt", "desc")
        );
        const reportsSnapshot = await getDocs(reportsQuery);
        setReports(
          reportsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Report[]
        );

        // Fetch processed reports
        const processedRef = collection(db, "processedReports");
        const processedQuery = query(
          processedRef,
          where("adminId", "==", userId),
          orderBy("uploadedAt", "desc")
        );
        const processedSnapshot = await getDocs(processedQuery);
        setProcessedReports(
          processedSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Report[]
        );
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [userId]);

  // Upload new report (superadmin)
  const handleUpload = async () => {
    if (!file || !user) return;
    setIsLoading(true);
    try {
      const storageRef = ref(storage, `reports/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);

      const newReport = {
        fileName: file.name,
        downloadUrl,
        uploadedAt: Timestamp.now(),
        userId: user.uid,
        adminId: userId, // Assign report to the respective admin
      };

      // Save to Firestore
      await addDoc(collection(db, "fileUploads"), newReport);
      setFile(null);
      window.location.reload();
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Upload processed report (superadmin assigns to admin)
  const handleProcessedUpload = async () => {
    if (!processedFile || !userId) return;
    setIsLoading(true);
    try {
      const storageRef = ref(
        storage,
        `processed_reports/${processedFile.name}`
      );
      await uploadBytes(storageRef, processedFile);
      const downloadUrl = await getDownloadURL(storageRef);

      const processedReport = {
        fileName: processedFile.name,
        downloadUrl,
        uploadedAt: Timestamp.now(),
        adminId: userId, // Assign report to admin
      };

      // Save to Firestore
      await addDoc(collection(db, "processedReports"), processedReport);
      setProcessedFile(null);
      window.location.reload();
    } catch (error) {
      console.error("Error uploading processed file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (fileUrl: string) => {
    window.open(fileUrl, "_blank");
  };

  const handleDelete = async (
    reportId: string,
    fileUrl: string,
    isProcessed = false
  ) => {
    setIsDeleting(true);
    try {
      const storagePath = decodeURIComponent(
        fileUrl.split("/o/")[1].split("?")[0]
      );

      await deleteDoc(
        doc(db, isProcessed ? "processedReports" : "fileUploads", reportId)
      );
      await deleteObject(ref(storage, storagePath));

      if (isProcessed) {
        setProcessedReports(
          processedReports.filter((report) => report.id !== reportId)
        );
      } else {
        setReports(reports.filter((report) => report.id !== reportId));
      }
    } catch (error) {
      console.error("Error deleting report:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
    {/* <div className="mb-5 mt-5">
      <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-5">Upload Processed Reports</h2>

      </div>
    <input
          type="file"
          onChange={(e) => setProcessedFile(e.target.files?.[0] || null)}
        />
        <button
          onClick={handleProcessedUpload}
          className="bg-green-600 text-white px-3 py-1 rounded mt-2"
        >
          Upload Processed Report
        </button>

    </div> */}
    {/* Upload Section for Processed Reports */}
<div className="mt-8 bg-white mb-5">
  <div >
    <h2 className="text-2xl font-bold   text-gray-900">
      Upload Processed Report
    </h2>
    <div className="mt-2 max-w-xl text-sm text-gray-500">
      <p>Upload processed reports in CSV format for admins.</p>
    </div>

    <div className="mt-5">
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <CloudArrowUpIcon className="w-10 h-10 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">CSV files only (max. 10GB)</p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            onChange={(e) => setProcessedFile(e.target.files?.[0] || null)}
            accept=".csv"
          />
        </label>
      </div>

      {processedFile && (
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Selected file: {processedFile.name}
            </div>
            <button
              type="button"
              onClick={handleProcessedUpload}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? "Uploading..." : "Upload File"}
            </button>
          </div>

          {isLoading && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: "50%" }} // Replace with actual progress if needed
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1 text-center">
                Uploading...
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
</div>

  
      {/* Uploaded Reports Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Uploaded Reports</h2>
        {isLoading ? (
          <div className="mt-6 text-center text-gray-500">Loading...</div>
        ) : (
          <table className="mt-6 w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Report Name</th>
                <th className="border p-2">Uploaded At</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border">
                  <td className="border p-2 text-center">{report.fileName}</td>
                  <td className="border p-2 text-center">
                    {new Date(
                      report.uploadedAt.seconds * 1000
                    ).toLocaleString()}
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => handleDownload(report.downloadUrl)}
                      className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 mr-2"
                    >
                      Download
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(report.id, report.downloadUrl)
                      }
                      className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Processed Reports Section */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold text-gray-900">Processed Reports</h2>

   
{/* For Displaying the Table Of Processed Report Start */}
{processedReports.length === 0 ? (
  <div className="mt-6 text-center text-gray-500">No processed reports found.</div>
) : (
  <table className="mt-6 w-full border-collapse border border-gray-200">
    <thead>
      <tr className="bg-gray-100"> 
        <th className="border p-2">Report Name</th>
        <th className="border p-2">Uploaded At</th>
        <th className="border p-2">Actions</th>
      </tr>
    </thead>
    <tbody>
      {processedReports.map((report) => (
        <tr key={report.id} className="border">
          <td className="border p-2 text-center">{report.fileName}</td>
          <td className="border p-2 text-center">
            {new Date(report.uploadedAt.seconds * 1000).toLocaleString()}
          </td>
          <td className="border p-2 text-center">
            <button
              onClick={() => handleDownload(report.downloadUrl)}
              className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 mr-2"
            >
              Download
            </button>
            <button
              onClick={() => handleDelete(report.id, report.downloadUrl)}
              className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Loading..." : "Delete"}
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)}


      {/* For Displaying the Table Of Processed Report End */}
      </div>
    </>
  );
}
