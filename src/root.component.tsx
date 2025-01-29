import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './root.scss';
import { Charts } from './charts/slot/charts.component';
import { useVitalsAndBiometrics } from './utils/DataFetching/Hooks/useVitals';
import { usePatientAttributes } from './utils/DataFetching/Hooks';

const Root: React.FC = () => {
  const { t } = useTranslation();
  const [patientUuid, setPatientUuid] = useState('');
  const [submittedUuid, setSubmittedUuid] = useState('');
  const vitals = useVitalsAndBiometrics(submittedUuid);
  const patientDetails = usePatientAttributes(submittedUuid);

  return (
    <div className={styles.container}>
      <h3 className={styles.welcome}>{t('welcomeText', 'Welcome to the O3 Template app')}</h3>
      <p className={styles.explainer}>{t('explainer', 'Enter a Patient UUID to fetch data')}.</p>
      <input
        type="text"
        value={patientUuid}
        onChange={(e) => setPatientUuid(e.target.value)}
        placeholder="Enter Patient UUID"
      />
      <button onClick={() => setSubmittedUuid(patientUuid)}>Fetch Data</button>
      <Charts />
      <div>
        <h4>Patient Details</h4>
        {patientDetails.isLoading ? <p>Loading...</p> : <pre>{JSON.stringify(patientDetails.attributes, null, 2)}</pre>}
      </div>
      <div>
        <h4>Vitals and Biometrics</h4>
        {vitals.isLoading ? <p>Loading...</p> : <pre>{JSON.stringify(vitals.data, null, 2)}</pre>}
      </div>
    </div>
  );
};

export default Root;
