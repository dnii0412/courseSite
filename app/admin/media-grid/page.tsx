'use client';

import { useState, useRef, useEffect } from 'react';

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic';
// Removed tabs per new design
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { MediaLibrary, MediaLibraryHandle } from '@/components/admin/media-library';
import { LayoutEditor } from '@/components/admin/layout-editor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ILayout } from '@/lib/models/layout';
import { IMedia } from '@/lib/models/media';
import { Plus, Save, Eye, Settings, Upload } from 'lucide-react';

export default function AdminMediaGridPage() {
  // Tabs removed; keep local state for selected media and layout only
  const [selectedMedia, setSelectedMedia] = useState<IMedia | null>(null);
  const [currentLayout, setCurrentLayout] = useState<ILayout | null>(null);
  const [layoutSlug, setLayoutSlug] = useState('home-hero');
  const [presets, setPresets] = useState<ILayout[]>([]);
  const [presetsLoading, setPresetsLoading] = useState(false);
  const [showCreateLayout, setShowCreateLayout] = useState(false);
  const [newLayoutSlug, setNewLayoutSlug] = useState('');
  const { toast } = useToast();
  const [uploadStamp, setUploadStamp] = useState(0)
  const libraryRef = useRef<MediaLibraryHandle | null>(null)

  const handleMediaSelect = (media: IMedia) => {
    setSelectedMedia(media);
  };

  const handleLayoutSave = (layout: ILayout) => {
    setCurrentLayout(layout);
    toast({
      title: 'Success',
      description: 'Layout saved successfully',
    });
  };

  // Load presets (saved layouts) for admin
  useEffect(() => {
    const loadPresets = async () => {
      try {
        setPresetsLoading(true);
        const res = await fetch('/api/layouts', { credentials: 'include', cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          setPresets(Array.isArray(json?.data) ? json.data as ILayout[] : []);
        }
      } catch (_) {
        // ignore
      } finally {
        setPresetsLoading(false);
      }
    };
    loadPresets();
  }, [showCreateLayout, uploadStamp]);

  const createNewLayout = () => {
    if (!newLayoutSlug.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a layout slug',
        variant: 'destructive',
      });
      return;
    }

    setLayoutSlug(newLayoutSlug.trim());
    setShowCreateLayout(false);
    setNewLayoutSlug('');
    // no tabs, directly shows both sections
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-sand-50">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1B3C53] mb-2">Media Grid Management</h1>
        <p className="text-gray-600">Upload media and create responsive grid layouts</p>
      </div>

      {/* Combined Presets + Upload toolbar */}
      <Card className="mb-4">
        <CardContent className="py-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Preset chooser */}
            <Select value={layoutSlug} onValueChange={(slug)=> setLayoutSlug(slug)}>
              <SelectTrigger className="h-9 w-52">
                <SelectValue placeholder={presetsLoading ? 'Loading presets...' : 'Choose preset'} />
              </SelectTrigger>
              <SelectContent>
                {presets.map((p)=> (
                  <SelectItem key={p._id} value={p.slug}>{p.slug}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={()=>setShowCreateLayout(true)}>
              <Plus className="w-4 h-4 mr-1"/> New
            </Button>
            <Button variant="outline" size="sm" onClick={()=>window.open(`/`, '_blank')}>
              <Eye className="w-4 h-4 mr-1"/> View
            </Button>
            
            <div className="ml-auto">
              <Button variant="outline" size="sm" asChild>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>Upload</span>
                  <input type="file" multiple accept="image/*,video/*" className="hidden" onChange={async (e)=>{
                    if (e.target.files) {
                      await libraryRef.current?.uploadFiles(e.target.files)
                      setUploadStamp(Date.now())
                    }
                  }} />
                </label>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create New Layout Modal */}
      {showCreateLayout && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-[#1B3C53]">Create New Layout</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="new-layout-slug">Layout Slug</Label>
                <Input
                  id="new-layout-slug"
                  value={newLayoutSlug}
                  onChange={(e) => setNewLayoutSlug(e.target.value)}
                  placeholder="e.g., home-hero, about-section"
                  className="border-[#D2C1B6]"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Use lowercase letters, numbers, and hyphens only
                </p>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  onClick={createNewLayout}
                  className="bg-[#1B3C53] hover:bg-[#456882]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Layout
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setShowCreateLayout(false)}
                  className="border-[#D2C1B6]"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compact two-column layout without tabs */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <MediaLibrary ref={libraryRef} onMediaSelect={handleMediaSelect} selectedMedia={selectedMedia} compact hideUpload refreshSignal={uploadStamp} />
        </div>
        <div className="space-y-2">
          <LayoutEditor
            slug={layoutSlug}
            onSave={handleLayoutSave}
            selectedMedia={selectedMedia as any}
            onSelectedMediaConsumed={() => setSelectedMedia(null)}
            compact
          />
          <p className="text-xs text-ink-500">Tip: Click a media item to add it to the grid; then drag/resize.</p>
        </div>
      </div>
    </div>
  );
}

// Layouts Manager Component
function LayoutsManager() {
  const [layouts, setLayouts] = useState<ILayout[]>([]);
  const [loading, setLoading] = useState(true);

  // This would fetch layouts from the API
  // For now, showing a placeholder
  return (
    <Card className="border-[#D2C1B6] bg-[#F9F3EF]">
      <CardHeader>
        <CardTitle className="text-[#1B3C53]">Layouts Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-500">
          <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Layouts management coming soon...</p>
          <p className="text-sm">View, duplicate, and manage all your layouts</p>
        </div>
      </CardContent>
    </Card>
  );
}
