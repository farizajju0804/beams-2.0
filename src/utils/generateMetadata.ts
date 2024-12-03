import { Metadata } from 'next';

export interface ShareMetadata {
    title: string;
    description: string;
    imageUrl: string;
    imageAlt: string;
  }

export function generateMetadata(pageMetadata: ShareMetadata): Metadata {
  return {
    title: pageMetadata.title,
    description: pageMetadata.description,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: 'https://www.beams.world',
      title: pageMetadata.title,
      description: pageMetadata.description,
      siteName: 'Beams',
      images: [
        {
          url: pageMetadata.imageUrl,
          width: 1200,
          height: 630,
          alt: pageMetadata.imageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageMetadata.title,
      description: pageMetadata.description,
      images: [pageMetadata.imageUrl],
    },
  };
}