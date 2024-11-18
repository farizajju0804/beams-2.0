import { getConnectionGames } from "../admin/connectionGame";
import { ConnectionGameAdmin } from "./connectionGameAdmin";



export default async function ConnectionGamePage() {
    const initialGames = await getConnectionGames();
    
    return <ConnectionGameAdmin 
    initialGames={initialGames}
   />;
  }