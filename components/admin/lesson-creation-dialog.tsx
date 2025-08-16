'use client'

import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react'
import { startBunnyUpload } from '@/lib/bunny/uploader'

interface LessonCreationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subcourseId: string
  onLessonCreated: () => void
}

interface NewLesson {
  title: string
  description: string
  preview: boolean
}

export function LessonCreationDialog({ 
  open, 
  onOpenChange, 
  subcourseId, 
  onLessonCreated 
}: LessonCreationDialogProps) {
  const [newLesson, setNewLesson] = useState<NewLesson>({
    title: '',
    description: '',
    preview: false,
  })
  
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState<string>('')
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        setUploadError('Зөвхөн видео файл сонгоно уу')
        return
      }
      
      // Validate file size (max 2GB)
      if (file.size > 2 * 1024 * 1024 * 1024) {
        setUploadError('Файлын хэмжээ 2GB-аас бага байх ёстой')
        return
      }
      
      setVideoFile(file)
      setUploadError('')
    }
  }

  const handleRemoveFile = () => {
    setVideoFile(null)
    setUploadError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleCreateLesson = async () => {
    if (!videoFile) {
      setUploadError('Видео файл сонгоно уу')
      return
    }

    if (!newLesson.title.trim()) {
      setUploadError('Хичээлийн гарчиг оруулна уу')
      return
    }

    setUploading(true)
    setUploadError('')

    try {
      // Step 1: Create the lesson first
      const lessonRes = await fetch('/api/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newLesson,
          subcourseId,
          duration: 30, // Default duration: 30 minutes
          order: 0, // Default order: 0
          videoStatus: 'pending' // Set initial status
        }),
      })

      if (!lessonRes.ok) {
        const error = await lessonRes.text()
        throw new Error(error || 'Хичээл үүсгэхэд алдаа гарлаа')
      }

      const lessonData = await lessonRes.json()
      const lessonId = lessonData.lesson?._id || lessonData._id

      console.log('✅ Lesson created with ID:', lessonId)

      // Step 2: Upload video with the real lessonId
      const uploadedVideoId = await startBunnyUpload(
        videoFile,
        newLesson.title || videoFile.name,
        {
          onProgress: (percent: number) => {
            setUploadProgress(percent)
          },
          onSuccess: async (id: string) => {
            console.log('🎬 Video upload completed for lesson:', lessonId)
            
            try {
              // Step 3: Update lesson with video info and status (immediate update like working version)
              const videoUrl = `https://iframe.mediadelivery.net/embed/480986/${id}`
              
              const updateRes = await fetch(`/api/lessons/${lessonId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  videoUrl: videoUrl,
                  videoId: id,
                  videoStatus: 'uploaded'  // ← Restore immediate status update
                })
              })

              if (updateRes.ok) {
                console.log('✅ Lesson updated with video info and status: uploaded')
                setUploadError('') // Clear previous errors
                setUploadProgress(100)
              } else {
                console.error('❌ Failed to update lesson with video info')
                setUploadError('Хичээл шинэчлэхэд алдаа гарлаа')
              }
            } catch (error) {
              console.error('❌ Error updating lesson with video info:', error)
              setUploadError('Хичээл шинэчлэхэд алдаа гарлаа')
            }
          },
          onError: (error: unknown) => {
            console.error('❌ Upload error:', error)
            setUploadError('Видео байршуулахад алдаа гарлаа')
          }
        }
      )
      
      console.log('🎬 Video uploaded with ID:', uploadedVideoId)
      
      // Step 4: Reset form and close dialog
      setNewLesson({
        title: '',
        description: '',
        preview: false,
      })
      setVideoFile(null)
      setUploadProgress(0)
      setUploadError('')
      
      onLessonCreated()
      onOpenChange(false)
    } catch (error) {
      console.error('❌ Upload failed:', error)
      setUploadError('Видео байршуулахад алдаа гарлаа')
    } finally {
      setUploading(false)
    }
  }

  const canCreateLesson = videoFile && newLesson.title.trim() && !uploading

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Шинэ хичээл нэмэх</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Basic Lesson Info */}
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="lesson-title">Гарчиг *</Label>
              <Input 
                id="lesson-title" 
                placeholder="Хичээлийн гарчиг" 
                value={newLesson.title} 
                onChange={e => setNewLesson(v => ({ ...v, title: e.target.value }))} 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="lesson-description">Тайлбар</Label>
              <Textarea 
                id="lesson-description" 
                placeholder="Хичээлийн тайлбар" 
                value={newLesson.description} 
                onChange={e => setNewLesson(v => ({ ...v, description: e.target.value }))} 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="lesson-preview">Урьдчилан харах</Label>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="lesson-preview" 
                  checked={newLesson.preview} 
                  onCheckedChange={val => setNewLesson(v => ({ ...v, preview: val }))} 
                />
                <span>{newLesson.preview ? 'Тийм' : 'Үгүй'}</span>
              </div>
            </div>
          </div>

          {/* Video Upload Section */}
          <div className="grid gap-4">
            <Label>Видео файл *</Label>
            
            {!videoFile ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Видео файл сонгох
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  MP4, MOV, AVI зэрэг видео формат
                </p>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Upload className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{videoFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {(videoFile.size / (1024 * 1024)).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveFile}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Upload Progress */}
                {uploading && (
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Байршуулж байна...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
                
                {/* Manual Status Check Button */}
                <div className="mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      try {
                        // Get the lesson ID from the current lesson being created
                        const lessonId = 'temp' // This will be updated after lesson creation
                        const videoId = 'temp' // This will be updated after upload
                        
                        alert('Use this button after creating the lesson to manually check video status')
                        
                        // TODO: Implement actual status check after lesson creation
                        // const response = await fetch('/api/bunny/force-update', {
                        //   method: 'POST',
                        //   headers: { 'Content-Type': 'application/json' },
                        //   body: JSON.stringify({ lessonId, videoId })
                        // })
                        // 
                        // if (response.ok) {
                        //   alert('Video status updated successfully!')
                        // } else {
                        //   alert('Failed to update video status')
                        // }
                      } catch (error) {
                        console.error('Error checking video status:', error)
                        alert('Error checking video status')
                      }
                    }}
                    className="w-full text-xs"
                  >
                    🔍 Check Video Status Manually
                  </Button>
                </div>
                
                {uploadError && (
                  <div className="mt-3 flex items-center space-x-2 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{uploadError}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Error Display */}
          {uploadError && (
            <div className="flex items-center space-x-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{uploadError}</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Цуцлах
          </Button>
          <Button 
            onClick={handleCreateLesson} 
            disabled={!canCreateLesson}
          >
            {uploading ? 'Байршуулж байна...' : 'Хичээл үүсгэх'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
