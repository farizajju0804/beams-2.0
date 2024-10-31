// import { getcompletedBeamsToday } from "@/actions/beams-today/completedActions";
import { currentUser } from "@/libs/auth";
import BeamsTodayPage from "./_components/BeamsTodayPage";
// import { getAllBeamsToday, getNewBeamsToday } from "@/actions/beams-today/getAllBeamsToday";
import { getAllCategories } from "@/actions/beams-today/categoryActions";
// import { searchTopics } from "@/actions/beams-today/search";


interface PageProps {
  searchParams: {
    query?: string;
    page?: string;
    date?: string;
    categories?: string;
    beamedStatus?: string;
    sortBy?: string;
  };
}

export default async function Page({ searchParams }: PageProps) {
  // Fetch the currently authenticated user
  const user:any = await currentUser();
  // console.log('beams today session',user)
  // If the user is not found, display a fallback message
  if (!user) {
    return <div>User not found</div>;
  }


  // Fetch categories and completed topics
  const availableCategories = await getAllCategories();


  return (
    <BeamsTodayPage
      // completedTopics={completedTopics}
      user={user}
      
      categories={availableCategories}
    />
    
  );
}
