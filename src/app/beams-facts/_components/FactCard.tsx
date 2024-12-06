import FormattedDate from "@/app/beams-today/_components/FormattedDate"
import { Card } from "@/components/ui/card"
import Image from "next/image"

interface FactCardProps {
  id: string
  title: string
  date: Date
  thumbnail: string
  category: {
    name: string
    color: string
  },
  hashtags : string[]
  onClick: () => void
}

export function FactCard({ title, date, thumbnail, category, onClick,hashtags }: FactCardProps) {
  return (
    <Card 
      className="group flex w-full max-w-md shadow-none border-1 border-default-200 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg"
      onClick={onClick}
    >
      <div className="relative w-1/3 min-w-[120px]">
        <Image
          src={thumbnail}
          alt={title}
          width={1000}
          height={1000}
          className="object-cover w-full h-44"
        />

      </div>
      <div className="flex-1 p-4 flex flex-col justify-center gap-2">
        <div>
          <h3 className="font-semibold text-lg  md:text-xl mb-2">
            {title}
          </h3>
        </div>
        <div className="flex flex-col items-start gap-4  justify-between text-xs text-muted-foreground">
          <div className="flex items-center">
            <FormattedDate date={date.toISOString().split('T')[0]}/>
          </div>
    
          {/* <div className="lg:flex w-full hidden gap-3">
          {hashtags.map((tag, index) => (
            <Chip
                variant="flat"
                size="sm"
                key={index}
                as={Link}
                href={`/beams-facts/tag/${tag}`}
            >
                #{tag}
            </Chip>
        ))}
        </div> */}
        </div>
      </div>
    </Card>
  )
}

