import useSWR from 'swr';
import { useMemo } from 'react';
import { openmrsFetch } from '@openmrs/esm-framework'; // OpenMRS Fetch utility
import { convertDataElementToValues } from '../Convert';
import { type ServerEvent } from '../../../types/Event.types';
import { RequestedEntities, handleAPIResponse } from './handleAPIResponse';

type UseEventsByProgramStageProps = {
  programStageId: string | undefined;
  orgUnitId: string | undefined;
  programId: string | undefined;
  teiId: string | undefined;
};

export type DataValue = {
  [key: string]: string | number;
};

export type MeasurementData = {
  eventDate: string;
  dataValues: DataValue;
};

export interface Event {
  dataValues: DataValue[];
  occurredAt: string;
  event: string;
  program: string;
  programStage: string;
  status: 'ACTIVE' | 'COMPLETED';
}

interface UseEventsByProgramStageReturn {
  events: Event[] | undefined;
  isLoading: boolean;
  isError: boolean;
  stageHasEvents: boolean;
}

export const useEvents = ({
  orgUnitId,
  programId,
  programStageId,
  teiId,
}: UseEventsByProgramStageProps): UseEventsByProgramStageReturn => {
  // Fetcher for SWR to retrieve events
  const fetchEvents = async () => {
    const queryParams = new URLSearchParams({
      fields: 'event,status,program,dataValues,occurredAt,programStage',
      program: programId ?? '',
      programStage: programStageId ?? '',
      orgUnit: orgUnitId ?? '',
      trackedEntity: teiId ?? '',
    }).toString();

    const response = await openmrsFetch(`/ws/rest/v1/tracker/events?${queryParams}`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }
    return response.data;
  };

  const { data, error, isValidating } = useSWR(
    ['eventsByProgramStage', orgUnitId, programStageId, programId, teiId],
    fetchEvents,
    { revalidateOnFocus: true, dedupingInterval: 5000 }
  );

  const apiResponse = handleAPIResponse(RequestedEntities.events, data);

  // Process events to convert data elements
  const events = useMemo(
    () =>
      apiResponse?.map((event: ServerEvent) => {
        const dataValues = convertDataElementToValues(event?.dataValues);
        return {
          ...event,
          dataValues,
        };
      }),
    [apiResponse]
  );

  const stageHasEvents = useMemo(() => events?.length !== 0, [events]);

  return {
    events,
    isLoading: !data && !error && isValidating,
    isError: !!error,
    stageHasEvents,
  };
};
