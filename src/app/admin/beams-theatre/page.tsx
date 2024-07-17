// 'use client'
// import React, { useEffect, useState } from "react";
// import { Spinner, Button, Modal, Text, ModalHeader, ModalContent } from "@nextui-org/react";
// import {
//   getBeamsTheatreEntries,
//   getGenres,
//   createBeamsTheatre,
//   updateBeamsTheatre,
//   deleteBeamsTheatre,
//   createSeason,
//   updateSeason,
//   deleteSeason,
//   createEpisode,
//   updateEpisode,
//   deleteEpisode,
// } from "@/actions/beams-theatre/admin/beamsTheatreActions";
// import {
//   BeamsTheatre,
//   BeamsTheatreGenre,
//   BeamsTheatreCreateInput,
//   BeamsTheatreUpdateInput,
//   BeamsTheatreStructure,
//   BeamsTheatreViewType,
//   BeamsTheatreSeasonCreateInput,
//   BeamsTheatreSeasonUpdateInput,
//   BeamsTheatreEpisodeCreateInput,
//   BeamsTheatreEpisodeUpdateInput,
// } from "@/types/beamsTheatre";
// import BeamsTheatreForm from "./_components/BeamsTheatreForm";
// import EntriesList from "./_components/EntriesList";
// import SeasonForm from "./_components/SeasonForm";
// import EpisodeForm from "./_components/EpisodeForm";

// const AdminBeamsTheatre: React.FC = () => {
//   const [entries, setEntries] = useState<BeamsTheatre[]>([]);
//   const [genres, setGenres] = useState<BeamsTheatreGenre[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editId, setEditId] = useState<string | null>(null);
//   const [form, setForm] = useState<BeamsTheatreCreateInput | BeamsTheatreUpdateInput>({
//     title: "",
//     description: "",
//     posterUrl: "",
//     genreId: "",
//     viewType: BeamsTheatreViewType.DEFAULT,
//     structure: BeamsTheatreStructure.SINGLE_VIDEO,
//   });
//   const [showSeasonModal, setShowSeasonModal] = useState(false);
//   const [seasonForm, setSeasonForm] = useState<BeamsTheatreSeasonCreateInput | BeamsTheatreSeasonUpdateInput>({
//     title: "",
//     beamsTheatreId: "",
//   });
//   const [showEpisodeModal, setShowEpisodeModal] = useState(false);
//   const [episodeForm, setEpisodeForm] = useState<BeamsTheatreEpisodeCreateInput | BeamsTheatreEpisodeUpdateInput>({
//     title: "",
//     description: "",
//     url: "",
//     thumbnailUrl: "",
//     durationInSeconds: 0,
//     beamsTheatreId: "",
//     seasonId: "",
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [entriesData, genresData] = await Promise.all([getBeamsTheatreEntries(), getGenres()]);
//         setEntries(entriesData);
//         setGenres(genresData);
//       } catch (error) {
//         console.error("Error fetching Beams Theatre entries and genres:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const handleSubmit = async (data: BeamsTheatreCreateInput | BeamsTheatreUpdateInput) => {
//     try {
//       if (isEditing && editId) {
//         const updatedEntry = await updateBeamsTheatre(editId, data as BeamsTheatreUpdateInput);
//         setEntries((prevEntries) => {
//           const index = prevEntries.findIndex((entry) => entry.id === updatedEntry.id);
//           if (index !== -1) {
//             const updatedEntries = [...prevEntries];
//             updatedEntries[index] = updatedEntry as BeamsTheatre;
//             return updatedEntries;
//           }
//           return prevEntries;
//         });
//       } else {
//         const newEntry = await createBeamsTheatre(data as BeamsTheatreCreateInput);
//         setEntries((prevEntries) => [newEntry, ...prevEntries]);
//         setEditId(newEntry.id);
//       }
//       setForm({
//         title: "",
//         description: "",
//         posterUrl: "",
//         genreId: "",
//         viewType: BeamsTheatreViewType.DEFAULT,
//         structure: BeamsTheatreStructure.SINGLE_VIDEO,
//       });
//       setIsEditing(false);
//     } catch (error) {
//       console.error("Error creating/updating Beams Theatre entry:", error);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     try {
//       await deleteBeamsTheatre(id);
//       setEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== id));
//     } catch (error) {
//       console.error("Error deleting Beams Theatre entry:", error);
//     }
//   };

//   const handleEdit = (entry: BeamsTheatre) => {
//     setForm({
//       id: entry.id,
//       title: entry.title,
//       description: entry.description,
//       posterUrl: entry.posterUrl,
//       genreId: entry.genreId,
//       viewType: entry.viewType,
//       structure: entry.structure,
//       seasons: entry.seasons.map((season) => ({
//         id: season.id,
//         title: season.title,
//         beamsTheatreId: season.beamsTheatreId,
//       })),
//       episodes: entry.episodes.map((episode) => ({
//         title: episode.title,
//         description: episode.description,
//         url: episode.url,
//         thumbnailUrl: episode.thumbnailUrl,
//         durationInSeconds: episode.durationInSeconds,
//         beamsTheatreId: episode.beamsTheatreId,
//         seasonId: episode.seasonId,
//       }))
//     });
//     setEditId(entry.id);
//     setIsEditing(true);
//   };

//   const handleSeasonSubmit = async (data: BeamsTheatreSeasonCreateInput | BeamsTheatreSeasonUpdateInput) => {
//     try {
//       if (seasonForm.id) {
//         const updatedSeason = await updateSeason(seasonForm.id, data as BeamsTheatreSeasonUpdateInput);
//         setForm((prevForm) => ({
//           ...prevForm,
//           seasons: prevForm.seasons?.map((season) => (season.id === updatedSeason.id ? updatedSeason : season)) || [],
//         }));
//       } else {
//         const newSeason = await createSeason(data as BeamsTheatreSeasonCreateInput);
//         setForm((prevForm) => ({
//           ...prevForm,
//           seasons: [...(prevForm.seasons || []), newSeason],
//         }));
//       }
//       setShowSeasonModal(false);
//       setSeasonForm({
//         title: "",
//         beamsTheatreId: "",
//       });
//     } catch (error) {
//       console.error("Error creating/updating season:", error);
//     }
//   };

//   const handleEpisodeSubmit = async (data: BeamsTheatreEpisodeCreateInput | BeamsTheatreEpisodeUpdateInput) => {
//     try {
//       if (episodeForm.id) {
//         const updatedEpisode = await updateEpisode(episodeForm.id, data as BeamsTheatreEpisodeUpdateInput);
//         setForm((prevForm) => ({
//           ...prevForm,
//           episodes: prevForm.episodes?.map((episode) => (episode.id === updatedEpisode.id ? updatedEpisode : episode)) || [],
//         }));
//       } else {
//         const newEpisode = await createEpisode(data as BeamsTheatreEpisodeCreateInput);
//         setForm((prevForm) => ({
//           ...prevForm,
//           episodes: [...(prevForm.episodes || []), newEpisode],
//         }));
//       }
//       setShowEpisodeModal(false);
//       setEpisodeForm({
//         title: "",
//         description: "",
//         url: "",
//         thumbnailUrl: "",
//         durationInSeconds: 0,
//         beamsTheatreId: "",
//         seasonId: "",
//       });
//     } catch (error) {
//       console.error("Error creating/updating episode:", error);
//     }
//   };

//   const handleSeasonEdit = (season: BeamsTheatreSeasonCreateInput | BeamsTheatreSeasonUpdateInput) => {
//     setSeasonForm({
//       id: season.id,
//       title: season.title,
//       beamsTheatreId: season.beamsTheatreId,
//     });
//     setShowSeasonModal(true);
//   };

//   const handleEpisodeEdit = (episode: BeamsTheatreEpisodeCreateInput | BeamsTheatreEpisodeUpdateInput) => {
//     setEpisodeForm({
//       id: episode.id,
//       title: episode.title,
//       description: episode.description,
//       url: episode.url,
//       thumbnailUrl: episode.thumbnailUrl,
//       durationInSeconds: episode.durationInSeconds,
//       beamsTheatreId: episode.beamsTheatreId,
//       seasonId: episode.seasonId,
//     });
//     setShowEpisodeModal(true);
//   };

//   const handleSeasonDelete = async (id: string) => {
//     try {
//       await deleteSeason(id);
//       setForm((prevForm) => ({
//         ...prevForm,
//         seasons: prevForm.seasons?.filter((season) => season.id !== id) || [],
//       }));
//     } catch (error) {
//       console.error("Error deleting season:", error);
//     }
//   };

//   const handleEpisodeDelete = async (id: string) => {
//     try {
//       await deleteEpisode(id);
//       setForm((prevForm) => ({
//         ...prevForm,
//         episodes: prevForm.episodes?.filter((episode) => episode.id !== id) || [],
//       }));
//     } catch (error) {
//       console.error("Error deleting episode:", error);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center w-full p-8 gap-8">
//       {isLoading ? (
//         <div className="flex justify-center items-center h-screen">
//           <Spinner size="large" />
//         </div>
//       ) : (
//         <div className="w-full max-w-5xl">
//           <BeamsTheatreForm form={form} genres={genres} setForm={setForm} onSubmit={handleSubmit} />
//           <EntriesList
//             entries={entries}
//             onEdit={handleEdit}
//             onDelete={handleDelete}
//             onSeasonEdit={handleSeasonEdit}
//             onEpisodeEdit={handleEpisodeEdit}
//           />
//           {isEditing && form.structure === BeamsTheatreStructure.SINGLE_VIDEO && (
//             <EpisodeForm form={form} setForm={setForm} onSubmit={handleEpisodeSubmit} />
//           )}
//           {form.structure === BeamsTheatreStructure.SEASON_BASED && (
//             <div className="mt-4">
//               <Button onClick={() => setShowSeasonModal(true)}>Add Season</Button>
//               <Modal
//                 open={showSeasonModal}
//                 onClose={() => setShowSeasonModal(false)}
//                 width="md"
//                 hideBackdropClose
//                 animation
//               >
//                 <Modal.Header>Add/Edit Season</Modal.Header>
//                 <Modal.Content>
//                   <SeasonForm form={seasonForm} setForm={setSeasonForm} onSubmit={handleSeasonSubmit} />
//                 </Modal.Content>
//               </Modal>
//               <EntriesList
//                 entries={form.seasons || []}
//                 onEdit={handleSeasonEdit}
//                 onDelete={handleSeasonDelete}
//                 isSeasonList
//               />
//               {showEpisodeModal && (
//                 <Modal
//                   open={showEpisodeModal}
//                   onClose={() => setShowEpisodeModal(false)}
//                   width="md"
//                   hideBackdropClose
//                   animation
//                 >
//                   <ModalHeader>Add/Edit Episode</ModalHeader>
//                   <ModalContent>
//                     <EpisodeForm form={episodeForm} setForm={setEpisodeForm} onSubmit={handleEpisodeSubmit} />
//                   </ModalContent>
//                 </Modal>
//               )}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminBeamsTheatre;

import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page