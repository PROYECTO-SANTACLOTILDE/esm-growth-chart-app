import useSWRImmutable from 'swr/immutable';
import { type OpenmrsResource, openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';

export interface Patient {
  uuid: string;
  display: string;
  identifiers: Array<any>;
  person: Person;
}

export interface Person {
  age: number;
  attributes: Array<Attribute>;
  birthDate: string;
  gender: string;
  display: string;
  preferredAddress: OpenmrsResource;
  uuid: string;
}

export interface Attribute {
  attributeType: OpenmrsResource;
  display: string;
  uuid: string;
  value: string | number;
}

const customRepresentation =
  'custom:(uuid,gender,birthdate,birthdateEstimated)';

/**
 *  React hook that takes patientUuid and return Patient Attributes {@link Attribute}
 * @param patientUuid Unique Patient identifier
 * @returns Object containing `patient-attributes`, `isLoading` loading status, `error`
 */
export const usePatientAgeAndGender = (patientUuid: string | null) => {
  const { data, error, isLoading } = useSWRImmutable<{ data: Patient }>(
    `${restBaseUrl}/person/${patientUuid}?v=${customRepresentation}`,
    openmrsFetch,
  );

  return {
    isLoading,
    attributes: data?.data ?? [],
    error: error,
  };
};
