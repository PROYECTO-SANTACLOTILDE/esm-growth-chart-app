import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './root.scss';
import { usePatientBirthdateAndGender } from './utils/DataFetching/Hooks';
import { useChartConfig } from './utils/DataFetching/Hooks';
import { useVitalsAndBiometrics } from './utils/DataFetching/Hooks';
import { age } from '@openmrs/esm-framework';

const Root: React.FC = () => {
  const { t } = useTranslation();
  const [patientUuid, setPatientUuid] = useState('');
  const [submittedUuid, setSubmittedUuid] = useState('');
  const [vitalsUuid, setVitalsUuid] = useState('');
  const [submittedVitalsUuid, setSubmittedVitalsUuid] = useState('');

  const { isLoading, gender, birthdate, birthdateEstimated, error } = usePatientBirthdateAndGender(submittedUuid);
  const { chartConfig, isLoading: isChartLoading, isError: isChartError } = useChartConfig();
  const {
    data: vitalsData,
    isLoading: vitalsLoading,
    error: vitalsError,
  } = useVitalsAndBiometrics(submittedVitalsUuid);

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
      <button onClick={() => setSubmittedUuid(patientUuid)}>Fetch Patient Data</button>

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
                formattedAge: birthdate ? age(birthdate) : 'N/A',
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

      <div>
        <h4>Vitals and Biometrics</h4>
        <input
          type="text"
          value={vitalsUuid}
          onChange={(e) => setVitalsUuid(e.target.value)}
          placeholder="Enter Patient UUID for Vitals"
        />
        <button onClick={() => setSubmittedVitalsUuid(vitalsUuid)}>Fetch Vitals Data</button>

        {vitalsLoading ? (
          <p>Loading Vitals...</p>
        ) : vitalsError ? (
          <p>Error fetching vitals</p>
        ) : vitalsData && vitalsData.length > 0 ? (
          <pre>{JSON.stringify(vitalsData, null, 2)}</pre>
        ) : (
          <p>No vitals data available.</p> // 🚀 Handle case when no vitals exist
        )}
      </div>
    </div>
  );
};

export default Root;
