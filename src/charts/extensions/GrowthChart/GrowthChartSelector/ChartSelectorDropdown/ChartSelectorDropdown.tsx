import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown, DropdownItem, Tooltip, TextInput } from '@carbon/react';
import { type CategoryCodes, type ChartData } from '../../../../../types/chartDataTypes';

interface ChartSelectorDropdownProps {
  title: keyof typeof CategoryCodes | keyof ChartData;
  items: string[];
  handleItemChange: (key: string) => void;
  isDisabled?: boolean;
  dataTest?: string;
}

export const ChartSelectorDropdown = ({
  title,
  items,
  handleItemChange,
  isDisabled,
  dataTest,
}: ChartSelectorDropdownProps) => {
  const { t } = useTranslation();

  return isDisabled ? (
    <Tooltip
      align="bottom"
      label={t('Gender is pre-selected based on the profile')}
      description={t('This field is disabled because the gender is pre-selected.')}
    >
      <TextInput
        id={`${dataTest}-disabled-input`}
        value={title.toString()}
        disabled
        size="sm"
        data-testid={`${dataTest}-disabled-button`}
      />
    </Tooltip>
  ) : (
    <Dropdown
      id={`${dataTest}-dropdown`}
      className="cursor-pointer"
      onChange={({ selectedItem }) => handleItemChange(selectedItem)}
      initialSelectedItem={title.toString()}
      size="sm"
      data-testid={`${dataTest}-button`}
    >
      {items.map((item) => (
        <DropdownItem key={item} itemText={item} value={item} data-testid={`${dataTest}-item`} />
      ))}
    </Dropdown>
  );
};
