import useSWR, { useSWRConfig } from 'swr';
import { openmrsFetch } from '@openmrs/esm-framework'; // Función para realizar solicitudes en OpenMRS

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

// Función fetcher para SWR que usa la API de OpenMRS
const fetchChartConfig = async (): Promise<ChartConfig> => {
    const response = await openmrsFetch('/ws/rest/v1/systemsetting/capture-growth-chart.config'); // Ruta API
    if (!response.ok) {
        throw new Error('Failed to fetch chart configuration');
    }
    return response.data;
};

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
