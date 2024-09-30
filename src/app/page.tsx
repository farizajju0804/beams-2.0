import { LoginButton } from "@/app/auth/_components/login-button";
import Hero from "@/components/Hero";
import Nav from "@/components/Navbar";
import PublicFooter from "@/components/PublicFooter";
import PublicNav from "@/components/PublicNav";
import { currentUser } from "@/libs/auth";
export default async function Home() {
  const user = await currentUser();
  return (
    <div className="w-full flex flex-col justify-center items-center">
        {user ? <Nav/> : <PublicNav/>}
        <Hero />
        <PublicFooter/>
    </div>
  );
}