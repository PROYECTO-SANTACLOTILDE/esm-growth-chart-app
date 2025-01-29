import { useMemo } from 'react';
import { fhirBaseUrl, openmrsFetch, useConfig } from '@openmrs/esm-framework';
import useSWR from 'swr';

export interface PatientVitalsAndBiometrics {
  id: string;
  date: string;
  height?: number;
  weight?: number;
  headCircumference?: number;
}

export function useVitalsAndBiometrics(patientUuid: string | null, mode: 'vitals' | 'biometrics' | 'both' = 'vitals') {
  const { concepts } = useConfig();

  const conceptUuids = useMemo(() => {
    if (!concepts) return '';

    return (mode === 'both'
      ? Object.values(concepts)
      : Object.values(concepts).filter((uuid) =>
          mode === 'vitals'
            ? !['heightUuid', 'weightUuid', 'headCircumferenceUuid'].includes(uuid as string)
            : ['heightUuid', 'weightUuid', 'headCircumferenceUuid'].includes(uuid as string),
        )
    ).join(',');
  }, [concepts, mode]);

  const { data, isLoading, error } = useSWR<{ data: { entry: Array<{ resource: any }> } }>(
    patientUuid ? `${fhirBaseUrl}/Observation?subject:Patient=${patientUuid}&code=${conceptUuids}&_sort=-date&_count=100` : null,
    openmrsFetch
  );

  console.log(data?.data);

  const formattedObs = useMemo(() => {
    if (!data) return [];

    const vitalsMap = new Map<string, Partial<PatientVitalsAndBiometrics>>();

    data?.data?.entry?.forEach((entry) => {
      const resource = entry.resource;
      const recordedDate = resource?.effectiveDateTime ?? 'Unknown date';
      const conceptUuid = resource?.code?.coding?.[0]?.code;
      const value = resource?.valueQuantity?.value ?? null;

      if (!conceptUuid || !value) return;

      if (!vitalsMap.has(recordedDate)) {
        vitalsMap.set(recordedDate, { id: recordedDate, date: recordedDate });
      }

      const vitalsEntry = vitalsMap.get(recordedDate);

      switch (conceptUuid) {
        case concepts.heightUuid:
          vitalsEntry!.height = value;
          break;
        case concepts.weightUuid:
          vitalsEntry!.weight = value;
          break;
        case concepts.headCircumferenceUuid:
          vitalsEntry!.headCircumference = value;
          break;
        default:
          break;
      }
    });

    return Array.from(vitalsMap.values());
  }, [data, concepts]);

  return { data: formattedObs, isLoading, error };
}
