export default function SkeletonLoader({ type = 'card' }) {
  if (type === 'card') {
    return (
      <div className="animate-pulse bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="mt-4 h-8 bg-gray-200 rounded"></div>
      </div>
    );
  }
  if (type === 'table') {
    return (
      <div className="animate-pulse space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }
  return <div className="animate-pulse h-20 bg-gray-200 rounded"></div>;
}