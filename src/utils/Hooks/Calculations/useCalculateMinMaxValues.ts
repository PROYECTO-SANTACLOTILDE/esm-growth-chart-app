export function useCalculateMinMaxValues(datasetValues: Array<Record<string, unknown>>) {
  // Verificar si no hay datos o el array está vacío
  if (!datasetValues || datasetValues.length === 0) {
    return { min: 0, max: 0 };
  }

  // Aplanar y filtrar valores numéricos válidos
  const flatValues: number[] = datasetValues.flatMap((entry) =>
    Object.values(entry).filter((value): value is number => {
      return typeof value === 'number' && Number.isFinite(value);
    })
  );

  // Verificar si no quedaron valores válidos después del filtrado
  if (flatValues.length === 0) {
    return { min: 0, max: 0 };
  }

  // Calcular min y max de manera segura para grandes datasets
  const min = flatValues.reduce((acc, val) => Math.min(acc, val), Infinity);
  const max = flatValues.reduce((acc, val) => Math.max(acc, val), -Infinity);

  return { min, max };
}
