import React from 'react';
import { getBeamsTheatreById } from '@/actions/beams-theatre/getBeamsTheatreById';
import { getRelatedBeamsTheatre } from '@/actions/beams-theatre/getRelatedBeamsTheatre';
import VideoPlayerPage from '../_components/VideoPlayerPage';
import RecommendedSection from '../_components/RecommendedSection';

interface BeamsTheatrePageProps {
  params: { id: string };
}

const BeamsTheatrePage: React.FC<BeamsTheatrePageProps> = async ({ params }) => {
  const beamsTheatre = await getBeamsTheatreById(params.id);
  const relatedBeamsTheatre = await getRelatedBeamsTheatre(beamsTheatre.genre.id);
  const filteredRelatedContent = relatedBeamsTheatre.filter(item => item.id !== beamsTheatre.id);

  return (
    <div className='w-full max-w-5xl justify-center items-center mx-auto flex flex-col gap-20 p-4'>
      <VideoPlayerPage beamsTheatre={beamsTheatre} />
      <RecommendedSection relatedBeamsTheatre={filteredRelatedContent} />
    </div>
  );
};

export default BeamsTheatrePage;
