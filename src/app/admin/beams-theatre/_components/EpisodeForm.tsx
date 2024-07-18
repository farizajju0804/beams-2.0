// import React, { useState, useEffect } from "react";
// import { Input, Textarea, Button } from "@nextui-org/react";
// import { createEpisode, updateEpisode, deleteEpisode, getEpisodes } from "@/actions/beams-theatre/admin/beamsTheatreActions";
// import { BeamsTheatreEpisode, BeamsTheatreEpisodeCreateInput, BeamsTheatreEpisodeUpdateInput } from "@/types/beamsTheatre";

// interface EpisodeFormProps {
//   beamsTheatreId: string;
//   seasonId?: string;
// }

// const EpisodeForm: React.FC<EpisodeFormProps> = ({ beamsTheatreId, seasonId }) => {
//   const [episodes, setEpisodes] = useState<BeamsTheatreEpisode[]>([]);
//   const [episodeForm, setEpisodeForm] = useState<BeamsTheatreEpisodeCreateInput & { id?: string }>({
//     title: "",
//     description: "",
//     url: "",
//     thumbnailUrl: "",
//     durationInSeconds: 0,
//     beamsTheatreId,
//     seasonId,
//     id: undefined,
//   });

//   useEffect(() => {
//     const fetchEpisodes = async () => {
//       try {
//         const episodesData = await getEpisodes(beamsTheatreId);
//         setEpisodes(episodesData);
//       } catch (error) {
//         console.error("Error fetching episodes:", error);
//       }
//     };
//     fetchEpisodes();
//   }, [beamsTheatreId]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setEpisodeForm((prevForm) => ({
//       ...prevForm,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async () => {
//     try {
//       if (episodeForm.id) {
//         const updatedEpisode = await updateEpisode(episodeForm.id, episodeForm as BeamsTheatreEpisodeUpdateInput);
//         setEpisodes((prevEpisodes) =>
//           prevEpisodes.map((episode) => (episode.id === updatedEpisode.id ? updatedEpisode : episode))
//         );
//       } else {
//         const newEpisode = await createEpisode(episodeForm as BeamsTheatreEpisodeCreateInput);
//         setEpisodes((prevEpisodes) => [...prevEpisodes, newEpisode]);
//       }
//       setEpisodeForm({
//         title: "",
//         description: "",
//         url: "",
//         thumbnailUrl: "",
//         durationInSeconds: 0,
//         beamsTheatreId,
//         seasonId,
//         id: undefined,
//       });
//     } catch (error) {
//       console.error("Error creating/updating episode:", error);
//     }
//   };

//   const handleEdit = (episode: BeamsTheatreEpisode) => {
//     setEpisodeForm({ ...episode, durationInSeconds: episode.durationInSeconds });
//   };

//   const handleDelete = async (id: string) => {
//     try {
//       await deleteEpisode(id);
//       setEpisodes((prevEpisodes) => prevEpisodes.filter((episode) => episode.id !== id));
//     } catch (error) {
//       console.error("Error deleting episode:", error);
//     }
//   };

//   return (
//     <div className="w-full max-w-5xl mt-8">
//       <h2 className="text-xl font-bold mb-4">Manage Episodes</h2>
//       <Input name="title" value={episodeForm.title} onChange={handleChange} placeholder="Episode Title" fullWidth />
//       <Textarea name="description" value={episodeForm.description} onChange={handleChange} placeholder="Episode Description" fullWidth />
//       <Input name="url" value={episodeForm.url} onChange={handleChange} placeholder="Video URL" fullWidth />
//       <Input name="thumbnailUrl" value={episodeForm.thumbnailUrl} onChange={handleChange} placeholder="Thumbnail URL" fullWidth />
//       <Input name="durationInSeconds" type="number" value={episodeForm.durationInSeconds.toString()} onChange={handleChange} placeholder="Duration in Seconds" fullWidth />
//       <Button onClick={handleSubmit}>{episodeForm.id ? "Update Episode" : "Add Episode"}</Button>
//       <div className="mt-4">
//         {episodes.map((episode) => (
//           <div key={episode.id} className="border-b border-gray-200 py-4">
//             <h3 className="text-lg font-bold">{episode.title}</h3>
//             <Button onClick={() => handleEdit(episode)}>Edit Episode</Button>
//             <Button onClick={() => handleDelete(episode.id)}>Delete Episode</Button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default EpisodeForm;
