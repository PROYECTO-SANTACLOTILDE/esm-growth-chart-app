import { useEffect, useState } from 'react';
import { type ChartData } from '../../types/chartDataTypes';

interface ChartDataForGenderProps {
    gender: string;
    chartData: ChartData;
}

export const useChartDataForGender = ({ gender, chartData = {} }: ChartDataForGenderProps) => {
    const [chartDataForGender, setChartDataForGender] = useState<ChartData>({});

    useEffect(() => {
        const filteredData = Object.entries(chartData).reduce(
            (acc: ChartData, [key, value]) => {
                if (value?.categoryMetadata?.gender === gender) {
                  acc[key] = value;
                }
                return acc;
            },
            {},
        );

        setChartDataForGender(filteredData);
    }, [gender, chartData]);

    return { chartDataForGender };
};
