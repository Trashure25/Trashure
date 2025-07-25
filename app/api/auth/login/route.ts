import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }
    const result = await client.query(
      'SELECT id, email, username, password, "firstName", "lastName", "avatarUrl", "trustScore", "createdAt", "updatedAt" FROM "User" WHERE email = $1 LIMIT 1',
      [email]
    );
    const user = result.rows[0];
    if (!user || user.password !== password) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }
    // Remove password from user object
    delete user.password;
    // Create JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '30d' });
    // Set cookie
    const response = NextResponse.json(user);
    const secureFlag = process.env.NODE_ENV === 'production';
    response.cookies.set('trashure_jwt', token, {
      httpOnly: true,
      secure: secureFlag,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });
    console.log('[LOGIN DEBUG] NODE_ENV:', process.env.NODE_ENV);
    console.log('[LOGIN DEBUG] Setting cookie trashure_jwt:', token.slice(0, 10) + '...');
    console.log('[LOGIN DEBUG] Cookie options:', {
      httpOnly: true,
      secure: secureFlag,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30
    });
    console.log('[LOGIN DEBUG] Response cookies:', response.cookies);
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  } finally {
    await client.end();
  }
} 