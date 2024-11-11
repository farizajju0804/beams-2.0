import { getBeamsTodayTopics, getConnectionGames } from "../_actions/admin/connectionGame";
import { ConnectionGameAdmin } from "./connectionGameAdmin";



export default async function ConnectionGamePage() {
    const beamsTodayTopics = await getBeamsTodayTopics();
    const initialGames = await getConnectionGames();
    
    return <ConnectionGameAdmin 
    initialGames={initialGames}
    beamsTodayTopics={beamsTodayTopics} />;
  }