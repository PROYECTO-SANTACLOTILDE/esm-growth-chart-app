import useSWR, { useSWRConfig } from 'swr';
import { openmrsFetch } from '@openmrs/esm-framework'; // Función para realizar solicitudes en OpenMRS

export type ChartConfig = {
  //estructura de datos de la configuración del gráfico
    metadata: {
        attributes: {
            dateOfBirth: string; //UUIDs del concepto detras de fecha de nacimiento
            gender: string; //UUIDs del concepto detras de genero
            femaleOptionCode: string; //UUIDs de MUJER
            maleOptionCode: string; //UUIDs de HOMBRE
        };
        dataElements: {
            headCircumference: string; //UUIDs del concepto
            height: string; //UUIDs del concepto
            weight: string; //UUIDs del concepto
        };
        program: {
            programStageId: string; //UUIDs del programa
        };
    };
    settings: {
        customReferences: boolean; //settings que extraigo del mismo front (con el hook config de openmrs-framework o de la BD desde la tabla systemsetting)
        usePercentiles: boolean; //settings que extraigo del mismo front (con el hook config de openmrs-framework o de la BD desde la tabla systemsetting)
        weightInGrams: boolean; //settings que extraigo del mismo front (con el hook config de openmrs-framework o de la BD desde la tabla systemsetting)
        defaultIndicator: string; //settings que extraigo del mismo front (con el hook config de openmrs-framework o de la BD desde la tabla systemsetting)
    };
};

// Función fetcher para SWR que usa la API de OpenMRS, la otra opcion es usar configSchema y useConfig de '@openmrs/esm-framework' para almacenar esas variables;
const fetchChartConfig = async (): Promise<ChartConfig> => {
    const response = await openmrsFetch('/ws/rest/v1/systemsetting/capture-growth-chart.config'); // Ruta API
    if (!response.ok) {
        throw new Error('Failed to fetch chart configuration');
    }
    return response.data;
};

//aca deberia cargar la estructura de datos de la configuración del gráfico con el fetch de setting y los UUIDs.
export const useChartConfig = () => {
    const { data, error, isValidating } = useSWR<ChartConfig>('chartConfig', fetchChartConfig, {
        revalidateOnFocus: true, // Opcional: Actualiza al volver a enfocar la ventana
        dedupingInterval: 5000, // Evita solicitudes duplicadas en un intervalo de 5 segundos
    });

    return {
        chartConfig: data,
        isLoading: !data && !error && isValidating,
        isError: !!error,
    };
};
