export default function Loading() {
  return (
    <div className="w-full flex flex-col items-center animate-pulse">
      
      {/* Hero Section Skeleton */}
      <div className="w-full h-[70vh] bg-[#0f0f0f] border-b border-[#333]"></div>

      {/* Product Grid Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="flex justify-center mb-16">
          <div className="h-10 w-64 bg-[#222] rounded"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-[#333] h-[400px] flex flex-col">
              {/* Image Placeholder */}
              <div className="h-[250px] bg-[#222] w-full"></div>
              {/* Text Placeholder */}
              <div className="p-6 flex-grow flex flex-col justify-end">
                <div className="h-6 w-3/4 bg-[#333] rounded mb-4"></div>
                <div className="h-6 w-1/4 bg-primary/20 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}