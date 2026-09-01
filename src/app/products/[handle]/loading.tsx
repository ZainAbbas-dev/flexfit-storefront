export default function ProductLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Left Side: Product Image Skeleton */}
        <div className="aspect-square bg-[#1a1a1a] rounded-xl border border-[#333]"></div>

        {/* Right Side: Product Details Skeleton */}
        <div className="flex flex-col justify-center">
          {/* Title */}
          <div className="h-12 w-3/4 bg-[#222] rounded mb-4"></div>
          {/* Price */}
          <div className="h-8 w-1/4 bg-primary/20 rounded mb-8"></div>
          
          {/* Description Lines */}
          <div className="space-y-4 mb-8">
            <div className="h-4 w-full bg-[#222] rounded"></div>
            <div className="h-4 w-5/6 bg-[#222] rounded"></div>
            <div className="h-4 w-4/6 bg-[#222] rounded"></div>
            <div className="h-4 w-full bg-[#222] rounded"></div>
          </div>

          {/* Button Skeleton */}
          <div className="h-14 w-full bg-[#222] rounded"></div>
        </div>
        
      </div>
    </div>
  );
}