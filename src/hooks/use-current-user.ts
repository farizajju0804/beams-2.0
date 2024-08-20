// import { useSession } from "next-auth/react";
// import { useEffect } from "react";
// import { useUserStore } from "@/store/userStore";

// export const useCurrentUser = async() => {
//   const { data: session, status } = useSession();
//   const setUser = useUserStore((state) => state.setUser);
//   const user = useUserStore((state) => state.user);

//   useEffect(() => {
//     if (status === "authenticated" && session?.user) {
     
//       setUser({ ...session.user, email: session.user.email ?? '', firstName: session.user.firstName ?? '' });
//     }
//   }, [session, status, setUser]);

//   return user;
// };
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";

export const useCurrentUser = () => {
  const { data: session, status } = useSession(); 
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // Store the session data in Zustand only if authenticated
      setUser(session.user);
    }
  }, [session, status, setUser]);

  return user;
};

