import { NextResponse } from 'next/server';
import { MongoClient, Db } from 'mongodb';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

async function connectToDatabase(): Promise<Db> {
  if (cachedDb && cachedClient) {
    // Check if the connection is still alive
    try {
      await cachedClient.db().command({ ping: 1 });
      return cachedDb;
    } catch (error) {
      // Connection is dead, close it
      await cachedClient.close();
      cachedClient = null;
      cachedDb = null;
    }
  }

  if (!process.env.DATABASE_URL) {
    throw new Error('Please define the DATABASE_URL environment variable');
  }

  try {
    const client = await MongoClient.connect(process.env.DATABASE_URL);
    const db = client.db();
    cachedClient = client;
    cachedDb = db;
    return db;
  } catch (error) {
    console.error('Failed to connect to database:', error);
    throw new Error('Unable to connect to database');
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const db = await connectToDatabase();
    const user = await db.collection('User').findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(`Error fetching user with email ${email}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}