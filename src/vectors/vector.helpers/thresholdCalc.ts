export function thresholdCalc(
  dimensions: number[],
  minThresholdValue: number,
): number[][] {
  const thresholds: Array<number[]> = [];

  for (let index = 0; index < dimensions.length; index++) {
    const stringedDimension = dimensions[index].toString().split('.')[1];
    const ceros = stringedDimension.match(/^0+/);

    const cerosQuantity = ceros ? ceros[0].length : 0; // Si hay ceros, cuenta su longitud
    console.log(cerosQuantity);

    // Accedo al primer valor distinto de cero
    const firstNonCeroValue = parseInt(stringedDimension[cerosQuantity]);

    console.log(firstNonCeroValue);

    const threshold = [
      (firstNonCeroValue + minThresholdValue) * 10 ** -(cerosQuantity + 1),
      (firstNonCeroValue - minThresholdValue) * 10 ** -(cerosQuantity + 1),
    ];
    console.log(threshold);
    console.log(dimensions);

    thresholds.push(threshold);
  }

  return thresholds;
}

export function isInThreshold(threshold: number[], value: number): boolean {
  const [maxThreshold, minThreshold] = threshold;
  console.log(threshold);
  console.log(value);
  if (value <= maxThreshold && value >= minThreshold) {
    console.log(true);
    return true;
  }

  console.log(false);
  return false;
}

export function calcEuclidianDistance(
  userVector: number[],
  noteVector: number[],
): number {
  let sumaCuadrados = 0;
  for (let i = 0, j = 0; i < userVector.length; i++, j++) {
    sumaCuadrados += Math.pow(userVector[i] - noteVector[i][j], 2);
  }

  return Math.sqrt(sumaCuadrados);
}
