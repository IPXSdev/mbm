export default function TestSimplePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Test Page Working!</h1>
          <p className="text-gray-600">Next.js routing is functioning correctly.</p>
          <div className="bg-gray-50 p-4 rounded-lg text-sm">
            <p>
              <strong>Current time:</strong> {new Date().toLocaleString()}
            </p>
            <p>
              <strong>Route:</strong> /test-simple
            </p>
            <p>
              <strong>Status:</strong> <span className="text-green-600 font-semibold">✅ Working</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
