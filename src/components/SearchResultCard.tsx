import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export interface SearchResult {
  id: string;
  type: 'beamsToday' | 'fact' | 'connectionGame';
  title: string;
  thumbnail: string;
  date: Date;
  category?: {
    id: string;
    name: string;
    color?: string;
  };
  completed?: boolean;
  content?: string;
  viewCount?: number;
  completionCount?: number;
  finalImage?: string;      // Add this
  finalImageDark?: string;  // Add this
  hashtags?: string[];  
}

interface SearchResultCardProps {
  result: SearchResult;
  onSelect?: (result: SearchResult) => void;
}

export const SearchResultCard: React.FC<SearchResultCardProps> = ({
  result,
  onSelect
}) => {
  const getContentBadge = () => {
    switch (result.type) {
      case 'beamsToday':
        return (
          <div className="px-3 py-1 w-fit font-medium bg-yellow text-black rounded-full text-xs">
            Beams Today
          </div>
        );
      case 'fact':
        return (
          <div className="px-3 py-1 w-fit bg-purple text-white rounded-full text-xs">
            Beams Fact
          </div>
        );
      case 'connectionGame':
        return (
          <div className="px-3 py-1 w-fit bg-success text-white rounded-full text-xs">
            Beams Connect
          </div>
        );
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date));
  };

  const CardContent = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full cursor-pointer"
    >
      <div className="flex md:flex-row flex-col gap-4 bg-background border border-divider rounded-xl transition-all">
        <div className="relative shrink-0">
          <Image
            src={result.thumbnail}
            alt={result.title}
            width={1000}
            height={1000}
            className="rounded-lg w-full md:w-60 h-40 object-cover"
            priority={true}
          />
        </div>
        <div className="flex-1 flex items-start justify-center gap-4 flex-col px-4 pb-4 min-w-0 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <h3 className="font-semibold text-lg line-clamp-2 flex-1">
              {result.title}
            </h3>
          </div>
          <div className="shrink-0">
            {getContentBadge()}
          </div>
          <div className="flex mt-4 flex-wrap items-center gap-2 text-sm text-default-500">
            <span>{formatDate(result.date)}</span>
            {result.category && (
              <>
                <span>•</span>
                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                  {result.category.name}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const getHref = () => {
    switch (result.type) {
      case 'beamsToday':
        return `/beams-today/${result.id}`;
      case 'fact':
        return `/facts/${result.id}`;
      case 'connectionGame':
        return `/connection-game/${result.id}`;
    }
  };

  // For fact type, render without Link and with click handler
  if (result.type === 'fact') {
    return (
      <div onClick={() => onSelect?.(result)}>
        <CardContent />
      </div>
    );
  }

  // For other types, wrap with Link
  return (
    <Link href={getHref()}>
      <CardContent />
    </Link>
  );
};