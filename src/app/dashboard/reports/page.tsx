"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db, storage } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp,
  addDoc,
  getDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import {
  CloudArrowUpIcon,
  TrashIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  uploadBytesResumable,
} from "firebase/storage";
import { getUserProfile } from "@/lib/firebase/schema";
import type { UserProfile, ProcessedReport } from "@/lib/firebase/schema";

interface Report {
  id: string;
  postalCode: string;
  searchedAt: Timestamp;
  userId: string;
}

interface FileUpload {
  id: string;
  fileName: string;
  uploadedAt: Timestamp;
  downloadUrl: string;
  userId: string;
}
const options = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" },
];
export default function Reports() {
  const { user } = useAuth();
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<FileUpload[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [processedReports, setProcessedReports] = useState<ProcessedReport[]>(
    []
  );

  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const toggleSelection = (value: string) => {
    setSelectedValues((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.uid) return;
      try {
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [user?.uid]);

  useEffect(() => {
    const fetchRecentReports = async () => {
      if (!user?.uid) return;

      try {
        const thirtyDaysAgo = Timestamp.fromDate(
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        );

        const reportsRef = collection(db, "reports");
        const q = query(
          reportsRef,
          where("userId", "==", user.uid),
          where("searchedAt", ">=", thirtyDaysAgo),
          orderBy("searchedAt", "desc"),
          orderBy("__name__", "desc"),
          limit(10)
        );

        const querySnapshot = await getDocs(q);
        const reports = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Report[];

        setRecentReports(reports);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentReports();
  }, [user?.uid]);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user?.uid) return;
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        console.log("User data:", userDoc.data(), user.uid); // This will show your user document in the console
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };

    checkAdminStatus();
  }, [user?.uid]);

  useEffect(() => {
    const fetchUploadedFiles = async () => {
      if (!user?.uid) return;

      try {
        const filesRef = collection(db, "fileUploads");
        const q = query(
          filesRef,
          where("userId", "==", user.uid),
          orderBy("uploadedAt", "desc")
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setUploadedFiles([]);
          return;
        }

        const files = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const fileData = {
              id: doc.id,
              fileName: doc.data().fileName,
              uploadedAt: doc.data().uploadedAt,
              downloadUrl: doc.data().downloadUrl,
              userId: doc.data().userId,
            };

            const storageRef = ref(
              storage,
              `uploads/${user.uid}/${fileData.fileName}`
            );
            try {
              await getDownloadURL(storageRef);
              return fileData;
            } catch (error: any) {
              if (error.code === "storage/object-not-found") {
                await deleteDoc(doc.ref);
              }
              return null;
            }
          })
        );

        setUploadedFiles(
          files.filter((file): file is FileUpload => file !== null)
        );
      } catch (error) {
        console.error("Error fetching uploaded files:", error);
        setUploadedFiles([]);
      }
    };

    fetchUploadedFiles();
  }, [user?.uid]);

  const formatDate = (timestamp: Timestamp) => {
    return new Date(timestamp.seconds * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.name.endsWith(".csv")) {
      return "Only CSV files are allowed";
    }

    // Check file size (10GB limit)
    if (file.size > 10737418240) {
      return "File size must be less than 10GB";
    }

    return null;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const error = validateFile(file);

      if (error) {
        alert(error);
        event.target.value = ""; // Clear the input
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user?.uid) return;

    setIsUploading(true);
    setUploadProgress(0);
    try {
      // Create storage reference
      const storageRef = ref(
        storage,
        `uploads/${user.uid}/${selectedFile.name}`
      );

      // Create upload task
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      // Monitor upload progress
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Error uploading file:", error);
          alert("Failed to upload file. Please try again.");
          setIsUploading(false);
        },
        async () => {
          // Upload completed successfully
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

          // Save metadata to Firestore
          const docRef = await addDoc(collection(db, "fileUploads"), {
            fileName: selectedFile.name,
            uploadedAt: Timestamp.now(),
            downloadUrl,
            userId: user.uid,
          });

          // Add new file to state
          setUploadedFiles((prev) => [
            {
              id: docRef.id,
              fileName: selectedFile.name,
              uploadedAt: Timestamp.now(),
              downloadUrl,
              userId: user.uid,
            },
            ...prev,
          ]);

          setSelectedFile(null);
          setIsUploading(false);
          setUploadProgress(0);
          alert("File uploaded successfully!");
        }
      );
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again.");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (fileId: string, fileName: string) => {
    if (!user?.uid || isDeleting) return;

    setIsDeleting(fileId);
    try {
      // Delete from Storage - with error handling for non-existent files
      const storageRef = ref(storage, `uploads/${user.uid}/${fileName}`);
      try {
        await deleteObject(storageRef);
      } catch (error: any) {
        // If the file doesn't exist in storage, we can still proceed to delete the Firestore record
        if (error.code !== "storage/object-not-found") {
          throw error;
        }
      }

      // Delete from Firestore
      await deleteDoc(doc(db, "fileUploads", fileId));

      // Update state
      setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
      alert("File deleted successfully!");
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Failed to delete file. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };
  useEffect(() => {
    const fetchProcessedReports = async () => {
      if (!user?.uid || userProfile?.role !== "admin") return;
      try {
        const reportsRef = collection(db, "processedReports");
        const q = query(
          reportsRef,
          where("adminId", "==", user.uid),
          orderBy("uploadedAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const reports = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ProcessedReport[];
        setProcessedReports(reports);
      } catch (error) {
        console.error("Error fetching processed reports:", error);
      }
    };
    fetchProcessedReports();
  }, [user?.uid, userProfile?.role]);

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Reports
          </h2>
        </div>
      </div>
      <div>
        {/* File Upload Section - Only show for admins */}
        {userProfile?.role === "admin" && (
          <div className="mt-8 bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Upload Claims File
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>
                  Upload claims in CSV format to initiate repricing analysis.
                </p>
              </div>
              <div className="mt-5">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <CloudArrowUpIcon className="w-10 h-10 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        CSV files only (max. 10GB)
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileSelect}
                      accept=".csv" // Only allow CSV files
                    />
                  </label>
                  {/* Dropdown With Parameters Starts */}
                  <div className="relative w-56 h-20 mx-3">
                    <button
                      className="w-full px-4 py-2 text-left border rounded-md bg-white shadow-sm"
                      onClick={() => setOpen(!open)}
                    >
                      {selectedValues.length > 0
                        ? selectedValues.join(", ")
                        : "Select Parameters"}
                    </button>

                    {open && (
                      <ul className="absolute w-full mt-2 bg-white border rounded-md shadow-lg z-10">
                        {options.map((option) => (
                          <li
                            key={option.value}
                            className={`flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                              selectedValues.includes(option.value)
                                ? "bg-gray-200"
                                : ""
                            }`}
                            onClick={() => toggleSelection(option.value)}
                          >
                            {option.label}
                            {selectedValues.includes(option.value) && (
                              <span>✔️</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {/* Dropdown With Parameters Ends */}
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
                        {isUploading ? "Uploading..." : "Upload File"}
                      </button>
                    </div>
                    {isUploading && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-500 mt-1 text-center">
                          {Math.round(uploadProgress)}% uploaded
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Uploaded Files Section */}
        {userProfile?.role === "admin" && (
          <div className="mt-8">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Uploaded Files
            </h3>
            {uploadedFiles.length > 0 ? (
              <ul
                role="list"
                className="mt-6 divide-y divide-gray-100 border-t border-gray-200"
              >
                {uploadedFiles.map((file) => (
                  <li
                    key={file.id}
                    className="flex items-center justify-between gap-x-6 py-5"
                  >
                    <div className="min-w-0">
                      <div className="flex items-start gap-x-3">
                        <p className="text-sm font-semibold leading-6 text-gray-900">
                          {file.fileName}
                        </p>
                      </div>
                      <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                        <p className="whitespace-nowrap">
                          Uploaded on {formatDate(file.uploadedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-none items-center gap-x-4">
                      <a
                        href={file.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
                      >
                        Download
                      </a>
                      <button
                        onClick={() => handleDelete(file.id, file.fileName)}
                        disabled={isDeleting === file.id}
                        className="rounded-md bg-red-50 p-2 text-red-600 hover:bg-red-100"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-6 text-center text-gray-500">
                No files uploaded yet
              </div>
            )}
          </div>
        )}
      </div>
      <div>
        {/* Processed Reports Section - Visible only to admins */}
        {userProfile?.role === "admin" && (
          <div className="mt-8">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Processed Reports
            </h3>
            {processedReports.length > 0 ? (
              <ul
                role="list"
                className="mt-6 divide-y divide-gray-100 border-t border-gray-200"
              >
                {processedReports.map((report) => (
                  <li
                    key={report.id}
                    className="flex items-center justify-between gap-x-6 py-5"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold leading-6 text-gray-900">
                        {report.fileName}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Uploaded on{" "}
                        {new Date(
                          report.uploadedAt.seconds * 1000
                        ).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-x-4">
                      <a
                        href={report.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md bg-blue-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
                      >
                        Download
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-6 text-center text-gray-500">
                No processed reports available
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
