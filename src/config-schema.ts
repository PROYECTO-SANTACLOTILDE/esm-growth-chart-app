import { Type } from '@openmrs/esm-framework';

export const configSchema = {
  settings: {
    customReferences: {
      _type: Type.Boolean,
      _default: true,
    },
    usePercentiles: {
      _type: Type.Boolean,
      _default: true,
    },
    weightInGrams: {
      _type: Type.Boolean,
      _default: false,
    },
    defaultIndicator: {
      _type: Type.String,
      _default: 'wfa', // "Weight for age"
    },
  },
  concepts: {
    headCircumferenceUuid: {
      _type: Type.UUID,
      _default: '163555AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    },
    heightUuid: {
      _type: Type.UUID,
      _default: '5090AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    },
    weightUuid: {
      _type: Type.UUID,
      _default: '5089AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    },
    growthMeasurementConceptSetUuid: {
      _type: Type.UUID,
      _default: '1114AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    },
  },
};

export type ConfigObject = {
  settings: {
    customReferences: boolean;
    usePercentiles: boolean;
    weightInGrams: boolean;
    defaultIndicator: string;
  };
};

export interface ConfigObjectWithUuids {
  concepts: {
    headCircumferenceUuid: string;
    heightUuid: string;
    weightUuid: string;
    growthMeasurementConceptSetUuid: string;
  };
}
