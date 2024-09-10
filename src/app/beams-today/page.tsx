import { getcompletedBeamsToday } from "@/actions/beams-today/completedActions";
import { currentUser } from "@/libs/auth";
import BeamsTodayPage from "./_components/BeamsTodayPage";
import { getAllBeamsToday, getNewBeamsToday } from "@/actions/beams-today/getAllBeamsToday";
import { getAllCategories } from "@/actions/beams-today/categoryActions";

export default async function Page() {
  // Fetch the currently authenticated user
  const user:any = await currentUser();

  // If the user is not found, display a fallback message
  if (!user) {
    return <div>User not found</div>;
  }

  // Fetch completed topics for the user
  const completedTopics = await getcompletedBeamsToday(user.id);
  
  // Fetch all available Beams Today topics
  const topics = await getAllBeamsToday();
  const newTopics = await getNewBeamsToday();
  
  // Extract the search query parameter, or default to an empty string
 
  
  // Fetch all available categories
  const categories = await getAllCategories();

  // Render the BeamsTodayPage component, passing all fetched data as props
  return (
    <BeamsTodayPage
      completedTopics={completedTopics}
      user={user}
      topics={topics}
      newTopics={newTopics}
      categories={categories}
    />
  );
}
