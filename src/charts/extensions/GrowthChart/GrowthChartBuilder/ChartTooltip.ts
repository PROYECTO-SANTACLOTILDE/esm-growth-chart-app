import i18n from '@dhis2/d2-i18n';
import { Scriptable, ScriptableTooltipContext, TooltipPositionerMap } from 'chart.js';
import { differenceInMonths, differenceInWeeks, differenceInYears } from 'date-fns';
import { unitCodes, CategoryCodes, timeUnitData, TimeUnitCodes } from '../../../types/chartDataTypes';

interface TooltipConfig {
    enabled: boolean;
    intersect: boolean;
    position: Scriptable<keyof TooltipPositionerMap, ScriptableTooltipContext<'line'>>;
    backgroundColor: string;
    bodyFont: { size: number };
    bodyColor: string;
    borderColor: string;
    borderWidth: number;
    padding: number;
    caretPadding: number;
    boxPadding: number;
    usePointStyle: boolean;
    animation: any;
    filter: (tooltipItem: any) => boolean;
    callbacks: {
        title: () => string;
        beforeLabel: (tooltipItem: any) => string;
        label: (tooltipItem: any) => string[];
    };
}

export const ChartTooltip = (category: string, xAxisLabel: string, yAxisLabel: string, dateOfBirth: Date): TooltipConfig => {
    let xUnit = '';
    let yUnit = '';

    if (category === CategoryCodes.hcfa_b || category === CategoryCodes.hcfa_g) {
        yUnit = unitCodes.cm;
    }

    if (category === CategoryCodes.lhfa_b || category === CategoryCodes.lhfa_g) {
        yUnit = unitCodes.cm;
    }

    if (category === CategoryCodes.wfa_g || category === CategoryCodes.wfa_b) {
        yUnit = unitCodes.kg;
    }

    if (category === CategoryCodes.wflh_b || category === CategoryCodes.wflh_g) {
        xUnit = unitCodes.cm;
        yUnit = unitCodes.kg;
    }

    return {
        enabled: true,
        intersect: false,
        position: 'nearest',
        backgroundColor: 'white',
        bodyFont: { size: 12 },
        bodyColor: 'black',
        borderColor: 'black',
        borderWidth: 1,
        padding: 12,
        caretPadding: 4,
        boxPadding: 4,
        usePointStyle: true,
        animation: false,
        filter: (tooltipItem) => tooltipItem.dataset.id === 'measurementData',
        callbacks: {
            title: () => '',
            beforeLabel: (tooltipItem) => {
                const date = new Date(tooltipItem.raw.eventDate).toLocaleDateString();
                return `${i18n.t('Date')}: ${date}`;
            },
            label: (tooltipItem) => {
                const date = new Date(tooltipItem.raw.eventDate);
                let yValue = Number(tooltipItem.formattedValue.replace(',', '.'));
                let xValue = Number(tooltipItem.label.replace(',', '.'));
                const weeks = differenceInWeeks(date, dateOfBirth);

                let xLabel = '';

                yValue = Number(yValue.toFixed(2));
                xValue = Number(xValue.toFixed(2));

                const yLabel = `${yAxisLabel}: ${yValue} ${yUnit}`;
                xLabel = `${xAxisLabel}: ${xValue} ${xUnit}`;

                if (xAxisLabel === TimeUnitCodes.weeks) {
                    xLabel = `${i18n.t('Age')}: `;
                    xLabel += `${weeks} ${(weeks === 1) ? timeUnitData.Weeks.singular : timeUnitData.Weeks.plural} `;
                }
                if (xAxisLabel === TimeUnitCodes.months) {
                    const months = differenceInMonths(date, dateOfBirth) % 12;
                    const years = differenceInYears(date, dateOfBirth);

                    xLabel = `${i18n.t('Age')}: `;

                    if (weeks <= 13) {
                        xLabel += `${weeks} ${(weeks === 1) ? timeUnitData.Weeks.singular : timeUnitData.Weeks.plural} `;
                    }

                    if (weeks > 13) {
                        if (years > 0) {
                            xLabel += `${years} ${(years === 1) ? timeUnitData.Years.singular : timeUnitData.Years.plural} `;
                        }

                        if (months > 0) {
                            xLabel += `${months} ${(months === 1) ? timeUnitData.Months.singular : timeUnitData.Months.plural} `;
                        }
                    }
                }

                const labels = [];
                labels.push(yLabel);
                labels.push(xLabel);

                return labels;
            },
        },
    };
};
