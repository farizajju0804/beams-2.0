import React from 'react';
import { Select, SelectItem } from '@nextui-org/react';

interface SeasonDropdownProps {
  seasons: string[];
  selectedSeason: string | null;
  onSeasonChange: (seasonId: string) => void;
}

const SeasonDropdown: React.FC<SeasonDropdownProps> = ({ seasons, selectedSeason, onSeasonChange }) => {
  return (
    <Select
      label="Select Season"
      defaultSelectedKeys={[selectedSeason || 'Season 1']}
      value={selectedSeason || 'Season 1'}
      onChange={(e) => onSeasonChange(e.target.value)}
    >
      {seasons.map((season) => (
        <SelectItem key={season} value={season}>
          {season}
        </SelectItem>
      ))}
    </Select>
  );
};

export default SeasonDropdown;
