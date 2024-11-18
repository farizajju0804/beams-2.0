'use server'

import { currentUser } from "@/libs/auth";
import { db } from "@/libs/db";
import { updateUserPointsAndLeaderboard } from "../points/updateUserPointsAndLeaderboard";
import { Prisma } from "@prisma/client";


interface WordGameResponse {
  success: boolean;
  data?: {
    id: string;
    answer: string;
    date : Date;
    hint: string;
    image: string;
    title : string;
    answerExplantion : string,
    solutionPoints : string[],
  };
  error?: string;
}

export async function getWordGame(clientDate: string): Promise<WordGameResponse> {

  const today = new Date(clientDate); // Parse the client-provided date into a Date object.
  today.setUTCHours(0, 0, 0, 0); // Set the time to midnight UTC to match videos by date only.
  try {
    const wordGame = await db.connectionGame.findFirst({
      where: {
        date : today,
        published : true,
      }
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
        date : wordGame.date,
        image: wordGame.image,
        title : wordGame.title,
        answerExplantion : wordGame.answerExplanation,
        solutionPoints : wordGame.solutionPoints,
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


export async function getWordGameById(id: string): Promise<WordGameResponse> {

  try {
    const wordGame = await db.connectionGame.findFirst({
      where: {
       id : id
      }
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
        date : wordGame.date,
        hint: wordGame.hint,
        image: wordGame.image,
        title : wordGame.title,
        answerExplantion : wordGame.answerExplanation,
        solutionPoints : wordGame.solutionPoints,
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

export async function checkConnectionGameStatus(id: string): Promise<ConnectionGameStatus> {
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
        id: id
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
    leveledUp: any;
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


    let updateResult
    if(pointsEarned > 0) {
    // Update user points and leaderboard
    updateResult = await updateUserPointsAndLeaderboard(
      user.id,
      pointsEarned,
      'CONNECTION_GAME',
      `Completed connection game for "${connectionGame.title}"`,
      user.userType
    );
  }

    return {
      success: true,
      data: {
        userBeamPoints: updateResult?.userBeamPoints,
        leveledUp: updateResult?.leveledUp,
        newLevel: updateResult?.newLevel,
        levelCaption: updateResult?.levelCaption
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



interface GetRecentGamesParams {
  clientDate: string
  page?: number
  limit?: number
  sortBy?: 'dateDesc' | 'dateAsc' | 'titleAsc' | 'titleDesc'
  filterOption?: 'all' | 'completed' | 'incomplete'
  userId?: string
}

interface Game {
  id: string
  title: string
  date: Date
  hint: string
  image: string
  isCompleted: boolean
}

interface PaginatedGamesResponse {
  success: boolean
  games?: Game[]
  totalPages?: number
  currentPage?: number
  error?: string
}


export async function getRecentGames({
  clientDate,
  page = 1,
  limit = 9,
  sortBy = "dateDesc",
  filterOption = "all",
  userId
}: GetRecentGamesParams): Promise<PaginatedGamesResponse> {
  const today = new Date(clientDate);
  today.setUTCHours(0, 0, 0, 0);

  try {
    const skip = (page - 1) * limit;

    // Define sort order based on sortBy parameter
    const orderBy: Prisma.ConnectionGameOrderByWithRelationInput = (() => {
      switch (sortBy) {
        case "titleAsc":
          return { title: 'asc' };
        case "titleDesc":
          return { title: 'desc' };
        case "dateAsc":
          return { date: 'asc' };
        case "dateDesc":
        default:
          return { date: 'desc' };
      }
    })();

    // Base where clause
    let whereClause: Prisma.ConnectionGameWhereInput = {
      date: {
        lt: today,
      },
      published: true,
    };

    // Add completion filter if userId is provided
    if (filterOption !== "all" && userId) {
      const completedGamesCondition = {
        completions: {
          some: {
            userId: userId,
            completed: true
          }
        }
      };

      if (filterOption === "completed") {
        whereClause = { ...whereClause, ...completedGamesCondition };
      } else if (filterOption === "incomplete") {
        whereClause = { ...whereClause, NOT: completedGamesCondition };
      }
    }

    // Get total count for pagination
    const totalCount = await db.connectionGame.count({
      where: whereClause,
    });

    // Fetch games with completion status
    const recentGames = await db.connectionGame.findMany({
      where: whereClause,
      orderBy,
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        date: true,
        hint: true,
        image: true,
        completions: userId ? {
          where: {
            userId: userId,
            completed: true
          },
          select: {
            id: true
          }
        } : false,
      },
    });

    // Transform the data to include completion status
    const transformedGames = recentGames.map(game => ({
      id: game.id,
      title: game.title,
      date: game.date,
      hint: game.hint,
      image: game.image,
      isCompleted: userId ? game.completions.length > 0 : false
    }));

    return {
      success: true,
      games: transformedGames,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };

  } catch (error) {
    console.error('Error fetching recent games:', error);
    return {
      success: false,
      games: [],  
      totalPages: 1,
      currentPage: 1,
      error: `Failed to fetch recent games: ${(error as Error).message}`
    };
  }
}