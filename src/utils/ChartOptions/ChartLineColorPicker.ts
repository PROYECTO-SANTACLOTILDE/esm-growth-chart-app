export const ChartLineColorPicker = (key: string, percentiles: boolean): string => {
  if (percentiles) {
    const value = parseFloat(key.substring(1)) / 1000;
    if (value < 0.015 || value > 0.085) return 'red';
    if (value >= 0.015 && value < 0.04) return 'orange';
    if (value <= 0.085 && value > 0.06) return 'orange';
    if (value >= 0.04 && value <= 0.06) return 'green';
  }
  if (!percentiles) {
    switch (key) {
      case 'SD3neg':
        return 'black';
      case 'SD2neg':
        return 'red';
      case 'SD1neg':
        return 'orange';
      case 'SD0':
        return 'green';
      case 'SD1':
        return 'orange';
      case 'SD2':
        return 'red';
      case 'SD3':
        return 'black';
      default:
        return 'gray';
    }
  }
  return 'gray';
};
