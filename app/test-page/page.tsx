export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Test Page Works!</h1>
        <p className="text-gray-600">If you can see this, Next.js routing is working.</p>
        <a href="/debug-supabase" className="text-blue-600 hover:underline">
          Try Debug Page
        </a>
      </div>
    </div>
  )
}
