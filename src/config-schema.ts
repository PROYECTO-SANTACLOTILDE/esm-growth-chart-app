import { Type } from '@openmrs/esm-framework';

/**
 * Schema para las configuraciones de gráficos de crecimiento.
 */
export const configSchema = {
  metadata: {
    dataElements: {
      headCircumference: {
        _type: Type.UUID,
        _description: 'UUID para circunferencia de la cabeza',
        _default: '5314AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      },
      height: {
        _type: Type.UUID,
        _description: 'UUID para altura',
        _default: '5090AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      },
      weight: {
        _type: Type.UUID,
        _description: 'UUID para peso',
        _default: '5089AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      },
    },
    program: {
      programStageId: {
        _type: Type.UUID,
        _description: 'UUID del programa',
        _default: 'uuid-for-program-stage', // Reemplaza con el UUID real
      },
    },
  },
  settings: {
    customReferences: {
      _type: Type.Boolean,
      _description: 'Indica si se usan referencias personalizadas',
      _default: true,
    },
    usePercentiles: {
      _type: Type.Boolean,
      _description: 'Indica si se usan percentiles',
      _default: true,
    },
    weightInGrams: {
      _type: Type.Boolean,
      _description: 'Indica si el peso se mide en gramos',
      _default: false,
    },
    defaultIndicator: {
      _type: Type.String,
      _description: 'Indicador por defecto',
      _default: 'wfa', // "Weight for age"
    },
  },
  concepts: {
    systolicBloodPressureUuid: {
      _type: Type.ConceptUuid,
      _default: '5085AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    },
    headCircumference: {
      _type: Type.UUID,
      _default: '5314AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    },
    diastolicBloodPressureUuid: {
      _type: Type.ConceptUuid,
      _default: '5086AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    },
    pulseUuid: {
      _type: Type.ConceptUuid,
      _default: '5087AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    },
    temperatureUuid: {
      _type: Type.ConceptUuid,
      _default: '5088AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    },
    oxygenSaturationUuid: {
      _type: Type.ConceptUuid,
      _default: '5092AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    },
    heightUuid: {
      _type: Type.ConceptUuid,
      _default: '5090AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    },
    weightUuid: {
      _type: Type.ConceptUuid,
      _default: '5089AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    },
    headUuid: {
      _type: Type.ConceptUuid,
      _default: '5089AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    },
    respiratoryRateUuid: {
      _type: Type.ConceptUuid,
      _default: '5242AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    },
    generalPatientNoteUuid: {
      _type: Type.ConceptUuid,
      _default: '165095AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    },
    midUpperArmCircumferenceUuid: {
      _type: Type.ConceptUuid,
      _default: '1343AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    },
    vitalSignsConceptSetUuid: {
      _type: Type.ConceptUuid,
      _default: '1114AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    },
  },
  vitals: {
    useFormEngine: {
      _type: Type.Boolean,
      _default: false,
      _description:
        'Whether to use an Ampath form as the vitals and biometrics form. If set to true, encounterUuid and formUuid must be set as well.',
    },
    encounterTypeUuid: {
      _type: Type.UUID,
      _default: '67a71486-1a54-468f-ac3e-7091a9a79584',
    },
    logo: {
      src: {
        _type: Type.String,
        _default: null,
        _description: 'A path or URL to an image. Defaults to the OpenMRS SVG sprite.',
      },
      alt: {
        _type: Type.String,
        _default: 'Logo',
        _description: 'Alt text, shown on hover',
      },
      name: {
        _type: Type.String,
        _default: null,
        _description: 'The organization name displayed when image is absent',
      },
    },
    showPrintButton: {
      _type: Type.Boolean,
      _default: false,
      _description:
        'Determines whether or not to display the Print button in the vitals datatable header. If set to true, a Print button gets shown as the right-most item in the table header. When clicked, this button enables the user to print out the contents of the table',
    },
    formUuid: {
      _type: Type.UUID,
      _default: '9f26aad4-244a-46ca-be49-1196df1a8c9a',
    },
    formName: {
      _type: Type.String,
      _default: 'Vitals',
    },
    useMuacColors: {
      _type: Type.Boolean,
      _default: false,
      _description: 'Whether to show/use MUAC color codes. If set to true, the input will show status colors.',
    },
  },
  biometrics: {
    bmiUnit: {
      _type: Type.String,
      _default: 'kg / m²',
    },
  },
};

export type ChartConfig = {
  metadata: {
    attributes: {
      dateOfBirth: string;
      gender: string;
      femaleOptionCode: string;
      maleOptionCode: string;
    };
    dataElements: {
      headCircumference: string;
      height: string;
      weight: string;
    };
    program: {
      programStageId: string;
    };
  };
  settings: {
    customReferences: boolean;
    usePercentiles: boolean;
    weightInGrams: boolean;
    defaultIndicator: string;
  };
};

export interface BiometricsConfigObject {
  bmiUnit: string;
  heightUnit: string;
  weightUnit: string;
}
export interface ConfigObject {
  concepts: {
    systolicBloodPressureUuid: string;
    diastolicBloodPressureUuid: string;
    pulseUuid: string;
    temperatureUuid: string;
    oxygenSaturationUuid: string;
    heightUuid: string;
    weightUuid: string;
    respiratoryRateUuid: string;
    midUpperArmCircumferenceUuid: string;
    vitalSignsConceptSetUuid: string;
  };
  vitals: {
    useFormEngine: boolean;
    encounterTypeUuid: string;
    formUuid: string;
    formName: string;
    useMuacColors: boolean;
    showPrintButton: boolean;
  };
  biometrics: BiometricsConfigObject;
}
