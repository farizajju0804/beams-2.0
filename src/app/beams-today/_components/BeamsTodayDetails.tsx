import React from 'react'; // Import React to create the component
import ShareButton from '@/app/beams-today/_components/ShareButton'; // Import the ShareButton component for sharing functionality
import FormattedDate from '@/app/beams-today/_components/FormattedDate'; // Import a component for formatting dates
import NoteModal from './NoteModal'; // Import the NoteModal component for adding notes
import FavoriteButton from '@/app/beams-today/_components/FavoriteButton'; // Import the FavoriteButton component to allow users to favorite the content
import { BeamsToday } from '@/types/beamsToday'; // Import the BeamsToday type for TypeScript type safety
import { getNote } from '@/actions/beams-today/saveUserNote';
import { BeamsTodayUserNote } from '@prisma/client';
import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { checkConnectionGameStatus } from '@/actions/connection/connectionGame';


// Define the props for the BeamsTodayDetails component, expecting a 'data' prop of type BeamsToday
interface BeamsTodayDetailsProps {
  data: BeamsToday; // The data object containing details of the beam today
}

// Define the functional component BeamsTodayDetails
const BeamsTodayDetails: React.FC<BeamsTodayDetailsProps> = async({ data }) => {

  const existingNote:BeamsTodayUserNote | null = await getNote(data.id)
   const connectionGameStatus = await checkConnectionGameStatus(data.id)
  
  return (
    <div className="px-4 mt-2 rounded-3xl mb-10 lg:mb-20"> {/* Container with padding, margin, and rounded corners */}
      <h1 className="text-2xl md:text-3xl font-bold my-2">{data?.title}</h1> {/* Title of the beam, responsive font size */}
      <p className="text-sm md:text-lg font-normal text-grey-2">{data?.shortDesc}</p> {/* Short description, responsive font size */}
      <div className="flex justify-between items-start gap-4 lg:items-center flex-col lg:flex-row w-full mt-2"> {/* Flex container for date and action buttons */}
        <p className="text-grey-2 text-xs lg:text-base"> {/* Date display */}
          {data?.date ? ( // Check if a date is available
            <FormattedDate date={data.date.toISOString().split('T')[0]} /> // Format and display the date
          ) : (
            'Unknown date' // Fallback if no date is available
          )}
        </p>
        <div className="flex items-center gap-4"> {/* Container for action buttons */}
        {!connectionGameStatus.data?.isCompleted && connectionGameStatus.gameExists && (
            <Button
              as={Link}
              href={`/connection-game/${data.id}`}
              prefetch
              className="bg-grey-1 text-grey-2 font-medium"
            >
              Play Game
            </Button>
          )}
          <FavoriteButton beamsTodayId={data.id} /> {/* Button to favorite the beam today, passing the ID */}
          <NoteModal id={data.id} title={data.title} existingNote={existingNote} /> {/* Modal for adding notes, passing the ID and title */}
          <ShareButton data={data} /> {/* Button to share the beam today, passing the data */}
        </div>
      </div>
    </div>
  );
};

export default BeamsTodayDetails; // Export the component for use in other parts of the application
