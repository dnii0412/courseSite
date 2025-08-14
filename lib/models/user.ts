import mongoose from 'mongoose';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: string; // Phone number
  password?: string; // Optional for OAuth users
  role: 'USER' | 'ADMIN';
  enrolledCourses?: mongoose.Types.ObjectId[];
  oauthProvider?: string; // Google, Facebook, etc.
  oauthId?: string; // OAuth provider's user ID
  image?: string; // Profile image from OAuth
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
  phone: {
    type: String,
    required: false
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
  image: {
    type: String,
    required: false
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
userSchema.pre('save', function (next) {
  // Skip validation for OAuth users
  if (this.oauthProvider && this.oauthId) {
    return next();
  }

  // For non-OAuth users, password is required
  if (!this.password) {
    return next(new Error('Password is required for non-OAuth users'));
  }

  next();
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
