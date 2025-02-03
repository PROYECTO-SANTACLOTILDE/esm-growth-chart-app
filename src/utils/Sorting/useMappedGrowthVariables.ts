import { Event } from '../Hooks/useEvents';

interface UseMappedGrowthVariablesProps {
    events: Event[];
    growthVariables: { [key: string]: string };
    isWeightInGrams: boolean;
}

export interface MappedDataValue {
    eventDate: string;
    dataValues: {
        weight: string;
        headCircumference: string;
        height: string;
    };
}

export const useMappedGrowthVariables = ({
    events,
    growthVariables,
    isWeightInGrams,
}: UseMappedGrowthVariablesProps): MappedDataValue[] | undefined => {
    const mappedData = events?.map((event: Event) => {
        const dataValueMap: { weight: string; headCircumference: string; height: string; [key: string]: string } = {
            weight: '',
            headCircumference: '',
            height: '',
        };

        if (growthVariables && event.dataValues) {
            Object.entries(growthVariables).reduce((acc, [key, value]: [string, string]) => {
                const dataValue = String(Object.entries(event.dataValues).find(([dataElement]) => dataElement === value)?.[1]);
                if (dataValue && value) {
                    acc[key] = (key === 'weight' && (isWeightInGrams || Number(dataValue) > 1000)) ? String(Number(dataValue) / 1000) : dataValue;
                }
                return acc;
            }, dataValueMap);
        }

        const eventDate = String(event.occurredAt).split('T')[0];

        return { eventDate, dataValues: dataValueMap };
    });

    return mappedData?.sort((a, b) => a.eventDate.localeCompare(b.eventDate));
};
