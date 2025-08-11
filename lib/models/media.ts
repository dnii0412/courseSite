import mongoose from 'mongoose';

export interface IMedia {
  _id: string;
  type: 'image' | 'video';
  cloudinaryPublicId: string;
  url: string;
  posterUrl?: string;
  alt: string;
  width: number;
  height: number;
  createdAt: Date;
  updatedAt: Date;
}

const mediaSchema = new mongoose.Schema<IMedia>({
  type: {
    type: String,
    required: true,
    enum: ['image', 'video']
  },
  cloudinaryPublicId: {
    type: String,
    required: true,
    unique: true
  },
  url: {
    type: String,
    required: true
  },
  posterUrl: {
    type: String,
    required: false
  },
  alt: {
    type: String,
    required: true
  },
  width: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

export const Media = mongoose.models.Media || mongoose.model<IMedia>('Media', mediaSchema);
