'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Upload, Grid3X3, List, Trash2, Eye, Video, Image } from 'lucide-react';
import { IMedia } from '@/lib/models/media';

// Client-side utility function for Cloudinary URLs
const getThumbnailUrl = (publicId: string, width: number = 200, height: number = 200) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo';
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_${width},h_${height},c_fill/${publicId}`;
};

interface MediaLibraryProps {
  onMediaSelect?: (media: IMedia) => void;
  selectedMedia?: IMedia | null;
}

export const MediaLibrary = ({ onMediaSelect, selectedMedia }: MediaLibraryProps) => {
  const [media, setMedia] = useState<IMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/media');
      if (response.ok) {
        const data = await response.json();
        setMedia(data.data || []);
      } else {
        throw new Error('Failed to fetch media');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load media library',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        await uploadFile(file);
      }

      toast({
        title: 'Success',
        description: 'Media uploaded successfully',
      });

      fetchMedia(); // Refresh the media list
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload media',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      // Reset the file input
      event.target.value = '';
    }
  };

  const uploadFile = async (file: File) => {
    // 1) Get short-lived signature from backend
    const sigRes = await fetch('/api/cloudinary/sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder: 'media-grid' }),
      credentials: 'include',
    })
    if (!sigRes.ok) {
      throw new Error('Failed to get upload signature')
    }
    const sigJson = await sigRes.json()
    const { timestamp, signature, apiKey, cloudName, folder, uploadPreset } = sigJson.data

    // 2) Direct upload to Cloudinary (auto resource type for image/video)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('api_key', String(apiKey))
    formData.append('timestamp', String(timestamp))
    formData.append('signature', String(signature))
    formData.append('folder', String(folder))
    if (uploadPreset) formData.append('upload_preset', String(uploadPreset))

    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: 'POST',
      body: formData,
    })
    if (!uploadRes.ok) {
      const errText = await uploadRes.text()
      throw new Error(`Cloudinary upload failed: ${errText}`)
    }
    const uploaded = await uploadRes.json()

    const publicId: string = uploaded.public_id
    const secureUrl: string = uploaded.secure_url
    const width: number = uploaded.width || 0
    const height: number = uploaded.height || 0
    const resourceType: string = uploaded.resource_type

    // 3) Persist in our DB
    const type: 'image' | 'video' = resourceType === 'video' ? 'video' : 'image'

    const posterUrl = type === 'video'
      ? `https://res.cloudinary.com/${cloudName}/video/upload/f_jpg,w_${width || 400},h_${height || 300},c_fill,so_0/${publicId}`
      : undefined

    const saveRes = await fetch('/api/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        cloudinaryPublicId: publicId,
        url: secureUrl,
        posterUrl,
        alt: file.name.replace(/\.[^/.]+$/, ''),
        width,
        height,
      }),
      credentials: 'include',
    })

    if (!saveRes.ok) {
      const errorData = await saveRes.json().catch(() => ({}))
      throw new Error(errorData.error || 'Failed to save media')
    }

    const result = await saveRes.json()
    if (!result.success) {
      throw new Error(result.error || 'Upload failed')
    }

    return result.data
  }

  const deleteMedia = async (mediaId: string, cloudinaryPublicId: string) => {
    if (!confirm('Are you sure you want to delete this media?')) return;

    try {
      const response = await fetch(`/api/media?id=${mediaId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Media deleted successfully',
        });
        fetchMedia();
      } else {
        throw new Error('Failed to delete media');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete media',
        variant: 'destructive',
      });
    }
  };

  const filteredMedia = media.filter(item =>
    item.alt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMediaClick = (media: IMedia) => {
    if (onMediaSelect) {
      onMediaSelect(media);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-[#1B3C53] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1B3C53]">Media Library</h2>
          <p className="text-gray-600">Manage your uploaded images and videos</p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Upload Section */}
      <Card className="border-[#D2C1B6] bg-[#F9F3EF]">
        <CardHeader>
          <CardTitle className="text-[#1B3C53]">Upload Media</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="media-upload">Select files to upload</Label>
              <Input
                id="media-upload"
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="border-[#D2C1B6]"
              />
              <p className="text-sm text-gray-500 mt-1">
                Supported formats: JPEG, PNG, GIF, WebP, MP4, WebM, OGG (max 10MB)
              </p>
            </div>
            {uploading && (
              <div className="flex items-center space-x-2 text-[#456882]">
                <div className="w-4 h-4 border-2 border-[#456882] border-t-transparent rounded-full animate-spin"></div>
                <span>Uploading...</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Search media..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-[#D2C1B6]"
          />
        </div>
        <Badge variant="secondary" className="bg-blue-600 text-white">
          {filteredMedia.length} items
        </Badge>
      </div>

      {/* Media Grid/List */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'grid' | 'list')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          {filteredMedia.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No media found. Upload some files to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {filteredMedia.map((item) => (
                <Card
                  key={item._id}
                  className={`cursor-pointer transition-all hover:shadow-lg border-[#D2C1B6] bg-[#F9F3EF] ${selectedMedia?._id === item._id ? 'ring-2 ring-[#1B3C53]' : ''
                    }`}
                  onClick={() => handleMediaClick(item)}
                >
                  <CardContent className="p-3">
                    <div className="aspect-square relative mb-2">
                      {item.type === 'video' ? (
                        <video
                          src={item.url}
                          poster={item.posterUrl}
                          className="w-full h-full object-cover rounded"
                          muted
                          preload="metadata"
                        />
                      ) : (
                        <img
                          src={item.url}
                          alt={item.alt}
                          className="w-full h-full object-cover rounded"
                        />
                      )}
                      <div className="absolute top-1 right-1">
                        {item.type === 'video' ? (
                          <Video className="w-4 h-4 text-white bg-black/50 rounded p-0.5" />
                        ) : (
                          <Image className="w-4 h-4 text-white bg-black/50 rounded p-0.5" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-[#1B3C53] truncate">
                        {item.alt}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {item.type}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteMedia(item._id, item.cloudinaryPublicId);
                          }}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="list" className="space-y-2">
          {filteredMedia.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No media found. Upload some files to get started!</p>
            </div>
          ) : (
            filteredMedia.map((item) => (
              <Card
                key={item._id}
                className={`cursor-pointer transition-all hover:shadow-md border-[#D2C1B6] bg-[#F9F3EF] ${selectedMedia?._id === item._id ? 'ring-2 ring-[#1B3C53]' : ''
                  }`}
                onClick={() => handleMediaClick(item)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 relative flex-shrink-0">
                      {item.type === 'video' ? (
                        <video
                          src={item.url}
                          poster={item.posterUrl}
                          className="w-full h-full object-cover rounded"
                          muted
                          preload="metadata"
                        />
                      ) : (
                        <img
                          src={item.url}
                          alt={item.alt}
                          className="w-full h-full object-cover rounded"
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-[#1B3C53] truncate">{item.alt}</h3>
                      <p className="text-sm text-gray-600">
                        {item.width} × {item.height} • {item.type}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{item.type}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteMedia(item._id, item.cloudinaryPublicId);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
