export default function LoadingSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="p-4 flex items-center gap-4">
          <div className="w-9 h-9 rounded-full animate-shimmer shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 rounded animate-shimmer" />
            <div className="h-2.5 w-1/2 rounded animate-shimmer" />
          </div>
          <div className="h-6 w-16 rounded-full animate-shimmer hidden sm:block" />
        </div>
      ))}
    </div>
  )
}