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

export function euclideanDistance(a: number[], b: number[]): number {
  let sum = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const d = a[i] - b[i];
    sum += d * d;
  }
  return Math.sqrt(sum);
}

export function findClosestVectors(
  targetVector: number[],
  vectorList: Array<{ vector: number[] }>,
  limit = 20,
) {
  const distances = vectorList.map((item) => ({
    item,
    distance: euclideanDistance(targetVector, item.vector),
  }));

  distances.sort((a, b) => a.distance - b.distance);

  return distances.slice(0, limit).map((d) => d.item);
}
