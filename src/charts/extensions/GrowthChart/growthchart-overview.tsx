import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { differenceInMonths, differenceInWeeks } from 'date-fns';
import { type ChartData, type MeasurementData } from '../../../types/chartDataTypes';
import { useCalculateMinMaxValues } from '../../../utils/Hooks/Calculations';
import { useChartDataForGender } from '../../../utils/Sorting';
import { useAppropriateChartData } from '../../../utils/Hooks/Calculations/useAppropriateChartData';
import { useVitalsAndBiometrics } from '../../../utils/DataFetching/Hooks';
import { usePatientBirthdateAndGender } from '../../../utils/DataFetching/Hooks';
import { ChartSelector } from './GrowthChartSelector/ChartSelector';
import { ChartSettingsButton } from './ChartSettingsButton/ChartSettingsButton';
import { GrowthChartBuilder } from './GrowthChartBuilder/GrowthChartBuilder';

import { DataTableSkeleton, InlineLoading, Button } from '@carbon/react';
import { Printer } from '@carbon/react/icons';
import { CardHeader, EmptyState, ErrorState } from '@openmrs/esm-patient-common-lib';

import styles from './growthchart-overview.scss';

interface GrowthChartProps {
  patientUuid: string;
  config: ChartData;
}

const GrowthChartOverview: React.FC<GrowthChartProps> = ({ patientUuid, config }) => {
  const { t } = useTranslation();
  const [defaultIndicatorError, setDefaultIndicatorError] = useState(false);
  const [genderParse, setGenderParser] = useState('');

  const { gender: rawGender, birthdate, isLoading, error } = usePatientBirthdateAndGender(patientUuid);

  useEffect(() => {
    if (rawGender && typeof rawGender === 'string') {
      setGenderParser(rawGender.toUpperCase());
    }
  }, [rawGender, error, isLoading]);

  const { chartDataForGender } = useChartDataForGender({
    gender: genderParse, // Valor por defecto seguro
    chartData: config || {}, // Asegurar objeto vacío si es undefined
  });

  // 3. Obtener observaciones médicas con tipo explícito
  const { data: rawObservations = [], isLoading: isValidating } = useVitalsAndBiometrics(patientUuid, 'both');

  const observations: MeasurementData[] = rawObservations.map((obs) => ({
    ...obs,
    eventDate: obs.eventDate.toISOString(),
  }));

  // 5. Cálculos de edad con fecha de nacimiento segura
  const safeBirthdate = birthdate || new Date().toISOString();
  const dateOfBirth = useMemo(() => new Date(safeBirthdate), [safeBirthdate]);
  const childAgeInWeeks = useMemo(() => differenceInWeeks(new Date(), dateOfBirth), [dateOfBirth]);
  const childAgeInMonths = useMemo(() => differenceInMonths(new Date(), dateOfBirth), [dateOfBirth]);

  // 6. Definir indicadores por defecto
  const defaultIndicator = Object.keys(chartDataForGender || {})[0] || '';

  const isPercentiles = true; // Asumiendo un valor por defecto si no está definido en otro lugar

  // 7. Selección de categoría/dataset con valores por defecto
  const {
    selectedCategory,
    selectedDataset,
    setSelectedCategory: setCategory,
    setSelectedDataset: setDataset,
  } = useAppropriateChartData(
    chartDataForGender,
    defaultIndicator,
    genderParse,
    setDefaultIndicatorError,
    childAgeInWeeks,
    childAgeInMonths,
  );

  // 9. Cálculo de valores del dataset con protección completa
  const dataSetEntry = chartDataForGender[selectedCategory]?.datasets?.[selectedDataset];

  const dataSetValues = isPercentiles
    ? (dataSetEntry?.percentileDatasetValues ?? [])
    : (dataSetEntry?.zScoreDatasetValues ?? []);

  const { min = 0, max = 100 } = useCalculateMinMaxValues(dataSetValues);
  const [minDataValue, maxDataValue] = useMemo(() => [Math.max(0, Math.floor(min)), Math.ceil(max)], [min, max]);

  if (isLoading) {
    return <div className="text-blue-500">{t('loading', 'Loading...')}</div>;
  }

  if (error) {
    return <div className="text-red-500">{t('errorLoadingData', 'Error loading data')}</div>;
  }

  if (!chartDataForGender) {
    return <div className="text-red-500">{t('noChartData', 'No chart data available')}</div>;
  }

  if (!dataSetEntry) {
    return <div className="text-red-500">{t('no dataSetEntry', 'No data set available')}</div>;
  }

  if (dataSetValues.length === 0) {
    return <div className="text-red-500">{t('emptyDataSet', 'Data set is empty')}</div>;
  }

  return (
    <div className={styles.widgetCard}>
      <CardHeader title={t('growthChart', 'Growth Chart')}>
        <div className={styles.backgroundDataFetchingIndicator}>
          {isValidating ? <InlineLoading description={t('updating', 'Updating...')} /> : null}
        </div>
        <div className={styles.chartHeaderActionItems}>
          <Button
            kind="ghost"
            renderIcon={Printer}
            iconDescription={t('print', 'Print')}
            onClick={() => window.print()} // Ejemplo de print
          >
            {t('print', 'Print')}
          </Button>
        </div>
      </CardHeader>

      <div className="p-4">
        <div className="flex justify-between px-4">
          <ChartSelector
            category={selectedCategory}
            dataset={selectedDataset}
            setCategory={setCategory}
            setDataset={setDataset}
            chartData={chartDataForGender}
            isDisabled={!!genderParse}
            gender={genderParse}
            setGender={setGenderParser}
          />
        </div>

        <div className="mt-4">
          <GrowthChartBuilder
            measurementData={observations}
            datasetValues={dataSetValues}
            datasetMetadata={
              dataSetEntry?.metadata ?? { chartLabel: '', yAxisLabel: '', xAxisLabel: '', range: { start: 0, end: 0 } }
            }
            yAxisValues={{ minDataValue, maxDataValue }}
            keysDataSet={Object.keys(dataSetValues[0] ?? {})}
            dateOfBirth={dateOfBirth}
            category={selectedCategory}
            dataset={selectedDataset}
            isPercentiles={isPercentiles}
          />
        </div>
      </div>
    </div>
  );
};

export default GrowthChartOverview;
