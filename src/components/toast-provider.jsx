"use client"

import { ToastProvider } from "./ui/toast"

export function Toaster({ children }) {
  return <ToastProvider>{children}</ToastProvider>
}
