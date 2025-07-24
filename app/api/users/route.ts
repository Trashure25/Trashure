import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Create a direct PostgreSQL connection
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });

    try {
      await client.connect();

      // Check if user already exists
      const existingUserResult = await client.query(
        'SELECT id, email, username FROM "User" WHERE email = $1 OR username = $2 LIMIT 1',
        [data.email, data.username]
      );

      const existingUser = existingUserResult.rows[0];

      if (existingUser) {
        if (existingUser.email === data.email) {
          return NextResponse.json(
            { message: 'An account with this email already exists' },
            { status: 400 }
          );
        } else {
          return NextResponse.json(
            { message: 'This username is already taken' },
            { status: 400 }
          );
        }
      }

      // TODO: Add proper password hashing!
      const insertResult = await client.query(
        `INSERT INTO "User" (id, email, username, password, "firstName", "lastName", "avatarUrl", "trustScore", "createdAt", "updatedAt")
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
         RETURNING id, email, username, "firstName", "lastName", "avatarUrl", "trustScore", "createdAt", "updatedAt"`,
        [
          data.email,
          data.username,
          data.password, // Hash this in production!
          data.firstName,
          data.lastName,
          `https://api.dicebear.com/8.x/initials/svg?seed=${data.firstName} ${data.lastName}`,
          50,
        ]
      );

      const user = insertResult.rows[0];
      return NextResponse.json(user);

    } finally {
      await client.end();
    }

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
