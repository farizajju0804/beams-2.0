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
  const { data: session, status, update } = useSession(); 
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const updateAndStoreUser = async () => {
      if (status === "authenticated" && session?.user) {
        // Update the session data if necessary
        const updatedSession:any = await update({
          ...session.user,
          // email: session.user.email ?? '',
          // firstName: session.user.firstName ?? '',
          // lastName: session.user.lastName ?? '',
          // Add any other fields you want to update
        });

        // Store the updated session data in Zustand
        setUser(updatedSession?.user || session.user);
      }
    };

    updateAndStoreUser();
  }, [session, status, setUser, update]);

  return user;
};
