import React from 'react';
import { useTranslation } from 'react-i18next';
import { OverflowMenuItem } from '@carbon/react';
import { EllipsisButton } from './EllipsisButton';
import { type CategoryCodes, type ChartData } from '../../../../types/chartDataTypes';
import { MappedEntityValues } from '../../../utils/DataFetching/Sorting/useMappedTrackedEntity';
import { PrintDocument } from '../../../../utils/ChartOptions';
import { Printer } from '@carbon/react/icons'; // Ícono de Carbon

interface ChartSettingsButtonProps {
  category: keyof typeof CategoryCodes;
  dataset: keyof ChartData;
  gender: string;
  trackedEntity: MappedEntityValues;
}

export const ChartSettingsButton = ({ category, dataset, gender, trackedEntity }: ChartSettingsButtonProps) => {
  const { t } = useTranslation();

  const handlePrintDocument = () => {
    PrintDocument({
      category,
      dataset,
      gender,
      firstName: trackedEntity.firstName,
      lastName: trackedEntity.lastName,
    });
  };

  return (
    <EllipsisButton dataTest="widget-profile-overflow-menu" secondary small>
      <OverflowMenuItem
        itemText={t('Print')}
        onClick={handlePrintDocument}
        renderIcon={Printer}
        data-testid="print-menu-item"
      />
    </EllipsisButton>
  );
};
