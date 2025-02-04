import useSWR from 'swr';
import { openmrsFetch } from '@openmrs/esm-framework'; // Función para realizar solicitudes en OpenMRS

export const useCustomReferences = () => {
  // Función fetcher para SWR que obtiene referencias personalizadas desde OpenMRS
  const fetchCustomReferences = async () => {
    const response = await openmrsFetch('/ws/rest/v1/datastore/capture-growth-chart/customReferences'); // Ruta API
    if (!response.ok) {
      throw new Error('Failed to fetch custom references');
    }
    return response.data;
  };

  const { data, error, isValidating } = useSWR('customReferences', fetchCustomReferences, {
    revalidateOnFocus: true, // Revalida al volver a enfocar la ventana
    dedupingInterval: 5000, // Evita solicitudes duplicadas en 5 segundos
  });

  return {
    customReferences: data?.customReferences,
    isLoading: !data && !error && isValidating,
    isError: !!error,
  };
};
