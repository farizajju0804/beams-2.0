'use client'

import { useEffect, useRef } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { validateSession } from '@/actions/auth/getSessionValid';
import { signOutUser } from '@/actions/auth/signout';

export const SessionValidator = () => {
  const { data: session, status, update } = useSession();
  const isUpdating = useRef(false);
  const executionLock = useRef(false);

  const handleSignOut = async () => {
    const result = await signOutUser(); 
    if (result.success) {
      await signOut({ callbackUrl: '/auth/login' });
    }
  };

  useEffect(() => {
    const checkAndUpdateSession = async () => {
      console.log("SessionValidator: Effect triggered");
      
      if (executionLock.current) {
        console.log("SessionValidator: Execution already in progress, skipping");
        return;
      }

      executionLock.current = true;

      // Early sign out for unauthenticated users or missing sessions
      if (status === "unauthenticated" || !session) {
        console.log("SessionValidator: No active session, signing out");
        // await handleSignOut();
        return;
      }

      try {
        if (isUpdating.current) {
          console.log("SessionValidator: Update already in progress, skipping");
          return;
        }

        console.log("SessionValidator: Starting session validation");
        isUpdating.current = true;
        
        const sessionStatus = await validateSession();
        console.log("SessionValidator: Received session status:", sessionStatus);

        if (sessionStatus === undefined) {
          console.log("SessionValidator: Session status is undefined, signing out");
        //   await handleSignOut();
          return;
        }

        const needsUpdate = 
          sessionStatus?.isSessionValid !== session.user.isSessionValid ||
          sessionStatus.isBanned !== session.user.isBanned;

        console.log("SessionValidator: Session needs update:", needsUpdate);
        console.log("Current session values:", {
          isSessionValid: session.user.isSessionValid,
          isBanned: session.user.isBanned
        });
        console.log("New session values:", {
          isSessionValid: sessionStatus?.isSessionValid,
          isBanned: sessionStatus?.isBanned
        });

        if (needsUpdate) {
          console.log("SessionValidator: Updating session");
          const updatedSession = await update({
            ...session,
            user: {
              ...session.user,
              isSessionValid: sessionStatus?.isSessionValid,
              isBanned: sessionStatus?.isBanned
            }
          });

          console.log("SessionValidator: Session updated", updatedSession);

          if (!sessionStatus?.isSessionValid || sessionStatus.isBanned) {
            console.log("SessionValidator: Session is invalid or user is banned, signing out");
            await handleSignOut();
          }
        } else {
          console.log("SessionValidator: No update needed");
        }
      } catch (error) {
        console.error('SessionValidator: Error validating session:', error);
        await handleSignOut();
      } finally {
        console.log("SessionValidator: Finished session check");
        isUpdating.current = false;
        executionLock.current = false;
      }
    };

    checkAndUpdateSession();
  }, [session, status, update]);

  console.log("SessionValidator: Rendered");
  return null;
};