import React from 'react';
import Select, { MultiValue, ActionMeta } from 'react-select';

interface TierFilterProps {
  selectedTiers: string[];
  setSelectedTiers: React.Dispatch<React.SetStateAction<string[]>>;
}

const tierOptions = [
  { value: 'NORMAL', label: 'NORMAL' },
  { value: 'TIER 1', label: 'TIER 1' },
  { value: 'TIER 2', label: 'TIER 2' },
  { value: 'TIER 3', label: 'TIER 3' },
];

const TierFilter = ({ selectedTiers, setSelectedTiers }: TierFilterProps) => {
  const handleChange = (newValue: MultiValue<{ value: string; label: string }>, actionMeta: ActionMeta<{ value: string; label: string }>) => {
    const selectedValues = newValue.map(option => option.value); // Extract the value from selected options
    setSelectedTiers(selectedValues); // Update the selected tiers state
  };

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="tier-select" className="text-sm font-medium text-gray-700">
        Filter by Tier:
      </label>
      <Select
        id="tier-select"
        options={tierOptions}
        isMulti
        value={tierOptions.filter(option => selectedTiers.includes(option.value))}
        onChange={handleChange} 
        className="w-60"
        placeholder="Select tiers..."
      />
    </div>
  );
};

export default TierFilter;
