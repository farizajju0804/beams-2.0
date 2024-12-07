import Image from "next/image";

interface NoResultsStateProps {
  query: string;
  message?: string;
}

export const NoResultsState = ({ query, message }: NoResultsStateProps) => (
  <div className="flex flex-col items-center justify-center py-3 text-center">
    <div className="w-32 h-32 mb-6 relative">
      <Image
        width={100}
        height={100}
        src="https://res.cloudinary.com/drlyyxqh9/image/upload/v1729587896/achievements/search-empty_wzzuq9.webp"
        className="object-contain"
        alt="No results found"
        priority
      />
    </div>
    <h3 className="font-medium text-grey-4 mb-2">
      {message || (
        <>
          Uh-oh! No results for &quot;<span className="font-semibold">{query}</span>&quot;
        </>
      )}
    </h3>
  
  </div>
);