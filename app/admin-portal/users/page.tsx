import dynamic from "next/dynamic"
import GrantAdminForm from "./grant-admin"

const UsersPage = dynamic(() => import("../../admin/users/page"), { ssr: false })

export default function AdminUsersPage() {
  return (
    <div className="space-y-8">
      <GrantAdminForm />
      <UsersPage />
    </div>
  )
}
