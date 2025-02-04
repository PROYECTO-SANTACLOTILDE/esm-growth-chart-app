import React from 'react';
import { useTranslation } from 'react-i18next';
import GrowthChartOverview from './charts/extensions/GrowthChart/growthchart-overview';
import { useConfig, type Patient } from '@openmrs/esm-framework';

const Root: React.FC = () => {
  const { t } = useTranslation();
  const config = useConfig();

  const patientUuid = '8673ee4f-e2ab-4077-ba55-4980f408773e';

  return (
    <div className="bg-white w-screen flex m-0 p-0">
      <GrowthChartOverview
        patientUuid={patientUuid} // Pasamos el UUID hardcodeado
        config={config}
      />
    </div>
  );
};

export default Root;
