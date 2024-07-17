import React from "react";
import { Input, Textarea, Select, SelectItem, Button } from "@nextui-org/react";
import {
  BeamsTheatreCreateInput,
  BeamsTheatreUpdateInput,
  BeamsTheatreGenre,
  BeamsTheatreViewType,
  BeamsTheatreStructure,
} from "@/types/beamsTheatre";

interface BeamsTheatreFormProps {
  form: BeamsTheatreCreateInput | BeamsTheatreUpdateInput;
  genres: BeamsTheatreGenre[];
  setForm: React.Dispatch<React.SetStateAction<BeamsTheatreCreateInput | BeamsTheatreUpdateInput>>;
  onSubmit: (data: BeamsTheatreCreateInput | BeamsTheatreUpdateInput) => void;
}

const BeamsTheatreForm: React.FC<BeamsTheatreFormProps> = ({ form, genres, setForm, onSubmit }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  return (
    <div className="w-full max-w-5xl mb-8">
      <div className="flex flex-col gap-4">
        <Input name="title" value={form.title} onChange={handleChange} placeholder="Title" fullWidth />
        <Textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" fullWidth />
        <Input name="posterUrl" value={form.posterUrl} onChange={handleChange} placeholder="Poster URL" fullWidth />
        <Select name="genreId" value={form.genreId} onChange={handleChange} fullWidth>
          {genres.map((genre) => (
            <SelectItem key={genre.id} value={genre.id}>
              {genre.name}
            </SelectItem>
          ))}
        </Select>
        <Select name="viewType" value={form.viewType} onChange={handleChange} fullWidth>
          <SelectItem key={BeamsTheatreViewType.NOW_SHOWING} value={BeamsTheatreViewType.NOW_SHOWING}>
            Now Showing
          </SelectItem>
          <SelectItem key={BeamsTheatreViewType.TRENDING} value={BeamsTheatreViewType.TRENDING}>
            Trending
          </SelectItem>
          <SelectItem key={BeamsTheatreViewType.DEFAULT} value={BeamsTheatreViewType.DEFAULT}>
            Default
          </SelectItem>
          <SelectItem key={BeamsTheatreViewType.OTHER} value={BeamsTheatreViewType.OTHER}>
            Other
          </SelectItem>
        </Select>
        <Select name="structure" value={form.structure} onChange={handleChange} fullWidth>
          <SelectItem key={BeamsTheatreStructure.SINGLE_VIDEO} value={BeamsTheatreStructure.SINGLE_VIDEO}>
            Single Video
          </SelectItem>
          <SelectItem key={BeamsTheatreStructure.SERIES_WITH_SEASONS} value={BeamsTheatreStructure.SERIES_WITH_SEASONS}>
            Series with Seasons
          </SelectItem>
          <SelectItem key={BeamsTheatreStructure.SERIES_WITHOUT_SEASONS} value={BeamsTheatreStructure.SERIES_WITHOUT_SEASONS}>
            Series without Seasons
          </SelectItem>
        </Select>
        <Button onClick={() => onSubmit(form)}>{(form as BeamsTheatreUpdateInput).id ? "Update" : "Submit"}</Button>
      </div>
    </div>
  );
};

export default BeamsTheatreForm;
