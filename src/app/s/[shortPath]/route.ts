// app/s/[shortPath]/route.ts
import { db } from "@/libs/db";
import { NextResponse } from "next/server";


export async function GET(
  request: Request,
  { params }: { params: { shortPath: string } }
) {
  const shortPath = params.shortPath;
  const origin = request.headers.get('host') || 'beams.world';
  const protocol = origin.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${origin}`;

  try {
    const shortUrl = await db.shortUrl.update({
      where: { shortPath },
      data: { 
        clicks: { increment: 1 },
        lastClicked: new Date()
      }
    });

    if (!shortUrl) {
      return NextResponse.redirect(`${baseUrl}/404`);
    }

    // Return HTML with metadata
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>${shortUrl.title}</title>
          <meta name="description" content="${shortUrl.description}">
          <meta property="og:title" content="${shortUrl.title}">
          <meta property="og:description" content="${shortUrl.description}">
          ${shortUrl.imageUrl ? `<meta property="og:image" content="${shortUrl.imageUrl}">` : ''}
          <meta property="og:url" content="${baseUrl}/s/${shortPath}">
          <meta property="og:type" content="${shortUrl.type}">
          <meta name="twitter:card" content="summary_large_image">
          <meta name="twitter:title" content="${shortUrl.title}">
          <meta name="twitter:description" content="${shortUrl.description}">
          ${shortUrl.imageUrl ? `<meta name="twitter:image" content="${shortUrl.imageUrl}">` : ''}
        </head>
        <body>
          <script>
            window.location.href = "${baseUrl}${shortUrl.fullUrl}";
          </script>
        </body>
      </html>`,
      {
        headers: {
          "Content-Type": "text/html",
        },
      }
    );

  } catch (error) {
    console.error('Error processing short URL:', error);
    return NextResponse.redirect(`${baseUrl}/404`);
  }
}