import { currentUser } from "@/libs/auth";
import BeamsTodayPage from "./_components/BeamsTodayPage";
import { getAllCategories } from "@/actions/beams-today/categoryActions";


export default async function Page() {
  const user:any = await currentUser();
  if (!user) {
    return <div>User not found</div>;
  }


  // Fetch categories and completed topics
  const availableCategories = await getAllCategories();


  return (
    <BeamsTodayPage
      user={user}
      categories={availableCategories}
    />
    
  );
}
