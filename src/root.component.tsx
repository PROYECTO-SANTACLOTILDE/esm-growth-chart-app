import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './root.scss';
import { usePatientAgeAndGender } from './utils/DataFetching/Hooks';
import { useChartConfig } from './utils/DataFetching/Hooks';

const Root: React.FC = () => {
  const { t } = useTranslation();
  const [patientUuid, setPatientUuid] = useState('');
  const [submittedUuid, setSubmittedUuid] = useState('');
  const { isLoading, gender, birthdate, birthdateEstimated, error } = usePatientAgeAndGender(submittedUuid);
  const { chartConfig, isLoading: isChartLoading, isError: isChartError } = useChartConfig();

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
      <div>
        <h4>Patient Details</h4>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error fetching patient details</p>
        ) : (
          <pre>
            {JSON.stringify(
              {
                gender,
                birthdate,
                birthdateEstimated,
              },
              null,
              2,
            )}
          </pre>
        )}
      </div>
      <div>
        <h4>Chart Configuration</h4>
        {isChartLoading ? (
          <p>Loading chart configuration...</p>
        ) : isChartError ? (
          <p>Error loading chart configuration</p>
        ) : (
          <pre>{JSON.stringify(chartConfig, null, 2)}</pre>
        )}
      </div>
    </div>
  );
};

export default Root;
