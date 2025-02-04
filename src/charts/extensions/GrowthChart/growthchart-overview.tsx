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
import { useVitalsAndBiometrics } from '../../../utils/DataFetching/Hooks';
import { usePatientBirthdateAndGender } from '../../../utils/DataFetching/Hooks';

interface GrowthChartProps {
  patientUuid: string;
  config: ChartData;
}

const GrowthChartOverview: React.FC<GrowthChartProps> = ({ patientUuid, config }) => {
  const { t } = useTranslation();
  const [defaultIndicatorError, setDefaultIndicatorError] = useState(false);

  // 1. Obtener datos del paciente con protección contra valores nulos/undefined
  const { gender: rawGender, birthdate, isLoading, error } = usePatientBirthdateAndGender(patientUuid);
  const patientGender = rawGender ?? GenderCodes.CGC_Female;

  // 2. Estado para el género con valor inicial seguro
  const [gender, setGender] = useState(() => patientGender.toUpperCase());

  // 3. Obtener observaciones médicas con tipo explícito
  const { data: observations = [] } = useVitalsAndBiometrics(patientUuid, 'both') as { data: MeasurementData[] };

  // 4. Procesar datos del gráfico con protección contra undefined
  const { chartDataForGender = {} } = useChartDataForGender({
    gender: patientGender,
    chartData: config,
  });

  // 5. Cálculos de edad con fecha de nacimiento segura
  const safeBirthdate = birthdate || new Date().toISOString();
  const dateOfBirth = useMemo(() => new Date(safeBirthdate), [safeBirthdate]);
  const childAgeInWeeks = useMemo(() => differenceInWeeks(new Date(), dateOfBirth), [dateOfBirth]);
  const childAgeInMonths = useMemo(() => differenceInMonths(new Date(), dateOfBirth), [dateOfBirth]);

  // 6. Selección de categoría/dataset con valores por defecto
  const {
    selectedCategory = Object.keys(chartDataForGender)[0],
    selectedDataset = 'default',
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

  // 7. Sincronización segura del género
  useEffect(() => {
    const normalizedGender = patientGender.toUpperCase();
    if (Object.values(GenderCodes).includes(normalizedGender as GenderCodes)) {
      setGender(normalizedGender);
    }
  }, [patientGender]);

  // 8. Cálculo de valores del dataset con protección completa
  const dataSetEntry = chartDataForGender[selectedCategory]?.datasets?.[selectedDataset];
  const dataSetValues = isPercentiles
    ? (dataSetEntry?.percentileDatasetValues ?? [])
    : (dataSetEntry?.zScoreDatasetValues ?? []);

  const { min = 0, max = 100 } = useCalculateMinMaxValues(dataSetValues);
  const [minDataValue, maxDataValue] = useMemo(() => [Math.max(0, Math.floor(min)), Math.ceil(max)], [min, max]);

  // 9. Manejo de estados de carga y error mejorado
  if (isLoading) {
    return <Tag type="blue">{t('loading', 'Loading...')}</Tag>;
  }

  if (error || !chartDataForGender || dataSetValues.length === 0) {
    return (
      <Layer>
        <Tag type="red">{t('noChartData', 'No chart data available')}</Tag>
      </Layer>
    );
  }

  // 10. Renderizado seguro con valores por defecto
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

        <ChartSettingsButton
          category={selectedCategory}
          dataset={selectedDataset}
          gender={gender}
          patientUuid={patientUuid}
        />
      </div>

      <Layer>
        <GrowthChartBuilder
          measurementData={observations}
          datasetValues={dataSetValues}
          datasetMetadata={dataSetEntry?.metadata ?? {}}
          yAxisValues={{ minDataValue, maxDataValue }}
          keysDataSet={Object.keys(dataSetValues[0] ?? {})}
          dateOfBirth={dateOfBirth}
          category={selectedCategory}
          dataset={selectedDataset}
          isPercentiles={isPercentiles}
        />
      </Layer>
    </Layer>
  );
};

export default GrowthChartOverview;
