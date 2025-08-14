// utils/skeletonUtils.js

/**
 * Common skeleton animation classes
 */
export const skeletonClasses = {
  base: "animate-pulse bg-gray-300 rounded",
  shimmer:
    "animate-pulse bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-[length:200%_100%] animate-shimmer",
  wave: "animate-pulse bg-gray-300 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:animate-wave",
};

/**
 * Skeleton component sizes
 */
export const skeletonSizes = {
  text: {
    xs: "h-3",
    sm: "h-4",
    md: "h-5",
    lg: "h-6",
    xl: "h-8",
    "2xl": "h-10",
  },
  button: {
    sm: "h-8",
    md: "h-10",
    lg: "h-12",
  },
  avatar: {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  },
  image: {
    sm: "h-32",
    md: "h-48",
    lg: "h-64",
    xl: "h-80",
  },
};

/**
 * Reusable skeleton components
 */
export const SkeletonText = ({
  width = "w-full",
  height = "h-4",
  className = "",
  animate = true,
}) => (
  <div
    className={`${
      animate ? "animate-pulse" : ""
    } bg-gray-300 rounded ${width} ${height} ${className}`}
  />
);

export const SkeletonAvatar = ({
  size = "md",
  className = "",
  animate = true,
}) => (
  <div
    className={`${animate ? "animate-pulse" : ""} bg-gray-300 rounded-full ${
      skeletonSizes.avatar[size]
    } ${className}`}
  />
);

export const SkeletonButton = ({
  size = "md",
  width = "w-24",
  className = "",
  animate = true,
}) => (
  <div
    className={`${
      animate ? "animate-pulse" : ""
    } bg-gray-300 rounded-lg ${width} ${
      skeletonSizes.button[size]
    } ${className}`}
  />
);

export const SkeletonImage = ({
  size = "md",
  width = "w-full",
  className = "",
  animate = true,
}) => (
  <div
    className={`${
      animate ? "animate-pulse" : ""
    } bg-gray-300 rounded ${width} ${skeletonSizes.image[size]} ${className}`}
  />
);

export const SkeletonCard = ({
  hasImage = true,
  hasAvatar = false,
  lines = 3,
  className = "",
  animate = true,
}) => (
  <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
    {hasImage && <SkeletonImage size="md" animate={animate} />}
    <div className="p-6">
      {hasAvatar && (
        <div className="flex items-center mb-4">
          <SkeletonAvatar size="md" animate={animate} />
          <div className="ml-3 flex-1">
            <SkeletonText width="w-32" height="h-4" animate={animate} />
            <SkeletonText
              width="w-24"
              height="h-3"
              className="mt-1"
              animate={animate}
            />
          </div>
        </div>
      )}
      <div className="space-y-2">
        {[...Array(lines)].map((_, i) => (
          <SkeletonText
            key={i}
            width={i === lines - 1 ? "w-3/4" : "w-full"}
            height="h-4"
            animate={animate}
          />
        ))}
      </div>
      <div className="flex justify-between items-center mt-4">
        <SkeletonText width="w-20" height="h-6" animate={animate} />
        <SkeletonButton size="sm" width="w-24" animate={animate} />
      </div>
    </div>
  </div>
);

/**
 * Grid skeleton layout
 */
export const SkeletonGrid = ({
  cols = 4,
  rows = 1,
  gap = "gap-6",
  className = "",
  children,
}) => (
  <div className={`grid grid-cols-1 md:grid-cols-${cols} ${gap} ${className}`}>
    {children ||
      [...Array(cols * rows)].map((_, i) => <SkeletonCard key={i} />)}
  </div>
);

/**
 * Carousel skeleton layout
 */
export const SkeletonCarousel = ({
  items = 4,
  gap = "gap-6",
  className = "",
  showArrows = true,
  showDots = true,
  children,
}) => (
  <div className={`relative ${className}`}>
    {showArrows && (
      <>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-gray-300 rounded-full animate-pulse" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-gray-300 rounded-full animate-pulse" />
      </>
    )}

    <div className={`flex ${gap} overflow-hidden`}>
      {children ||
        [...Array(items)].map((_, i) => (
          <div key={i} className="flex-none w-80">
            <SkeletonCard />
          </div>
        ))}
    </div>

    {showDots && (
      <div className="flex justify-center mt-6 space-x-2">
        {[...Array(Math.ceil(items / 2))].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"
          />
        ))}
      </div>
    )}
  </div>
);

/**
 * Enhanced skeleton with shimmer effect
 */
export const ShimmerSkeleton = ({
  width = "w-full",
  height = "h-4",
  className = "",
}) => (
  <div
    className={`bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-[length:200%_100%] animate-shimmer rounded ${width} ${height} ${className}`}
  />
);

export default {
  SkeletonText,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonImage,
  SkeletonCard,
  SkeletonGrid,
  SkeletonCarousel,
  ShimmerSkeleton,
};
