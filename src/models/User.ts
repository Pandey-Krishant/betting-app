import { Schema, model, models, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  password: string;
  mobile?: string;
  role: 'user' | 'admin';
  balance: number;
  exposure: number;
  isUnlimited: boolean;
  status: 'active' | 'banned';
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  balance: { type: Number, default: 0 },
  exposure: { type: Number, default: 0 },
  isUnlimited: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'banned'], default: 'active' },
}, { timestamps: true });

userSchema.pre('save', async function(this: any) {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password.toString(), salt);
});

userSchema.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = models.User || model<IUser>('User', userSchema);
