/**
 * Return an integer within range [0, max)
 * @param {number} max 
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

/**
 * Deep copy a two dimensional array 
 * @param {[][]]} matrix 
 */
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