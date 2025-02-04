import { useConfig } from '@openmrs/esm-framework';

export const useChartConfig = () => {
  // Extraemos las configuraciones desde el esquema usando `useConfig`
  const config = useConfig();

  // Simulamos estados de carga y error. No es necesario hacer fetch, porque la configuración se carga localmente.
  const isLoading = false;
  const isError = false;

  // Retornamos el objeto de configuración en el formato esperado por los componentes.
  return {
    chartConfig: {
      metadata: {
        headCircumference: config.metadata.dataElements.headCircumference,
        height: config.metadata.dataElements.height,
        weight: config.metadata.dataElements.weight,
      },
      settings: {
        customReferences: config.settings.customReferences,
        usePercentiles: config.settings.usePercentiles,
        weightInGrams: config.settings.weightInGrams,
        defaultIndicator: config.settings.defaultIndicator,
      },
    },
    isLoading,
    isError,
  };
};
