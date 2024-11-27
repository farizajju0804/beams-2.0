import { currentUser } from "@/libs/auth";
import { getFactsByHashtag } from "@/actions/fod/fod";
import { HashtagFacts } from "../../_components/HashtagPage";


interface PageProps {
  params: {
    hashtag: string;
  };
}

export default async function HashtagPage({ params }: PageProps) {
  const user: any = await currentUser();
  const decodedHashtag = decodeURIComponent(params.hashtag);
  
  const initialData = await getFactsByHashtag({
    hashtag: decodedHashtag,
    userId: user.id
  });

  return (
    <HashtagFacts 
      initialData={initialData}
      hashtag={decodedHashtag}
      userId={user.id}
    />
  );
}