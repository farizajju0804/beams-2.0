import { Suspense } from 'react';
import { getCategories } from '@/actions/home/search';
import GlobalSearch from '@/components/Search';
import { currentUser } from '@/libs/auth';
import { getAllBeamsToday5 } from '@/actions/beams-today/getAllBeamsToday';
import { DailyHeader } from '@/components/daily-header';
import BeamsTodayCarousel from '@/components/beams-today-carousel';
import BeamsConnectCarousel from '@/components/beams-connect-carousel';
import { getTop5WordGames } from '@/actions/connection/connectionGame';
import SwipeCards from '@/components/swipe-cards';
import { getTop5Facts } from '@/actions/fod/fod';


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
    <div className="container flex flex-col gap-3 lg:gap-6  mx-auto py-4">
        <DailyHeader />
      <Suspense fallback={<div>Loading...</div>}>
        <GlobalSearch
          categories={categories}
          userId={userId}
        />
      </Suspense>
      <BeamsTodayCarousel beams={beamsToday} />
      {wordGamesResponse.success && wordGamesResponse.data && (
        <BeamsConnectCarousel games={wordGamesResponse.data} />
      )}

    <SwipeCards userId={userId} initialFacts={facts} />
    </div>
  )

}