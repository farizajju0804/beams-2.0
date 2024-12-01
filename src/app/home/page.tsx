import { Suspense } from 'react';
import { getCategories } from '@/actions/home/search';
import GlobalSearch from '@/components/Search';
import { currentUser } from '@/libs/auth';
import { AnimatedTestimonials } from '@/components/ui/animated-testimonials';
import { getAllBeamsToday5 } from '@/actions/beams-today/getAllBeamsToday';
import DailyHeader from '@/components/ui/daily-header';

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
 
  return (
    <div className="container mx-auto py-6">
        <DailyHeader />
      <Suspense fallback={<div>Loading...</div>}>
        <GlobalSearch
          categories={categories}
          userId={userId}
        />
      </Suspense>
      <AnimatedTestimonials autoplay testimonials={beamsToday} />
    </div>
  )

}