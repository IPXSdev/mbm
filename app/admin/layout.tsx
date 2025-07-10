import type React from "react"
import type { Metadata } from "next"
import AdminLayoutClient from "./AdminLayoutClient"

export const metadata: Metadata = {
  title: "Admin Dashboard - Man Behind The Music",
  description: "Admin portal for managing music submissions",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
