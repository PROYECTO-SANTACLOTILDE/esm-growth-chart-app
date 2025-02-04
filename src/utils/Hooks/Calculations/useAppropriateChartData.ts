import { useEffect, useRef, useState } from "react";
import {
  CategoryCodes,
  type ChartData,
  MeasurementTypeCodesLabel,
  TimeUnitCodes,
} from "../../../types/chartDataTypes";

export const useAppropriateChartData = (
  chartDataForGender: ChartData,
  defaultIndicator: string,
  gender: string,
  setDefaultIndicatorError: (value: boolean) => void,
  childAgeInWeeks: number,
  childAgeInMonths: number
) => {
  const [selectedCategory, setSelectedCategory] =
    useState<keyof typeof CategoryCodes>();
  const [selectedDataset, setSelectedDataset] = useState<string>();

  const selectDatasetForCategoryRef =
    useRef<(category: keyof typeof CategoryCodes) => void>();
  selectDatasetForCategoryRef.current = (
    category: keyof typeof CategoryCodes
  ) => {
    const { datasets } = chartDataForGender[category];
    console.log("datasets", datasets);
    const isMeasurementType = (xAxis: string) =>
      (
        Object.values(MeasurementTypeCodesLabel) as Array<
          "Head circumference" | "Length" | "Height" | "Weight"
        >
      ).includes(
        xAxis as "Head circumference" | "Length" | "Height" | "Weight"
      );

    const isWeeksInRange = (xAxis: string) =>
      xAxis === TimeUnitCodes.weeks && childAgeInWeeks < 13;

    const isMonthsInRange = (
      xAxis: string,
      range: { start: number; end: number }
    ) =>
      xAxis === TimeUnitCodes.months &&
      childAgeInMonths >= range.start &&
      childAgeInMonths < range.end;

    const getMaxRangeDataset = (datasets: ChartData[0]["datasets"]) =>
      Object.entries(datasets).reduce((max, [key, value]) =>
        !max || value.metadata.range.end > max[1].metadata.range.end
          ? [key, value]
          : max
      );

    const isAboveRange = (
      xAxis: string,
      range: { start: number; end: number }
    ) => xAxis === TimeUnitCodes.months && childAgeInMonths >= range.end;
    Object.entries(datasets).some(([key, value]) => {
      const { range } = value.metadata;
      const xAxis = value.metadata.xAxisLabel;

      if (
        isMeasurementType(xAxis) ||
        isWeeksInRange(xAxis) ||
        isMonthsInRange(xAxis, range)
      ) {
        setSelectedDataset((prevDataset) =>
          prevDataset !== key ? key : prevDataset
        );
        return true;
      }

      if (isAboveRange(xAxis, range)) {
        const [newDatasetKey] = getMaxRangeDataset(datasets);
        setSelectedDataset(newDatasetKey);
        return true;
      }
      return false;
    });
  };

  useEffect(() => {
    if (selectedCategory && chartDataForGender[selectedCategory]) {
      selectDatasetForCategoryRef.current?.(selectedCategory);
    }
  }, [selectedCategory, chartDataForGender]);

  const isKeyOfCategoryCodes = (
    key: string
  ): key is keyof typeof CategoryCodes => key in CategoryCodes;

  useEffect(() => {

    const key = `${defaultIndicator}`;

    if (!isKeyOfCategoryCodes(key)) {
      setDefaultIndicatorError(true);
    }
    if (isKeyOfCategoryCodes(key) && chartDataForGender[key]) {
      const newCategory = CategoryCodes[key];

      setSelectedCategory(newCategory);
      const newDataset = Object.keys(
        chartDataForGender[newCategory].datasets
      )[0];
      setSelectedDataset(newDataset);

    }
  }, [chartDataForGender, defaultIndicator, gender, setDefaultIndicatorError]);

  return {
    selectedCategory,
    selectedDataset,
    setSelectedCategory,
    setSelectedDataset,
  };
};
