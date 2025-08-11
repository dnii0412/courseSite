'use client';

import { useEffect, useState } from 'react';
import { IMedia, ILayout } from '@/lib/models/layout';

interface MediaGridProps {
  slug: string;
}

interface GridItemProps {
  item: any;
  media: IMedia;
  isMobile: boolean;
  isTablet: boolean;
}

// Client-side utility function for Cloudinary URLs
const getOptimizedUrl = (publicId: string, width: number, height: number, format: 'image' | 'video' = 'image') => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo';

  if (format === 'video') {
    return `https://res.cloudinary.com/${cloudName}/video/upload/f_auto,q_auto,w_${width},h_${height},c_fill/${publicId}`;
  }

  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_${width},h_${height},c_fill/${publicId}`;
};

const GridItem = ({ item, media, isMobile, isTablet }: GridItemProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Determine grid placement based on breakpoint
  const getGridPlacement = () => {
    if (isMobile && item.breakpoints?.sm) {
      return item.breakpoints.sm;
    }
    if (isTablet && item.breakpoints?.md) {
      return item.breakpoints.md;
    }
    return item;
  };

  const placement = getGridPlacement();

  const gridColumn = `${placement.startCol} / span ${placement.colSpan}`;
  const gridRow = `${placement.startRow} / span ${placement.rowSpan}`;

  const handleClick = () => {
    if (item.linkHref) {
      window.open(item.linkHref, '_blank');
    }
  };

  if (media.type === 'video') {
    return (
      <div
        className={`relative overflow-hidden rounded-lg cursor-pointer transition-transform hover:scale-105 ${item.linkHref ? 'hover:shadow-lg' : ''
          }`}
        style={{
          gridColumn,
          gridRow,
        }}
        onClick={handleClick}
        role={item.linkHref ? 'button' : undefined}
        tabIndex={item.linkHref ? 0 : undefined}
        aria-label={item.ariaLabel || media.alt}
      >
        <video
          className="w-full h-full object-cover"
          muted
          autoPlay
          loop
          playsInline
          poster={media.posterUrl}
          onLoadStart={() => setIsLoaded(true)}
          onError={() => setError(true)}
        >
          <source src={media.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {item.linkHref && (
          <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-white/90 rounded-full p-2">
              <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-lg cursor-pointer transition-transform hover:scale-105 ${item.linkHref ? 'hover:shadow-lg' : ''
        }`}
      style={{
        gridColumn,
        gridRow,
      }}
      onClick={handleClick}
      role={item.linkHref ? 'button' : undefined}
      tabIndex={item.linkHref ? 0 : undefined}
      aria-label={item.ariaLabel || media.alt}
    >
      <img
        src={getOptimizedUrl(
          media.cloudinaryPublicId,
          placement.colSpan * 200, // Approximate cell width
          placement.rowSpan * 150   // Approximate cell height
        )}
        alt={media.alt}
        className="w-full h-full object-cover"
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
      />

      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-500 text-sm">Failed to load image</div>
        </div>
      )}

      {item.linkHref && (
        <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="bg-white/90 rounded-full p-2">
            <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export const MediaGrid = ({ slug }: MediaGridProps) => {
  const [layout, setLayout] = useState<ILayout | null>(null);
  const [media, setMedia] = useState<IMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const fetchLayout = async () => {
      try {
        setLoading(true);

        // Fetch layout
        const layoutResponse = await fetch(`/api/layouts?slug=${slug}`);
        if (!layoutResponse.ok) {
          throw new Error('Layout not found');
        }

        const layoutData = await layoutResponse.json();
        const layout = layoutData.data;

        if (!layout.published) {
          throw new Error('Layout not published');
        }

        setLayout(layout);

        // Fetch all media referenced in the layout
        const mediaIds = layout.items.map((item: any) => item.mediaId);
        if (mediaIds.length > 0) {
          const mediaResponse = await fetch('/api/media');
          if (mediaResponse.ok) {
            const mediaData = await mediaResponse.json();
            const allMedia = mediaData.data;
            const filteredMedia = allMedia.filter((m: IMedia) =>
              mediaIds.includes(m._id)
            );
            setMedia(filteredMedia);
          }
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load layout');
      } finally {
        setLoading(false);
      }
    };

    fetchLayout();
  }, [slug]);

  if (loading) {
    return (
      <div className="w-full h-[90vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-[#1B3C53] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[90vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-[#1B3C53] mb-2">Layout Not Found</div>
          <div className="text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  if (!layout || !media.length) {
    return (
      <div className="w-full h-[90vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-[#1B3C53] mb-2">No Content</div>
          <div className="text-gray-600">This layout has no published content.</div>
        </div>
      </div>
    );
  }

  // Create media lookup map
  const mediaMap = new Map(media.map(m => [m._id, m]));

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div
        className="grid gap-3 h-[90vh]"
        style={{
          gridTemplateColumns: 'repeat(6, 1fr)',
          gridTemplateRows: 'repeat(4, 1fr)',
        }}
      >
        {layout.items.map((item) => {
          const mediaItem = mediaMap.get(item.mediaId);
          if (!mediaItem) return null;

          return (
            <GridItem
              key={item.id}
              item={item}
              media={mediaItem}
              isMobile={isMobile}
              isTablet={isTablet}
            />
          );
        })}
      </div>
    </div>
  );
};
