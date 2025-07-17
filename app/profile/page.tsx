import { getUser } from "@/lib/auth"

export default async function ProfilePage() {
  const user = await getUser()

  if (!user) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Not logged in</h1>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  )
}
