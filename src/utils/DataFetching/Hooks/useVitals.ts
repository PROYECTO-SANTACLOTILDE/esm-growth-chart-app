import { useCallback, useMemo } from 'react';
import { fhirBaseUrl, openmrsFetch, useConfig } from '@openmrs/esm-framework';
import useSWRInfinite from 'swr/infinite';

const pageSize = 100;

export function useVitalsAndBiometrics(patientUuid, mode = 'vitals') {
  const { concepts } = useConfig();

  const conceptUuids = useMemo(
    () => Object.values(concepts).join(','),
    [concepts],
  );

  const getPage = useCallback(
    (page, prevPageData) => ({
      patientUuid,
      conceptUuids,
      page,
      prevPageData,
    }),
    [conceptUuids, patientUuid],
  );

  const { data, isLoading, error } = useSWRInfinite(
    getPage,
    ({ patientUuid, conceptUuids, page }) => {
      if (!patientUuid) return null; // 🚀 Prevent API calls with empty UUID
      const url = `${fhirBaseUrl}/Observation?subject:Patient=${patientUuid}&code=${conceptUuids}&_sort=-date&_count=${pageSize}&_getpagesoffset=${page * pageSize}`;
      return openmrsFetch(url);
    },
  );

  // Safely extract vitals data
  const formattedObs = useMemo(() => {
    if (!data) return []; // 🚀 Avoid errors if data is undefined

    return data.flatMap((page) =>
      page?.data?.entry?.map((entry) => {
        const resource = entry.resource;
        return {
          date: resource?.effectiveDateTime ?? 'Unknown date',
          value: resource?.valueQuantity?.value ?? 'Unknown value',
          code: resource?.code?.coding?.[0]?.code ?? 'Unknown code',
        };
      }) ?? []
    );
  }, [data]);

  return { data: formattedObs, isLoading, error };
}
