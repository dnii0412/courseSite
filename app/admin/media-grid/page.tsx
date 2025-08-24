"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Upload, Image as ImageIcon, Trash2, Save, Grid3X3, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface MediaItem {
  id: string
  name: string
  type: string
  size: number
  dimensions: string
  uploadedAt: string
  url: string
  thumbnailUrl?: string
}

interface GridCell {
  x: number
  y: number
  mediaId?: string
  media?: MediaItem
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

export default function AdminMediaGrid() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [gridLayout, setGridLayout] = useState<GridLayout>({
    id: "default",
    name: "Main Grid",
    width: 6,
    height: 4,
    cells: [],
    isPublished: true,
    isLive: false,
    lastSaved: new Date().toISOString()
  })
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (!response.ok || response.status === 401) {
        router.push("/admin/login")
        return
      }
      
      const data = await response.json()
      if (data.user.role !== "admin") {
        router.push("/admin/login")
        return
      }
      
      fetchMediaItems()
      fetchGridLayout()
    } catch (error) {

      router.push("/admin/login")
    }
  }

  const fetchMediaItems = async () => {
    try {
      const response = await fetch("/api/admin/media")
      if (response.ok) {
        const data = await response.json()
        setMediaItems(data.mediaItems)
      } else {
        // Use mock data for now
        setMediaItems([
          {
            id: "1",
            name: "Screenshot 2025-08-15 at 00.35.46",
            type: "image",
            size: 1024000,
            dimensions: "1920 x 1080",
            uploadedAt: "2025-08-15T00:35:46Z",
            url: "/api/media/1",
            thumbnailUrl: "/api/media/1/thumbnail"
          },
          {
            id: "2",
            name: "Screenshot 2025-08-15 at 00.36.12",
            type: "image",
            size: 2048000,
            dimensions: "2560 x 1440",
            uploadedAt: "2025-08-15T00:36:12Z",
            url: "/api/media/2",
            thumbnailUrl: "/api/media/2/thumbnail"
          },
          {
            id: "3",
            name: "Screenshot 2025-08-15 at 00.37.01",
            type: "image",
            size: 1536000,
            dimensions: "1920 x 1080",
            uploadedAt: "2025-08-15T00:37:01Z",
            url: "/api/media/3",
            thumbnailUrl: "/api/media/3/thumbnail"
          }
        ])
      }
    } catch (error) {

    } finally {
      setLoading(false)
    }
  }

  const fetchGridLayout = async () => {
    try {
      const response = await fetch("/api/admin/media-grid/layout")
      if (response.ok) {
        const data = await response.json()
        setGridLayout(data.layout)
      } else {
        // Initialize empty grid
        const cells: GridCell[] = []
        for (let y = 0; y < gridLayout.height; y++) {
          for (let x = 0; x < gridLayout.width; x++) {
            cells.push({ x, y })
          }
        }
        setGridLayout(prev => ({ ...prev, cells }))
      }
    } catch (error) {

    }
  }

  const handleUpload = () => {
    // File upload functionality would go here
    toast({
      title: "Upload",
      description: "File upload functionality coming soon"
    })
  }

  const handleMediaClick = (mediaItem: MediaItem) => {
    setSelectedMedia(mediaItem)
  }

  const handleCellClick = (cell: GridCell) => {
    if (selectedMedia) {
      const updatedCells = gridLayout.cells.map(c => 
        c.x === cell.x && c.y === cell.y 
          ? { ...c, mediaId: selectedMedia.id, media: selectedMedia }
          : c
      )
      setGridLayout(prev => ({ ...prev, cells: updatedCells }))
      setSelectedMedia(null)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/admin/media-grid/layout", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...gridLayout,
          lastSaved: new Date().toISOString()
        })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Grid layout saved successfully"
        })
        setGridLayout(prev => ({ ...prev, lastSaved: new Date().toISOString() }))
      } else {
        toast({
          title: "Error",
          description: "Failed to save grid layout",
          variant: "destructive"
        })
      }
    } catch (error) {

      toast({
        title: "Error",
        description: "Failed to save grid layout",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteMedia = async (mediaId: string) => {
    if (!confirm("Are you sure you want to delete this media item?")) return

    try {
      const response = await fetch(`/api/admin/media/${mediaId}`, {
        method: "DELETE"
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Media item deleted successfully"
        })
        setMediaItems(prev => prev.filter(item => item.id !== mediaId))
        
        // Remove from grid cells
        const updatedCells = gridLayout.cells.map(cell => 
          cell.mediaId === mediaId ? { ...cell, mediaId: undefined, media: undefined } : cell
        )
        setGridLayout(prev => ({ ...prev, cells: updatedCells }))
      } else {
        toast({
          title: "Error",
          description: "Failed to delete media item",
          variant: "destructive"
        })
      }
    } catch (error) {

      toast({
        title: "Error",
        description: "Failed to delete media item",
        variant: "destructive"
      })
    }
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
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Media Grid Management</h1>
        <p className="text-gray-600">Upload media and create responsive grid layouts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Media Items */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Media Items</CardTitle>
                <Button onClick={handleUpload} size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
              <p className="text-sm text-gray-500">{mediaItems.length} items</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mediaItems.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedMedia?.id === item.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleMediaClick(item)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.name}</h4>
                        <p className="text-xs text-gray-500">{item.dimensions} • {item.type}</p>
                        <p className="text-xs text-gray-500">{formatDate(item.uploadedAt)}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs">{item.type}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteMedia(item.id)
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Grid Canvas */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Grid Canvas ({gridLayout.width}x{gridLayout.height})</CardTitle>
                <Button onClick={handleSave} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-1" style={{
                gridTemplateColumns: `repeat(${gridLayout.width}, 1fr)`,
                gridTemplateRows: `repeat(${gridLayout.height}, 1fr)`
              }}>
                {gridLayout.cells.map((cell, index) => (
                  <div
                    key={`${cell.x}-${cell.y}`}
                    className={`aspect-square border border-gray-200 rounded flex items-center justify-center cursor-pointer transition-colors ${
                      cell.mediaId 
                        ? 'bg-blue-100 border-blue-300' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => handleCellClick(cell)}
                  >
                    {cell.mediaId ? (
                      <div className="text-center">
                        <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center mx-auto mb-1">
                          <ImageIcon className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-xs text-gray-600">{cell.x},{cell.y}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">{cell.x},{cell.y}</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Layout Controls */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Layout Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="published">Published</Label>
                    <p className="text-sm text-gray-500">Make grid visible to users</p>
                  </div>
                  <Switch
                    id="published"
                    checked={gridLayout.isPublished}
                    onCheckedChange={(checked) => setGridLayout(prev => ({ ...prev, isPublished: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="live">Live</Label>
                    <p className="text-sm text-gray-500">Enable live updates</p>
                  </div>
                  <Switch
                    id="live"
                    checked={gridLayout.isLive}
                    onCheckedChange={(checked) => setGridLayout(prev => ({ ...prev, isLive: checked }))}
                  />
                </div>
                <div className="text-sm text-gray-500">
                  {mediaItems.length} items • Last saved: {formatDate(gridLayout.lastSaved)}
                </div>
                <p className="text-xs text-gray-400">
                  Tip: Click a media item to add it to the grid; then drag/resize.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
