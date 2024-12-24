import { useMemo } from 'react';
import useSWR from 'swr';
import { fhirBaseUrl, openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';

type Observation = {
  id: string;
  effectiveDateTime: string;
  valueQuantity: {
    value: number;
    unit: string;
  };
  code: {
    coding: Array<{
      code: string;
      display: string;
    }>;
  };
};

type ObservationResponse = {
  resourceType: string;
  entry: Array<{
    resource: Observation;
  }>;
};

export function usePatientObservations(patientUuid: string, codes: string[]) {
  const fetchUrl = useMemo(() => {
    const codeParams = codes.join(',');
    return `${fhirBaseUrl}/Observation?subject:Patient=${patientUuid}&code=${codeParams}&_summary=data&_sort=-date&_count=100`;
  }, [patientUuid, codes]);

  const { data, error, isLoading } = useSWR<ObservationResponse>(patientUuid ? fetchUrl : null, async (url) => {
    const response = await openmrsFetch(url);
    return response?.data;
  });

  const observations = useMemo(() => {
    if (!data?.entry) return [];

    return data.entry.map((entry) => ({
      id: entry.resource.id,
      date: entry.resource.effectiveDateTime,
      value: entry.resource.valueQuantity.value,
      unit: entry.resource.valueQuantity.unit,
      type: entry.resource.code.coding[0].display,
    }));
  }, [data]);

  return {
    observations,
    isLoading,
    error,
  };
}
