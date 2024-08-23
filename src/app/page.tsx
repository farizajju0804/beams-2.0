import { LoginButton } from "@/components/auth/login-button";
import Hero from "@/components/Hero";
import PublicFooter from "@/components/PublicFooter";
import PublicNav from "@/components/PublicNav";
export default function Home() {
  return (
    <div className="w-full flex flex-col justify-center items-center bg-white">
      <PublicNav/>
        <Hero />
        <PublicFooter/>
    </div>
  );
}