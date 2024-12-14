import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Tile } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import styles from './growthChart.module.scss';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const GrowthChart: React.FC = () => {
  const { t } = useTranslation();

  const data = {
    labels: ['0', '1', '2', '3', '4', '5', '6'],
    datasets: [
      {
        label: t('growthChart.height'),
        data: [50, 55, 60, 65, 70, 75, 80],
        borderColor: '#00A9E0',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: t('growthChart.title'),
      },
    },
  };

  return (
    <Tile className={styles.white}>
      <Line data={data} options={options} />
    </Tile>
  );
};

export default GrowthChart;
