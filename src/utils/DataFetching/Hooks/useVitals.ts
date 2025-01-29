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
      const url = `${fhirBaseUrl}/Observation?subject:Patient=${patientUuid}&code=${conceptUuids}&_sort=-date&_count=${pageSize}&_getpagesoffset=${page * pageSize}`;
      return openmrsFetch(url);
    },
  );

  const formattedObs = useMemo(() => {
    return data?.flatMap((page) =>
      page.data.entry.map((entry) => {
        const resource = entry.resource;
        return {
          date: resource.effectiveDateTime,
          value: resource.valueQuantity?.value,
          code: resource.code.coding[0]?.code,
        };
      }),
    );
  }, [data]);

  return { data: formattedObs, isLoading, error };
}
