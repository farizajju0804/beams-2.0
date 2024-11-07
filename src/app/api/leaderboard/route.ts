// app/api/leaderboard/route.ts
import { generateLeaderboardNotifications } from "@/actions/dashboard/generateLeaderboardNotifications";
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Validate cron job authentication
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('API request received: Generating leaderboard notifications...');
    await generateLeaderboardNotifications();
    console.log('Notifications successfully generated');
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Leaderboard notifications sent successfully',
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error while generating notifications: ${(error as Error).message}`);
    return NextResponse.json(
      { 
        success: false, 
        error: (error as Error).message 
      },
      { status: 500 }
    );
  }
}