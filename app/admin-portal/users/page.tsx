"use client"
import GrantAdminForm from "./grant-admin"
import UsersPage from "../../admin/users/page"

export default function AdminUsersPage() {
  return (
    <div className="space-y-8">
      <GrantAdminForm />
      <UsersPage />
    </div>
  )
}
