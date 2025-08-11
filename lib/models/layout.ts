import mongoose from 'mongoose';

export interface ILayoutItem {
  id: string;
  mediaId: mongoose.Types.ObjectId;
  startCol: 1 | 2 | 3 | 4 | 5 | 6;
  startRow: 1 | 2 | 3 | 4;
  colSpan: 1 | 2 | 3 | 4 | 5 | 6;
  rowSpan: 1 | 2 | 3 | 4;
  linkHref?: string;
  priority?: number;
  ariaLabel?: string;
}

export interface ILayout {
  _id: string;
  slug: string;
  items: ILayoutItem[];
  breakpoints?: {
    sm?: ILayoutItem[];
    md?: ILayoutItem[];
  };
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const layoutItemSchema = new mongoose.Schema<ILayoutItem>({
  id: {
    type: String,
    required: true
  },
  mediaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media',
    required: true
  },
  startCol: {
    type: Number,
    required: true,
    min: 1,
    max: 6
  },
  startRow: {
    type: Number,
    required: true,
    min: 1,
    max: 4
  },
  colSpan: {
    type: Number,
    required: true,
    min: 1,
    max: 6
  },
  rowSpan: {
    type: Number,
    required: true,
    min: 1,
    max: 4
  },
  linkHref: {
    type: String,
    required: false
  },
  priority: {
    type: Number,
    required: false,
    default: 0
  },
  ariaLabel: {
    type: String,
    required: false
  }
});

const layoutSchema = new mongoose.Schema<ILayout>({
  slug: {
    type: String,
    required: true,
    unique: true
  },
  items: [layoutItemSchema],
  breakpoints: {
    sm: [layoutItemSchema],
    md: [layoutItemSchema]
  },
  published: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  timestamps: true
});

export const Layout = mongoose.models.Layout || mongoose.model<ILayout>('Layout', layoutSchema);
