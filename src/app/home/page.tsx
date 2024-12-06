import { Suspense } from 'react';
import { getCategories } from '@/actions/home/search';

import { currentUser } from '@/libs/auth';
import { getAllBeamsToday5 } from '@/actions/beams-today/getAllBeamsToday';
import { DailyHeader } from '@/app/home/_components/daily-header';

import { getTop5WordGames } from '@/actions/connection/connectionGame';

import { getTop5Facts } from '@/actions/fod/fod';
import { BeamsSlideshow } from './_components/beams-today-slideshow';
import { BeamsConnectSlideshow } from './_components/beams-connect-slideshow';
import { BeamsFactsSlideshow } from './_components/beams-facts-slideshow';
import GlobalSearch from './_components/Search';

async function getSearchData() {
  const user:any = await currentUser()
  const userId = user?.id;
  const categories = await getCategories();

  return {
    categories,
    userId
  };
}

export default async function SearchPage() {
  const { categories, userId } = await getSearchData();
  const beamsToday = await getAllBeamsToday5()
  const wordGamesResponse = await getTop5WordGames(userId);
  const facts = await getTop5Facts(userId);
  return (
    <div className="container flex flex-col gap-3 lg:gap-6  mx-auto pb-4">
        <DailyHeader />
      <Suspense fallback={<div>Loading...</div>}>
        <GlobalSearch
          categories={categories}
          userId={userId}
        />
      </Suspense>
      <BeamsSlideshow slides={beamsToday} />
    

  <BeamsFactsSlideshow userId={userId} slides={facts}/>
  {wordGamesResponse.success && wordGamesResponse.data &&
      <BeamsConnectSlideshow  slides={wordGamesResponse.data}  />
  }
    </div>
  )

}