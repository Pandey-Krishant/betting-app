import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import { generateToken } from '@/lib/auth';
import { ensureDemoUser, ensureDevAdminUser } from '@/lib/seedDevUsers';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ success: false, msg: "Method not allowed - Use POST" }, { status: 405 });
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    await ensureDemoUser();
    await ensureDevAdminUser();

    const body = await request.json();
    const username =
      typeof body.username === 'string' ? body.username.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!username || !password) {
      return NextResponse.json({
        success: false,
        msg: 'Username and password required',
      });
    }

    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return NextResponse.json({ success: false, msg: 'Invalid credentials' });
    }
    
    if (user.status === 'banned') {
      return NextResponse.json({ success: false, msg: 'Account suspended' });
    }

    const token = generateToken({
      id: user._id.toString(),
      username: user.username,
      role: user.role
    });

    const response = NextResponse.json({
      success: true,
      token,
      data: {
        username: user.username,
        role: user.role,
        balance: user.balance,
        exposure: user.exposure,
        isUnlimited: user.isUnlimited,
        mobile: user.mobile,
      },
    });

    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, msg: 'Server error' }, { status: 500 });
  }
}
