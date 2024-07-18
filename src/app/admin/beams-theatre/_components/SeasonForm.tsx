// import React, { useState, useEffect } from "react";
// import { Input, Button } from "@nextui-org/react";
// import { createSeason, updateSeason, deleteSeason, getSeasons } from "@/actions/beams-theatre/admin/beamsTheatreActions";
// import { BeamsTheatreSeason } from "@/types/beamsTheatre";

// interface SeasonFormProps {
//   beamsTheatreId: string;
// }

// const SeasonForm: React.FC<SeasonFormProps> = ({ beamsTheatreId }) => {
//   const [seasons, setSeasons] = useState<BeamsTheatreSeason[]>([]);
//   const [seasonForm, setSeasonForm] = useState<BeamsTheatreSeason>({
//     id: "",
//     title: "",
//     beamsTheatreId,
//     episodes: [],
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   });

//   useEffect(() => {
//     const fetchSeasons = async () => {
//       try {
//         const seasonsData = await getSeasons(beamsTheatreId);
//         setSeasons(seasonsData);
//       } catch (error) {
//         console.error("Error fetching seasons:", error);
//       }
//     };
//     fetchSeasons();
//   }, [beamsTheatreId]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setSeasonForm((prevForm) => ({
//       ...prevForm,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async () => {
//     try {
//       if (seasonForm.id) {
//         const updatedSeason = await updateSeason(seasonForm.id, seasonForm);
//         setSeasons((prevSeasons) =>
//           prevSeasons.map((season) => (season.id === updatedSeason.id ? updatedSeason : season))
//         );
//       } else {
//         const newSeason = await createSeason(beamsTheatreId, seasonForm.title);
//         setSeasons((prevSeasons) => [...prevSeasons, newSeason]);
//       }
//       setSeasonForm({
//         id: "",
//         title: "",
//         beamsTheatreId,
//         episodes: [],
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       });
//     } catch (error) {
//       console.error("Error creating/updating season:", error);
//     }
//   };

//   const handleEdit = (season: BeamsTheatreSeason) => {
//     setSeasonForm(season);
//   };

//   const handleDelete = async (id: string) => {
//     try {
//       await deleteSeason(id);
//       setSeasons((prevSeasons) => prevSeasons.filter((season) => season.id !== id));
//     } catch (error) {
//       console.error("Error deleting season:", error);
//     }
//   };

//   return (
//     <div className="w-full max-w-5xl mt-8">
//       <h2 className="text-xl font-bold mb-4">Manage Seasons</h2>
//       <Input name="title" value={seasonForm.title} onChange={handleChange} placeholder="Season Title" fullWidth />
//       <Button onClick={handleSubmit}>{seasonForm.id ? "Update Season" : "Add Season"}</Button>
//       <div className="mt-4">
//         {seasons.map((season) => (
//           <div key={season.id} className="border-b border-gray-200 py-4">
//             <h3 className="text-lg font-bold">{season.title}</h3>
//             <Button onClick={() => handleEdit(season)}>Edit Season</Button>
//             <Button onClick={() => handleDelete(season.id)}>Delete Season</Button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default SeasonForm;
