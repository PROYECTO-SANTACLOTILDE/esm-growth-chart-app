import { type Animation, type Chart } from 'chart.js';

interface DataSet {
  data: number[];
  borderWidth: number;
  borderColor: string;
  label: string;
}

export const AnnotateLineEnd = (
  animation: Animation & { chart?: Chart },
  isPercentiles: boolean,
  keysDataSet: string[],
) => {
  const { chart } = animation;
  if (!chart) return;

  const { ctx } = chart;

  const labelsToInclude = keysDataSet;

  const lines = chart.data.datasets.filter((dataset: DataSet) => labelsToInclude.includes(dataset.label));

  const extractNumberFromLabel = (label: string): number => parseFloat(label.replace(/[^\d.-]/g, ''));

  const adjustLabel = (labelText: number, originalLabel: string): string => {
    if (isPercentiles) {
      if (originalLabel === 'P01') return '0.1%';
      if (originalLabel === 'P999') return '99.9%';
      return `${labelText}%`;
    }
    if (!isPercentiles) {
      const isNegative = originalLabel.includes('neg');
      return isNegative ? `-${labelText}` : ` ${labelText}`;
    }
    return originalLabel;
  };

  const drawText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color: string) => {
    ctx.fillStyle = color;
    ctx.font = '14px Arial';
    ctx.fillText(text, x + 3, y + 4);
  };

  lines.forEach((dataset: DataSet, index: number) => {
    const meta = chart.getDatasetMeta(index);
    const [lastElement] = meta.data.slice(-1);
    const { x, y } = lastElement.getProps(['x', 'y']);

    const labelText = extractNumberFromLabel(dataset.label);
    const adjustedLabelText = adjustLabel(labelText, dataset.label);

    drawText(ctx, adjustedLabelText.toString(), x, y, dataset.borderColor);
  });
};
