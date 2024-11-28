'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GoLinkExternal } from "react-icons/go";
import Image from "next/image"
import Link from "next/link"
import { Button, Chip } from "@nextui-org/react"
import FormattedDate from "@/app/beams-today/_components/FormattedDate";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface FactOfTheDayProps {
  id: string | undefined
  date: Date | undefined
  title: string | undefined
  finalImage: string | undefined 
  finalImageDark: string | undefined
  thumbnail: string | undefined
  referenceLink1?: string
  referenceLink2?: string
  hashtags: string[] | undefined
  category: {
    name: string 
    color: string 
  } | undefined,

}

export function FactDisplay({
  date,
  title,
  finalImage,
  finalImageDark,
  thumbnail,
  referenceLink1,
  referenceLink2,
  hashtags,
  category,
}: FactOfTheDayProps) {
  const hasBothLinks = referenceLink1 && referenceLink2;
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  
  // Use state to track the current image
  const [currentImage, setCurrentImage] = useState(finalImage);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      // Use resolvedTheme instead of theme for more reliable theme detection
      const imageToUse = (resolvedTheme === 'dark' ? finalImageDark : finalImage) || finalImage;
      setCurrentImage(imageToUse);
      
      // Debug logging
      console.log({
        resolvedTheme,
        theme,
        imageToUse,
        finalImage,
        finalImageDark,
        currentImage: imageToUse
      });
    }
  }, [mounted, resolvedTheme, theme, finalImage, finalImageDark]);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }
  return (
    <Card className="w-full rounded-none md:rounded-xl border-1 border-default/50 shadow-none max-w-lg mx-auto overflow-hidden">
      <CardHeader className="pb-0 pt-4 px-4">
        <div className="flex justify-between items-center">
                  
        {title && 
        <h1 className="text-lg md:text-xl lg:text-2xl font-poppins decoration-brand underline underline-offset-[6px] font-medium">{title}</h1>
        }
        {date && 
          <div className="flex items-center text-muted-foreground text-sm">
            <FormattedDate date={date.toISOString().split('T')[0]}/>
          </div>
             }
        </div>
      
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative w-full">
        {currentImage && title && 
            <Image
              src={currentImage}
              alt={title}
            width={1000}
            height={1000}
            className="object-cover w-full h-full"
          />
        }
        </div>
        <div className="flex px-4 justify-between items-center w-full mb-4">

        {category && 
          <Chip
            className=" py-1"
            as={Link}
            href={`/beams-facts/category/${category.name}`}
            style={{ backgroundColor: category.color, color: '#fff' }}
            classNames={{
                content : "text-xs font-semibold"
            }}
          >
            {category.name}
          </Chip>
            }
            </div>
        <div className="flex px-4 justify-between items-center w-full mb-4">
        {hashtags && 
        <div className="flex  flex-wrap gap-2 ">
          {hashtags.map((tag) => (
            <Chip 
              key={tag}
              size="sm"
              variant="flat" 
              className="text-xs"
              as={Link}
              href={`/beams-facts/tag/${tag}`}
            >
              #{tag}
            </Chip>
          ))}
        </div>
        }
         
         <div className="flex gap-4">
          {referenceLink1 && (
            <div className="flex flex-col items-center">
              <Button as={Link} 
              href={referenceLink1} target="_blank" rel="noopener noreferrer"
              isIconOnly variant="light" size="sm">
                  <GoLinkExternal className="w-5 h-5" />
                
                {hasBothLinks && (
                <span className="font-medium text-[8px] absolute  bottom-[2px] right-[5px]">1</span>
              )}
              </Button>
            
            </div>
          )}
          {referenceLink2 && (
            <div className="flex flex-col items-center">
              <Button as={Link} 
              href={referenceLink1} target="_blank" rel="noopener noreferrer"
              isIconOnly variant="light" size="sm">
                  <GoLinkExternal className="w-5 h-5" />
                  {hasBothLinks && (
                  <span className="font-medium text-[8px] absolute  bottom-[2px] right-[5px]">2</span>
              )}
              </Button>
             
            </div>
          )}
        </div>
        </div>
      </CardContent>
     
    </Card>
  )
}