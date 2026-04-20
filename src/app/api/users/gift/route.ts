export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import { getAuthUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Check admin
    const adminUser = await getAuthUser(request);
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ success: false, msg: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { toUsername, amount } = body;

    if (!toUsername || !amount || amount <= 0) {
      return NextResponse.json({ success: false, msg: 'Invalid params' }, { status: 400 });
    }

    const user = await User.findOne({ username: toUsername.toLowerCase() });
    if (!user) {
      return NextResponse.json({ success: false, msg: 'User not found' }, { status: 404 });
    }

    // Add balance
    user.balance = (user.balance || 0) + amount;
    await user.save();

    return NextResponse.json({ success: true, balance: user.balance });
  } catch (error) {
    console.error('Gift error:', error);
    return NextResponse.json({ success: false, msg: 'Server error' }, { status: 500 });
  }
}