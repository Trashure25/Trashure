import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });

    try {
      await client.connect();
      
      const result = await client.query(
        `SELECT l.*, u."firstName", u."lastName", u.username 
         FROM "Listing" l 
         JOIN "User" u ON l."userId" = u.id 
         WHERE l.id = $1`,
        [params.id]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'Listing not found' },
          { status: 404 }
        );
      }

      const listing = result.rows[0];
      listing.images = JSON.parse(listing.images || '[]');
      
      return NextResponse.json(listing);

    } finally {
      await client.end();
    }

  } catch (error) {
    console.error('Error fetching listing:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listing' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();

    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });

    try {
      await client.connect();
      
      const result = await client.query(
        `UPDATE "Listing" 
         SET title = $1, description = $2, category = $3, condition = $4, 
             price = $5, brand = $6, size = $7, images = $8, status = $9, "updatedAt" = NOW()
         WHERE id = $10
         RETURNING *`,
        [
          data.title,
          data.description,
          data.category,
          data.condition,
          data.price,
          data.brand || null,
          data.size || null,
          JSON.stringify(data.images || []),
          data.status || 'active',
          params.id,
        ]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'Listing not found' },
          { status: 404 }
        );
      }

      const listing = result.rows[0];
      listing.images = JSON.parse(listing.images || '[]');
      
      return NextResponse.json(listing);

    } finally {
      await client.end();
    }

  } catch (error) {
    console.error('Error updating listing:', error);
    return NextResponse.json(
      { error: 'Failed to update listing' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });

    try {
      await client.connect();
      
      const result = await client.query(
        'DELETE FROM "Listing" WHERE id = $1 RETURNING id',
        [params.id]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'Listing not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true });

    } finally {
      await client.end();
    }

  } catch (error) {
    console.error('Error deleting listing:', error);
    return NextResponse.json(
      { error: 'Failed to delete listing' },
      { status: 500 }
    );
  }
} 