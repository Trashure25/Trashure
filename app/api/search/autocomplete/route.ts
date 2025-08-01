import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all'; // all, brand, designer, category, style
    
    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }
    
    const suggestions: any[] = [];
    
    // Brand suggestions
    if (type === 'all' || type === 'brand') {
      const brands = await prisma.listing.findMany({
        where: {
          brand: { contains: query, mode: 'insensitive' },
          status: 'active'
        },
        select: { brand: true },
        distinct: ['brand'],
        take: 10
      });
      
      suggestions.push(...brands.map(b => ({
        type: 'brand',
        value: b.brand,
        label: b.brand
      })));
    }
    
    // Designer suggestions
    if (type === 'all' || type === 'designer') {
      const designers = await prisma.listing.findMany({
        where: {
          designer: { contains: query, mode: 'insensitive' },
          status: 'active'
        },
        select: { designer: true },
        distinct: ['designer'],
        take: 10
      });
      
      suggestions.push(...designers.map(d => ({
        type: 'designer',
        value: d.designer,
        label: d.designer
      })));
    }
    
    // Category suggestions
    if (type === 'all' || type === 'category') {
      const categories = await prisma.listing.findMany({
        where: {
          category: { contains: query, mode: 'insensitive' },
          status: 'active'
        },
        select: { category: true },
        distinct: ['category'],
        take: 10
      });
      
      suggestions.push(...categories.map(c => ({
        type: 'category',
        value: c.category,
        label: c.category
      })));
    }
    
    // Style suggestions
    if (type === 'all' || type === 'style') {
      const styles = await prisma.listing.findMany({
        where: {
          style: { contains: query, mode: 'insensitive' },
          status: 'active'
        },
        select: { style: true },
        distinct: ['style'],
        take: 10
      });
      
      suggestions.push(...styles.map(s => ({
        type: 'style',
        value: s.style,
        label: s.style
      })));
    }
    
    // General text search suggestions
    if (type === 'all') {
      const generalResults = await prisma.listing.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
          ],
          status: 'active'
        },
        select: { title: true },
        take: 5
      });
      
      suggestions.push(...generalResults.map(r => ({
        type: 'general',
        value: r.title,
        label: r.title
      })));
    }
    
    // Remove duplicates and limit results
    const uniqueSuggestions = suggestions
      .filter((s, index, self) => 
        index === self.findIndex(t => t.value === s.value)
      )
      .slice(0, 15);
    
    return NextResponse.json({ suggestions: uniqueSuggestions });
    
  } catch (error) {
    console.error('Autocomplete error:', error);
    return NextResponse.json({ suggestions: [] });
  }
} 