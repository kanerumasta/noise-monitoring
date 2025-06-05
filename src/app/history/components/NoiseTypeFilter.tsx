import React from 'react';
import Select from 'react-select';

interface NoiseTypeFilterProps {
  selectedNoiseType: string;
  setSelectedNoiseType: React.Dispatch<React.SetStateAction<string>>;
}

const noiseTypeOptions = [
     { value: '', label: 'All' },
  { value: 'shortburst', label: 'Shortburst' },
  { value: 'sustained', label: 'Sustained' },
];

const NoiseTypeFilter = ({ selectedNoiseType, setSelectedNoiseType }: NoiseTypeFilterProps) => {
  const handleChange = (newValue: { value: string; label: string } | null) => {
    if (newValue) {
      setSelectedNoiseType(newValue.value);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="noise-type-select" className="text-sm font-medium text-gray-700">
        Noise Type:
      </label>
      <Select
        id="noise-type-select"
        options={noiseTypeOptions}
        value={noiseTypeOptions.find(option => option.value === selectedNoiseType) || null}
        onChange={handleChange}
        className="w-48"
        placeholder="Select noise type..."
      />
    </div>
  );
};

export default NoiseTypeFilter;
