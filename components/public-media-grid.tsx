"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Image as ImageIcon, Eye, Calendar } from "lucide-react"

interface MediaItem {
  id: string
  name: string
  description?: string
  type: string
  size: number
  originalName?: string
  uploadedBy?: string
  status: string
  createdAt?: string
  updatedAt?: string
  cloudinarySecureUrl?: string // Added for Cloudinary URL
}

interface GridCell {
  x: number
  y: number
  mediaId?: string
  media?: MediaItem
  spanX?: number
  spanY?: number
}

interface GridLayout {
  id: string
  name: string
  width: number
  height: number
  cells: GridCell[]
  isPublished: boolean
  isLive: boolean
  lastSaved: string
}

export default function PublicMediaGrid() {
  const [gridLayout, setGridLayout] = useState<GridLayout | null>(null)
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    fetchGridLayout()
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const fetchGridLayout = async () => {
    try {
      const response = await fetch("/api/media-grid")
      if (response.ok) {
        const data = await response.json()
        if (data.layout && data.layout.isPublished) {
          setGridLayout(data.layout)
        }
      }
    } catch (error) {
      console.error("Error fetching grid layout:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading media grid...</p>
          </div>
        </div>
      </section>
    )
  }

  if (!gridLayout || !gridLayout.isPublished) {
    return null
  }

  // Filter cells that have media
  const mediaCells = gridLayout.cells.filter(cell => cell.mediaId && cell.media)

  if (mediaCells.length === 0) {
    return null
  }

  // Responsive grid settings
  const displayWidth = isMobile ? 3 : gridLayout.width
  const displayHeight = isMobile ? 4 : gridLayout.height
  const displayCells = isMobile ? gridLayout.cells.slice(0, 12) : gridLayout.cells

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        

        {/* Grid Display */}
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-2 sm:gap-3 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20" style={{
            gridTemplateColumns: `repeat(${displayWidth}, 1fr)`,
            gridTemplateRows: `repeat(${displayHeight}, 1fr)`
          }}>
            {displayCells.map((cell) => (
              <div
                key={`${cell.x}-${cell.y}`}
                className={`aspect-square rounded-lg sm:rounded-xl overflow-hidden transition-all duration-300 ${
                  cell.mediaId 
                    ? 'bg-white shadow-md sm:rounded-xl border border-gray-100 hover:shadow-xl hover:scale-[1.02]' 
                    : 'bg-transparent'
                }`}
                style={{
                  gridColumn: `${cell.x + 1} / span ${cell.spanX || 1}`,
                  gridRow: `${cell.y + 1} / span ${cell.spanY || 1}`
                }}
              >
                {cell.mediaId && cell.media ? (
                  <div className="w-full h-full relative group cursor-pointer">
                    {/* Media Content */}
                    <div className="w-full h-full relative">
                      {cell.media.cloudinarySecureUrl ? (
                        <img 
                          src={cell.media.cloudinarySecureUrl} 
                          alt={cell.media.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center p-2 sm:p-4">
                          <div className="text-center">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#5B7FFF] to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-lg">
                              <ImageIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-xs sm:text-sm leading-tight">
                              {cell.media.name}
                            </h3>
                            {cell.media.description && (
                              <p className="text-xs text-gray-600 mb-2 sm:mb-3 leading-relaxed hidden sm:block">
                                {cell.media.description}
                              </p>
                            )}
                            <div className="flex items-center justify-center gap-1 sm:gap-2 text-xs text-gray-500">
                              <Badge variant="outline" className="text-xs bg-white/80">
                                {cell.media.type.split('/')[1].toUpperCase()}
                              </Badge>
                              <span className="text-gray-400 hidden sm:inline">•</span>
                              <span className="hidden sm:inline">{formatFileSize(cell.media.size)}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Size Indicator */}
                    {(cell.spanX && cell.spanX > 1) || (cell.spanY && cell.spanY > 1) ? (
                      <div className="absolute top-2 right-2 bg-blue-500/90 text-white text-xs px-2 py-1 rounded-full">
                        {cell.spanX || 1}×{cell.spanY || 1}
                      </div>
                    ) : null}
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center">
                      <div className="text-center text-white p-2 sm:p-4">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 inline-block mb-2">
                          <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                        </div>
                        <p className="text-xs sm:text-sm font-medium">Харах</p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        {/* Grid Info & CTA */}
        
      </div>
    </section>
  )
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('mn-MN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
