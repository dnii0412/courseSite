import mongoose from 'mongoose';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string; // Optional for OAuth users
  role: 'USER' | 'ADMIN';
  enrolledCourses?: mongoose.Types.ObjectId[];
  oauthProvider?: string; // Google, Facebook, etc.
  oauthId?: string; // OAuth provider's user ID
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: false // Optional for OAuth users
  },
  oauthProvider: {
    type: String,
    required: false
  },
  oauthId: {
    type: String,
    required: false
  },
  role: {
    type: String,
    enum: ['USER', 'ADMIN'],
    default: 'USER'
  },
  enrolledCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    }
  ]
}, {
  timestamps: true
});

// Add validation to ensure either password or OAuth provider is present
userSchema.pre('save', function(next) {
  if (!this.password && !this.oauthProvider) {
    return next(new Error('Either password or OAuth provider is required'));
  }
  next();
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
