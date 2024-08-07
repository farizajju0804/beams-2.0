import React from 'react';
import { getBeamsTheatreById } from '@/actions/beams-theatre/getBeamsTheatreById';
import { getRelatedBeamsTheatre } from '@/actions/beams-theatre/getRelatedBeamsTheatre';


import OverviewCard from '../_components/OverviewCard';
import LearnPointsCard from '../_components/LearnPointsCard';

import Breadcrumbs from '@/components/Breadcrumbs';

import CourseIncludesCard from '../_components/CourseIncludesCard';
import BottomCta from '../_components/BottomCta';
import CourseContent from '../_components/CourseContent';
import HeaderSection from '../_components/HeaderSection';


interface BeamsTheatrePageProps {
  params: { id: string };
}

const PreviewPage: React.FC<BeamsTheatrePageProps> = async ({ params }) => {
  const beamsTheatre = await getBeamsTheatreById(params.id);
  const relatedBeamsTheatre = await getRelatedBeamsTheatre(beamsTheatre.genre.id);
  const filteredRelatedContent = relatedBeamsTheatre.filter(item => item.id !== beamsTheatre.id);

  return (
    <div className='w-full bg-background max-w-5xl flex flex-col px-6 pt-4 pb-8 mb-14 md:mb-4 mx-auto'>
      
      <div className='flex flex-col gap-8'>
      <HeaderSection/>
      <OverviewCard/>
      <LearnPointsCard/>
      <CourseIncludesCard/>
      <CourseContent/>
      <BottomCta  />
    
      </div>
  
    </div>
  );
};

export default PreviewPage;
