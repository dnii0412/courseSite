"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Save, 
  X, 
  Settings
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface MediaItem {
  _id?: string
  id?: string
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
  const [uploadForm, setUploadForm] = useState({ name: '', description: '', file: null as File | null })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)
  const [editingCell, setEditingCell] = useState<GridCell | null>(null)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [gridSettings, setGridSettings] = useState({
    width: 6,
    height: 4
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/admin/check", {
        credentials: 'include'
      })
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
      console.error("Auth error:", error)
      router.push("/admin/login")
    }
  }

  const fetchMediaItems = async () => {
    try {
      const response = await fetch("/api/admin/media")
      if (response.ok) {
        const data = await response.json()
        setMediaItems(data.mediaItems || [])
      } else {
        console.error("Failed to fetch media items")
        setMediaItems([])
      }
    } catch (error) {
      console.error("Error fetching media items:", error)
      setMediaItems([])
    } finally {
      setLoading(false)
    }
  }

  const fetchGridLayout = async () => {
    try {
      const response = await fetch("/api/admin/media-grid/layout")
      if (response.ok) {
        const data = await response.json()
        if (data.layout) {
          setGridLayout(data.layout)
          setGridSettings({
            width: data.layout.width,
            height: data.layout.height
          })
        } else {
          initializeGrid()
        }
      } else {
        initializeGrid()
      }
    } catch (error) {
      console.error("Error fetching grid layout:", error)
      initializeGrid()
    }
  }

  const initializeGrid = () => {
    const cells: GridCell[] = []
    for (let y = 0; y < gridLayout.height; y++) {
      for (let x = 0; x < gridLayout.width; x++) {
        cells.push({ x, y })
      }
    }
    setGridLayout(prev => ({ ...prev, cells }))
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadForm(prev => ({ ...prev, file, name: file.name }))
    }
  }

  const handleUpload = async () => {
    if (!uploadForm.file) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive"
      })
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', uploadForm.file)
      formData.append('name', uploadForm.name)
      formData.append('description', uploadForm.description)

      const response = await fetch("/api/admin/media", {
        method: "POST",
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Success",
          description: "Media uploaded successfully"
        })
        
        // Add new media item to the list
        const newMediaItem = { ...data.mediaItem, id: data.mediaId }
        setMediaItems(prev => [newMediaItem, ...prev])
        
        // Reset form and close dialog
        setUploadForm({ name: '', description: '', file: null })
        setShowUploadDialog(false)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to upload media",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Error",
        description: "Failed to upload media",
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
  }

  const handleMediaClick = (mediaItem: MediaItem) => {
    setSelectedMedia(mediaItem)
  }

  const handleCellClick = (cell: GridCell) => {
    if (selectedMedia) {
      const updatedCells = gridLayout.cells.map(c => 
        c.x === cell.x && c.y === cell.y 
          ? { 
              ...c, 
              mediaId: selectedMedia._id, 
              media: selectedMedia,
              spanX: 1,  // Default to 1x1, can be edited later
              spanY: 1
            }
          : c
      )
      setGridLayout(prev => ({ ...prev, cells: updatedCells }))
      setSelectedMedia(null)
      toast({
        title: "Success",
        description: `Added ${selectedMedia.name} to grid position (${cell.x}, ${cell.y}). Click the image to edit size.`
      })
    }
  }

  const handleRemoveFromGrid = (cell: GridCell) => {
    const updatedCells = gridLayout.cells.map(c => 
      c.x === cell.x && c.y === cell.y 
        ? { ...c, mediaId: undefined, media: undefined }
        : c
    )
    setGridLayout(prev => ({ ...prev, cells: updatedCells }))
    toast({
      title: "Success",
      description: "Removed media from grid"
    })
  }

  const handleEditCell = (cell: GridCell) => {
    if (cell.mediaId && cell.media) {
      setEditingCell(cell)
      setShowEditDialog(true)
    } else {
      console.error('Cannot edit cell - missing mediaId or media:', cell)
      toast({
        title: "Error",
        description: "Cannot edit this cell - no media found",
        variant: "destructive"
      })
    }
  }

  const handleUpdateCell = (updatedCell: GridCell) => {
    const updatedCells = gridLayout.cells.map(c => 
      c.x === updatedCell.x && c.y === updatedCell.y 
        ? { ...c, ...updatedCell }
        : c
    )
    
    setGridLayout(prev => ({ ...prev, cells: updatedCells }))
    setShowEditDialog(false)
    setEditingCell(null)
    
    toast({
      title: "Success",
      description: `Cell updated: ${updatedCell.spanX || 1}×${updatedCell.spanY || 1} at position (${updatedCell.x}, ${updatedCell.y})`
    })
  }

  // Check if a cell is occupied by another image's span
  const isCellOccupied = (x: number, y: number) => {
    return gridLayout.cells.some(cell => 
      cell.mediaId && 
      x >= cell.x && 
      x < cell.x + (cell.spanX || 1) && 
      y >= cell.y && 
      y < cell.y + (cell.spanY || 1) &&
      !(x === cell.x && y === cell.y) // Don't mark the main cell as occupied
    )
  }

  // Test if a Cloudinary URL is accessible
  const testImageUrl = async (url: string) => {
    try {
      const response = await fetch(url, { method: 'HEAD' })
      return response.ok
    } catch (error) {
      console.error('Image URL test failed:', error)
      return false
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
      console.error("Save error:", error)
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
        setMediaItems(prev => prev.filter(item => item._id !== mediaId))
        
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
      console.error("Delete error:", error)
      toast({
        title: "Error",
        description: "Failed to delete media item",
        variant: "destructive"
      })
    }
  }

  const updateGridSize = () => {
    const cells: GridCell[] = []
    for (let y = 0; y < gridSettings.height; y++) {
      for (let x = 0; x < gridSettings.width; x++) {
        cells.push({ x, y })
      }
    }
    setGridLayout(prev => ({ 
      ...prev, 
      width: gridSettings.width, 
      height: gridSettings.height,
      cells 
    }))
    toast({
      title: "Success",
      description: "Grid size updated successfully"
    })
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

      {/* Grid Editor Section */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Media Items */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Media Items</CardTitle>
                  <Button onClick={() => setShowUploadDialog(true)} size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </div>
                <p className="text-sm text-gray-500">{mediaItems.length} items</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mediaItems.map((item, index) => (
                    <div
                      key={item._id || `media-${index}`}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedMedia?._id === item._id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedMedia(item)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                          {item.cloudinarySecureUrl ? (
                            <img 
                              src={item.cloudinarySecureUrl} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="h-6 w-6 text-gray-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{item.name}</h4>
                          <p className="text-xs text-gray-500">{item.type.split('/')[1]} • {formatFileSize(item.size)}</p>
                          <p className="text-xs text-gray-500">
                            {item.createdAt ? formatDate(item.createdAt) : 'Recently'}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs">{item.type.split('/')[1]}</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteMedia(item._id || '')
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {mediaItems.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <ImageIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>No media items yet</p>
                      <p className="text-sm">Upload your first image to get started</p>
                    </div>
                  )}
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
                  <div className="flex items-center gap-2">
                    <Button onClick={handleSave} disabled={saving}>
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <p>
                    💡 <strong>Tip:</strong> Hover over placed images to see edit controls. Click on images to edit their size and position.
                  </p>
                  <div className="text-right">
                    <p>Placed: {gridLayout.cells.filter(c => c.mediaId).length} images</p>
                    <p>Total Span: {gridLayout.cells.reduce((total, c) => total + ((c.spanX || 1) * (c.spanY || 1)), 0)} cells</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {selectedMedia && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">
                          Selected: {selectedMedia.name}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedMedia(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-blue-700 mt-1">
                      Click on a grid cell to place this media item
                    </p>
                  </div>
                )}
                
                <div className="grid gap-1" style={{
                  gridTemplateColumns: `repeat(${gridLayout.width}, minmax(100px, 1fr))`,
                  gridTemplateRows: `repeat(${gridLayout.height}, minmax(100px, 1fr))`
                }}>
                  {gridLayout.cells.map((cell, index) => {
                    
                    return (
                    <div
                      key={`cell-${cell.x}-${cell.y}-${index}`}
                      className={`min-w-[100px] min-h-[100px] border border-gray-200 rounded flex items-center justify-center cursor-pointer transition-colors overflow-hidden ${
                        cell.mediaId 
                          ? 'bg-blue-100 border-blue-300' 
                          : isCellOccupied(cell.x, cell.y)
                          ? 'bg-gray-200 border-gray-300 cursor-not-allowed'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => !isCellOccupied(cell.x, cell.y) && handleCellClick(cell)}
                    >
                      {cell.mediaId && cell.media ? (
                        <div className="w-full h-full relative group bg-yellow-100">
                          <img 
                            src={cell.media.cloudinarySecureUrl || ''} 
                            alt={cell.media.name}
                            className="w-full h-full object-cover object-center"
                            style={{
                              minWidth: '100%',
                              minHeight: '100%',
                              maxWidth: '100%',
                              maxHeight: '100%',
                              display: 'block'
                            }}
                            onLoad={(event) => {
                              
                            }}
                            onError={(e) => {
                              console.error('Image failed to load:', {
                                mediaId: cell.mediaId,
                                cloudinaryUrl: cell.media?.cloudinarySecureUrl,
                                media: cell.media,
                                target: e.currentTarget
                              })
                              // Instead of hiding, show a fallback
                              e.currentTarget.style.display = 'none'
                              // Show fallback content
                              const fallback = e.currentTarget.nextElementSibling as HTMLElement
                              if (fallback) {
                                fallback.style.display = 'flex'
                              }
                            }}
                            onAbort={() => {
                              
                            }}
                          />
                          
                          {/* Fallback content when image fails to load */}
                          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-2" style={{ display: 'none' }}>
                            <div className="text-center">
                              <ImageIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                              <div className="text-xs text-blue-900 font-medium">{cell.media?.name}</div>
                              <div className="text-xs text-blue-700">Image failed to load</div>
                              <div className="text-xs text-blue-500 mt-1">URL: {cell.media?.cloudinarySecureUrl?.substring(0, 30)}...</div>
                            </div>
                          </div>
                          
                          {/* Debug: Show if image is loaded */}
                          <div className="absolute bottom-1 left-1 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded">
                            {cell.media?.cloudinarySecureUrl ? '✓' : '✗'}
                          </div>
                          
                          <div className="absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded">
                            {cell.x},{cell.y}
                          </div>
                          
                          {/* Cell Properties Indicator */}
                          {(cell.spanX && cell.spanX > 1) || (cell.spanY && cell.spanY > 1) ? (
                            <div className="absolute top-1 left-12 bg-blue-500/90 text-white text-xs px-1 py-0.5 rounded">
                              {cell.spanX || 1}×{cell.spanY || 1}
                            </div>
                          ) : null}
                          
                          {/* Edit and Remove Controls */}
                          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 bg-white/90 hover:bg-white text-gray-700"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEditCell(cell)
                                }}
                                title="Edit cell properties"
                              >
                                <Settings className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 bg-red-500/90 hover:bg-red-500 text-white"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleRemoveFromGrid(cell)
                                }}
                                title="Remove from grid"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          {/* Click to Edit Overlay */}
                          <div 
                            className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditCell(cell)
                            }}
                          >
                            <div className="opacity-0 hover:opacity-100 transition-opacity text-white text-center">
                              <Settings className="h-4 w-4 mx-auto mb-1" />
                              <span className="text-xs">Click to Edit</span>
                            </div>
                          </div>
                        </div>
                      ) : cell.mediaId ? (
                        // Fallback: show mediaId even if media object is missing
                        <div className="w-full h-full relative group bg-blue-100 border-blue-300 flex items-center justify-center">
                          <div className="text-center">
                            <ImageIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                            <div className="text-xs text-blue-900 font-medium">Media ID: {cell.mediaId}</div>
                            <div className="text-xs text-blue-700">Click to edit</div>
                          </div>
                          <div className="absolute top-1 right-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 bg-white/90 hover:bg-white text-gray-700"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditCell(cell)
                              }}
                              title="Edit cell properties"
                            >
                              <Settings className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ) : isCellOccupied(cell.x, cell.y) ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-xs text-gray-500 text-center">
                            <div className="w-4 h-4 bg-blue-200 rounded-full mx-auto mb-1"></div>
                            <span>Part of image</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400">
                          {cell.x},{cell.y}
                        </div>
                      )}
                    </div>
                  )})}
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="gridWidth">Grid Width</Label>
                      <Input
                        id="gridWidth"
                        type="number"
                        min="1"
                        max="12"
                        value={gridSettings.width}
                        onChange={(e) => setGridSettings(prev => ({ ...prev, width: parseInt(e.target.value) || 1 }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="gridHeight">Grid Height</Label>
                      <Input
                        id="gridHeight"
                        type="number"
                        min="1"
                        max="8"
                        value={gridSettings.height}
                        onChange={(e) => setGridSettings(prev => ({ ...prev, height: parseInt(e.target.value) || 1 }))}
                      />
                    </div>
                  </div>
                  
                  <Button onClick={updateGridSize} variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Update Grid Size
                  </Button>
                  
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
                    Tip: Click a media item to select it, then click a grid cell to place it.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Media</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="uploadFile">File</Label>
              <Input
                id="uploadFile"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                ref={fileInputRef}
              />
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: JPEG, PNG, GIF, WebP (max 10MB)
              </p>
            </div>
            <div>
              <Label htmlFor="uploadName">Name</Label>
              <Input
                id="uploadName"
                value={uploadForm.name}
                onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter media name"
              />
            </div>
            <div>
              <Label htmlFor="uploadDescription">Description</Label>
              <Textarea
                id="uploadDescription"
                value={uploadForm.description}
                onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter media description"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={uploading}>
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cell Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Cell Properties</DialogTitle>
            <DialogDescription>
              Customize how this media item appears in the grid
            </DialogDescription>
          </DialogHeader>
          {editingCell && editingCell.media && (
            <div className="space-y-4">
              {/* Media Preview */}
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-2 rounded overflow-hidden">
                  {editingCell.media.cloudinarySecureUrl ? (
                    <img 
                      src={editingCell.media.cloudinarySecureUrl} 
                      alt={editingCell.media.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium">{editingCell.media.name}</p>
                <p className="text-xs text-gray-500">Position: ({editingCell.x}, {editingCell.y})</p>
              </div>

              {/* Cell Properties */}
              <div className="space-y-3">
                <div>
                  <Label htmlFor="cellSpanX">Width (columns)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="cellSpanX"
                      type="number"
                      min="1"
                      max="6"
                      value={editingCell.spanX || 1}
                      onChange={(e) => setEditingCell(prev => prev ? {
                        ...prev,
                        spanX: parseInt(e.target.value) || 1
                      } : null)}
                    />
                    <span className="text-xs text-gray-500">
                      Current: {editingCell.spanX || 1} column{editingCell.spanX !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    How many grid columns this image should span
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="cellSpanY">Height (rows)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="cellSpanY"
                      type="number"
                      min="1"
                      max="4"
                      value={editingCell.spanY || 1}
                      onChange={(e) => setEditingCell(prev => prev ? {
                        ...prev,
                        spanY: parseInt(e.target.value) || 1
                      } : null)}
                    />
                    <span className="text-xs text-gray-500">
                      Current: {editingCell.spanY || 1} row{editingCell.spanY !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    How many grid rows this image should span
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => editingCell && handleUpdateCell(editingCell)}>
                  Update Cell
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
