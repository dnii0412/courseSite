'use client';

import { useState } from 'react';

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { MediaLibrary } from '@/components/admin/media-library';
import { LayoutEditor } from '@/components/admin/layout-editor';
import { ILayout } from '@/lib/models/layout';
import { IMedia } from '@/lib/models/media';
import { Plus, Save, Eye, Settings } from 'lucide-react';

export default function AdminMediaGridPage() {
  const [activeTab, setActiveTab] = useState('library');
  const [selectedMedia, setSelectedMedia] = useState<IMedia | null>(null);
  const [currentLayout, setCurrentLayout] = useState<ILayout | null>(null);
  const [layoutSlug, setLayoutSlug] = useState('home-hero');
  const [showCreateLayout, setShowCreateLayout] = useState(false);
  const [newLayoutSlug, setNewLayoutSlug] = useState('');
  const { toast } = useToast();

  const handleMediaSelect = (media: IMedia) => {
    setSelectedMedia(media);
    setActiveTab('editor');
  };

  const handleLayoutSave = (layout: ILayout) => {
    setCurrentLayout(layout);
    toast({
      title: 'Success',
      description: 'Layout saved successfully',
    });
  };

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
    setActiveTab('editor');
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-sand-50">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1B3C53] mb-2">Media Grid Management</h1>
        <p className="text-gray-600">Upload media and create responsive grid layouts</p>
      </div>

      {/* Layout Slug Selector */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-[#1B3C53]">Current Layout</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Label htmlFor="layout-slug">Layout Slug</Label>
              <Input
                id="layout-slug"
                value={layoutSlug}
                onChange={(e) => setLayoutSlug(e.target.value)}
                placeholder="e.g., home-hero, about-section"
                className="border-[#D2C1B6]"
              />
            </div>
            
            <Button
              variant="outline"
              onClick={() => setShowCreateLayout(true)}
              className="border-[#D2C1B6]"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Layout
            </Button>
            
            <Button
              variant="outline"
              onClick={() => window.open(`/media-grid/${layoutSlug}`, '_blank')}
              className="border-[#D2C1B6]"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Public
            </Button>
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

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-sand-100 rounded-xl p-1">
          <TabsTrigger value="library" className="rounded-lg data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-sand-200">Media Library</TabsTrigger>
          <TabsTrigger value="editor" className="rounded-lg data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-sand-200">Layout Editor</TabsTrigger>
          <TabsTrigger value="layouts" className="rounded-lg data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-sand-200">Layouts</TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="space-y-6">
          <MediaLibrary
            onMediaSelect={handleMediaSelect}
            selectedMedia={selectedMedia}
          />
        </TabsContent>

        <TabsContent value="editor" className="space-y-6">
          <LayoutEditor
            slug={layoutSlug}
            onSave={handleLayoutSave}
            selectedMedia={selectedMedia as any}
            onSelectedMediaConsumed={() => setSelectedMedia(null)}
          />
        </TabsContent>

        <TabsContent value="layouts" className="space-y-6">
          <LayoutsManager />
        </TabsContent>
      </Tabs>
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
