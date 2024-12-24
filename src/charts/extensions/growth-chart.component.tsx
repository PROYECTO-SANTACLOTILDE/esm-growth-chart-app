import React from 'react';
import { ComboChart, ScaleTypes } from '@carbon/charts-react';
import '@carbon/charts/styles.css';
import { Tile, Header, InlineLoading } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import styles from './growthChart.module.scss';
import { useConfig } from '@openmrs/esm-framework';
import { type Config } from '../../config-schema';
import { usePatientObservations } from '../growth-chart.resource';

const GrowthChart: React.FC = () => {
  const { t } = useTranslation();
  const config: Config = useConfig();

  const { observations, isLoading, error } = usePatientObservations('a6acfd24-3668-4cbe-9b25-36e40ac9f571', [
    '5090AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', // Height
    '5089AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', // Weight
  ]);

  const growthChartTimeUnit = config.growthChartTimeUnit.includes('years');

  const transformedData = observations.map((obs) => ({
    group: obs.type === 'Height (cm)' ? t('growthChart.height', 'Height') : t('growthChart.weight', 'Weight'),
    key: new Date(obs.date).getFullYear().toString(),
    value: obs.value,
  }));

  const options = {
    title: t('growthChart.title', 'Child Growth Chart'),
    axes: {
      left: {
        title: t('growthChart.axisHeight', 'Height (cm)'),
        mapsTo: 'value',
      },
      bottom: {
        title: growthChartTimeUnit
          ? t('growthChart.axisMonths', 'Age (Months)')
          : t('growthChart.axisYears', 'Age (Years)'),
        scaleType: ScaleTypes.LABELS,
        mapsTo: 'key',
      },
    },
    comboChartTypes: [
      {
        type: 'line',
        options: { points: { enabled: true } },
        correspondingDatasets: [t('growthChart.height', 'Height')],
      },
    ],
    curve: 'curveNatural',
    height: '400px',
  };

  if (isLoading) {
    return (
      <div className={styles.loaderContainer}>
        <InlineLoading description={t('loading', 'Loading...')} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>{t('error.loadingData', 'Error loading growth chart data.')}</p>
      </div>
    );
  }

  return (
    <div className={styles.growthChartContainer}>
      <Tile className={styles.chartTile}>
        <ComboChart data={transformedData} options={options} />
      </Tile>
    </div>
  );
};

export default GrowthChart;
