import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Basic search parameters
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;
    
    // Advanced filter parameters
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const designer = searchParams.get('designer');
    const condition = searchParams.get('condition');
    const size = searchParams.get('size');
    const style = searchParams.get('style');
    const color = searchParams.get('color');
    const material = searchParams.get('material');
    const season = searchParams.get('season');
    const era = searchParams.get('era');
    const releaseYear = searchParams.get('releaseYear');
    const collaboration = searchParams.get('collaboration');
    const exclusivity = searchParams.get('exclusivity');
    const department = searchParams.get('department');
    const location = searchParams.get('location');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') || 'newest';
    
    // Build where clause
    const where: any = {
      status: 'active'
    };
    
    // Text search across multiple fields
    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { brand: { contains: query, mode: 'insensitive' } },
        { designer: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } }
      ];
    }
    
    // Apply filters
    if (category) where.category = category;
    if (brand) where.brand = brand;
    if (designer) where.designer = designer;
    if (condition) where.condition = condition;
    if (size) where.size = size;
    if (style) where.style = style;
    if (color) where.color = color;
    if (material) where.material = material;
    if (season) where.season = season;
    if (era) where.era = era;
    if (releaseYear) where.releaseYear = parseInt(releaseYear);
    if (collaboration) where.collaboration = { contains: collaboration, mode: 'insensitive' };
    if (exclusivity) where.exclusivity = exclusivity;
    if (department) where.department = department;
    if (location) where.location = location;
    
    // Price range
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseInt(minPrice);
      if (maxPrice) where.price.lte = parseInt(maxPrice);
    }
    
    // Build order by clause
    let orderBy: any = {};
    switch (sortBy) {
      case 'newest':
        orderBy.createdAt = 'desc';
        break;
      case 'oldest':
        orderBy.createdAt = 'asc';
        break;
      case 'price-low':
        orderBy.price = 'asc';
        break;
      case 'price-high':
        orderBy.price = 'desc';
        break;
      case 'name':
        orderBy.title = 'asc';
        break;
      default:
        orderBy.createdAt = 'desc';
    }
    
    // Execute query
    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        orderBy,
        skip: offset,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              trustScore: true
            }
          }
        }
      }),
      prisma.listing.count({ where })
    ]);
    
    return NextResponse.json({
      listings,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total
    });
    
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
} 