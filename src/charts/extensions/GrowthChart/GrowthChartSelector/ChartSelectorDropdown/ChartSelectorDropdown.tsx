import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown, Tooltip, TextInput } from '@carbon/react';
import { type CategoryCodes, type ChartData } from '../../../../../types/chartDataTypes';

interface DropdownItem {
  id: string;
  text: string;
}

interface ChartSelectorDropdownProps {
  title: string;
  items: DropdownItem[];
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
    <Tooltip align="bottom" label={t('genderPreselected', 'Gender is pre-selected based on the profile')}>
      <TextInput
        id={`${dataTest}-disabled`}
        value={title}
        disabled
        size="sm"
        data-testid={`${dataTest}-disabled`}
        labelText=""
      />
    </Tooltip>
  ) : (
    <Dropdown
      id={`${dataTest}-dropdown`}
      titleText=""
      label={title}
      items={items}
      itemToString={(item) => item?.text || ''}
      onChange={({ selectedItem }) => selectedItem && handleItemChange(selectedItem.id)}
      size="sm"
      data-testid={dataTest}
    />
  );
};
