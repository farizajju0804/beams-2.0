import React from 'react';

interface SeasonDropdownProps {
  seasons: string[];
  selectedSeason: string | null;
  onSeasonChange: (seasonId: string) => void;
}

const SeasonDropdown: React.FC<SeasonDropdownProps> = ({ seasons, selectedSeason, onSeasonChange }) => {
  return (
    <select
      value={selectedSeason || ''}
      onChange={(e) => onSeasonChange(e.target.value)}
      className="season-dropdown p-2 border rounded"
    >
      {seasons.map((season) => (
        <option key={season} value={season}>
          {season}
        </option>
      ))}
    </select>
  );
};

export default SeasonDropdown;
