import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    console.log('Attempting login for email:', email);

    // Create a direct PostgreSQL connection
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });

    try {
      await client.connect();
      
      // Use direct SQL query to bypass Prisma issues
      const result = await client.query(
        'SELECT id, email, username, password, "firstName", "lastName", "avatarUrl", "trustScore", "createdAt", "updatedAt" FROM "User" WHERE email = $1 LIMIT 1',
        [email]
      );

      const user = result.rows[0];
      console.log('User found:', user ? 'Yes' : 'No');

      if (!user) {
        return NextResponse.json(
          { message: 'Invalid email or password' },
          { status: 401 }
        );
      }

      // TODO: Add proper password hashing and comparison
      // For now, we'll do a simple comparison (NOT secure for production!)
      if (user.password !== password) {
        console.log('Password mismatch for user:', email);
        return NextResponse.json(
          { message: 'Invalid email or password' },
          { status: 401 }
        );
      }

      console.log('Login successful for user:', email);

      // Return user data (without password)
      const { password: _, ...userWithoutPassword } = user;
      return NextResponse.json(userWithoutPassword);

    } finally {
      await client.end();
    }

  } catch (error) {
    console.error('Login error:', error);
    
    // More specific error handling
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 