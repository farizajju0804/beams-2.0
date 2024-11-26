'use client'
import React, { useState } from "react"
import { Button } from "@nextui-org/button"
import {  RadioGroup, Radio, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react"
import { Game, Eye, InfoCircle } from "iconsax-react"
import { useRouter } from 'next/navigation'
import CustomPagination from "@/components/Pagination"
import Image from "next/image"
import { getRecentGames } from "@/actions/connection/connectionGame"
import FormattedDate from "@/app/beams-today/_components/FormattedDate"
import { BiSolidJoystick } from "react-icons/bi"
import SortByFilter from "@/app/beams-today/_components/SortByFilter"


interface Game {
    id: string
    title: string
    date: Date
    isCompleted: boolean
    hint: string
    thumbnail : string
    image: string
  }
  
  // Define the server response type
  interface PaginatedGamesResponse {
    success: boolean
    games?: Game[]
    totalPages?: number
    currentPage?: number
    error?: string
  }
  
  // Define the props interface with required initial data structure
  interface RecentGamesProps {
    initialData: {
      games: Game[]  // Make this required
      totalPages: number
      currentPage: number
    }
    userId: string
    clientDate: string
  }


export default function RecentGames({ initialData, userId, clientDate }: RecentGamesProps) {
  const router = useRouter()
  const [games, setGames] = useState<Game[]>(initialData.games)
  const [sortBy, setSortBy] = useState<'dateDesc' | 'dateAsc' | 'titleAsc' | 'titleDesc'>('dateDesc')
  const [filterOption, setFilterOption] = useState<'all' | 'completed' | 'incomplete'>('all')
  const [currentPage, setCurrentPage] = useState(initialData.currentPage)
  const [totalPages, setTotalPages] = useState(initialData.totalPages)

  const fetchData = async (
    page: number, 
    sort: string, 
    filter: string
  ) => {
    try {
      const result = await getRecentGames({
        clientDate,
        page,
        sortBy: sort as 'dateDesc' | 'dateAsc' | 'nameAsc' | 'nameDesc',
        filterOption: filter as 'all' | 'completed' | 'incomplete',
        userId
      });

      if (result.success && result.games) {
        setGames(result.games)
        setTotalPages(result.totalPages || 1)
        setCurrentPage(result.currentPage || 1)
      }
    } catch (error) {
      console.error('Error fetching games:', error)
    }
  }

  const handleSortChange = async (newSortBy: string) => {
    setSortBy(newSortBy as 'dateDesc' | 'dateAsc' | 'titleAsc' | 'titleDesc')
    await fetchData(1, newSortBy, filterOption)
  }

  const handleFilterChange = async (newFilter: string) => {
    setFilterOption(newFilter as 'all' | 'completed' | 'incomplete')
    await fetchData(1, sortBy, newFilter)
  }

  const handlePageChange = async (page: number) => {
    await fetchData(page, sortBy, filterOption)
  }

  const handleGameAction = (gameId: string, completed: boolean) => {
    if (completed) {
      router.push(`/connection-game/${gameId}`)
    } else {
      router.push(`/connection-game/${gameId}`)
    }
  }

  const InfoIcon = ({ content }: { content: string }) => (
    <Popover placement="top">
      <PopoverTrigger>
        <sup>
          <InfoCircle size={12} className="ml-1 cursor-pointer text-grey-2" />
        </sup>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-1 py-2">
          <div className="text-tiny">{content}</div>
        </div>
      </PopoverContent>
    </Popover>
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 md:py-8">
      <div className="pl-2 lg:pl-0 w-full flex flex-col items-start lg:items-center">
        <h1 className="text-lg md:text-2xl text-text font-poppins font-semibold mb-[1px]">
          Trending Connects
        </h1>
        <div
          className="border-b-2 mb-6 border-brand w-full"
          style={{ maxWidth: "13%" }}
        ></div>
      </div>
  

      <div className="pl-2 flex flex-col md:flex-row items-start gap-6 md:justify-between mb-6 md:items-center w-full">
      <SortByFilter sortBy={sortBy} setSortBy={handleSortChange} />
 
        <RadioGroup
          orientation="horizontal"
          value={filterOption}
          onValueChange={handleFilterChange}
          classNames={{ wrapper: "gap-4" }}
        >
          <Radio 
            classNames={{
              wrapper: "w-3 h-3",
              control: "w-1 h-1",
              label: "text-sm"
            }} 
            value="all"
            size="sm"
          >
            All Games
          </Radio>
          <div className="flex items-center mx-1">
            <Radio 
              classNames={{
                wrapper: "w-3 h-3",
                control: "w-1 h-1",
                label: "text-sm"
              }} 
              value="completed"
              size="sm"
            >
              Beamed
            </Radio>
            <InfoIcon content="Games that you have completed" />
          </div>
          <div className="flex items-center mx-1">
            <Radio
              classNames={{
                wrapper: "w-3 h-3",
                control: "w-1 h-1",
                label: "text-sm"
              }} 
              value="incomplete"
              size="sm"
            >
              Unbeamed
            </Radio>
            <InfoIcon content="Games that you haven't completed yet" />
          </div>
        </RadioGroup>
      </div>

      {games.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-40 h-40 mb-6">
          <Image
                width={200} 
                height={200} 
                src="https://res.cloudinary.com/drlyyxqh9/image/upload/v1729604854/achievements/empty-box-3d-6717ace7b4c8a_zkwzn0.webp" 
                alt="empty"
              />
          </div>
          <h3 className="text-sm text-grey-4 mb-2">
            Games are looking a bit lonely here! Try adjusting your filters to find more games to play.
          </h3>
        </div>
      )}

      <div className="px-2 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {games.map(game => (
         <div 
         key={game.id}
         className="w-full relative max-w-sm bg-background shadow-defined rounded-2xl overflow-hidden transition-all duration-300 ease-in-out transform "
       >
    
         <div className="relative h-48 overflow-hidden">
           <Image
             src={game.thumbnail}
             alt={game.title}
             fill
             className="w-full h-full object-cover transition-transform duration-300 ease-in-out transform "
           />
            
         </div>
         <div className="p-4">
           <h3 className="text-lg font-semibold mb-2">{game.title}</h3>
           <p className="text-sm text-default-600 mb-4">
             <FormattedDate date={game.date.toISOString().split('T')[0]} />
           </p>
           <div className="flex justify-between items-center">
           <Button 
            className="text-white font-semibold"
            color={game.isCompleted ? "success" : "primary"}
            onClick={() => handleGameAction(game.id, game.isCompleted)}
            startContent={game.isCompleted ? 
              <Eye size={20} variant="Bold" /> : 
              <BiSolidJoystick size={20}  />
            }
          >
            {game.isCompleted ? "View Solution" : "Play Now"}
          </Button>
          
           </div>
         </div>
       </div>
        ))}
      </div>

      <div className="mt-6 md:mt-8">
        {totalPages > 1 && (
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  )
}