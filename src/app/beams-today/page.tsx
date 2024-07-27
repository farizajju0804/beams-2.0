import { getcompletedBeamsToday } from "@/actions/beams-today/completedActions";
import { currentUser } from "@/libs/auth";
import BeamsTodayPage from "@/components/beams-today/BeamsTodayPage";
import { CustomGreeting } from "@/components/beams-today/CustomGreeting";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import { Home } from "iconsax-react";

export default async function Page() {
  const user:any = await currentUser();

  if (!user) {
    return <div>User not found</div>;
  }

  const completedTopics = await getcompletedBeamsToday(user.id);
  const greeting = await CustomGreeting();
  return (
    <>
  
    <BeamsTodayPage
      greeting={greeting}
      completedTopics={completedTopics}
      user={user}
    />
    </>
  );
}
