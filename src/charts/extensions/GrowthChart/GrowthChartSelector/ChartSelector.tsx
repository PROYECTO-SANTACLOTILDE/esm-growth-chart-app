import React from 'react';
import { type ChartData, type CategoryCodes, GenderCodes, CategoryToLabel } from '../../../../types/chartDataTypes';
import { ChartSelectorDropdown } from './ChartSelectorDropdown';

interface ChartSelectorProps {
  category: keyof typeof CategoryCodes;
  dataset: keyof ChartData;
  setCategory: (category: keyof typeof CategoryCodes) => void;
  setDataset: (dataset: string) => void;
  chartData: ChartData;
  isDisabled?: boolean;
  gender: string;
  setGender: (gender: keyof typeof GenderCodes) => void;
}

export const ChartSelector = ({
  category,
  dataset,
  setCategory,
  setDataset,
  chartData,
  isDisabled,
  gender,
  setGender,
}: ChartSelectorProps) => {
  const handleCategoryChange = (value: string) => {
    const newCategory = Object.keys(chartData).find(
      (key) => chartData[key].categoryMetadata.label === value,
    ) as keyof typeof CategoryCodes;
    setCategory(newCategory);
    setDataset(Object.keys(chartData[newCategory].datasets)[0]);
  };

  const handleDatasetChange = (value: string) => {
    setDataset(value);
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <ChartSelectorDropdown
        title={gender}
        items={Object.values(GenderCodes)}
        handleItemChange={setGender}
        isDisabled={isDisabled}
        dataTest="CGC-gender-dropdown"
      />
      <ChartSelectorDropdown
        title={CategoryToLabel[category]}
        items={Object.keys(chartData).map((key) => chartData[key].categoryMetadata.label)}
        handleItemChange={handleCategoryChange}
        dataTest="CGC-category-dropdown"
      />
      <ChartSelectorDropdown
        title={dataset}
        items={Object.keys(chartData[category].datasets)}
        handleItemChange={handleDatasetChange}
        dataTest="CGC-dataset-dropdown"
      />
    </div>
  );
};
