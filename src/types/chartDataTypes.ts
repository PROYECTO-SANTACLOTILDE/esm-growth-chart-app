export interface MeasurementData {
  eventDate: string;
  dataValues: {
    weight: string;
    headCircumference: string;
    height: string;
  };
}

interface TimeUnitData {
  singular: string;
  plural: string;
}

export interface ChartDataTypes {
  datasetValues: { [key: string]: number }[];
  datasetMetadata: {
    chartLabel: string;
    yAxisLabel: string;
    xAxisLabel: string;
    range: { start: number; end: number };
  };
  yAxisValues: { minDataValue: number; maxDataValue: number };
  keysDataSet: string[];
  measurementData: MeasurementData[];
}

export interface ChartData {
  [key: string]: {
    categoryMetadata?: {
      label: string;
      gender: string;
    };
    datasets: {
      [key: string]: {
        zScoreDatasetValues: { [key: string]: number }[];
        percentileDatasetValues: { [key: string]: number }[];
        metadata: {
          chartLabel: string;
          yAxisLabel: string;
          xAxisLabel: string;
          range: { start: number; end: number };
        };
      };
    };
  };
}

export const TimeUnitCodes = Object.freeze({
  years: 'Years',
  months: 'Months',
  weeks: 'Weeks',
});

export const timeUnitData: { [key: string]: TimeUnitData } = {
  [TimeUnitCodes.years]: {
    singular: 'year',
    plural: 'years',
  },
  [TimeUnitCodes.months]: {
    singular: 'month',
    plural: 'months',
  },
  [TimeUnitCodes.weeks]: {
    singular: 'week',
    plural: 'weeks',
  },
};

export const MeasurementTypeCodesLabel = Object.freeze({
  headCircumference: 'Head circumference',
  length: 'Length',
  height: 'Height',
  weight: 'Weight',
});

export const MeasurementTypeCodes = Object.freeze({
  hcfa_b: 'headCircumference',
  hcfa_g: 'headCircumference',
  lhfa_b: 'height',
  lhfa_g: 'height',
  wfa_g: 'weight',
  wfa_b: 'weight',
  wflh_b: 'weight',
  wflh_g: 'weight',
});

export const unitCodes = Object.freeze({
  cm: 'cm',
  kg: 'kg',
  g: 'g',
});

export const CategoryLabels = Object.freeze({
  hcfa: 'Head circumference for age',
  lhfa: 'Length/height for age',
  wfa: 'Weight for age',
  wflh: 'Weight for length/height',
});

const CategoryToYUnitLabel = Object.freeze({
  hcfa: unitCodes.cm,
  lhfa: unitCodes.cm,
  wfa: unitCodes.kg,
  wflh: unitCodes.cm,
});

export const CategoryCodes = Object.freeze({
  hcfa_b: 'hcfa_b',
  hcfa_g: 'hcfa_g',
  lhfa_b: 'lhfa_b',
  lhfa_g: 'lhfa_g',
  wfa_b: 'wfa_b',
  wfa_g: 'wfa_g',
  wflh_b: 'wflh_b',
  wflh_g: 'wflh_g',
});

export const CategoryToLabel = Object.freeze({
  hcfa_b: CategoryLabels.hcfa,
  hcfa_g: CategoryLabels.hcfa,
  lhfa_b: CategoryLabels.lhfa,
  lhfa_g: CategoryLabels.lhfa,
  wfa_b: CategoryLabels.wfa,
  wfa_g: CategoryLabels.wfa,
  wflh_b: CategoryLabels.wflh,
  wflh_g: CategoryLabels.wflh,
});

export const CategoryToYUnit = Object.freeze({
  hcfa_b: CategoryToYUnitLabel.hcfa,
  hcfa_g: CategoryToYUnitLabel.hcfa,
  lhfa_b: CategoryToYUnitLabel.lhfa,
  lhfa_g: CategoryToYUnitLabel.lhfa,
  wfa_b: CategoryToYUnitLabel.wfa,
  wfa_g: CategoryToYUnitLabel.wfa,
  wflh_b: CategoryToYUnitLabel.wflh,
  wflh_g: CategoryToYUnitLabel.wflh,
});

export const DataSetLabels = Object.freeze({
  y_0_5: '0 to 5 years',
  w_0_13: '0 to 13 weeks',
  y_0_2: '0 to 2 years',
  y_2_5: '2 to 5 years',
});

export const ChartLabelCodes = Object.freeze({
  b_0_5_y: DataSetLabels.y_0_5,
  b_0_13_w: DataSetLabels.w_0_13,
  g_0_5_y: DataSetLabels.y_0_5,
  g_0_13_w: DataSetLabels.w_0_13,
  b_0_2_y: DataSetLabels.y_0_2,
  b_2_5_y: DataSetLabels.y_2_5,
  g_0_2_y: DataSetLabels.y_0_2,
  g_2_5_y: DataSetLabels.y_2_5,
});

export const ChartCodes = Object.freeze({
  hcfa_b_0_5_y_z: ChartLabelCodes.b_0_5_y,
  hcfa_b_0_13_w_z: ChartLabelCodes.b_0_13_w,
  hcfa_g_0_5_y_z: ChartLabelCodes.g_0_5_y,
  hcfa_g_0_13_w_z: ChartLabelCodes.g_0_13_w,
  lhfa_b_0_2_y_z: ChartLabelCodes.b_0_2_y,
  lhfa_b_0_13_w_z: ChartLabelCodes.b_0_13_w,
  lhfa_b_2_5_y_z: ChartLabelCodes.b_2_5_y,
  lhfa_g_0_2_y_z: ChartLabelCodes.g_0_2_y,
  lhfa_g_0_13_w_z: ChartLabelCodes.b_0_13_w,
  lhfa_g_2_5_y_z: ChartLabelCodes.g_2_5_y,
  wfa_b_0_5_y_z: ChartLabelCodes.b_0_5_y,
  wfa_b_0_13_w_z: ChartLabelCodes.b_0_13_w,
  wfa_g_0_5_y_z: ChartLabelCodes.g_0_5_y,
  wfa_g_0_13_w_z: ChartLabelCodes.g_0_13_w,
  wfh_g_2_5_y_z: ChartLabelCodes.g_2_5_y,
  wfl_g_0_2_y_z: ChartLabelCodes.g_0_2_y,
  wfh_b_2_5_y_z: ChartLabelCodes.b_2_5_y,
  wfl_b_0_2_y_z: ChartLabelCodes.b_0_2_y,
});

export const GenderCodes = Object.freeze({
  CGC_Male: 'M',
  CGC_Female: 'F',
});
