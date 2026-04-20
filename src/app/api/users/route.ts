import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Check admin
    const adminUser = await getAuthUser(request);
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ success: false, msg: 'Admin access required' }, { status: 403 });
    }

    const docs = await User.find({}, '-password').sort({ createdAt: -1 }).lean();

    const users = docs.map((u) => ({
      id: String(u._id),
      username: u.username,
      mobile: u.mobile,
      role: u.role,
      balance: u.balance ?? 0,
      exposure: u.exposure ?? 0,
      isUnlimited: Boolean(u.isUnlimited),
      status: u.status ?? 'active',
      createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : undefined,
    }));

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error('Users fetch error:', error);
    return NextResponse.json({ success: false, msg: 'Server error' }, { status: 500 });
  }
}

