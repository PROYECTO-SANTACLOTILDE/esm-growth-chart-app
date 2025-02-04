import useSWRImmutable from 'swr/immutable';
import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import { GenderCodes } from '../../../types/chartDataTypes';

export interface PatientInfo {
  uuid: string;
  gender: string;
  birthdate: string;
  birthdateEstimated?: boolean;
}

const customRepresentation = 'custom:(uuid,gender,birthdate,birthdateEstimated)';

/**
 * Hook para obtener la edad y género del paciente.
 * @param patientUuid Identificador único del paciente
 * @returns { gender, birthdate, birthdateEstimated, isLoading, error }
 */
export const usePatientBirthdateAndGender = (patientUuid) => {
  const { data, isLoading, error } = useSWRImmutable<{ data: PatientInfo }>(
    `${restBaseUrl}/person/${patientUuid}?v=${customRepresentation}`,
    openmrsFetch
  );

  const rawGender = data?.data.gender ?? GenderCodes.CGC_Female;


  return {
    gender: rawGender?.toUpperCase(),
    birthdate: data?.data.birthdate ?? '',
    birthdateEstimated: data?.data.birthdateEstimated ?? false,
    isLoading,
    error
  };
};
