import { DataSetLabels } from '../../../types/chartDataTypes';

interface DatasetMap {
  [x: string]: () => string;
}

export const calculateDecimalDate = (date: string, dataset: string, dateOfBirth: Date): string => {
  const millisecondsInDay = 1000 * 60 * 60 * 24;
  const formattedDate: Date = new Date(date);
  const diffInMilliseconds = formattedDate.getTime() - dateOfBirth.getTime();

  const calculateDiffInMonths = (maxMonths: number | null = null): string => {
    const millisecondsInMonth = millisecondsInDay * 30.44;
    const diffInMonths = diffInMilliseconds / millisecondsInMonth;
    if (diffInMonths < 0 || (maxMonths !== null && diffInMonths > maxMonths)) return null;
    return diffInMonths.toFixed(2);
  };

  const datasetMap: DatasetMap = {
    [DataSetLabels.w_0_13]: () => {
      const millisecondsInWeek = millisecondsInDay * 7;
      const diffInWeeks = diffInMilliseconds / millisecondsInWeek;
      if (diffInWeeks < 0 || diffInWeeks > 13) return null;
      return diffInWeeks.toFixed(2);
    },
    [DataSetLabels.y_0_2]: () => calculateDiffInMonths(24),
    [DataSetLabels.y_0_5]: () => calculateDiffInMonths(60),
    [DataSetLabels.y_2_5]: () => calculateDiffInMonths(60),
  };

  return datasetMap[dataset]?.() ?? null;
};
