import React from 'react';
import { useTranslation } from 'react-i18next';
import { Layer, ClickableTile } from '@carbon/react';
import { ArrowRight } from '@carbon/react/icons';

const PruebaCardLink: React.FC = () => {
  const { t } = useTranslation();
  const header = t('manageBillableServices', 'Esto es una prueba');

  return (
    <Layer>
      <ClickableTile href={`http://localhost:8080/openmrs/spa/test`} target="_blank" rel="noopener noreferrer">
        <div>
          <div className="heading">{header}</div>
          <div className="content">{t('billableServices', 'Lorem IPsum')}</div>
        </div>
        <div className="iconWrapper">
          <ArrowRight size={16} />
        </div>
      </ClickableTile>
    </Layer>
  );
};

export default PruebaCardLink;
