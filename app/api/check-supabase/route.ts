import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    return NextResponse.json({
      error: 'DATABASE_URL not found',
      suggestions: [
        'Check if environment variable is set in Vercel',
        'Verify the variable name is exactly DATABASE_URL'
      ]
    });
  }

  // Parse the connection string to extract info
  const urlMatch = databaseUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  
  if (!urlMatch) {
    return NextResponse.json({
      error: 'Invalid DATABASE_URL format',
      databaseUrl: databaseUrl.substring(0, 20) + '...'
    });
  }

  const [, username, password, host, port, database] = urlMatch;
  
  return NextResponse.json({
    connectionInfo: {
      host,
      port,
      database,
      username,
      hasPassword: !!password
    },
    suggestions: [
      'Check if Supabase project is active (not paused)',
      'Verify network settings allow all connections',
      'Try using connection pooling URL (port 6543 instead of 5432)',
      'Check if your Supabase project has any usage limits'
    ],
    nextSteps: [
      'Go to Supabase dashboard and check project status',
      'Look for any error messages in Supabase logs',
      'Try the connection pooling URL: ' + databaseUrl.replace(':5432/', ':6543/')
    ]
  });
} 