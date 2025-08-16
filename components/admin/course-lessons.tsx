'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Plus, Upload, Edit, Trash } from 'lucide-react'
import { startBunnyUpload } from '@/lib/bunny/uploader'

interface Lesson {
  _id?: string
  title: string
  description: string
  duration: number
  preview?: boolean
  videoUrl?: string
  videoId?: string
  videoStatus?: string
  videoFile?: string
}

export function CourseLessons({ course, onChanged, variant = 'default' }: { course: any, onChanged: () => void, variant?: 'default' | 'compact' }) {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [title, setTitle] = useState('')
  const [duration, setDuration] = useState<number | ''>('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    const load = async () => {
      if (!course?._id) return
      const res = await fetch(`/api/courses/${course._id}`)
      if (res.ok) {
        const data = await res.json()
        const c = data.course || data
        setLessons(c.lessons || [])
      }
    }
    load()
  }, [course?._id])



  const handleUpload = async (file: File) => {
    if (!file || !course?._id || !title || !duration) return

    try {
      setUploading(true)
      setUploadProgress(0)
      
      // Check file type
      if (!file.type.startsWith('video/')) {
        alert('Please select a video file')
        return
      }

      // Step 1: Create the lesson first
      console.log('Creating lesson with video...')
      const lessonRes = await fetch(`/api/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          duration: Number(duration), 
          courseId: course._id,
          videoFile: file.name, // Store the filename for reference
          videoStatus: 'pending' // Set initial status
        })
      })

      if (!lessonRes.ok) {
        throw new Error('Failed to create lesson')
      }

      const lessonData = await lessonRes.json()
      const lessonId = lessonData.lesson?._id || lessonData._id

      console.log('✅ Lesson created:', lessonId)

      // Step 2: Upload video and get URL
      const videoId = await startBunnyUpload(file, file.name, {
        onProgress: setUploadProgress,
        onSuccess: async (id: string) => {
          console.log('🎬 Video upload success for lesson:', lessonId)
          
          try {
            // Step 3: Update the lesson with video info (immediate update like working version)
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
              setUploading(false)
              setUploadProgress(0)
              setTitle('')
              setDuration('')
              setSelectedFile(null)
              
              // Show success message
              alert('Видео амжилттай байршуулагдлаа! Одоо харах боломжтой.')
              
              // Refresh lessons
              if (onChanged) onChanged()
              
              // Also reload lessons locally
              const r = await fetch(`/api/courses/${course._id}`)
              if (r.ok) {
                const data = await r.json()
                const c = data.course || data
                setLessons(c.lessons || [])
              }
            } else {
              console.error('❌ Failed to update lesson with video info')
              alert('Видео байршуулагдлаа, гэхдээ холбох үед алдаа гарлаа. Админтай холбогдоно уу.')
            }
          } catch (error) {
            console.error('❌ Error updating lesson with video info:', error)
            alert('Видео байршуулагдлаа, гэхдээ холбох үед алдаа гарлаа. Админтай холбогдоно уу.')
          }
        },
        onError: (error: unknown) => {
          console.error('❌ Bunny upload failed:', error)
          setUploading(false)
          setUploadProgress(0)
          
          // Check if it's a credentials error
          if (error instanceof Error && error.message.includes('502')) {
            alert('Video upload service is not configured. Please contact your administrator to set up Bunny.net credentials.')
          } else {
            alert('Upload failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
          }
        }
      })

      return videoId
    } catch (error) {
      console.error('❌ Upload error:', error)
      setUploading(false)
      setUploadProgress(0)
      
      if (error instanceof Error && error.message.includes('502')) {
        alert('Video upload service is not configured. Please contact your administrator to set up Bunny.net credentials.')
      } else {
        alert('Upload failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
      }
    }
  }

  return (
    <Card className={variant === 'compact' ? 'border-0 bg-transparent shadow-none' : undefined}>
      <CardContent className={variant === 'compact' ? 'pt-0 px-0' : 'pt-4'}>
        {/* Add Lesson Form */}
        <div className={variant === 'compact' ? 'rounded-xl overflow-hidden bg-white divide-y divide-gray-100' : 'space-y-3'}>
          {lessons.map((l, idx) => (
            <div key={l._id || idx} className={variant === 'compact' ? 'flex items-center justify-between px-3 py-3 hover:bg-gray-50 transition-colors' : 'flex items-center justify-between p-2 border rounded'}>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-700">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="font-medium text-black">{l.title}</h4>
                  <p className="text-sm text-gray-600">{l.description}</p>
                  <div className="text-xs text-gray-500">{l.duration} минут</div>
                  {l.videoUrl && (
                    <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <span>✅</span>
                      <a href={l.videoUrl} target="_blank" rel="noopener noreferrer" className="underline">
                        Видео харах
                      </a>
                    </div>
                  )}
                  {l.videoFile && !l.videoUrl && (
                    <div className="text-xs text-yellow-600 flex items-center gap-1 mt-1">
                      <span>⏳</span>
                      Видео байршуулж байна...
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={async () => {
                  const titleNew = prompt('Шинэ гарчиг', l.title) || l.title
                  const durationNew = Number(prompt('Минут', String(l.duration)) || l.duration)
                  const res = await fetch(`/api/lessons/${l._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: titleNew, duration: durationNew }) })
                  if (res.ok) {
                    onChanged()
                    const r = await fetch(`/api/courses/${course._id}`)
                    if (r.ok) {
                      const data = await r.json()
                      const c = data.course || data
                      setLessons(c.lessons || [])
                    }
                  }
                }}>Засах</Button>
                <Button size="sm" variant="destructive" onClick={async () => {
                  if (!l._id) return
                  if (!confirm('Хичээлийг устгах уу?')) return
                  const res = await fetch(`/api/lessons/${l._id}`, { method: 'DELETE' })
                  if (res.ok) {
                    onChanged()
                    setLessons(prev => prev.filter(x => x._id !== l._id))
                  }
                }}>Устгах</Button>
              </div>
            </div>
          ))}

          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="col-span-2">
              <Label htmlFor="new-lesson-title">Шинэ хичээлийн гарчиг</Label>
              <Input id="new-lesson-title" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="new-lesson-duration">Минут</Label>
              <Input id="new-lesson-duration" type="number" value={duration} onChange={e => setDuration(e.target.value ? Number(e.target.value) : '')} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 items-end">
            <div className="col-span-2">
              <Label htmlFor="new-lesson-video">Видео файл (Bunny)</Label>
              <input
                id="new-lesson-video"
                ref={fileInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                  Файл сонгох
                </Button>
                <span className="text-sm text-gray-600 truncate max-w-[240px]">
                  {selectedFile ? selectedFile.name : 'Файл сонгогдоогүй'}
                </span>
              </div>
              {uploading && (
                <div className="mt-2">
                  <Progress value={uploadProgress} />
                  <div className="text-xs text-gray-600 mt-1">{uploadProgress}%</div>
                </div>
              )}
            </div>
            <div className="space-x-2 flex justify-end">
              
              <Button
                type="button"
                onClick={() => selectedFile && handleUpload(selectedFile)}
                disabled={uploading || !selectedFile || !title || !duration}
              >
                {uploading ? 'Хичээл үүсгэж байна...' : 'Хичээл + Видео үүсгэх'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
