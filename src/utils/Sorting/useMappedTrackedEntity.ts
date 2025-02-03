import { GenderCodes } from '../../../types/chartDataTypes';
import { ChartConfig } from '../Hooks/useChartConfig';
import { TrackedEntity } from '../Hooks/useTeiById';

interface Attribute {
    [key: string]: string;
}

export interface MappedEntityValues {
    dateOfBirth: string | undefined;
    gender: string | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
    [key: string]: string | undefined;
}

interface UseMappedTrackedEntityVariablesProps {
    trackedEntity: TrackedEntity;
    trackedEntityAttributes: Attribute[];
    variableMappings: ChartConfig['metadata']['attributes'];
}

export const useMappedTrackedEntityVariables = ({
    trackedEntity,
    trackedEntityAttributes,
    variableMappings,
}: UseMappedTrackedEntityVariablesProps): MappedEntityValues => {
    const mappedValues: MappedEntityValues = {
        dateOfBirth: undefined,
        gender: undefined,
        firstName: undefined,
        lastName: undefined,
    };

    if (!trackedEntity || !trackedEntityAttributes || !variableMappings) {
        return mappedValues;
    }

    return Object.entries(variableMappings)
        .reduce((acc, [key, attributeId]) => {
            const attribute = trackedEntityAttributes.find((attr: Attribute) => attr.attribute === attributeId);
            if (attribute) {
                const value = trackedEntity.attributes.find((attr: Attribute) => attr.attribute === attributeId)?.value;
                if (value !== undefined && value !== null) {
                    if (key === 'gender') {
                        if (value === String(variableMappings.femaleOptionCode)) {
                            acc.gender = GenderCodes.CGC_Female;
                        }
                        if (value === String(variableMappings.maleOptionCode)) {
                            acc.gender = GenderCodes.CGC_Male;
                        }
                        return acc;
                    }
                    acc[key] = value;
                }
            }
            return acc;
        }, mappedValues);
};
