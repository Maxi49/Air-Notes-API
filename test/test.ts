(() => {
  const a = 0.04;
  const stringedDimension = a.toString().split('.')[1];
  const ceros = stringedDimension.match(/0/g).length;

  console.log(ceros);

  const firstValue = parseInt(stringedDimension[ceros]);

  const threshold = [
    (firstValue + 1) * 10 ** -(ceros + 1),
    (firstValue - 1) * 10 ** -(ceros + 1),
  ];
  console.log(threshold);

  const [first, second] = threshold;

  console.log(first, second);
})();

/**
       const similarVectors = [];

      // Extraigo el vector del usuario
      const { vector: userVector } = vector;
      console.log(userVector);

      const vectorList = await this.vectorModel
        .find({ vectorType: VectorType.note })
        .limit(10);

      console.log(vectorList.length);
      // recorro la lista de vectores
      for (
        let vectorListIndex = 0;
        vectorListIndex < vectorList.length;
        vectorListIndex++
      ) {
        // para cada vector extraigo el vector numerico
        const noteVector = vectorList[vectorListIndex].vector;
        console.log(noteVector);
        let count = 0;

        // mientras el index sea menor al vector del usuario
        for (
          let userVectorIndex = 0;
          userVectorIndex < userVector.length;
          userVectorIndex++
        ) {
          console.log(userVector, noteVector);

          //vamos a calcular el umbral de cada dimension
          const userVectorThreshold = thresholdCalc(
            userVector[userVectorIndex],
          );
          console.log(userVectorThreshold, noteVector[userVectorIndex]);

          //vemos si el valor de la dimension del vector de la nota se encuentra dentro del umbral
          const isVectorDimensionInThreshold = isInThreshold(
            userVectorThreshold,
            noteVector[userVectorIndex],
          );

          console.log(count);
          console.log(isVectorDimensionInThreshold);
          if (!isVectorDimensionInThreshold) {
            console.log(noteVector);
            count = 0;
            break;
          }
          count++;
        }
        count === userVector.length &&
          similarVectors.push(vectorList[vectorListIndex]);
      }

      return similarVectors;
 */
