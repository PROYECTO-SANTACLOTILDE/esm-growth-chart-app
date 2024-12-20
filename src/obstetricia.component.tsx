import React from 'react';
import { ConfigurableLink } from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';

export default function DispensingLink() {
  const { t } = useTranslation();
  return <ConfigurableLink to={'https://www.instagram.com/'}>{t('dispensing', 'TEXTO VACIO')}</ConfigurableLink>;
}
