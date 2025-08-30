"use client"

import { useState, useEffect } from "react"
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

interface PublicMediaGridProps {
  gridLayout: GridLayout | null
  loading?: boolean
}

export default function PublicMediaGrid({ gridLayout, loading = false }: PublicMediaGridProps) {
  // Fixed grid - no need for screen size detection
  const screenSize = 'desktop'

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-muted/30 to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading media grid...</p>
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

  // Fixed grid settings - 4x6 grid (24 cells total)
  const totalCells = 24
  
  // Create fixed grid structure
  const fixedGridCells = Array.from({ length: totalCells }, (_, index) => {
    const x = index % 4
    const y = Math.floor(index / 4)
    
    // Find if there's media for this position
    const existingCell = gridLayout.cells.find(cell => 
      cell.x === x && cell.y === y
    )
    
    return {
      x,
      y,
      mediaId: existingCell?.mediaId,
      media: existingCell?.media,
      spanX: existingCell?.spanX || 1,
      spanY: existingCell?.spanY || 1
    }
  })

  return (
    <section className="py-20 bg-gradient-to-br from-muted/30 to-muted/20 min-h-[500px]">
      <div className="container mx-auto px-4">
        

        {/* Grid Display */}
        <div className="w-full flex justify-center">
          <div className="grid gap-1 sm:gap-2 md:gap-3 lg:gap-4 bg-card/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 shadow-lg border border-border/20" style={{
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gridTemplateRows: 'repeat(6, minmax(0, 1fr))',
            maxWidth: '800px',
            height: 'auto',
            minHeight: '400px'
          }}>
            {fixedGridCells.map((cell) => (
              <div
                key={`${cell.x}-${cell.y}`}
                className={`aspect-square rounded-md sm:rounded-lg md:rounded-xl overflow-hidden transition-all duration-300 ${
                  cell.mediaId 
                    ? 'bg-card shadow-sm sm:shadow-md border border-border hover:shadow-lg sm:hover:shadow-xl hover:scale-[1.01] sm:hover:scale-[1.02]' 
                    : 'bg-transparent'
                }`}
                style={{
                  gridColumn: `${cell.x + 1} / span ${cell.spanX || 1}`,
                  gridRow: `${cell.y + 1} / span ${cell.spanY || 1}`,
                  minHeight: '80px',
                  height: 'auto'
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
                        <div className="w-full h-full bg-gradient-to-br from-muted/50 via-muted/30 to-muted/50 flex items-center justify-center p-1 sm:p-2 md:p-4">
                          <div className="text-center">
                            <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-to-br from-[#5B7FFF] to-purple-600 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2 md:mb-3 shadow-lg">
                              <ImageIcon className="h-4 w-4 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white" />
                            </div>
                            <h3 className="font-semibold text-card-foreground mb-1 sm:mb-2 text-xs sm:text-sm leading-tight">
                              {cell.media.name}
                            </h3>
                            {cell.media.description && (
                              <p className="text-xs text-muted-foreground mb-1 sm:mb-2 md:mb-3 leading-relaxed hidden sm:block">
                                {cell.media.description}
                              </p>
                            )}
                            <div className="flex items-center justify-center gap-1 sm:gap-2 text-xs text-muted-foreground">
                              <Badge variant="outline" className="text-xs bg-background/80">
                                {cell.media.type.split('/')[1].toUpperCase()}
                              </Badge>
                              <span className="text-muted-foreground/60 hidden sm:inline">•</span>
                              <span className="hidden sm:inline">{formatFileSize(cell.media.size)}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Size Indicator */}
                    {(cell.spanX && cell.spanX > 1) || (cell.spanY && cell.spanY > 1) ? (
                      <div className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-blue-500/90 text-white text-xs px-1 py-0.5 sm:px-2 sm:py-1 rounded-full">
                        {cell.spanX || 1}×{cell.spanY || 1}
                      </div>
                    ) : null}
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center">
                      <div className="text-center text-white p-1 sm:p-2 md:p-4">
                        <div className="bg-card/20 backdrop-blur-sm rounded-full p-1 sm:p-2 inline-block mb-1 sm:mb-2">
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white" />
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
