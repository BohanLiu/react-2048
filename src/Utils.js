function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function copy2DArray(matrix) {
  let newMatrix = matrix.map((row) => {
    return [].concat(row);
  });

  return newMatrix;
}

export {
  getRandomInt,
  copy2DArray
}