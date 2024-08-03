import { getcompletedBeamsToday } from "@/actions/beams-today/completedActions";
import { currentUser } from "@/libs/auth";
import BeamsTodayPage from "./_components/BeamsTodayPage";
import { getAllBeamsToday } from "@/actions/beams-today/getAllBeamsToday";
import { getAllCategories } from "@/actions/beams-today/categoryActions";

export default async function Page({ searchParams }: { searchParams: { query: string } }) {
  const user:any = await currentUser();

  if (!user) {
    return <div>User not found</div>;
  }

  const completedTopics = await getcompletedBeamsToday(user.id);
  const topics = await getAllBeamsToday();
  const searchQuery = searchParams.query || "";
  const categories = await getAllCategories();
  return (
    <BeamsTodayPage
      completedTopics={completedTopics}
      user={user}
      topics={topics}
      categories={categories}
      searchQuery={searchQuery}
    />
  );
}
