import { Card, CardContent, CardFooter } from '@/components/ui/card'

export function SkeletonCard() {
  return (
    <Card className="overflow-hidden border-0 bg-white">
      {/* Image Skeleton */}
      <div className="relative overflow-hidden">
        <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse">
          {/* Category Badge Skeleton */}
          <div className="absolute top-3 left-3">
            <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
          
          {/* Level Badge Skeleton */}
          <div className="absolute top-3 right-3">
            <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
          
          {/* Price Skeleton */}
          <div className="absolute bottom-3 right-3">
            <div className="w-24 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      <CardContent className="p-5">
        {/* Title Skeleton */}
        <div className="space-y-2 mb-2">
          <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        </div>
        
        {/* Description Skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
        </div>
        
        {/* Stats Skeleton */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <div className="flex gap-2 w-full">
          {/* Button Skeleton */}
          <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          
          {/* Arrow Button Skeleton */}
          <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </CardFooter>
    </Card>
  )
}
