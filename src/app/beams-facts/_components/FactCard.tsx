import FormattedDate from "@/app/beams-today/_components/FormattedDate"
import { Card } from "@/components/ui/card"
import { Chip } from "@nextui-org/react"
import { Hashtag } from "iconsax-react"
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
      className="group flex overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg"
      onClick={onClick}
    >
      <div className="relative w-1/3 min-w-[120px]">
        <Image
          src={thumbnail}
          alt={title}
          width={1000}
          height={1000}
          className="object-cover w-full h-44 "
          
        />

      </div>
      <div className="flex-1 p-4 flex flex-col justify-center gap-2">
        <div>
          <h3 className="font-semibold text-lg mb-2">
            {title}
          </h3>
        </div>
        <div className="flex flex-col items-start gap-4  justify-between text-xs text-muted-foreground">
          <div className="flex items-center">
            <FormattedDate date={date.toISOString().split('T')[0]}/>
          </div>
          <Chip
           classNames={{
            content : "text-xs font-semibold"
        }}
            className="text-xs text-white font-semibold py-1 px-2  "
            style={{ backgroundColor: `${category.color}` }}
          >
            {category.name}
          </Chip>
          <div className="lg:flex w-full hidden gap-3">
          {hashtags.map((tag, index) => (
            <Chip
                variant="bordered"
                size="sm"
                key={index}
                startContent={<Hashtag className="w-3 h-3" />}
            >
                {tag}
            </Chip>
            
        ))}
        </div>
        </div>
      </div>
      {/* <div className="w-1 bg-gradient-to-b from-primary/50 to-primary transition-all duration-300 transform origin-bottom scale-y-0 group-hover:scale-y-100" /> */}
    </Card>
  )
}

