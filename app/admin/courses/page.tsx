"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { BookOpen, Plus, Search, Edit, Trash2, ChevronDown, ChevronRight, Video } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { bunnyVideoService } from "@/lib/bunny-video"

interface Lesson {
  _id: string
  title: string
  description: string
  videoUrl: string
  duration: number
  order: number
  isPreview: boolean
  subCourseId?: string
  bunnyVideoId?: string
  tusUploadId?: string
}

interface SubCourse {
  _id: string
  courseId: string
  title: string
  description: string
  lessons: Lesson[]
  order: number
  isActive: boolean
}

interface Course {
  _id: string
  title: string
  description: string
  price: number
  originalPrice?: number
  category: string
  level: "beginner" | "intermediate" | "advanced"
  duration: number
  videoUrl?: string
  thumbnailUrl?: string
  lessons: Lesson[]
  enrolledCount: number
  rating: number
  totalRatings: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminCourses() {
  const { toast } = useToast()

  const [courses, setCourses] = useState<Course[]>([])
  const [subCourses, setSubCourses] = useState<SubCourse[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])

  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [selectedSubCourse, setSelectedSubCourse] = useState<SubCourse | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)

  const [isCreateCourseDialogOpen, setIsCreateCourseDialogOpen] = useState(false)
  const [isCreateSubCourseDialogOpen, setIsCreateSubCourseDialogOpen] = useState(false)
  const [isCreateLessonDialogOpen, setIsCreateLessonDialogOpen] = useState(false)
  const [isEditLessonDialogOpen, setIsEditLessonDialogOpen] = useState(false)
  const [editLessonFormData, setEditLessonFormData] = useState<{
    title: string
    description: string
    order: number
    isPreview: boolean
  }>({
    title: "",
    description: "",
    order: 1,
    isPreview: false
  })
  const [isEditCourseDialogOpen, setIsEditCourseDialogOpen] = useState(false)
  const [isEditSubCourseDialogOpen, setIsEditSubCourseDialogOpen] = useState(false)

  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set())
  const [expandedSubCourses, setExpandedSubCourses] = useState<Set<string>>(new Set())

  const [isCreatingLesson, setIsCreatingLesson] = useState(false)

  const [courseFormData, setCourseFormData] = useState({
    title: "",
    description: "",
    price: 0,
    originalPrice: 0,
    category: "",
    level: "beginner" as "beginner" | "intermediate" | "advanced",
    isActive: true
  })

  const [subCourseFormData, setSubCourseFormData] = useState({
    title: "",
    description: "",
    order: 1,
    isActive: true
  })

  const [editCourseFormData, setEditCourseFormData] = useState({
    title: "",
    description: "",
    price: 0,
    originalPrice: 0,
    category: "",
    level: "beginner" as "beginner" | "intermediate" | "advanced",
    isActive: true
  })

  const [editSubCourseFormData, setEditSubCourseFormData] = useState({
    title: "",
    description: "",
    order: 1,
    isActive: true
  })

  const [lessonFormData, setLessonFormData] = useState<{
    title: string
    description: string
    order: number
    isPreview: boolean
    videoFile: File | null
  }>({
    title: "",
    description: "",
    order: 1,
    isPreview: false,
    videoFile: null
  })

  useEffect(() => {
    const load = async () => {
      try {
        const [coursesRes, subCoursesRes] = await Promise.all([
          fetch("/api/admin/courses"),
          fetch("/api/admin/sub-courses")
        ])

        if (coursesRes.ok) {
          const data = await coursesRes.json()
          setCourses(data.courses || [])
        }
        if (subCoursesRes.ok) {
          const data = await subCoursesRes.json()
          setSubCourses(data.subCourses || [])
        }
    } catch (error) {
        console.error("Failed to load data", error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const fetchLessons = async (subCourseId: string): Promise<Lesson[]> => {
    try {
      const res = await fetch(`/api/admin/lessons?subCourseId=${subCourseId}`)
      if (!res.ok) return []
      const data = await res.json()
      return data.lessons || []
    } catch (e) {
      console.warn("Lessons GET not available; returning empty list", e)
      return []
    }
  }

  const toggleCourseExpansion = (courseId: string) => {
    const next = new Set(expandedCourses)
    if (next.has(courseId)) next.delete(courseId)
    else next.add(courseId)
    setExpandedCourses(next)
  }

  const toggleSubCourseExpansion = async (subCourseId: string) => {
    const next = new Set(expandedSubCourses)
    if (next.has(subCourseId)) {
      next.delete(subCourseId)
      } else {
      next.add(subCourseId)
      const lessonsData = await fetchLessons(subCourseId)
      setLessons(prevLessons => {
        const filtered = prevLessons.filter(l => l.subCourseId !== subCourseId)
        return [...filtered, ...lessonsData]
      })
    }
    setExpandedSubCourses(next)
  }

  const handleCreateCourse = async () => {
    try {
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseFormData)
      })
      if (res.ok) {
        toast({ title: "Success", description: "Course created" })
        const data = await (await fetch("/api/admin/courses")).json()
        setCourses(data.courses || [])
        setIsCreateCourseDialogOpen(false)
      } else {
        const err = await res.json()
        toast({ title: "Error", description: err.error || "Failed", variant: "destructive" })
      }
    } catch (e) {
      toast({ title: "Error", description: "Failed to create course", variant: "destructive" })
    }
  }

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm("Delete course?")) return
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, { method: "DELETE" })
      if (res.ok) {
        setCourses(prev => prev.filter(c => c._id !== courseId))
        toast({ title: "Deleted", description: "Course deleted" })
      } else {
        const err = await res.json()
        toast({ title: "Error", description: err.error || "Failed", variant: "destructive" })
      }
    } catch (e) {
      toast({ title: "Error", description: "Failed to delete course", variant: "destructive" })
    }
  }

  const handleCreateSubCourse = async () => {
    if (!selectedCourse) return
    try {
      const res = await fetch("/api/admin/sub-courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: subCourseFormData.title,
          description: subCourseFormData.description,
          courseId: selectedCourse._id,
          order: subCourseFormData.order,
          isActive: subCourseFormData.isActive
        })
      })
      if (res.ok) {
        toast({ title: "Success", description: "Sub-course created" })
        const data = await (await fetch("/api/admin/sub-courses")).json()
        setSubCourses(data.subCourses || [])
        setIsCreateSubCourseDialogOpen(false)
      } else {
        const err = await res.json()
        toast({ title: "Error", description: err.error || "Failed", variant: "destructive" })
      }
    } catch (e) {
      toast({ title: "Error", description: "Failed to create sub-course", variant: "destructive" })
    }
  }

  const handleDeleteSubCourse = async (subCourseId: string) => {
    if (!confirm("Delete sub-course?")) return
    try {
      const res = await fetch(`/api/admin/sub-courses/${subCourseId}`, { method: "DELETE" })
      if (res.ok) {
        setSubCourses(prev => prev.filter(sc => sc._id !== subCourseId))
        setLessons(prev => prev.filter(l => l.subCourseId !== subCourseId))
        toast({ title: "Deleted", description: "Sub-course deleted" })
      } else {
        const err = await res.json()
        toast({ title: "Error", description: err.error || "Failed", variant: "destructive" })
      }
    } catch (e) {
      toast({ title: "Error", description: "Failed to delete sub-course", variant: "destructive" })
    }
  }

  const handleUpdateCourse = async () => {
    if (!selectedCourse) return
    try {
      const res = await fetch(`/api/admin/courses/${selectedCourse._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editCourseFormData)
      })
      if (res.ok) {
        toast({ title: "Updated", description: "Course updated" })
        setCourses(prev => prev.map(c => c._id === selectedCourse._id ? { ...c, ...editCourseFormData } as Course : c))
        setIsEditCourseDialogOpen(false)
      } else {
        const err = await res.json()
        toast({ title: "Error", description: err.error || "Failed", variant: "destructive" })
      }
    } catch (e) {
      toast({ title: "Error", description: "Failed to update course", variant: "destructive" })
    }
  }

  const handleUpdateSubCourse = async () => {
    if (!selectedSubCourse) return
    try {
      const res = await fetch(`/api/admin/sub-courses/${selectedSubCourse._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editSubCourseFormData)
      })
      if (res.ok) {
        toast({ title: "Updated", description: "Sub-course updated" })
        setSubCourses(prev => prev.map(sc => sc._id === selectedSubCourse._id ? { ...sc, ...editSubCourseFormData } as SubCourse : sc))
        setIsEditSubCourseDialogOpen(false)
      } else {
        const err = await res.json()
        toast({ title: "Error", description: err.error || "Failed", variant: "destructive" })
      }
    } catch (e) {
      toast({ title: "Error", description: "Failed to update sub-course", variant: "destructive" })
    }
  }

  const handleCreateLesson = async () => {
    if (!selectedSubCourse || !lessonFormData.videoFile) return
    setIsCreatingLesson(true)
    try {
      const upload = await bunnyVideoService.uploadVideo(lessonFormData.videoFile, {
        title: lessonFormData.title,
        description: lessonFormData.description,
        tags: [],
        category: "education"
      })

      if (!upload.success || !upload.videoId || !upload.videoUrl) {
        toast({ title: "Error", description: upload.error || "Upload failed", variant: "destructive" })
        setIsCreatingLesson(false)
        return
      }

      const res = await fetch("/api/admin/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: lessonFormData.title,
          description: lessonFormData.description,
          subCourseId: selectedSubCourse._id,
          order: lessonFormData.order,
          isPreview: lessonFormData.isPreview,
          bunnyVideoId: upload.videoId,
          videoUrl: upload.videoUrl
        })
      })
      if (res.ok) {
        toast({ title: "Success", description: "Lesson created" })
        const lessonsData = await fetchLessons(selectedSubCourse._id)
        setLessons(prev => {
          const filtered = prev.filter(l => l.subCourseId !== selectedSubCourse._id)
          return [...filtered, ...lessonsData]
        })
        setIsCreateLessonDialogOpen(false)
      } else {
        const err = await res.json()
        toast({ title: "Error", description: err.error || "Failed", variant: "destructive" })
      }
    } catch (e) {
      toast({ title: "Error", description: "Failed to create lesson", variant: "destructive" })
    } finally {
      setIsCreatingLesson(false)
    }
  }

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm("Delete lesson?")) return
    try {
      const res = await fetch(`/api/admin/lessons/${lessonId}`, { method: "DELETE" })
      if (res.ok) {
        const subCourseId = lessons.find(l => l._id === lessonId)?.subCourseId
        if (subCourseId) {
          const lessonsData = await fetchLessons(subCourseId)
          setLessons(prev => {
            const filtered = prev.filter(l => l.subCourseId !== subCourseId)
            return [...filtered, ...lessonsData]
          })
      } else {
          setLessons(prev => prev.filter(l => l._id !== lessonId))
        }
        toast({ title: "Deleted", description: "Lesson deleted" })
      } else {
        const err = await res.json()
        toast({ title: "Error", description: err.error || "Failed", variant: "destructive" })
      }
    } catch (e) {
      toast({ title: "Error", description: "Failed to delete lesson", variant: "destructive" })
    }
  }

  const getCourseSubCourses = (courseId: string) => subCourses.filter(sc => sc.courseId === courseId).sort((a, b) => a.order - b.order)
  const getSubCourseLessons = (subCourseId: string) => lessons.filter(l => l.subCourseId === subCourseId)

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

    return (
    <div className="space-y-6">
      {loading ? (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
      ) : (
        <>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Хичээл удирдах</h1>
        <p className="text-gray-600">Хичээлүүдийг нэмэх, засах, устгах</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Хичээлүүд ({courses.length})</CardTitle>
            <Dialog open={isCreateCourseDialogOpen} onOpenChange={setIsCreateCourseDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Шинэ хичээл
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Course</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="courseTitle">Title</Label>
                      <Input
                        id="courseTitle"
                        value={courseFormData.title}
                        onChange={(e) => setCourseFormData({ ...courseFormData, title: e.target.value })}
                        placeholder="Enter course title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="courseCategory">Category</Label>
                      <Input
                        id="courseCategory"
                        value={courseFormData.category}
                        onChange={(e) => setCourseFormData({ ...courseFormData, category: e.target.value })}
                        placeholder="Enter course category"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="courseDescription">Description</Label>
                    <Textarea
                      id="courseDescription"
                      value={courseFormData.description}
                      onChange={(e) => setCourseFormData({ ...courseFormData, description: e.target.value })}
                      placeholder="Enter course description"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="coursePrice">Price (₮)</Label>
                      <Input
                        id="coursePrice"
                        type="number"
                        value={courseFormData.price}
                        onChange={(e) => setCourseFormData({ ...courseFormData, price: parseInt(e.target.value) })}
                        placeholder="Enter price"
                      />
                    </div>
                    <div>
                      <Label htmlFor="courseOriginalPrice">Original Price (₮)</Label>
                      <Input
                        id="courseOriginalPrice"
                        type="number"
                        value={courseFormData.originalPrice}
                        onChange={(e) => setCourseFormData({ ...courseFormData, originalPrice: parseInt(e.target.value) })}
                        placeholder="Enter original price"
                      />
                    </div>
                    <div>
                      <Label htmlFor="courseLevel">Level</Label>
                      <Select value={courseFormData.level} onValueChange={(value: "beginner" | "intermediate" | "advanced") => setCourseFormData({ ...courseFormData, level: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={handleCreateCourse} className="w-full">Create Course</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Q Хичээл хайх..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredCourses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No courses found</div>
            ) : (
              filteredCourses.map((course) => (
                <div key={course._id} className="border rounded-lg">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <BookOpen className="h-8 w-8 text-blue-600" />
                      <div>
                        <h3 className="font-medium text-lg">{course.title}</h3>
                        <p className="text-sm text-gray-500">{course.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>Үнэ: ${course.price}</span>
                          <span>Дэд хичээл: {getCourseSubCourses(course._id).length}</span>
                          <span>Сурагчид: {course.enrolledCount}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="font-medium">₮{course.price}</div>
                        <Badge variant={course.isActive ? "default" : "secondary"}>
                          {course.isActive ? "Идэвхтэй" : "Идэвхгүй"}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => toggleCourseExpansion(course._id)}>
                        {expandedCourses.has(course._id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                            variant="outline"
                        size="sm"
                            onClick={() => {
                              setSelectedCourse(course)
                              setEditCourseFormData({
                                title: course.title,
                                description: course.description,
                                price: course.price,
                                originalPrice: course.originalPrice || 0,
                                category: course.category,
                                level: course.level,
                                isActive: course.isActive
                              })
                              setIsEditCourseDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <Button variant="outline" size="sm" onClick={() => handleDeleteCourse(course._id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {expandedCourses.has(course._id) && (
                        <div className="border-t bg-gray-50 p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-5 w-5 text-primary" />
                              <h4 className="font-medium text-gray-800">Дэд хичээлүүд ({getCourseSubCourses(course._id).length})</h4>
                            </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCourse(course)
                          setIsCreateSubCourseDialogOpen(true)
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Дэд хичээл нэмэх
                      </Button>
                          </div>

                          <div className="space-y-3">
                            {getCourseSubCourses(course._id).length === 0 ? (
                              <div className="text-center py-6 text-gray-500">
                                <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                <p className="mb-3">No sub-courses found</p>
                      <Button
                        variant="outline"
                        size="sm"
                                  onClick={() => {
                                    setSelectedCourse(course)
                                    setIsCreateSubCourseDialogOpen(true)
                                  }}
                      >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Create First Sub-course
                      </Button>
                    </div>
                        ) : (
                          getCourseSubCourses(course._id).map((subCourse) => (
                                <div key={subCourse._id} className="bg-white rounded border">
                                  <div className="flex items-center justify-between p-3">
                              <div className="flex items-center gap-3">
                                <BookOpen className="h-5 w-5 text-green-600" />
                                <div>
                                  <h5 className="font-medium">{subCourse.title}</h5>
                                  <p className="text-sm text-gray-500">{subCourse.description}</p>
                                  <p className="text-xs text-gray-500">Order: {subCourse.order}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                      <Button variant="outline" size="sm" onClick={() => toggleSubCourseExpansion(subCourse._id)}>
                                        {expandedSubCourses.has(subCourse._id) ? (
                                          <ChevronDown className="h-4 w-4" />
                                        ) : (
                                          <ChevronRight className="h-4 w-4" />
                                        )}
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setSelectedSubCourse(subCourse)
                                          setEditSubCourseFormData({
                                            title: subCourse.title,
                                            description: subCourse.description,
                                            order: subCourse.order,
                                            isActive: subCourse.isActive
                                          })
                                          setIsEditSubCourseDialogOpen(true)
                                        }}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button variant="outline" size="sm" onClick={() => handleDeleteSubCourse(subCourse._id)}>
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>

                                  {expandedSubCourses.has(subCourse._id) && (
                                    <div className="border-t bg-gray-25 p-3">
                                      <div className="flex items-center justify-between mb-3">
                                        <h6 className="font-medium text-sm text-gray-700">
                                          Хичээлүүд ({getSubCourseLessons(subCourse._id).length})
                                        </h6>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedSubCourse(subCourse)
                                    setIsCreateLessonDialogOpen(true)
                                  }}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Хичээл нэмэх
                                </Button>
                                      </div>
                                      <div className="space-y-2">
                                        {getSubCourseLessons(subCourse._id).length === 0 ? (
                                          <div className="text-center py-3 text-gray-500 text-sm">
                                            <Video className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                                            <p>No lessons found</p>
                                          </div>
                                        ) : (
                                          getSubCourseLessons(subCourse._id)
                                            .sort((a, b) => a.order - b.order)
                                            .map((lesson) => (
                                              <div key={lesson._id} className="flex items-center justify-between p-2 bg-white rounded border text-sm">
                                                <div className="flex items-center gap-2">
                                                  <Video className="h-4 w-4 text-blue-600" />
                                                  <div>
                                                    <p className="font-medium">{lesson.title}</p>
                                                    <p className="text-xs text-gray-500">{lesson.description}</p>
                                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                                      <span>Order: {lesson.order}</span>
                                                      <span>•</span>
                                                      <span>{lesson.duration} мин</span>
                                                      {lesson.isPreview && (
                                                        <>
                                                          <span>•</span>
                                                          <Badge variant="secondary" className="text-xs">Preview</Badge>
                                                        </>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                      setSelectedLesson(lesson)
                                                      setEditLessonFormData({
                                                        title: lesson.title,
                                                        description: lesson.description,
                                                        order: lesson.order,
                                                        isPreview: lesson.isPreview
                                                      })
                                                      setIsEditLessonDialogOpen(true)
                                                    }}
                                                  >
                                                    <Edit className="h-3 w-3" />
                                                  </Button>
                                                  <Button variant="ghost" size="sm" onClick={() => handleDeleteLesson(lesson._id)}>
                                                    <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                                              </div>
                                            ))
                                        )}
                                      </div>
                                    </div>
                                  )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isCreateSubCourseDialogOpen} onOpenChange={setIsCreateSubCourseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Sub-Course</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="subCourseTitle">Title</Label>
              <Input
                id="subCourseTitle"
                value={subCourseFormData.title}
                onChange={(e) => setSubCourseFormData({ ...subCourseFormData, title: e.target.value })}
                placeholder="Enter sub-course title"
              />
            </div>
            <div>
              <Label htmlFor="subCourseDescription">Description</Label>
              <Textarea
                id="subCourseDescription"
                value={subCourseFormData.description}
                onChange={(e) => setSubCourseFormData({ ...subCourseFormData, description: e.target.value })}
                placeholder="Enter sub-course description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="subCourseOrder">Order</Label>
                <Input
                  id="subCourseOrder"
                  type="number"
                  value={subCourseFormData.order}
                  onChange={(e) => setSubCourseFormData({ ...subCourseFormData, order: parseInt(e.target.value) })}
                  placeholder="Enter order"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="subCourseActive"
                  checked={subCourseFormData.isActive}
                  onCheckedChange={(checked) => setSubCourseFormData({ ...subCourseFormData, isActive: checked })}
                />
                <Label htmlFor="subCourseActive">Active</Label>
              </div>
            </div>
            <Button onClick={handleCreateSubCourse} className="w-full">Create Sub-Course</Button>
          </div>
        </DialogContent>
      </Dialog>

          {/* Edit Course Dialog */}
          <Dialog open={isEditCourseDialogOpen} onOpenChange={setIsEditCourseDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Course</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editCourseTitle">Title</Label>
                    <Input
                      id="editCourseTitle"
                      value={editCourseFormData.title}
                      onChange={(e) => setEditCourseFormData({ ...editCourseFormData, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editCourseCategory">Category</Label>
                    <Input
                      id="editCourseCategory"
                      value={editCourseFormData.category}
                      onChange={(e) => setEditCourseFormData({ ...editCourseFormData, category: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="editCourseDescription">Description</Label>
                  <Textarea
                    id="editCourseDescription"
                    value={editCourseFormData.description}
                    onChange={(e) => setEditCourseFormData({ ...editCourseFormData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="editCoursePrice">Price (₮)</Label>
                    <Input
                      id="editCoursePrice"
                      type="number"
                      value={editCourseFormData.price}
                      onChange={(e) => setEditCourseFormData({ ...editCourseFormData, price: parseInt(e.target.value || "0") })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editCourseOriginalPrice">Original Price (₮)</Label>
                    <Input
                      id="editCourseOriginalPrice"
                      type="number"
                      value={editCourseFormData.originalPrice}
                      onChange={(e) => setEditCourseFormData({ ...editCourseFormData, originalPrice: parseInt(e.target.value || "0") })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editCourseLevel">Level</Label>
                    <Select value={editCourseFormData.level} onValueChange={(value: "beginner" | "intermediate" | "advanced") => setEditCourseFormData({ ...editCourseFormData, level: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="editCourseActive"
                    checked={editCourseFormData.isActive}
                    onCheckedChange={(checked) => setEditCourseFormData({ ...editCourseFormData, isActive: checked })}
                  />
                  <Label htmlFor="editCourseActive">Active</Label>
                </div>
                <Button onClick={handleUpdateCourse} className="w-full">Save</Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Lesson Dialog */}
          <Dialog open={isEditLessonDialogOpen} onOpenChange={setIsEditLessonDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Lesson</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editLessonTitle">Title</Label>
                    <Input
                      id="editLessonTitle"
                      value={editLessonFormData.title}
                      onChange={(e) => setEditLessonFormData({ ...editLessonFormData, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editLessonOrder">Order</Label>
                    <Input
                      id="editLessonOrder"
                      type="number"
                      value={editLessonFormData.order}
                      onChange={(e) => setEditLessonFormData({ ...editLessonFormData, order: parseInt(e.target.value || "1") })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="editLessonDescription">Description</Label>
                  <Textarea
                    id="editLessonDescription"
                    value={editLessonFormData.description}
                    onChange={(e) => setEditLessonFormData({ ...editLessonFormData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="editLessonPreview"
                    checked={editLessonFormData.isPreview}
                    onCheckedChange={(checked) => setEditLessonFormData({ ...editLessonFormData, isPreview: checked })}
                  />
                  <Label htmlFor="editLessonPreview">Preview Lesson</Label>
                </div>
                <Button
                  onClick={async () => {
                    if (!selectedLesson) return
                    try {
                      const res = await fetch(`/api/admin/lessons/${selectedLesson._id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(editLessonFormData)
                      })
                      if (res.ok) {
                        const subCourseId = selectedLesson.subCourseId
                        if (subCourseId) {
                          const lessonsData = await fetchLessons(subCourseId)
                          setLessons(prev => {
                            const filtered = prev.filter(l => l.subCourseId !== subCourseId)
                            return [...filtered, ...lessonsData]
                          })
                        }
                        setIsEditLessonDialogOpen(false)
                        setSelectedLesson(null)
                        toast({ title: "Updated", description: "Lesson updated" })
                      } else {
                        const err = await res.json()
                        toast({ title: "Error", description: err.error || "Failed", variant: "destructive" })
                      }
                    } catch (e) {
                      toast({ title: "Error", description: "Failed to update lesson", variant: "destructive" })
                    }
                  }}
                  className="w-full"
                >
                  Save
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Sub-Course Dialog */}
          <Dialog open={isEditSubCourseDialogOpen} onOpenChange={setIsEditSubCourseDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Sub-Course</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="editSubCourseTitle">Title</Label>
                  <Input
                    id="editSubCourseTitle"
                    value={editSubCourseFormData.title}
                    onChange={(e) => setEditSubCourseFormData({ ...editSubCourseFormData, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="editSubCourseDescription">Description</Label>
                  <Textarea
                    id="editSubCourseDescription"
                    value={editSubCourseFormData.description}
                    onChange={(e) => setEditSubCourseFormData({ ...editSubCourseFormData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editSubCourseOrder">Order</Label>
                    <Input
                      id="editSubCourseOrder"
                      type="number"
                      value={editSubCourseFormData.order}
                      onChange={(e) => setEditSubCourseFormData({ ...editSubCourseFormData, order: parseInt(e.target.value || "1") })}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="editSubCourseActive"
                      checked={editSubCourseFormData.isActive}
                      onCheckedChange={(checked) => setEditSubCourseFormData({ ...editSubCourseFormData, isActive: checked })}
                    />
                    <Label htmlFor="editSubCourseActive">Active</Label>
                  </div>
                </div>
                <Button onClick={handleUpdateSubCourse} className="w-full">Save</Button>
              </div>
            </DialogContent>
          </Dialog>

      <Dialog open={isCreateLessonDialogOpen} onOpenChange={setIsCreateLessonDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Lesson</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lessonTitle">Title</Label>
                <Input
                  id="lessonTitle"
                  value={lessonFormData.title}
                  onChange={(e) => setLessonFormData({ ...lessonFormData, title: e.target.value })}
                  placeholder="Enter lesson title"
                />
              </div>
              <div>
                <Label htmlFor="lessonOrder">Order</Label>
                <Input
                  id="lessonOrder"
                  type="number"
                  value={lessonFormData.order}
                  onChange={(e) => setLessonFormData({ ...lessonFormData, order: parseInt(e.target.value) })}
                  placeholder="Enter order"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="lessonDescription">Description</Label>
              <Textarea
                id="lessonDescription"
                value={lessonFormData.description}
                onChange={(e) => setLessonFormData({ ...lessonFormData, description: e.target.value })}
                placeholder="Enter lesson description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="lessonVideo">Video File</Label>
              <Input
                id="lessonVideo"
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null
                  if (file) {
                    toast({
                      title: "File selected",
                          description: `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)}MB)`
                    })
                  }
                  setLessonFormData({ ...lessonFormData, videoFile: file })
                }}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: MP4, AVI, MOV, WMV, FLV, WebM. Max size: 100MB
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="lessonPreview"
                checked={lessonFormData.isPreview}
                onCheckedChange={(checked) => setLessonFormData({ ...lessonFormData, isPreview: checked })}
              />
              <Label htmlFor="lessonPreview">Preview Lesson</Label>
            </div>
                <Button onClick={handleCreateLesson} className="w-full" disabled={!lessonFormData.videoFile || isCreatingLesson}>
              {isCreatingLesson ? "Creating Lesson..." : "Create Lesson"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
        </>
      )}
    </div>
  )
}


