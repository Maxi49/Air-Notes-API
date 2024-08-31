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

function euclideanDistance(vector1, vector2) {
  let sum = 0;
  for (let i = 0; i < vector1.length; i++) {
    sum += Math.pow(vector1[i] - vector2[i], 2);
  }
  return Math.sqrt(sum);
}

export function findClosestVectors(targetVector, vectorList) {
  const distances = vectorList.map((vector) => ({
    vector,
    distance: euclideanDistance(targetVector, vector),
  }));

  // Sort by distance
  distances.sort((a, b) => a.distance - b.distance);

  // Return the 20 closest vectors
  return distances.slice(0, 20).map((item) => item.vector);
}
