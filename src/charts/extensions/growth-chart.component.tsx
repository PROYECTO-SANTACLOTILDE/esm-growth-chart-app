import React from 'react';
import { ComboChart, ScaleTypes } from '@carbon/charts-react';
import '@carbon/charts/styles.css';
import { Tile, Header } from '@carbon/react';
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

  const data = [
    { group: '50th Percentile', key: '0', value: 50 },
    { group: '50th Percentile', key: '1', value: 55 },
    { group: '50th Percentile', key: '2', value: 60 },
    { group: '50th Percentile', key: '3', value: 65 },
    { group: '50th Percentile', key: '4', value: 70 },
    { group: '50th Percentile', key: '5', value: 75 },
    { group: '50th Percentile', key: '6', value: 80 },
    { group: '3rd Percentile', key: '0', value: 45 },
    { group: '3rd Percentile', key: '1', value: 48 },
    { group: '3rd Percentile', key: '2', value: 52 },
    { group: '97th Percentile', key: '0', value: 55 },
    { group: '97th Percentile', key: '1', value: 60 },
    { group: '97th Percentile', key: '2', value: 65 },
  ];

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
      { type: 'line', options: { points: { enabled: true } }, correspondingDatasets: ['50th Percentile'] },
      {
        type: 'line',
        options: { points: { enabled: true } },
        correspondingDatasets: ['3rd Percentile', '97th Percentile'],
      },
    ],
    curve: 'curveNatural',
    height: '400px',
  };

  return (
    <div className={styles.growthChartContainer}>
      <Tile className={styles.chartTile}>
        <ComboChart data={data} options={options} />
      </Tile>
    </div>
  );
};

export default GrowthChart;
