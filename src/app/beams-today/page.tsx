import { getcompletedBeamsToday } from "@/actions/beams-today/completedActions";
import { currentUser } from "@/libs/auth";
import BeamsTodayPage from "@/components/beams-today/BeamsTodayPage";

export default async function Page() {
  const user:any = await currentUser();

  if (!user) {
    return <div>User not found</div>;
  }

  const completedTopics = await getcompletedBeamsToday(user.id);
  
  return (
    <BeamsTodayPage
  
      completedTopics={completedTopics}
      user={user}
    />
  );
}
