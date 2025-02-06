import { getAsyncLifecycle, defineConfigSchema } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';

const moduleName = '@pucp-gidis-hiisc/esm-growth-chart-app';

const options = {
  featureName: 'growth-chart-app',
  moduleName,
};

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

export const growthChart = getAsyncLifecycle(
  () => import('./charts/extensions/GrowthChart/growthchart-overview'),
  options,
);
