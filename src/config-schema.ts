import { Type } from '@openmrs/esm-framework';

/**
 * Schema para las configuraciones de gráficos de crecimiento.
 */
export const configSchema = {
  metadata: {
    attributes: {
      dateOfBirth: {
        _type: Type.UUID,
        _description: 'UUID del concepto detrás de fecha de nacimiento',
        _default: 'uuid-for-date-of-birth', // Reemplaza con el UUID real
      },
      gender: {
        _type: Type.UUID,
        _description: 'UUID del concepto detrás de género',
        _default: 'uuid-for-gender', // Reemplaza con el UUID real
      },
      femaleOptionCode: {
        _type: Type.UUID,
        _description: 'UUID para Mujer',
        _default: 'uuid-for-female', // Reemplaza con el UUID real
      },
      maleOptionCode: {
        _type: Type.UUID,
        _description: 'UUID para Hombre',
        _default: 'uuid-for-male', // Reemplaza con el UUID real
      },
    },
    dataElements: {
      headCircumference: {
        _type: Type.UUID,
        _description: 'UUID para circunferencia de la cabeza',
        _default: 'uuid-for-head-circumference', // Reemplaza con el UUID real
      },
      height: {
        _type: Type.UUID,
        _description: 'UUID para altura',
        _default: 'uuid-for-height', // Reemplaza con el UUID real
      },
      weight: {
        _type: Type.UUID,
        _description: 'UUID para peso',
        _default: 'uuid-for-weight', // Reemplaza con el UUID real
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
