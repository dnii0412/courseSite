# Media Grid System

A responsive 6×4 media grid system with admin editor for Next.js applications. This system allows admins to create, edit, and publish media layouts that are displayed on the public site.

## Features

- **Public 6×4 Media Grid**: Responsive grid that fills 90vh on desktop
- **Admin Editor**: Drag-and-drop interface for creating layouts
- **Media Management**: Upload and manage images/videos with Cloudinary
- **Responsive Breakpoints**: Automatic responsive behavior with custom breakpoint support
- **Layout Publishing**: Draft/publish workflow for controlling public visibility
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

## Architecture

### Data Models

#### Media
```typescript
{
  _id: string;
  type: "image" | "video";
  cloudinaryPublicId: string;
  url: string;
  posterUrl?: string; // For videos
  alt: string;
  width: number;
  height: number;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Layout
```typescript
{
  _id: string;
  slug: string; // Unique identifier (e.g., "home-hero")
  items: LayoutItem[];
  breakpoints?: {
    sm?: LayoutItem[]; // Mobile layout
    md?: LayoutItem[]; // Tablet layout
  };
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### LayoutItem
```typescript
{
  id: string;
  mediaId: ObjectId;
  startCol: 1|2|3|4|5|6;
  startRow: 1|2|3|4;
  colSpan: 1..6;
  rowSpan: 1..4;
  linkHref?: string;
  priority?: number;
  ariaLabel?: string;
}
```

### File Structure

```
components/
├── media/
│   └── media-grid.tsx          # Public grid component
└── admin/
    ├── media-library.tsx        # Media upload/management
    └── layout-editor.tsx        # Grid layout editor

app/
├── api/
│   ├── media/route.ts           # Media CRUD API
│   └── layouts/route.ts         # Layout CRUD API
├── admin/
│   └── media-grid/page.tsx      # Admin interface
└── media-grid/
    └── [slug]/page.tsx          # Public grid pages

lib/
├── models/
│   ├── media.ts                 # Media Mongoose model
│   └── layout.ts                # Layout Mongoose model
└── utils/
    └── cloudinary.ts            # Cloudinary utilities

scripts/
└── seed-media-grid.js           # Database seeding script
```

## Setup

### 1. Environment Variables

Add these to your `.env.local`:

```bash
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### 2. Install Dependencies

```bash
npm install cloudinary
```

### 3. Seed Database

```bash
node scripts/seed-media-grid.js
```

This creates sample media and a "home-hero" layout for testing.

## Usage

### Public Display

The media grid automatically renders on the homepage and can be accessed at `/media-grid/[slug]`.

```tsx
import { MediaGrid } from '@/components/media/media-grid';

// Render a specific layout
<MediaGrid slug="home-hero" />
```

### Admin Interface

Access the admin interface at `/admin/media-grid` (requires ADMIN role).

#### Media Library Tab
- Upload images/videos
- Search and filter media
- Delete media items
- Grid and list view modes

#### Layout Editor Tab
- 6×4 grid canvas with visual overlay
- Drag and drop media placement
- Resize handles for adjusting spans
- Properties panel for fine-tuning
- Publish/unpublish controls

#### Layouts Tab
- Manage multiple layouts
- Duplicate existing layouts
- Version control (coming soon)

### Creating a New Layout

1. Go to `/admin/media-grid`
2. Enter a new slug (e.g., "about-section")
3. Click "Create Layout"
4. Upload media in the Media Library tab
5. Switch to Layout Editor tab
6. Drag media from library to grid
7. Adjust positioning and sizing
8. Save and publish

### Responsive Behavior

The system automatically handles responsive layouts:

- **Desktop (lg+)**: 6×4 grid @ 90vh
- **Tablet (md)**: 4×6 auto-height
- **Mobile (sm)**: 2×12 auto-height

Custom breakpoints can be defined in the layout data for precise control.

## API Endpoints

### Media API (`/api/media`)

- `GET`: List all media (admin only)
- `POST`: Upload new media (admin only)
- `DELETE`: Delete media (admin only)

### Layouts API (`/api/layouts`)

- `GET`: Get layout by slug or list all (admin only)
- `POST`: Create new layout (admin only)
- `PATCH`: Update layout (admin only)

## Customization

### Grid Dimensions

To change the grid size, modify these files:

1. `components/media/media-grid.tsx` - Update grid template
2. `components/admin/layout-editor.tsx` - Update canvas dimensions
3. `lib/models/layout.ts` - Update validation rules

### Styling

The system uses your project's color palette:

- Primary: `#1B3C53` (headers, buttons)
- Secondary: `#456882` (secondary elements)
- Accent: `#D2C1B6` (borders, highlights)
- Background: `#F9F3EF` (page backgrounds)

### Cloudinary Transformations

Customize image/video transformations in `lib/utils/cloudinary.ts`:

```typescript
// Example: Add custom transformations
getCustomUrl: (publicId: string, options: any) => {
  const baseUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}`;
  return `${baseUrl}/image/upload/f_auto,q_auto,w_${options.width},h_${options.height},c_fill,g_auto/${publicId}`;
}
```

## Best Practices

### Media Optimization
- Use appropriate image formats (WebP for images, MP4 for videos)
- Set reasonable dimensions for your use case
- Include descriptive alt text for accessibility

### Layout Design
- Consider mobile-first responsive design
- Use consistent spacing and proportions
- Test layouts across different screen sizes

### Performance
- Images are lazy-loaded by default
- Videos use poster frames for faster loading
- Cloudinary transformations optimize delivery

## Troubleshooting

### Common Issues

1. **Grid not displaying**: Check if layout is published and has items
2. **Media not loading**: Verify Cloudinary credentials and media URLs
3. **Admin access denied**: Ensure user has ADMIN role in NextAuth
4. **Layout not saving**: Check MongoDB connection and validation rules

### Debug Mode

Enable debug logging by setting:

```bash
DEBUG=media-grid:*
```

### Database Queries

Check MongoDB directly for data issues:

```javascript
// Check layouts
db.layouts.find({ slug: "home-hero" })

// Check media
db.media.find({})

// Check for orphaned media references
db.layouts.aggregate([
  { $unwind: "$items" },
  { $lookup: { from: "media", localField: "items.mediaId", foreignField: "_id", as: "media" } },
  { $match: { media: { $size: 0 } } }
])
```

## Future Enhancements

- [ ] Drag and drop reordering
- [ ] Advanced media filters
- [ ] Layout templates
- [ ] A/B testing support
- [ ] Analytics integration
- [ ] Bulk operations
- [ ] Media versioning
- [ ] Advanced responsive controls

## Support

For issues or questions:

1. Check the troubleshooting section
2. Review the API responses in browser dev tools
3. Check MongoDB logs for database errors
4. Verify environment variables are set correctly

## License

This system is part of your course site project and follows the same licensing terms.
