import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
  try {
    const response = NextResponse.json(
      { message: 'All cookies deleted successfully' },
      { status: 200 }
    );

    // Get all cookies
    const cookies = request.cookies.getAll();

    // Delete each cookie by setting it to expire in the past
    cookies.forEach((cookie) => {
      response.cookies.set(cookie.name, '', {
        expires: new Date(0),
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
      });
    });

    console.log('Cookies being deleted:', cookies.map(c => c.name));

    return response;
  } catch (error) {
    console.error('Error deleting cookies:', error);
    return NextResponse.json(
      { error: 'Failed to delete cookies', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}