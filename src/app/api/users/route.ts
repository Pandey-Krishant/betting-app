export const dynamic = 'force-dynamic';
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

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Check admin
    const adminUser = await getAuthUser(request);
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ success: false, msg: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { username, amount, type } = body;

    if (!username || amount === undefined || !type) {
      return NextResponse.json({ success: false, msg: 'Missing required fields' }, { status: 400 });
    }

    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      console.log('User not found:', username);
      return NextResponse.json({ success: false, msg: 'User not found' }, { status: 404 });
    }

    console.log('Updating user:', user.username, 'current balance:', user.balance, 'type:', type, 'amount:', amount);

    let newBalance = user.balance;
    if (type === 'set') newBalance = amount;
    else if (type === 'add') newBalance += amount;
    else if (type === 'deduct') newBalance -= amount;

    user.balance = newBalance;
    await user.save();
    console.log('Saved new balance:', newBalance);

    return NextResponse.json({ success: true, balance: newBalance });
  } catch (error) {
    console.error('User balance update error:', error);
    return NextResponse.json({ success: false, msg: 'Server error' }, { status: 500 });
  }
}


