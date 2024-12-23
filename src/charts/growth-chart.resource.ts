import useSWR from 'swr';
import { fhirBaseUrl, restBaseUrl, openmrsFetch } from '@openmrs/esm-framework';

/**
 * This hook searches for a patient using the provided search term from the
 * OpenMRS FHIR API.It leverages the useSWR hook from the SWR library
 * https://swr.vercel.app/docs/data-fetching to fetch data. SWR provides a
 * number of benefits over the standard React useEffect hook, including:
 *
 * - Fast, lightweight and reusable data fetching
 * - Built-in cache and request deduplication
 * - Real-time updates
 * - Simplified error and loading state handling, and more.
 *
 *  We recommend using SWR for data fetching in your OpenMRS frontend modules.
 *
 * See the docs for the underlying fhir.js Client object: https://github.com/FHIR/fhir.js#api
 * See the OpenMRS FHIR Module docs: https://wiki.openmrs.org/display/projects/OpenMRS+FHIR+Module
 * See the OpenMRS REST API docs: https://rest.openmrs.org/#openmrs-rest-api
 *
 * @param query A patient name or ID
 * @returns The first matching patient
 */

interface Observation {
  resource: {
    code: {
      coding: Array<{ display: string }>;
    };
    effectiveDateTime: string;
    valueQuantity: {
      value: number;
      unit: string;
    };
  };
}

export function useGrowthData(query: string) {
  const url = `${fhirBaseUrl}/Observation`;

  const { data, error, isLoading } = useSWR<
    {
      data: { entry: Array<{ resource: fhir.Observation }> };
    },
    Error
  >(query ? url : null, openmrsFetch);

  return {
    observation: data ? data?.data?.entry[0].resource : null,
    isLoading,
    error,
  };
}
