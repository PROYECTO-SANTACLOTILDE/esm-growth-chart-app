import useSWRImmutable from 'swr/immutable';
import { type OpenmrsResource, useConfig, openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';

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
  'custom:(uuid,display,identifiers:(identifier,uuid,preferred,location:(uuid,name),identifierType:(uuid,name,format,formatDescription,validator)),person:(uuid,display,gender,birthdate,dead,age,deathDate,birthdateEstimated,causeOfDeath,preferredName:(uuid,preferred,givenName,middleName,familyName),attributes,preferredAddress:(uuid,preferred,address1,address2,cityVillage,longitude,stateProvince,latitude,country,postalCode,countyDistrict,address3,address4,address5,address6,address7)))';

/**
 *  React hook that takes patientUuid and return Patient Attributes {@link Attribute}
 * @param patientUuid Unique Patient identifier
 * @returns Object containing `patient-attributes`, `isLoading` loading status, `error`
 */
export const usePatientAttributes = (patientUuid: string) => {
  const { data, error, isLoading } = useSWRImmutable<{ data: Patient }>(
    `${restBaseUrl}/patient/${patientUuid}?v=${customRepresentation}`,
    openmrsFetch,
  );

  return {
    isLoading,
    attributes: data?.data.person.attributes ?? [],
    error: error,
  };
};

/**
 *  React hook that takes patientUuid {@link string} and return contact details
 *  derived from patient-attributes using configured attributeTypes
 * @param patientUuid Unique patient identifier {@type string}
 * @returns Object containing `contactAttribute` {@link Attribute} loading status
 * Quiero uuid, birthdate, gender y nombres de los pacientes
 */
export const usePatientContactAttributes = (patientUuid: string) => {
  const { contactAttributeTypes } = useConfig();
  const { attributes, isLoading } = usePatientAttributes(patientUuid);
  const contactAttributes = attributes.filter(
    ({ attributeType }) => contactAttributeTypes?.some((uuid) => attributeType.uuid === uuid),
  );
  return {
    contactAttributes: contactAttributes ?? [],
    isLoading,
  };
};
