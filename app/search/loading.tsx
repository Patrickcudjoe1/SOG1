export default function Loading() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center py-20">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
        <p className="text-sm font-light text-gray-600" style={{ fontFamily: 'var(--font-brand)' }}>
          Loading...
        </p>
      </div>
    </div>
  )
}
