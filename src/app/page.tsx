"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function WelcomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-blue-200">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">
          Welcome to Barangay Tisa Noise Monitoring System
        </h1>
        <p className="text-xl text-gray-700 max-w-2xl mx-auto">
          Real-time noise monitoring and management for a peaceful community
        </p>
      </div>

      {user ? (
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <div className="space-y-6">
            <Link 
              href="/dashboard"
              className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-center rounded-md transition duration-200"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <div className="space-y-6">
            <Link
              href="/login"
              className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-center rounded-md transition duration-200"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="block w-full py-3 px-4 bg-white hover:bg-gray-100 text-blue-600 border border-blue-600 font-medium text-center rounded-md transition duration-200"
            >
              Register
            </Link>
          </div>
        </div>
      )}

      <div className="mt-8 text-gray-600">
        <img
          src="/logo.png"
          alt="Barangay Tisa Logo"
          className="w-24 h-24 mx-auto mb-4"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.style.display = "none";
          }}
        />
        <p>© 2025 Barangay Tisa Noise Monitoring System</p>
      </div>
    </div>
  );
}
