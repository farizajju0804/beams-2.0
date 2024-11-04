'use client';
 
import ErrorPage from '@/components/ErrorPage';
 
export default function GlobalError({
}: {
  error: Error & { digest?: string };

}) {
  return (
    <html>
      <body>
        <ErrorPage 
          code="500"
        />
      </body>
    </html>
  );
}