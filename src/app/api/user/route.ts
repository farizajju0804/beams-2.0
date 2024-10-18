import { NextResponse } from 'next/server';
import { MongoClient, Db } from 'mongodb';
// export const runtime = 'edge'
let cachedDb: Db | null = null;

async function connectToDatabase() {
//   console.log('Connecting to database...');
  if (cachedDb) {
    // console.log('Using cached database connection');
    return cachedDb;
  }

  try {
    // console.log('DATABASE_URL:', process.env.DATABASE_URL);
    const client = await MongoClient.connect(process.env.DATABASE_URL as string);
    const db = client.db();
    cachedDb = db;
    // console.log('Connected to database successfully');
    return db;
  } catch (error) {
    console.error('Failed to connect to database:', error);
    throw error;
  }
}

export async function GET(request: Request) {
//   console.log('API Route: Received GET request');
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

//   console.log('API Route: Received request for email:', email);

  if (!email) {
    // console.log('API Route: Email is required');
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const db = await connectToDatabase();
    // console.log('API Route: Connected to database');
    
    const user = await db.collection('User').findOne({ email });

    if (!user) {
    //   console.log('API Route: User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // console.log('API Route: User found', user);
    return NextResponse.json(user);
  } catch (error) {
    console.error(`API Route: Error fetching user with email ${email}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}