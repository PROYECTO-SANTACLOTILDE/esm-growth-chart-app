import React, { useState, useEffect } from 'react';
import { ComboChart, ScaleTypes } from '@carbon/charts-react';
import '@carbon/charts/styles.css';
import { Tile, InlineLoading } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import styles from './growthChart.module.scss';
import { csv } from 'd3';

const GrowthChartWeight: React.FC = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    // Load CSV data from `/utils`
    const loadCSVData = async () => {
      try {
        const csvData = await csv('/utils/wfa-b-z.csv'); // Replace with actual path
        const formattedData = csvData.map((row: any) => ({
          group: t('growthChart.weight', 'Weight'),
          key: row.Month,
          value: row.SD1, // Adjust based on the required column
        }));
        setData(formattedData);
        setIsLoading(false);
      } catch (err) {
        setError(t('error.loadingData', 'Error loading growth chart data.'));
        setIsLoading(false);
      }
    };

    loadCSVData();
  }, [t]);

  const options = {
    title: t('growthChart.title', 'Child Growth Chart'),
    axes: {
      left: {
        title: t('growthChart.axisWeight', 'Weight (kg)'),
        mapsTo: 'value',
      },
      bottom: {
        title: t('growthChart.axisMonths', 'Age (Months)'),
        scaleType: ScaleTypes.LABELS,
        mapsTo: 'key',
      },
    },
    comboChartTypes: [
      {
        type: 'line',
        options: { points: { enabled: true } },
        correspondingDatasets: [t('growthChart.weight', 'Weight')],
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
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.growthChartContainer}>
      <Tile className={styles.chartTile}>
        <ComboChart data={data} options={options} />
      </Tile>
    </div>
  );
};

export default GrowthChartWeight;
