"use client"
import Navbar from "./navbar"
import Sidebar from "./sidebar"
import { useAuth } from "../contexts/AuthContext"
import { Navigate } from "react-router-dom"

export default function DashboardLayout({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
