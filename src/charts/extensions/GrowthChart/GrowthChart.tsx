import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { differenceInMonths, differenceInWeeks } from 'date-fns';
import { Layer, Tag } from '@carbon/react';
import { GrowthChartBuilder } from './GrowthChartBuilder';
import { ChartSelector } from './GrowthChartSelector';
import { type ChartData, GenderCodes, type MeasurementData } from '../../../types/chartDataTypes';
import { useCalculateMinMaxValues } from '../../../utils/Hooks/Calculations';
import { ChartSettingsButton } from './ChartSettingsButton';
import { useChartDataForGender } from '../../../utils/Sorting';
import { useAppropriateChartData } from '../../../utils/Hooks/Calculations/useAppropriateChartData';
import { type Patient } from '@openmrs/esm-framework';

interface GrowthChartProps {
  patient: Patient;
  observations: MeasurementData[];
  isPercentiles: boolean;
  chartData: ChartData;
  defaultIndicator?: string;
  setDefaultIndicatorError: (error: boolean) => void;
}

export const GrowthChart = ({
  patient,
  observations,
  isPercentiles,
  chartData,
  defaultIndicator,
  setDefaultIndicatorError,
}: GrowthChartProps) => {
  const { t } = useTranslation();
  const patientGender = patient?.person?.gender;
  const dateOfBirth = useMemo(() => new Date(patient?.person?.birthdate), [patient?.person?.birthdate]);

  const childAgeInWeeks = useMemo(() => differenceInWeeks(new Date(), dateOfBirth), [dateOfBirth]);
  const childAgeInMonths = useMemo(() => differenceInMonths(new Date(), dateOfBirth), [dateOfBirth]);

  const [gender, setGender] = useState<string>(patientGender ? patientGender.toUpperCase() : GenderCodes.CGC_Female);

  const { chartDataForGender } = useChartDataForGender({
    gender,
    chartData,
  });

  const {
    selectedCategory,
    selectedDataset,
    setSelectedCategory: setCategory,
    setSelectedDataset: setDataset,
  } = useAppropriateChartData(
    chartDataForGender,
    defaultIndicator,
    gender,
    setDefaultIndicatorError,
    childAgeInWeeks,
    childAgeInMonths,
  );

  useEffect(() => {
    if (patientGender && Object.values(GenderCodes).includes(patientGender.toUpperCase())) {
      setGender(patientGender.toUpperCase());
    }
  }, [patientGender]);

  const dataSetEntry = chartDataForGender[selectedCategory]?.datasets[selectedDataset];
  const dataSetValues = isPercentiles ? dataSetEntry?.percentileDatasetValues : dataSetEntry?.zScoreDatasetValues;
  const dataSetMetadata = dataSetEntry?.metadata;
  const { min, max } = useCalculateMinMaxValues(dataSetValues);

  const [minDataValue, maxDataValue] = useMemo(() => {
    const minVal = Math.max(0, Math.floor(min));
    const maxVal = Math.ceil(max);
    return [minVal, maxVal];
  }, [min, max]);

  if (!chartDataForGender || !dataSetValues) {
    return (
      <Layer>
        <Tag type="red">{t('noChartData', 'No chart data available')}</Tag>
      </Layer>
    );
  }

  const keysDataSet = Object.keys(dataSetValues[0]);
  const yAxisValues = {
    minDataValue,
    maxDataValue,
  };

  return (
    <Layer>
      <div className="flex justify-between px-4">
        <ChartSelector
          category={selectedCategory}
          dataset={selectedDataset}
          setCategory={setCategory}
          setDataset={setDataset}
          chartData={chartDataForGender}
          isDisabled={!!patientGender}
          gender={gender}
          setGender={setGender}
        />

        <ChartSettingsButton category={selectedCategory} dataset={selectedDataset} gender={gender} patient={patient} />
      </div>

      <Layer>
        <GrowthChartBuilder
          measurementData={observations}
          datasetValues={dataSetValues}
          datasetMetadata={dataSetMetadata}
          yAxisValues={yAxisValues}
          keysDataSet={keysDataSet}
          dateOfBirth={dateOfBirth}
          category={selectedCategory}
          dataset={selectedDataset}
          isPercentiles={isPercentiles}
        />
      </Layer>
    </Layer>
  );
};
