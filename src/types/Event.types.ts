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
