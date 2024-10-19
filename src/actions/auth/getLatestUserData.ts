'use server'
import { db } from "@/libs/db";
import { auth } from "@/auth";

export async function getLatestUserData() {
  const session = await auth();

  if (!session || !session.user?.email) {
    return null;
  }

  // Fetch the user's basic information
  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      email: true,
      firstName: true,
      gender:true,
      dob:true,
      schoolName:true,
      lastName: true,
      image: true,
      grade:true,
      userType: true,
      isTwoFactorEnabled: true,
      userFormCompleted: true,
      onBoardingCompleted: true,
    },
  });

  if (!user) {
    return null;
  }

  // Fetch the user's beam points and level, where userId is unique
  const userBeamPoints = await db.userBeamPoints.findFirst({
    where: { userId: user.id }, // Query based on the unique `userId`
    select: {
      beams: true,  // Total points (beams) accumulated by the user
      level: {
        select: {
          levelNumber: true,  // User's current level number
          name: true,         // Level's name (e.g., "Newbie", "Amateur")
        }
      }
    }
  });
  const levelDefault = await db.level.findFirst({
    where : {
      levelNumber :  1
    }
  })
  return {
    ...user,
    beams: userBeamPoints?.beams || 0,  // Default to 0 if no points exist
    level: userBeamPoints?.level?.levelNumber || levelDefault?.levelNumber,  // Default to level 1
    levelName: userBeamPoints?.level?.name || levelDefault?.name  // Default to 'Newbie'
  };
}
