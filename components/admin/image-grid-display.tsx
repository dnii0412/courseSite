"use client"

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Image as ImageIcon,
    Plus,
    Edit,
    Trash2,
    Eye,
    Download,
    Share2
} from 'lucide-react'

interface ImageItem {
    id: string
    title: string
    description?: string
    url: string
    category: string
    size: string
    uploadDate: string
    status: 'active' | 'inactive' | 'pending'
}

interface ImageGridDisplayProps {
    images?: ImageItem[]
    onAddImage?: () => void
    onEditImage?: (image: ImageItem) => void
    onDeleteImage?: (imageId: string) => void
    onViewImage?: (image: ImageItem) => void
}

export function ImageGridDisplay({
    images = [],
    onAddImage,
    onEditImage,
    onDeleteImage,
    onViewImage
}: ImageGridDisplayProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    // Sample data if no images provided
    const sampleImages: ImageItem[] = [
        {
            id: '1',
            title: 'Course Banner 1',
            description: 'Main course banner for web development',
            url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
            category: 'banners',
            size: '2.4 MB',
            uploadDate: '2025-01-15',
            status: 'active'
        },
        {
            id: '2',
            title: 'Lesson Thumbnail',
            description: 'Thumbnail for lesson 1',
            url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
            category: 'thumbnails',
            size: '1.8 MB',
            uploadDate: '2025-01-14',
            status: 'active'
        },
        {
            id: '3',
            title: 'Profile Picture',
            description: 'Default user profile picture',
            url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop',
            category: 'profiles',
            size: '0.9 MB',
            uploadDate: '2025-01-13',
            status: 'active'
        },
        {
            id: '4',
            title: 'Course Icon',
            description: 'Icon for programming course',
            url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
            category: 'icons',
            size: '1.2 MB',
            uploadDate: '2025-01-12',
            status: 'pending'
        },
        {
            id: '5',
            title: 'Background Image',
            description: 'Hero section background',
            url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
            category: 'backgrounds',
            size: '3.1 MB',
            uploadDate: '2025-01-11',
            status: 'active'
        },
        {
            id: '6',
            title: 'Logo Design',
            description: 'Company logo variations',
            url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop',
            category: 'logos',
            size: '0.7 MB',
            uploadDate: '2025-01-10',
            status: 'inactive'
        }
    ]

    const displayImages = images.length > 0 ? images : sampleImages
    const categories = ['all', ...Array.from(new Set(displayImages.map(img => img.category)))]

    const filteredImages = selectedCategory === 'all'
        ? displayImages
        : displayImages.filter(img => img.category === selectedCategory)

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800'
            case 'inactive': return 'bg-gray-100 text-gray-800'
            case 'pending': return 'bg-yellow-100 text-yellow-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'active': return 'Идэвхтэй'
            case 'inactive': return 'Идэвхгүй'
            case 'pending': return 'Хүлээгдэж буй'
            default: return 'Тодорхойгүй'
        }
    }

    return (
        <div className="space-y-6">
            {/* Header Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Media Grid</h2>
                    <p className="text-gray-600">Зураг, байршуулалтын удирдлага</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* View Mode Toggle */}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'grid'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Grid
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'list'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            List
                        </button>
                    </div>

                    {/* Add Image Button */}
                    <Button onClick={onAddImage} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Зураг нэмэх
                    </Button>
                </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {category === 'all' ? 'Бүгд' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                ))}
            </div>

            {/* Image Grid/List */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredImages.map((image) => (
                        <Card key={image.id} className="group hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-0">
                                {/* Image Container */}
                                <div className="relative aspect-video overflow-hidden rounded-t-lg">
                                    <img
                                        src={image.url}
                                        alt={image.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />

                                    {/* Overlay Actions */}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={() => onViewImage?.(image)}
                                            className="bg-white/90 hover:bg-white text-gray-900"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={() => onEditImage?.(image)}
                                            className="bg-white/90 hover:bg-white text-gray-900"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => onDeleteImage?.(image.id)}
                                            className="bg-red-500/90 hover:bg-red-500 text-white"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>

                                    {/* Status Badge */}
                                    <Badge className={`absolute top-2 right-2 ${getStatusColor(image.status)}`}>
                                        {getStatusText(image.status)}
                                    </Badge>
                                </div>

                                {/* Image Info */}
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                                        {image.title}
                                    </h3>
                                    {image.description && (
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                            {image.description}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>{image.size}</span>
                                        <span>{image.uploadDate}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredImages.map((image) => (
                        <Card key={image.id} className="group hover:shadow-md transition-all duration-300">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                    {/* Thumbnail */}
                                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                        <img
                                            src={image.url}
                                            alt={image.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <Badge className={`absolute top-1 right-1 text-xs ${getStatusColor(image.status)}`}>
                                            {getStatusText(image.status)}
                                        </Badge>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 mb-1">{image.title}</h3>
                                        {image.description && (
                                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                                {image.description}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span>Категори: {image.category}</span>
                                            <span>Хэмжээ: {image.size}</span>
                                            <span>Огноо: {image.uploadDate}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => onViewImage?.(image)}
                                        >
                                            <Eye className="w-4 h-4 mr-1" />
                                            Харах
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => onEditImage?.(image)}
                                        >
                                            <Edit className="w-4 h-4 mr-1" />
                                            Засах
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => onDeleteImage?.(image.id)}
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" />
                                            Устгах
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {filteredImages.length === 0 && (
                <div className="text-center py-12">
                    <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Зураг олдсонгүй</h3>
                    <p className="text-gray-600 mb-4">
                        {selectedCategory === 'all'
                            ? 'Одоогоор зураг оруулаагүй байна.'
                            : `"${selectedCategory}" категорид зураг олдсонгүй.`
                        }
                    </p>
                    <Button onClick={onAddImage} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Эхний зураг нэмэх
                    </Button>
                </div>
            )}
        </div>
    )
}
