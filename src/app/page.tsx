
import Hero from "@/components/Hero";
import PublicFooter from "@/components/PublicFooter";
import PublicNav from "@/components/PublicNav";

export default async function Home() {

  return (
    <div className="w-full flex flex-col justify-center items-center">
         <PublicNav/>
        <Hero />
        <PublicFooter/>
    </div>
  );
}