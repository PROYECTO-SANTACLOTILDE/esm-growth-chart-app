import React from 'react';
import { type ChartData, type CategoryCodes, GenderCodes, CategoryToLabel } from '../../../../types/chartDataTypes';
import { ChartSelectorDropdown } from './ChartSelectorDropdown';

interface ChartSelectorProps {
  category: keyof typeof CategoryCodes;
  dataset: string;
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
  const genderItems = Object.values(GenderCodes).map((code) => ({
    id: code,
    text: code === GenderCodes.CGC_Female ? 'Female' : 'Male',
  }));

  const categoryItems = Object.keys(chartData).map((key) => ({
    id: key,
    text: chartData[key].categoryMetadata.label,
  }));

  const datasetItems = Object.keys(chartData[category].datasets).map((key) => ({
    id: key,
    text: key,
  }));

  const handleCategoryChange = (categoryKey: string) => {
    setCategory(categoryKey as keyof typeof CategoryCodes);
    setDataset(Object.keys(chartData[categoryKey].datasets)[0]);
  };

  return (
    <div className="cds--grid cds--grid--condensed">
      <div className="cds--row cds--grid-row">
        <div className="cds--col">
          <ChartSelectorDropdown
            title={gender}
            items={genderItems}
            handleItemChange={(value) => setGender(value as keyof typeof GenderCodes)}
            isDisabled={isDisabled}
            dataTest="gender-selector"
          />
        </div>

        <div className="cds--col">
          <ChartSelectorDropdown
            title={CategoryToLabel[category]}
            items={categoryItems}
            handleItemChange={handleCategoryChange}
            dataTest="category-selector"
          />
        </div>

        <div className="cds--col">
          <ChartSelectorDropdown
            title={dataset}
            items={datasetItems}
            handleItemChange={setDataset}
            dataTest="dataset-selector"
          />
        </div>
      </div>
    </div>
  );
};
