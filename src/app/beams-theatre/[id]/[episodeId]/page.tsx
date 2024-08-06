import React from 'react';
import { getBeamsTheatreById } from '@/actions/beams-theatre/getBeamsTheatreById';
import { getRelatedBeamsTheatre } from '@/actions/beams-theatre/getRelatedBeamsTheatre';
import SideBar from '../../_components/SideBar';
import PlayerComponent from '../../_components/PlayerComponent';

interface BeamsTheatrePageProps {
  params: { id: string };
}

const BeamsTheatrePage: React.FC<BeamsTheatrePageProps> = async ({ params }) => {
  const beamsTheatre = await getBeamsTheatreById(params.id);
  const relatedBeamsTheatre = await getRelatedBeamsTheatre(beamsTheatre.genre.id);
  const filteredRelatedContent = relatedBeamsTheatre.filter(item => item.id !== beamsTheatre.id);

  return (
    <div className='w-full max-w-5xl flex px-2 mx-auto'>
      <SideBar/>
      <PlayerComponent/>
 
   
      {/* <VideoPlayerPage beamsTheatre={beamsTheatre} /> */}
      {/* <RecommendedSection relatedBeamsTheatre={filteredRelatedContent} /> */}
    </div>
  );
};

export default BeamsTheatrePage;
