import React from 'react';
import GrowthChartOverview from './charts/extensions/GrowthChart/growthchart-overview';
import { useConfig } from '@openmrs/esm-framework';

const Root: React.FC = () => {
  const config = useConfig();

  const patientUuid = '5f088298-da75-420a-8413-84dddefc8f66';

  return (
    <div className="bg-white w-screen flex m-0 p-0">
      <GrowthChartOverview patientUuid={patientUuid} config={config} />
    </div>
  );
};

export default Root;
