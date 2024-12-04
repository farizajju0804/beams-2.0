import React from "react";
import { getBeamsTodayById } from "@/actions/beams-today/getBeamsTodayById";
import { getPoll, getUserPollResponse } from "@/actions/beams-today/pollActions";
import BeamsTodayTabs from "../_components/BeamsTodayTabs";
import BeamsTodayDetails from "@/app/beams-today/_components/BeamsTodayDetails";
import RelatedSection from "../_components/RelatedSection";
import { fetchCategoryRelatedTopics } from '@/actions/beams-today/categoryActions';
import { BeamsToday } from '@/types/beamsToday';
import BarPoll from "@/app/beams-today/_components/BarPoll";
import Breadcrumbs from "@/components/Breadcrumbs";
import BottomNavigation from "../_components/BottomNavigation"; // Ensure correct import
import { getAllBeamsToday } from "@/actions/beams-today/getAllBeamsToday";
import { Metadata, ResolvingMetadata } from "next";

interface BeamsTodayPlayerPageProps {
  params: { id: string };
}
export async function generateMetadata(
  { params }: BeamsTodayPlayerPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = params;
  
  try {
    const beamsToday = await getBeamsTodayById(id);
    
    if (!beamsToday) {
      return {
        title: 'Not Found | Beams Today',
        description: 'Content not found'
      };
    }

    const title = `${beamsToday.title} | Beams Today`;  // Directly construct the full title

    return {
      title,  // Use full title instead of template
      description: beamsToday.shortDesc,
      openGraph: {
        type: 'article',
        title,  // Use the same full title
        description: beamsToday.shortDesc,
        url: `https://www.beams.world/beams-today/${id}`,
        siteName: 'Beams',
        images: beamsToday.thumbnailUrl ? [
          {
            url: beamsToday.thumbnailUrl,
            width: 1200,
            height: 630,
            alt: beamsToday.title,
          }
        ] : undefined,  // Use undefined instead of empty array
      },
      twitter: {
        card: 'summary_large_image',
        title,  // Use the same full title
        description: beamsToday.shortDesc,
        images: beamsToday.thumbnailUrl ? [beamsToday.thumbnailUrl] : undefined,
      },
    };

  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error | Beams Today',
      description: 'An error occurred while loading the content'
    };
  }
}
const BeamsTodayPlayerPage = async ({ params }: BeamsTodayPlayerPageProps) => {
  // Destructure the topic ID from params
  const { id } = params;
  
  // Fetch the specific Beams Today topic by ID
  const beamsToday: any = await getBeamsTodayById(id);
  
  // Fetch the poll associated with the topic
  const poll:any = await getPoll(id);
  const pollResponse = await getUserPollResponse(poll?.id)
  // Fetch related topics within the same category, excluding the current topic
  const relatedTopics = await fetchCategoryRelatedTopics(beamsToday.category.id);
  const filteredRelatedTopics: any = relatedTopics.filter(topic => topic.id !== beamsToday.id);
  
  // Fetch all Beams Today topics for navigation purposes
  const allBeamsToday:any = await getAllBeamsToday();
  const currentIndex = allBeamsToday.findIndex((topic: BeamsToday) => topic.id === id);
  
  // Define URLs for the previous and next topics, if they exist
  const nextUrl = currentIndex > 0 ? `/beams-today/${allBeamsToday[currentIndex - 1].id}` : null;
  const prevUrl = currentIndex < allBeamsToday.length - 1 ? `/beams-today/${allBeamsToday[currentIndex + 1].id}` : null;

  return (
    <>
    <div className="px-4 md:px-8">
        {/* Breadcrumbs navigation */}
        <Breadcrumbs
          pageClassName="text-text"
          linkClassName="text-grey-2"
          items={[
            // { href: "/", name: "Home" },
            { name: "Beams Today", href: "/beams-today" },
            { name: beamsToday.title }
          ]}
        />
      </div>
    <div className="max-w-5xl flex w-full flex-col mx-auto px-4 mt-4 overflow-x-hidden">
      
      
      {/* Render tabs and details of the Beams Today topic */}
      <BeamsTodayTabs beamsToday={beamsToday} />
      <BeamsTodayDetails data={beamsToday} />
      
      {/* Render the poll component for user interaction */}
      <BarPoll poll={poll} pollResponse={pollResponse} />
      
      {/* Display related topics if available */}
      {filteredRelatedTopics.length > 0 && (
        <RelatedSection topics={filteredRelatedTopics} categoryName={beamsToday.category.name} />
      )}
      
    
      <BottomNavigation
        currentDate={beamsToday.date}
        prevUrl={prevUrl}
        nextUrl={nextUrl}
      />
    </div>
    </>
  );
};


export default BeamsTodayPlayerPage;
