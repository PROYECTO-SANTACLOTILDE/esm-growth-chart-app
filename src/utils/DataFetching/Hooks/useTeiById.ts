import useSWR from 'swr';
import { openmrsFetch } from '@openmrs/esm-framework';
import { RequestedEntities, handleAPIResponse } from './handleAPIResponse';

type UseEventByIdProps = {
  teiId: string | undefined;
};

type Attribute = {
  [key: string]: string;
};

export type TrackedEntity = {
  trackedEntity: string;
  trackedEntityType: string;
  createdAt: string;
  createdAtClient: string;
  updatedAt: string;
  orgUnit: string;
  inactive: boolean;
  deleted: boolean;
  potentialDuplicate: boolean;
  attributes: Attribute[];
};

type UseEventByIdReturn = {
  trackedEntity: TrackedEntity | undefined;
  isLoading: boolean;
  isError: boolean;
};

export const useTeiById = ({ teiId }: UseEventByIdProps): UseEventByIdReturn => {
  // Validación de teiId antes de realizar la solicitud
  if (!teiId) {
    throw new Error('teiId es obligatorio para realizar la solicitud.');
  }

  // Fetcher para SWR usando openmrsFetch
  const fetchTeiById = async () => {
    const response = await openmrsFetch(`/ws/rest/v1/tracker/trackedEntities/${teiId}`, {
      method: 'GET',
    });

    if (!response || !response.data) {
      throw new Error('No se pudo recuperar la entidad rastreada.');
    }

    return response.data;
  };

  // SWR hook
  const { data, error, isValidating } = useSWR(['trackedEntityById', teiId], fetchTeiById, {
    revalidateOnFocus: true,
    dedupingInterval: 5000, // 5 segundos
  });

  // Procesar la respuesta usando handleAPIResponse
  const apiResponse: TrackedEntity = handleAPIResponse(RequestedEntities.trackedEntity, data);

  return {
    trackedEntity: apiResponse,
    isLoading: !data && !error && isValidating,
    isError: !!error,
  };
};
