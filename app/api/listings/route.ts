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
      
      // Insert new listing
      const result = await client.query(
        `INSERT INTO "Listing" (id, "userId", title, description, category, condition, price, brand, size, images, status, "createdAt", "updatedAt")
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
         RETURNING *`,
        [
          data.userId,
          data.title,
          data.description,
          data.category,
          data.condition,
          data.price,
          data.brand || null,
          data.size || null,
          JSON.stringify(data.images || []),
          data.status || 'active',
        ]
      );

      const listing = result.rows[0];
      
      // Parse images back to array
      listing.images = JSON.parse(listing.images || '[]');
      
      return NextResponse.json(listing);

    } finally {
      await client.end();
    }

  } catch (error) {
    console.error('Error creating listing:', error);
    return NextResponse.json(
      { error: 'Failed to create listing' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    // Create a direct PostgreSQL connection
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });

    try {
      await client.connect();
      
      let query = `
        SELECT l.*, u."firstName", u."lastName", u.username 
        FROM "Listing" l 
        JOIN "User" u ON l."userId" = u.id 
        WHERE l.status = 'active'
      `;
      let params: string[] = [];

      if (userId) {
        query += ` AND l."userId" = $1`;
        params.push(userId);
      }

      query += ` ORDER BY l."createdAt" DESC`;

      const result = await client.query(query, params);
      
      // Parse images for each listing
      const listings = result.rows.map(row => ({
        ...row,
        images: JSON.parse(row.images || '[]')
      }));

      return NextResponse.json(listings);

    } finally {
      await client.end();
    }

  } catch (error) {
    console.error('Error fetching listings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    );
  }
} 