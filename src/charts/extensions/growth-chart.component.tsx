import React from 'react';
import { ComboChart, ScaleTypes } from '@carbon/charts-react';
import '@carbon/charts/styles.css';
import { Tile } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '@openmrs/esm-framework';
import { type Config } from '../../config-schema';
import styles from './growthChart.module.scss';

const GrowthChart: React.FC = () => {
  const { t } = useTranslation();
  const config: Config = useConfig();

  const data = [
    {
      group: t('growthChart.height', 'Height'),
      key: '0',
      value: 50,
    },
    {
      group: t('growthChart.height', 'Height'),
      key: '1',

      value: 55,
    },
    {
      group: t('growthChart.height', 'Height'),
      key: '2',
      value: 60,
    },
    {
      group: t('growthChart.height', 'Height'),
      key: '3',
      value: 65,
    },
    {
      group: t('growthChart.height', 'Height'),
      key: '4',
      value: 70,
    },
    {
      group: t('growthChart.height', 'Height'),
      key: '5',
      value: 75,
    },
    {
      group: t('growthChart.height', 'Height'),
      key: '6',
      value: 80,
    },
  ];

  const options = {
    title: t('dataFetching', 'Data fetching'),
    axes: {
      left: {
        title: t('growthChart.axisHeight', 'Height'),
        mapsTo: 'value',
      },
      bottom: {
        scaleType: ScaleTypes.LABELS,
        mapsTo: 'key',
      },
    },
    comboChartTypes: [
      {
        type: 'line',
        options: {
          points: {
            enabled: true,
          },
        },
        correspondingDatasets: [t('growthChart.height', 'Height')],
      },
    ],
    curve: 'curveNatural',
    height: '400px',
  };

  return (
    //<Tile className={styles.white}>
    <h5>{t('translations:test', 'Data fetching')}</h5>
    //<ComboChart data={data} options={options}></ComboChart>
    //</Tile>
  );
};

export default GrowthChart;
