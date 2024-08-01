import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";

export const useCurrentUser = () => {
  const { data: session, status } = useSession();
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUser({ ...session.user, email: session.user.email ?? '', name: session.user.name ?? '' });
    }
  }, [session, status, setUser]);

  return user;
};
