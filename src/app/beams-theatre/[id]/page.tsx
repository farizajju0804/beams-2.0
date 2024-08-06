import React from 'react';
import { getBeamsTheatreById } from '@/actions/beams-theatre/getBeamsTheatreById';
import { getRelatedBeamsTheatre } from '@/actions/beams-theatre/getRelatedBeamsTheatre';

import SideBar from '../_components/SideBar';
import PlayerComponent from '../_components/PlayerComponent';
import VideoPlayer from '../_components/VideoPlayer';
import OverviewCard from '../_components/OverviewCard';
import LearnPointsCard from '../_components/LearnPointsCard';
import Plot from '../_components/Plot';
import Breadcrumbs from '@/components/Breadcrumbs';
import PreviewSection from '../_components/PreviewSection';
import { Button } from '@nextui-org/react';
import { VideoPlay } from 'iconsax-react';


interface BeamsTheatrePageProps {
  params: { id: string };
}

const PreviewPage: React.FC<BeamsTheatrePageProps> = async ({ params }) => {
  const beamsTheatre = await getBeamsTheatreById(params.id);
  const relatedBeamsTheatre = await getRelatedBeamsTheatre(beamsTheatre.genre.id);
  const filteredRelatedContent = relatedBeamsTheatre.filter(item => item.id !== beamsTheatre.id);

  return (
    <div className='w-full bg-background max-w-5xl flex flex-col px-6 pt-4 pb-8 mx-auto'>
      <Breadcrumbs
        pageClassName="text-text"
        linkClassName="text-grey-2"
          items={[
            { href: "/", name: "Home" },
            { href: "/beams-theatre", name: "Beams Theatre" },
            { name: "Magical Materials" }
          ]}
        />
      <div className='flex flex-col gap-8'>
      <PreviewSection/>
      <OverviewCard/>
      <LearnPointsCard/>
      <Plot/>
      <Button  color="primary" className="text-white mt-2 text-lg lg:w-fit lg:px-10 lg:mx-auto" startContent={<VideoPlay variant='Bold' className="text-white" size="20" /> } >
       Start Course
      </Button>
      </div>
  
    </div>
  );
};

export default PreviewPage;
