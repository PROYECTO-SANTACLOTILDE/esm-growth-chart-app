import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { differenceInMonths, differenceInWeeks } from 'date-fns';

import { DataTableSkeleton, InlineLoading, Button } from '@carbon/react';
import { Printer } from '@carbon/react/icons';
import { CardHeader, EmptyState, ErrorState } from '@openmrs/esm-patient-common-lib';

import { type ChartData, type MeasurementData } from '../../../types/chartDataTypes';
import { useCalculateMinMaxValues } from '../../../utils/Hooks/Calculations';
import { useChartDataForGender } from '../../../utils/Sorting';
import { useAppropriateChartData } from '../../../utils/Hooks/Calculations/useAppropriateChartData';
import { useVitalsAndBiometrics } from '../../../utils/Hooks/DataFetching';
import { usePatientBirthdateAndGender } from '../../../utils/Hooks/DataFetching';
import { chartData } from '../../../DataSets/WhoStandardDataSets/ChartData';

import { ChartSelector } from './GrowthChartSelector/ChartSelector';
import { GrowthChartBuilder } from './GrowthChartBuilder/GrowthChartBuilder';

import styles from './growthchart-overview.scss';

interface GrowthChartProps {
  patientUuid: string;
  config: ChartData;
}

const GrowthChartOverview: React.FC<GrowthChartProps> = ({ patientUuid, config }) => {
  const { t } = useTranslation();
  // Título que se usa en varios lugares (error, cabecera, etc.)
  const headerTitle = t('growthChart', 'Growth Chart');

  // Lógica de estado local
  const [defaultIndicatorError, setDefaultIndicatorError] = useState(false);
  const [genderParse, setGenderParser] = useState('');

  // Hooks para cargar datos del paciente
  const { gender: rawGender, birthdate, isLoading, error } = usePatientBirthdateAndGender(patientUuid);

  useEffect(() => {
    if (rawGender && typeof rawGender === 'string') {
      setGenderParser(rawGender.toUpperCase());
    }
  }, [rawGender, error, isLoading]);

  // Chart data filtrado según género
  const { chartDataForGender } = useChartDataForGender({
    gender: genderParse,
    chartData: chartData || {},
  });

  // Observaciones (vitals/biometrics)
  const { data: rawObservations = [], isLoading: isValidating } = useVitalsAndBiometrics(patientUuid, 'both');
  const observations: MeasurementData[] = rawObservations.map((obs) => ({
    ...obs,
    eventDate: obs.eventDate.toISOString(),
  }));

  // Calcular edad con date-fns
  const safeBirthdate = birthdate || new Date().toISOString();
  const dateOfBirth = useMemo(() => new Date(safeBirthdate), [safeBirthdate]);
  const childAgeInWeeks = useMemo(() => differenceInWeeks(new Date(), dateOfBirth), [dateOfBirth]);
  const childAgeInMonths = useMemo(() => differenceInMonths(new Date(), dateOfBirth), [dateOfBirth]);

  // Indicador/categoría de gráfico por defecto
  const defaultIndicator = Object.keys(chartDataForGender || {})[0] || '';
  const isPercentiles = true;

  // useAppropriateChartData: Retorna categoría y dataset “seleccionados”
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

  // Sacamos el entry (los valores en sí) del chart
  const dataSetEntry = chartDataForGender[selectedCategory]?.datasets?.[selectedDataset];
  const dataSetValues = isPercentiles
    ? (dataSetEntry?.percentileDatasetValues ?? [])
    : (dataSetEntry?.zScoreDatasetValues ?? []);

  // Min/max en Y
  const { min = 0, max = 100 } = useCalculateMinMaxValues(dataSetValues);
  const [minDataValue, maxDataValue] = useMemo(() => [Math.max(0, Math.floor(min)), Math.ceil(max)], [min, max]);

  // ---- Manejo de estados OpenMRS-lik
  return (
    <>
      {(() => {
        // 1. Loading => Skeleton
        if (isLoading) {
          return <DataTableSkeleton role="progressbar" zebra={false} />;
        }

        // 2. Error => ErrorState
        if (error) {
          return <ErrorState error={error} headerTitle={headerTitle} />;
        }

        // 3. Sin dataset seleccionado o sin datos => EmptyState
        if (!selectedDataset || !dataSetEntry || !dataSetValues.length) {
          return (
            <EmptyState displayText={t('noChartDataAvailable', 'No chart data available')} headerTitle={headerTitle} />
          );
        }

        // 4. Render principal (Card con GrowthChart)
        return (
          <div className={styles.widgetCard}>
            <CardHeader title={headerTitle}>
              <div className={styles.backgroundDataFetchingIndicator}>
                {isValidating ? <InlineLoading description={t('updating', 'Updating...')} /> : null}
              </div>
              <div className={styles.chartHeaderActionItems}>
                <Button
                  kind="ghost"
                  renderIcon={Printer}
                  iconDescription={t('print', 'Print')}
                  className={styles.printButton}
                  onClick={() => window.print()}
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

                <GrowthChartBuilder
                  measurementData={observations}
                  datasetValues={dataSetValues}
                  datasetMetadata={
                    dataSetEntry?.metadata ?? {
                      chartLabel: '',
                      yAxisLabel: '',
                      xAxisLabel: '',
                      range: { start: 0, end: 0 },
                    }
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
      })()}
    </>
  );
};

export default GrowthChartOverview;
