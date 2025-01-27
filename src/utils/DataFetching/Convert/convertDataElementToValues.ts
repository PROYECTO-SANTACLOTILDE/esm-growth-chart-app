import { type ServerDataValues } from '../../../types/Event.types';

export const convertDataElementToValues = (dataElements: ServerDataValues[]): { [key: string]: string } =>
  dataElements?.reduce((dataValuesAcc: { [key: string]: string }, dataValue) => {
    dataValuesAcc[dataValue.dataElement] = dataValue.value;
    return dataValuesAcc;
  }, {});
