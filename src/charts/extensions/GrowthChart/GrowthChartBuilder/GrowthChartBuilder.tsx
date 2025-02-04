import React from 'react';
import { useTranslation } from 'react-i18next';
import { Line } from 'react-chartjs-2';
import Chart, { type ChartOptions } from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import AutoSizer from 'react-virtualized-auto-sizer';

import {
  CategoryCodes,
  type CategoryToLabel,
  DataSetLabels,
  MeasurementTypeCodes,
  type ChartDataTypes,
} from '../../../../types/chartDataTypes';

import { GrowthChartAnnotations, AnnotateLineEnd } from '../../../../utils/ChartOptions';
import { useMeasurementPlotting, useChartLines } from '../../../../utils/Hooks/ChartDataVisualization';
import { ChartTooltip } from './ChartTooltip';
interface GrowthChartBuilderProps extends ChartDataTypes {
  category: keyof typeof CategoryToLabel;
  dataset: string;
  dateOfBirth: Date;
  isPercentiles: boolean;
}

export const GrowthChartBuilder = ({
  datasetValues,
  datasetMetadata,
  yAxisValues,
  keysDataSet,
  measurementData,
  category,
  dataset,
  dateOfBirth,
  isPercentiles,
}: GrowthChartBuilderProps) => {
  // Registramos el plugin de anotación
  Chart.register(annotationPlugin);

  const { t } = useTranslation();
  const { minDataValue, maxDataValue } = yAxisValues;

  // Obtenemos el "código" de medición según la categoría (peso, altura, etc.)
  const MeasuremenCode = MeasurementTypeCodes[category];

  // Ajustes para el inicio del eje X
  const adjustIndex = dataset === DataSetLabels.y_2_5 ? 24 : 0;
  const startIndex =
    category !== CategoryCodes.wflh_b && category !== CategoryCodes.wflh_g ? adjustIndex : datasetMetadata.range.start;

  // Datos de percentiles/z-scores
  const ChartLinesData = useChartLines(
    datasetValues,
    keysDataSet,
    datasetMetadata,
    category,
    dataset,
    startIndex,
    isPercentiles,
  );

  // Datos de mediciones reales del paciente
  const MeasurementData = useMeasurementPlotting(
    measurementData,
    MeasuremenCode,
    category,
    dataset,
    dateOfBirth,
    startIndex,
  );

  // Armamos el objeto data para Chart.js
  const data: any = {
    datasets: [...ChartLinesData, ...MeasurementData],
  };

  // Anotaciones (líneas, áreas sombreadas, etc.)
  const annotations = GrowthChartAnnotations(ChartLinesData, datasetMetadata);

  const options: ChartOptions<'line'> = {
    elements: { point: { radius: 0, hoverRadius: 0 } },
    plugins: {
      annotation: { annotations },
      legend: { display: false },
      tooltip: ChartTooltip(category, datasetMetadata.xAxisLabel, datasetMetadata.yAxisLabel, dateOfBirth),
    },
    scales: {
      x: {
        type: 'linear',
        title: {
          display: true,
          text: t(datasetMetadata.xAxisLabel),
          font: { size: 13 },
        },
        min: datasetMetadata.range.start,
        max: datasetMetadata.range.end,
        ticks: {
          stepSize: 1,
          callback: (value: number, index, values) => {
            // Manejamos la lógica de "Months" para ver Años / Meses
            if (datasetMetadata.xAxisLabel === 'Months') {
              const isFirstTick = index === 0;
              const isLastTick = index === values.length - 1;

              if (isFirstTick || isLastTick) {
                const years = value / 12;
                return `${years} ${years === 1 ? t('Year') : t('Years')}`;
              }

              const modulo = value % 12;
              return modulo === 0 ? '' : modulo;
            }
            return value;
          },
        },
      },
      y: {
        title: {
          display: true,
          text: t(datasetMetadata.yAxisLabel),
          font: { size: 13 },
        },
        position: 'left',
        min: minDataValue,
        max: maxDataValue,
      },
      yRight: {
        position: 'right',
        min: minDataValue,
        max: maxDataValue,
        ticks: { padding: isPercentiles ? 36 : 18 },
      },
    },
    animation: {
      onComplete: (chartAnimation: any) => AnnotateLineEnd(chartAnimation, isPercentiles, keysDataSet),
      onProgress: (chartAnimation: any) => AnnotateLineEnd(chartAnimation, isPercentiles, keysDataSet),
    },
  };

  return (
    <div id="divToPrint" className="aspect-video w-full" style={{ minHeight: '400px' }}>
      <AutoSizer>
        {({ height, width }: { height: number; width: number }) => (
          <div style={{ height, width }}>
            <Line data={data} options={options} />
          </div>
        )}
      </AutoSizer>
    </div>
  );
};
