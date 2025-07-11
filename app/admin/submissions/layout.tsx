import type React from "react"
import type { Metadata } from "next"
import AdminLayoutClient from "../AdminLayoutClient"

export const metadata: Metadata = {
  title: "Admin Submissions - Man Behind The Music",
  description: "Detailed view of music submissions",
}

export default function SubmissionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayoutClient children={children} />
}