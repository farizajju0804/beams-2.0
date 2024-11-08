'use server'

import { currentUser } from "@/libs/auth";
import { db } from "@/libs/db";
import { updateUserPointsAndLeaderboard } from "../points/updateUserPointsAndLeaderboard";


interface WordGameResponse {
  success: boolean;
  data?: {
    id: string;
    answer: string;
    hint: string;
    image: string;
    title : string;
    beamsTodayTitle: string;
  };
  error?: string;
}

export async function getWordGame(beamsTodayId: string): Promise<WordGameResponse> {
  try {
    const wordGame = await db.connectionGame.findFirst({
      where: {
        beamsTodayId,
      },
      include: {
        beamsToday: {
          select: {
            title: true,
          },
        },
      },
    });

    if (!wordGame) {
      return {
        success: false,
        error: 'Word game not found'
      };
    }

    return {
      success: true,
      data: {
        id: wordGame.id,
        answer: wordGame.answer,
        hint: wordGame.hint,
        image: wordGame.image,
        title : wordGame.title,
        beamsTodayTitle: wordGame.beamsToday.title,
      },
    };
  } catch (error) {
    console.error('Error fetching word game:', error);
    return {
      success: false,
      error: 'Failed to fetch word game'
    };
  }
}




interface ConnectionGameStatus {
  success: boolean;
  gameExists: boolean;
  data?: {
    gameId: string;
    isCompleted: boolean;

  };
  error?: string;
}

export async function checkConnectionGameStatus(beamsTodayId: string): Promise<ConnectionGameStatus> {
  try {
    // Get current user session
    const user = await currentUser()
    if (!user?.id) {
      return {
        success: false,
        gameExists: false,
        error: 'User not authenticated'
      };
    }

    // First check if the connection game exists for this BeamsToday
    const connectionGame = await db.connectionGame.findUnique({
      where: {
        beamsTodayId: beamsTodayId
      },
      select: {
        id: true,
        title: true,
        completions: {
          where: {
            userId: user.id,
            completed: true
          }
        }
      }
    });

    // If game doesn't exist
    if (!connectionGame) {
      return {
        success: true,
        gameExists: false,
        data: undefined
      };
    }

    // Game exists, check completion status
    const completion = connectionGame.completions[0]; // Get first completion if exists

    return {
      success: true,
      gameExists: true,
      data: {
        gameId: connectionGame.id,
        isCompleted: !!completion,

      }
    };

  } catch (error) {
    console.error('Error checking connection game status:', error);
    return {
      success: false,
      gameExists: false,
      error: 'Failed to check game status'
    };
  }
}



interface GameCompletionResponse {
  success: boolean;
  data?: {
    userBeamPoints: any;
    leveledUp: boolean;
    newLevel?: any;
    levelCaption?: any;
  };
  error?: string;
}

export async function completeConnectionGame(
  connectionGameId: string,
  pointsEarned: number
): Promise<GameCompletionResponse> {
  try {
    // Get current user
    const user = await currentUser();
    if (!user?.id) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    // Get the connection game and associated beamsToday title
    const connectionGame = await db.connectionGame.findUnique({
      where: {
        id: connectionGameId
      },
      include: {
        beamsToday: {
          select: {
            title: true
          }
        }
      }
    });

    if (!connectionGame) {
      return {
        success: false,
        error: 'Connection game not found'
      };
    }

    // Create completion record
    await db.connectionGameCompletion.create({
      data: {
        userId: user.id,
        connectionGameId: connectionGameId,
        completed: true,
      }
    });

    // Update user points and leaderboard
    const updateResult = await updateUserPointsAndLeaderboard(
      user.id,
      pointsEarned,
      'CONNECTION_GAME',
      `Completed connection game for "${connectionGame.beamsToday.title}"`,
      user.userType
    );

    return {
      success: true,
      data: {
        userBeamPoints: updateResult.userBeamPoints,
        leveledUp: updateResult.leveledUp,
        newLevel: updateResult.newLevel,
        levelCaption: updateResult.levelCaption
      }
    };

  } catch (error) {
    console.error('Error completing connection game:', error);
    return {
      success: false,
      error: 'Failed to complete game'
    };
  }
}