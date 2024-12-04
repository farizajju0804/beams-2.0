// app/api/metadata/beams-today/[id]/route.ts
import { getBeamsTodayById } from "@/actions/beams-today/getBeamsTodayById";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const beamsToday = await getBeamsTodayById(id);

  if (!beamsToday) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Return HTML response with metadata
  return new NextResponse(
    `<!DOCTYPE html>
    <html>
      <head>
        <title>${beamsToday.title} | Beams Today</title>
        <meta name="description" content="${beamsToday.shortDesc}">
        <meta property="og:title" content="${beamsToday.title} | Beams Today">
        <meta property="og:description" content="${beamsToday.shortDesc}">
        <meta property="og:image" content="${beamsToday.thumbnailUrl}">
        <meta property="og:url" content="https://www.beams.world/beams-today/${id}">
        <meta property="og:type" content="article">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${beamsToday.title} | Beams Today">
        <meta name="twitter:description" content="${beamsToday.shortDesc}">
        <meta name="twitter:image" content="${beamsToday.thumbnailUrl}">
      </head>
      <body>
        <script>
          window.location.href = "/beams-today/${id}";
        </script>
      </body>
    </html>`,
    {
      headers: {
        "Content-Type": "text/html",
      },
    }
  );
}