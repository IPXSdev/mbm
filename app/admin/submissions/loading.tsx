export default function SubmissionsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Loading submissions...</p>
      </div>
    </div>
  )
}
