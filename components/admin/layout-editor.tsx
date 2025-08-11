'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Save,
  Eye,
  Grid3X3,
  Move,
  GripHorizontal as ResizeHorizontal,
  Settings,
  Plus,
  Trash2,
  Copy,
  RotateCcw
} from 'lucide-react';
import { ILayout, ILayoutItem } from '@/lib/models/layout';
import { IMedia } from '@/lib/models/media';

interface LayoutEditorProps {
  slug: string;
  onSave?: (layout: ILayout) => void;
  selectedMedia?: IMedia | null;
  onSelectedMediaConsumed?: () => void;
}

interface GridCell {
  col: number;
  row: number;
  occupied: boolean;
  itemId?: string;
}

export const LayoutEditor = ({ slug, onSave, selectedMedia, onSelectedMediaConsumed }: LayoutEditorProps) => {
  const [layout, setLayout] = useState<ILayout | null>(null);
  const [items, setItems] = useState<ILayoutItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ILayoutItem | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [gridCells, setGridCells] = useState<GridCell[][]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [mediaList, setMediaList] = useState<IMedia[]>([]);
  const [mediaMap, setMediaMap] = useState<Map<string, IMedia>>(new Map());
  const { toast } = useToast();

  // Initialize 6x4 grid
  useEffect(() => {
    const cells: GridCell[][] = [];
    for (let row = 1; row <= 4; row++) {
      cells[row] = [];
      for (let col = 1; col <= 6; col++) {
        cells[row][col] = { col, row, occupied: false };
      }
    }
    setGridCells(cells);
  }, []);

  useEffect(() => {
    fetchLayout();
  }, [slug]);

  // Load media library to render item previews
  useEffect(() => {
    const loadMedia = async () => {
      try {
        const res = await fetch('/api/media', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          const list = (json.data || []) as IMedia[];
          setMediaList(list);
          setMediaMap(new Map(list.map((m) => [String(m._id), m])));
        }
      } catch (_) {
        // ignore
      }
    };
    loadMedia();
  }, []);

  // Auto-add selected media when provided from the media library
  useEffect(() => {
    if (selectedMedia?._id) {
      addItem(selectedMedia);
      onSelectedMediaConsumed?.();
      toast({ title: 'Added to layout', description: selectedMedia.alt });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMedia?._id]);

  const fetchLayout = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/layouts?slug=${slug}&admin=true`);
      if (response.ok) {
        const data = await response.json();
        setLayout(data.data);
        setItems(data.data.items || []);
        updateGridOccupancy(data.data.items || []);
      } else {
        // Create new layout if it doesn't exist
        const newLayout: ILayout = {
          _id: '',
          slug,
          items: [],
          published: false,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        setLayout(newLayout);
        setItems([]);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load layout',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateGridOccupancy = (currentItems: ILayoutItem[]) => {
    const newGridCells = [...gridCells];

    // Reset all cells
    for (let row = 1; row <= 4; row++) {
      for (let col = 1; col <= 6; col++) {
        newGridCells[row][col] = { col, row, occupied: false };
      }
    }

    // Mark occupied cells
    currentItems.forEach(item => {
      for (let r = item.startRow; r < item.startRow + item.rowSpan; r++) {
        for (let c = item.startCol; c < item.startCol + item.colSpan; c++) {
          if (newGridCells[r] && newGridCells[r][c]) {
            newGridCells[r][c].occupied = true;
            newGridCells[r][c].itemId = item.id;
          }
        }
      }
    });

    setGridCells(newGridCells);
  };

  const addItem = (media: IMedia) => {
    const newItem: ILayoutItem = {
      id: `item_${Date.now()}`,
      mediaId: media._id as any,
      startCol: 1,
      startRow: 1,
      colSpan: 1,
      rowSpan: 1,
      ariaLabel: media.alt
    };

    // Find first available position
    const position = findAvailablePosition(1, 1);
    if (position) {
      newItem.startCol = position.col as any;
      newItem.startRow = position.row as any;
    }

    const newItems = [...items, newItem];
    setItems(newItems);
    updateGridOccupancy(newItems);
    setSelectedItem(newItem);
  };

  const findAvailablePosition = (colSpan: number, rowSpan: number) => {
    for (let row = 1; row <= 4 - rowSpan + 1; row++) {
      for (let col = 1; col <= 6 - colSpan + 1; col++) {
        let available = true;

        // Check if the area is available
        for (let r = row; r < row + rowSpan; r++) {
          for (let c = col; c < col + colSpan; c++) {
            if (gridCells[r] && gridCells[r][c] && gridCells[r][c].occupied) {
              available = false;
              break;
            }
          }
          if (!available) break;
        }

        if (available) {
          return { col, row };
        }
      }
    }
    return null;
  };

  const updateItem = (itemId: string, updates: Partial<ILayoutItem>) => {
    const newItems = items.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    );
    setItems(newItems);
    updateGridOccupancy(newItems);

    if (selectedItem?.id === itemId) {
      setSelectedItem({ ...selectedItem, ...updates });
    }
  };

  const deleteItem = (itemId: string) => {
    const newItems = items.filter(item => item.id !== itemId);
    setItems(newItems);
    updateGridOccupancy(newItems);

    if (selectedItem?.id === itemId) {
      setSelectedItem(null);
    }
  };

  const duplicateItem = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    const newItem: ILayoutItem = {
      ...item,
      id: `item_${Date.now()}`,
      startCol: Math.min(item.startCol + 1, 6) as any,
      startRow: Math.min(item.startRow + 1, 4) as any
    };

    // Adjust position if it would overflow
    if (newItem.startCol + newItem.colSpan > 6) {
      newItem.startCol = 1;
    }
    if (newItem.startRow + newItem.rowSpan > 4) {
      newItem.startRow = 1;
    }

    const newItems = [...items, newItem];
    setItems(newItems);
    updateGridOccupancy(newItems);
  };

  const saveLayout = async () => {
    try {
      setSaving(true);

      const layoutData = {
        slug,
        items,
        published: layout?.published || false
      };

      let response;
      if (layout?._id) {
        response = await fetch('/api/layouts', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: layout._id, ...layoutData }),
        });
      } else {
        response = await fetch('/api/layouts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(layoutData),
        });
      }

      if (response.ok) {
        const savedLayout = await response.json();
        setLayout(savedLayout.data);
        toast({
          title: 'Success',
          description: 'Layout saved successfully',
        });

        if (onSave) {
          onSave(savedLayout.data);
        }
      } else {
        throw new Error('Failed to save layout');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save layout',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async () => {
    if (!layout?._id) return;

    try {
      const response = await fetch('/api/layouts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: layout._id,
          published: !layout.published
        }),
      });

      if (response.ok) {
        const updatedLayout = await response.json();
        setLayout(updatedLayout.data);
        toast({
          title: 'Success',
          description: `Layout ${updatedLayout.data.published ? 'published' : 'unpublished'}`,
        });
      } else {
        throw new Error('Failed to update layout');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update layout',
        variant: 'destructive',
      });
    }
  };

  const handleItemDrop = (col: number, row: number, itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    // Check if the new position is valid
    if (col + item.colSpan - 1 > 6 || row + item.rowSpan - 1 > 4) {
      toast({
        title: 'Invalid Position',
        description: 'Item would overflow the grid',
        variant: 'destructive',
      });
      return;
    }

    // Check for conflicts
    let hasConflict = false;
    for (let r = row; r < row + item.rowSpan; r++) {
      for (let c = col; c < col + item.colSpan; c++) {
        if (gridCells[r] && gridCells[r][c] &&
          gridCells[r][c].occupied &&
          gridCells[r][c].itemId !== itemId) {
          hasConflict = true;
          break;
        }
      }
      if (hasConflict) break;
    }

    if (hasConflict) {
      toast({
        title: 'Position Occupied',
        description: 'This area is already occupied by another item',
        variant: 'destructive',
      });
      return;
    }

    updateItem(itemId, { startCol: col as 1|2|3|4|5|6, startRow: row as 1|2|3|4 });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-[#1B3C53] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1B3C53]">Layout Editor</h2>
          <p className="text-gray-600">Edit grid layout for: {slug}</p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowGrid(!showGrid)}
          >
            <Grid3X3 className="w-4 h-4 mr-2" />
            {showGrid ? 'Hide' : 'Show'} Grid
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => selectedMedia && addItem(selectedMedia)}
            disabled={!selectedMedia}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Selected Media
          </Button>

          <Button
            onClick={saveLayout}
            disabled={saving}
            className="bg-[#1B3C53] hover:bg-[#456882]"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Grid Canvas */}
      <Card className="border-[#D2C1B6] bg-[#F9F3EF]">
        <CardHeader>
          <CardTitle className="text-[#1B3C53]">Grid Canvas (6×4)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Grid Overlay */}
            {showGrid && (
              <div className="absolute inset-0 pointer-events-none">
                <div
                  className="grid gap-0.5 h-[90vh]"
                  style={{
                    gridTemplateColumns: 'repeat(6, 1fr)',
                    gridTemplateRows: 'repeat(4, 1fr)',
                  }}
                >
                  {Array.from({ length: 24 }, (_, i) => {
                    const row = Math.floor(i / 6) + 1;
                    const col = (i % 6) + 1;
                    return (
                      <div
                        key={i}
                        className="border border-gray-300/30 flex items-center justify-center text-xs text-gray-400"
                      >
                        {col},{row}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Grid Items */}
            <div
              className="grid gap-3 h-[90vh] relative"
              style={{
                gridTemplateColumns: 'repeat(6, 1fr)',
                gridTemplateRows: 'repeat(4, 1fr)',
              }}
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDrop={(e) => {
                e.preventDefault();
                const itemId = e.dataTransfer.getData('text/plain');
                if (!itemId) return;
                const container = e.currentTarget as HTMLDivElement;
                const rect = container.getBoundingClientRect();
                const relX = e.clientX - rect.left;
                const relY = e.clientY - rect.top;
                const col = Math.max(1, Math.min(6, Math.floor((relX / rect.width) * 6) + 1));
                const row = Math.max(1, Math.min(4, Math.floor((relY / rect.height) * 4) + 1));

                const item = items.find(i => i.id === itemId);
                if (!item) return;
                // Bounds check
                if (col + item.colSpan - 1 > 6 || row + item.rowSpan - 1 > 4) return;

                // Conflict check
                let conflict = false;
                for (let r = row; r < row + item.rowSpan; r++) {
                  for (let c = col; c < col + item.colSpan; c++) {
                    const cell = gridCells[r]?.[c];
                    if (cell?.occupied && cell.itemId !== itemId) {
                      conflict = true; break;
                    }
                  }
                  if (conflict) break;
                }
                if (!conflict) {
    updateItem(itemId, { startCol: col as 1|2|3|4|5|6, startRow: row as 1|2|3|4 });
                }
              }}
            >
              {items.map((item) => (
                <GridItem
                  key={item.id}
                  item={item}
                  isSelected={selectedItem?.id === item.id}
                  onSelect={() => setSelectedItem(item)}
                  onUpdate={updateItem}
                  onDelete={deleteItem}
                  onDuplicate={duplicateItem}
                  media={mediaMap.get(String(item.mediaId))}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Item Properties Panel */}
      {selectedItem && (
        <Card className="border-[#D2C1B6] bg-[#F9F3EF]">
          <CardHeader>
            <CardTitle className="text-[#1B3C53]">Item Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startCol">Start Column</Label>
                <Input
                  id="startCol"
                  type="number"
                  min="1"
                  max="6"
                  value={selectedItem.startCol}
                  onChange={(e) => updateItem(selectedItem.id, {
                    startCol: parseInt(e.target.value) as any
                  })}
                  className="border-[#D2C1B6]"
                />
              </div>

              <div>
                <Label htmlFor="startRow">Start Row</Label>
                <Input
                  id="startRow"
                  type="number"
                  min="1"
                  max="4"
                  value={selectedItem.startRow}
                  onChange={(e) => updateItem(selectedItem.id, {
                    startRow: parseInt(e.target.value) as any
                  })}
                  className="border-[#D2C1B6]"
                />
              </div>

              <div>
                <Label htmlFor="colSpan">Column Span</Label>
                <Input
                  id="colSpan"
                  type="number"
                  min="1"
                  max="6"
                  value={selectedItem.colSpan}
                  onChange={(e) => updateItem(selectedItem.id, {
                    colSpan: parseInt(e.target.value) as any
                  })}
                  className="border-[#D2C1B6]"
                />
              </div>

              <div>
                <Label htmlFor="rowSpan">Row Span</Label>
                <Input
                  id="rowSpan"
                  type="number"
                  min="1"
                  max="4"
                  value={selectedItem.rowSpan}
                  onChange={(e) => updateItem(selectedItem.id, {
                    rowSpan: parseInt(e.target.value) as any
                  })}
                  className="border-[#D2C1B6]"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="linkHref">Link URL (optional)</Label>
                <Input
                  id="linkHref"
                  type="url"
                  value={selectedItem.linkHref || ''}
                  onChange={(e) => updateItem(selectedItem.id, {
                    linkHref: e.target.value || undefined
                  })}
                  placeholder="https://example.com"
                  className="border-[#D2C1B6]"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="ariaLabel">ARIA Label (optional)</Label>
                <Input
                  id="ariaLabel"
                  type="text"
                  value={selectedItem.ariaLabel || ''}
                  onChange={(e) => updateItem(selectedItem.id, {
                    ariaLabel: e.target.value || undefined
                  })}
                  placeholder="Descriptive text for screen readers"
                  className="border-[#D2C1B6]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#D2C1B6]">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => duplicateItem(selectedItem.id)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteItem(selectedItem.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedItem(null)}
              >
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Layout Controls */}
      <Card className="border-[#D2C1B6] bg-[#F9F3EF]">
        <CardHeader>
          <CardTitle className="text-[#1B3C53]">Layout Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={layout?.published || false}
                  onCheckedChange={togglePublished}
                />
                <Label htmlFor="published">Published</Label>
              </div>

              <Badge variant={layout?.published ? 'default' : 'secondary'}>
                {layout?.published ? 'Live' : 'Draft'}
              </Badge>
            </div>

            <div className="text-sm text-gray-600">
              {items.length} items • Last saved: {layout?.updatedAt ?
                new Date(layout.updatedAt).toLocaleString() : 'Never'
              }
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Grid Item Component
interface GridItemProps {
  item: ILayoutItem;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (itemId: string, updates: Partial<ILayoutItem>) => void;
  onDelete: (itemId: string) => void;
  onDuplicate: (itemId: string) => void;
  media?: IMedia;
}

const GridItem = ({
  item,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  media,
}: GridItemProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    onSelect();
  };

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', item.id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleResize = (direction: 'horizontal' | 'vertical', delta: number) => {
    if (direction === 'horizontal') {
      const newColSpan = Math.max(1, Math.min(6, item.colSpan + delta));
      if (item.startCol + newColSpan - 1 <= 6) {
        onUpdate(item.id, { colSpan: newColSpan as any });
      }
    } else {
      const newRowSpan = Math.max(1, Math.min(4, item.rowSpan + delta));
      if (item.startRow + newRowSpan - 1 <= 4) {
        onUpdate(item.id, { rowSpan: newRowSpan as any });
      }
    }
  };

  return (
    <div
      className={`relative cursor-move transition-all ${isSelected ? 'ring-2 ring-[#1B3C53]' : 'ring-1 ring-gray-300'
        } ${isDragging ? 'opacity-50' : ''}`}
      style={{
        gridColumn: `${item.startCol} / span ${item.colSpan}`,
        gridRow: `${item.startRow} / span ${item.rowSpan}`,
      }}
      draggable
      onMouseDown={handleMouseDown}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* Item Content */}
      <div className="w-full h-full rounded overflow-hidden">
        {media ? (
          media.type === 'image' ? (
            <img src={media.url} alt={media.alt} className="w-full h-full object-cover" />
          ) : (
            <video src={media.url} poster={media.posterUrl} className="w-full h-full object-cover" autoPlay loop muted playsInline />
          )
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#456882] to-[#1B3C53] rounded flex items-center justify-center text-white text-sm font-medium">
            <div className="text-center">
              <div className="text-lg mb-1">📷</div>
              <div className="text-xs">{item.colSpan}×{item.rowSpan}</div>
            </div>
          </div>
        )}
      </div>

      {/* Selection Overlay */}
      {isSelected && (
        <div className="absolute inset-0 border-2 border-[#1B3C53] border-dashed pointer-events-none" />
      )}

      {/* Resize Handles */}
      {isSelected && (
        <>
          <div
            className="absolute right-0 top-1/2 w-2 h-2 bg-[#1B3C53] rounded cursor-ew-resize transform -translate-y-1/2"
            onMouseDown={(e) => {
              e.stopPropagation();
              setIsResizing(true);
              const startX = e.clientX;
              const startColSpan = item.colSpan;

              const handleMouseMove = (e: MouseEvent) => {
                const delta = Math.round((e.clientX - startX) / 50);
                handleResize('horizontal', delta);
              };

              const handleMouseUp = () => {
                setIsResizing(false);
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };

              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          />

          <div
            className="absolute bottom-0 left-1/2 w-2 h-2 bg-[#1B3C53] rounded cursor-ns-resize transform -translate-x-1/2"
            onMouseDown={(e) => {
              e.stopPropagation();
              setIsResizing(true);
              const startY = e.clientY;
              const startRowSpan = item.rowSpan;

              const handleMouseMove = (e: MouseEvent) => {
                const delta = Math.round((e.clientY - startY) / 50);
                handleResize('vertical', delta);
              };

              const handleMouseUp = () => {
                setIsResizing(false);
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };

              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          />
        </>
      )}
    </div>
  );
};
