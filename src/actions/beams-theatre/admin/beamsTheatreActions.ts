// "use server";

// import { db } from "@/libs/db";
// import { BeamsTheatre, BeamsTheatreCreateInput, BeamsTheatreUpdateInput, BeamsTheatreSeason, BeamsTheatreEpisode, BeamsTheatreGenre, BeamsTheatreEpisodeUpdateInput, BeamsTheatreEpisodeCreateInput } from "@/types/beamsTheatre";

// // Fetch all BeamsTheatre entries
// export const getBeamsTheatreEntries = async (): Promise<BeamsTheatre[]> => {
//   try {
//     const entries = await db.beamsTheatre.findMany({
//       include: {
//         seasons: {
//           include: {
//             episodes: true
//           }
//         },
//         episodes: true,
//       },
//     });
//     console.log("Fetched Beams Theatre entries:", entries);
//     return entries as any;
//   } catch (error) {
//     console.error("Error fetching Beams Theatre entries:", error);
//     throw new Error(`Error fetching Beams Theatre entries: ${(error as Error).message}`);
//   }
// };

// // Create a new BeamsTheatre entry
// export const createBeamsTheatre = async (data: BeamsTheatreCreateInput): Promise<BeamsTheatre> => {
//   try {
//     const newEntry = await db.beamsTheatre.create({
//       data: {
//         ...data,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//     });
//     console.log("Created Beams Theatre entry:", newEntry);
//     return newEntry as any;
//   } catch (error) {
//     console.error("Error creating Beams Theatre entry:", error);
//     throw new Error(`Error creating Beams Theatre entry: ${(error as Error).message}`);
//   }
// };

// // Update an existing BeamsTheatre entry

// // export const updateBeamsTheatre = async (id: string, data: BeamsTheatreUpdateInput) => {
// //     try {
// //       // Prepare the update data object excluding empty arrays
// //       const updateData: BeamsTheatreUpdateInput = {
// //         ...data,
// //         seasons: data.seasons?.length ? data.seasons : undefined,
// //         episodes: data.episodes?.length ? data.episodes : undefined,
// //       };
  
// //       const updatedBeamsTheatre = await db.beamsTheatre.update({
// //         where: { id },
// //         data: updateData,
// //       });
// //       return updatedBeamsTheatre;
// //     } catch (error) {
// //       console.error("Error updating Beams Theatre entry:", error);
// //       throw new Error(`Error updating Beams Theatre entry: ${(error as Error).message}`);
// //     }
// //   };
// // Delete a BeamsTheatre entry
// export const deleteBeamsTheatre = async (id: string): Promise<void> => {
//   try {
//     await db.beamsTheatre.delete({
//       where: { id },
//     });
//     console.log("Deleted Beams Theatre entry with id:", id);
//   } catch (error) {
//     console.error("Error deleting Beams Theatre entry:", error);
//     throw new Error(`Error deleting Beams Theatre entry: ${(error as Error).message}`);
//   }
// };

// // Fetch all genres
// export const getGenres = async (): Promise<BeamsTheatreGenre[]> => {
//   try {
//     const genres = await db.beamsTheatreGenre.findMany();
//     console.log("Fetched genres:", genres);
//     return genres as any;
//   } catch (error) {
//     console.error("Error fetching genres:", error);
//     throw new Error(`Error fetching genres: ${(error as Error).message}`);
//   }
// };

// // Fetch all seasons for a BeamsTheatre entry
// export const getSeasons = async (beamsTheatreId: string): Promise<BeamsTheatreSeason[]> => {
//   try {
//     const seasons = await db.beamsTheatreSeason.findMany({
//       where: { beamsTheatreId },
//       include: {
//         episodes: true,
//       },
//     });
//     console.log("Fetched seasons for Beams Theatre entry:", beamsTheatreId, seasons);
//     return seasons as any;
//   } catch (error) {
//     console.error("Error fetching seasons:", error);
//     throw new Error(`Error fetching seasons: ${(error as Error).message}`);
//   }
// };

// // Create a new season for a BeamsTheatre entry
// export const createSeason = async (beamsTheatreId: string, title: string): Promise<BeamsTheatreSeason> => {
//   try {
//     const newSeason = await db.beamsTheatreSeason.create({
//       data: {
//         title,
//         beamsTheatreId,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//     });
//     console.log("Created season:", newSeason);
//     return newSeason as any;
//   } catch (error) {
//     console.error("Error creating season:", error);
//     throw new Error(`Error creating season: ${(error as Error).message}`);
//   }
// };

// export const updateSeason = async (id: string, data: Partial<BeamsTheatreSeason>): Promise<BeamsTheatreSeason> => {
//     try {
//       // Ensure episodes are not included directly in the data
//       const { episodes, ...updateData } = data;
  
//       const updatedSeason = await db.beamsTheatreSeason.update({
//         where: { id },
//         data: {
//           ...updateData,
//           updatedAt: new Date(),
//         },
//       });
  
//       console.log("Updated season:", updatedSeason);
//       return updatedSeason as any;
//     } catch (error) {
//       console.error("Error updating season:", error);
//       throw new Error(`Error updating season: ${(error as Error).message}`);
//     }
//   };
  
  


// // Delete a season
// export const deleteSeason = async (id: string): Promise<void> => {
//   try {
//     await db.beamsTheatreSeason.delete({
//       where: { id },
//     });
//     console.log("Deleted season with id:", id);
//   } catch (error) {
//     console.error("Error deleting season:", error);
//     throw new Error(`Error deleting season: ${(error as Error).message}`);
//   }
// };

// // Fetch all episodes for a BeamsTheatre entry
// export const getEpisodes = async (beamsTheatreId: string): Promise<BeamsTheatreEpisode[]> => {
//   try {
//     const episodes = await db.beamsTheatreEpisode.findMany({
//       where: { beamsTheatreId },
//     });
//     console.log("Fetched episodes for Beams Theatre entry:", beamsTheatreId, episodes);
//     return episodes as any;
//   } catch (error) {
//     console.error("Error fetching episodes:", error);
//     throw new Error(`Error fetching episodes: ${(error as Error).message}`);
//   }
// };

// // Create a new episode for a BeamsTheatre entry
// export const createEpisode = async (data: BeamsTheatreEpisodeCreateInput): Promise<BeamsTheatreEpisode> => {
//     try {
//       console.log("Creating episode with data:", data);
  
//       const newEpisode = await db.beamsTheatreEpisode.create({
//         data: {
//           ...data,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//       });
  
//       console.log("Created episode:", newEpisode);
//       return newEpisode as any;
//     } catch (error) {
//       console.error("Error creating episode:", error);
//       throw new Error(`Error creating episode: ${(error as Error).message}`);
//     }
//   };
  
//   // Update an existing episode
//   export const updateEpisode = async (id: string, data: BeamsTheatreEpisodeUpdateInput): Promise<BeamsTheatreEpisode> => {
//     try {
//       const updatedEpisode = await db.beamsTheatreEpisode.update({
//         where: { id },
//         data: {
//           ...data,
//           updatedAt: new Date(),
//         },
//       });
  
//       console.log("Updated episode:", updatedEpisode);
//       return updatedEpisode as any;
//     } catch (error) {
//       console.error("Error updating episode:", error);
//       throw new Error(`Error updating episode: ${(error as Error).message}`);
//     }
//   };
// // Delete an episode
// export const deleteEpisode = async (id: string): Promise<void> => {
//   try {
//     await db.beamsTheatreEpisode.delete({
//       where: { id },
//     });
//     console.log("Deleted episode with id:", id);
//   } catch (error) {
//     console.error("Error deleting episode:", error);
//     throw new Error(`Error deleting episode: ${(error as Error).message}`);
//   }
// };
