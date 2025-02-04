import React from 'react';
import { useTranslation } from 'react-i18next';
import { OverflowMenuItem } from '@carbon/react';
import { Printer } from '@carbon/react/icons';
import { EllipsisButton } from './EllipsisButton';
import { type CategoryCodes, type ChartData } from '../../../../types/chartDataTypes';
import { PrintDocument } from '../../../../utils/ChartOptions';

interface ChartSettingsButtonProps {
  category: keyof typeof CategoryCodes;
  dataset: keyof ChartData;
  gender: string;
}

export const ChartSettingsButton = ({ category, dataset, gender }: ChartSettingsButtonProps) => {
  const { t } = useTranslation();

  const handlePrintDocument = () => {
    PrintDocument({ category, dataset, gender });
  };

  return (
    <EllipsisButton dataTest="widget-profile-overflow-menu" kind="ghost" size="sm">
      <OverflowMenuItem
        itemText={t('print', 'Print')}
        onClick={handlePrintDocument}
        renderIcon={Printer}
        data-testid="print-menu-item"
        requireTitle
      />
    </EllipsisButton>
  );
};
