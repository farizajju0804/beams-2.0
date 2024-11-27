import { getFactsByCategory } from "@/actions/fod/fod";
import { currentUser } from "@/libs/auth";
import { CategoryFacts } from "../../_components/CategoryPage";


interface PageProps {
  params: {
    category: string;
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const user: any = await currentUser();
  
  // Clean up the category name by:
  // 1. Decoding the URL encoding
  // 2. Replacing spaces with actual spaces
  // 3. Converting to proper case (first letter of each word capitalized)
  const categoryName = decodeURIComponent(params.category)
    .replace(/%20/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  // Fetch initial data with cleaned category name
  const initialData = await getFactsByCategory({
    categoryName,
    userId: user.id
  });

  // Extract the category details from the first fact
  const categoryDetails = initialData.facts[0]?.category || {
    name: categoryName,
    color: "#000000" // Default color if no facts found
  };

  return (
    <CategoryFacts
      initialData={initialData}
      categoryName={categoryDetails.name}
      categoryColor={categoryDetails.color}
      userId={user.id}
    />
  );
}