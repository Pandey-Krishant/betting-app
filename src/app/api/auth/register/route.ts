export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const usernameRaw = typeof body.username === 'string' ? body.username.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    const mobile =
      typeof body.mobile === 'string' ? body.mobile.trim() : undefined;

    if (!usernameRaw || !password) {
      return NextResponse.json({ success: false, msg: 'Username and password required' });
    }

    const username = usernameRaw.toLowerCase();

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json({ success: false, msg: 'Username already taken' });
    }

    const newUser = new User({
      username,
      password,
      mobile,
    });

    await newUser.save();

    return NextResponse.json({ 
      success: true, 
      msg: 'Registration successful',
      data: { username: newUser.username, role: newUser.role }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ success: false, msg: 'Server error' }, { status: 500 });
  }
}


