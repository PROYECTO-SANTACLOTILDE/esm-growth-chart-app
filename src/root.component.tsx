import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './root.scss';
import { usePatientBirthdateAndGender } from './utils/DataFetching/Hooks';
import { useChartConfig } from './utils/DataFetching/Hooks';
import { useVitalsAndBiometrics } from './utils/DataFetching/Hooks';
import { age, type Patient } from '@openmrs/esm-framework';
import { GrowthChart } from './charts/extensions/GrowthChart/GrowthChart';
import { type MeasurementData } from './types/chartDataTypes';

const Root: React.FC = () => {
  const { t } = useTranslation();
  const [patientUuid, setPatientUuid] = useState('');
  const [submittedUuid, setSubmittedUuid] = useState('');
  const [vitalsUuid, setSubmittedVitalsUuid] = useState('');
  const [defaultIndicatorError, setDefaultIndicatorError] = useState(false);

  // Obtener datos del paciente
  const { isLoading, gender, birthdate, birthdateEstimated, error } = usePatientBirthdateAndGender(submittedUuid);

  // Obtener configuración del gráfico
  const { chartConfig, isLoading: isChartLoading, isError: isChartError } = useChartConfig();

  // Obtener signos vitales
  const { data: vitalsData, isLoading: vitalsLoading, error: vitalsError } = useVitalsAndBiometrics(patientUuid);

  // Mapear paciente según estructura de OpenMRS
  const mappedPatient: Patient = {
    uuid: patientUuid,
    person: {
      uuid: patientUuid,
      gender: gender,
      birthdate: birthdate,
      birthdateEstimated: birthdateEstimated,
      names: [{ uuid: patientUuid, givenName: 'Nombre', familyName: 'Apellido' }],
      attributes: [],
    },
  };

  // Transformar observaciones al formato requerido
  const transformedObservations: MeasurementData[] =
    vitalsData?.map((obs) => ({
      eventDate: obs.encounterDateTime,
      dataValues: [
        {
          value: obs.value.toString(),
          concept: obs.concept.uuid,
        },
      ],
    })) || [];

  return (
    <div className={styles.container}>
      {/* ... resto del código igual ... */}

      <div className="bg-white w-screen flex m-0 p-0">
        <GrowthChart
          patient={mappedPatient}
          observations={transformedObservations}
          isPercentiles={chartConfig?.settings?.usePercentiles || false}
          chartData={chartConfig?.metadata || []}
          setDefaultIndicatorError={setDefaultIndicatorError}
        />
      </div>
    </div>
  );
};

export default Root;
