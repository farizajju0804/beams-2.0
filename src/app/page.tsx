import Hero from "@/components/Hero";
import PublicFooter from "@/components/PublicFooter";
import PublicNav from "@/components/PublicNav";

// The main Home page component renders the navigation bar, hero section, and footer.
export default async function Home() {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <PublicNav /> 
      <Hero /> 
      <PublicFooter /> 
    </div>
  );
}