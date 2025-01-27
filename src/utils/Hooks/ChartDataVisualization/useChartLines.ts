import { useEffect, useState } from 'react';
import { ChartLineColorPicker } from '../../ChartOptions';

interface DatasetValues {
  [key: string]: number;
}

export const useChartLines = (
  datasetValues: DatasetValues[],
  keysDataSet: string[],
  datasetMetadata: any,
  category: string,
  dataset: string | number,
  startIndex: number,
  isPercentiles: boolean,
) => {
  const [ChartLines, setChartLines] = useState<any[]>([]);

  useEffect(() => {
    const newChartLines = keysDataSet.map((key) => ({
      data: datasetValues.map((entry, index) => ({
        x: startIndex + index,
        y: entry[key],
      })),
      borderWidth: 0.9,
      borderColor: ChartLineColorPicker(key, isPercentiles),
      label: key,
    }));

    setChartLines(newChartLines);
  }, [datasetValues, keysDataSet, datasetMetadata, category, dataset, startIndex, isPercentiles]);

  return ChartLines;
};
