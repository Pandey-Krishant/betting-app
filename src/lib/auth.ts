import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { User } from '@/models/User';
import dbConnect from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this';

export interface AuthUser {
  id: string;
  username: string;
  role: 'user' | 'admin';
}

export function generateToken(user: AuthUser) {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
}

export async function getAuthUser(req: NextRequest): Promise<AuthUser | null> {
  try {
    const authHeader = req.headers.get('authorization');
    const bearer =
      authHeader?.replace(/^Bearer\s+/i, '').trim() ?? '';
    const token =
      bearer ||
      req.cookies.get('authToken')?.value ||
      '';

    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & {
      id?: string;
    };
    const userId = decoded.id ?? decoded.sub;
    if (!userId || typeof userId !== 'string') return null;

    await dbConnect();
    const user = await User.findById(userId).select('username role');
    
    if (!user) return null;

    return {
      id: user._id.toString(),
      username: user.username,
      role: user.role as 'user' | 'admin'
    };
  } catch {
    return null;
  }
}

