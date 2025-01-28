import { type OpenmrsResource } from '@openmrs/esm-api';

export interface Patient {
  uuid: string;
  display: string;
  identifiers: Array<any>;
  person: Person;
};

export interface Person {
  age: number;
  attributes: Array<Attribute>;
  birthDate: string;
  gender: string;
  display: string;
  preferredAddress: OpenmrsResource;
  uuid: string;
};

export interface Attribute {
  attributeType: OpenmrsResource;
  display: string;
  uuid: string;
  value: string | number;
}

export type ServerDataValues = {
  dataElement: string;
  value: any;
};
export type ClientEvent = {
  program: string;
  programStage: string;
  enrollment: string;
  event: string;
  occurredAt: string;
  createdAt: string;
  updatedAt: string;
  orgUnit: string;
  status: 'ACTIVE' | 'COMPLETED';
  dataValues: Record<string, string>;
};
export type ServerEvent = {
  event: string;
  occurredAt: string;
  orgUnit: string;
  program: string;
  programStage: string;
  enrollment: string;
  status: 'ACTIVE' | 'COMPLETED';
  createdAt?: string;
  updatedAt?: string;
  dataValues?: ServerDataValues[];
};
