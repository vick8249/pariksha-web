export default function GlobalLoading() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center space-y-4 bg-gray-50 dark:bg-gray-950">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="w-16 h-16 border-4 border-indigo-200 dark:border-indigo-900/50 rounded-full animate-pulse absolute"></div>
        {/* Inner spinning ring */}
        <div className="w-16 h-16 border-4 border-transparent border-t-indigo-600 dark:border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
      <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">Loading Pariksha...</p>
    </div>
  )
}
