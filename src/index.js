module.exports = function solveSudoku(matrix) {
  const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];


  let copyMatrix;
  let matrixSolved = false;
  let step = 1;

  function checkMatrix() {
    let checkingArr = null;
    for (let i = 0; i < copyMatrix.length; i++) {
      for (let j = 0; j < copyMatrix.length; j++) {
        if (copyMatrix[i][j] === 0) {
          checkingArr += 1;
        }
      }
    }
    if (!checkingArr) {
      matrixSolved = true
    }
  }

  function getSquare(row, col) {
    let square = [];
    function fillSquare(r, c) {
      for (let i = r; i < r + 3; i++) {
        for (let j = c; j < c + 3; j++) {
          square.push(matrix[i][j]);
        }
      }
    }
    switch (true) {
      case row <= 2 && col <= 2:
        fillSquare(0, 0); break;
      case (3 <= row && row <= 5) && (col <= 2):
        fillSquare(3, 0); break;
      case (6 <= row && row <= 8) && (col <= 2):
        fillSquare(6, 0); break;

      case (row <= 2) && (3 <= col && col <= 5):
        fillSquare(0, 3); break;
      case (3 <= row && row <= 5) && (3 <= col && col <= 5):
        fillSquare(3, 3); break;
      case (6 <= row && row <= 8) && (3 <= col && col <= 5):
        fillSquare(6, 3); break;

      case (row <= 2) && (6 <= col && col <= 8):
        fillSquare(0, 6); break;
      case (3 <= row && row <= 5) && (6 <= col && col <= 8):
        fillSquare(3, 6); break;
      case (6 <= row && row <= 8) && (6 <= col && col <= 8):
        fillSquare(6, 6); break;
      default:
        break;
    }
    return square;
  }

  function getSolution(nextStep) {

    for (let i = 0; i < copyMatrix.length; i++) {
      let isChange = false;

      for (let j = 0; j < copyMatrix.length; j++) {

        if (isChange) {
          i = -1;
          j = -1;
          break;
        }

        if (copyMatrix[i][j] === 0) {
          let horizontal = copyMatrix[i];
          let vertical = [];
          let currentSquare = getSquare(i, j);

          copyMatrix.forEach(subArr => vertical.push(subArr[j]));

          for (let k = nextStep; k <= DIGITS.length; k++) {
            if ((!horizontal.includes(k) && !vertical.includes(k) && !currentSquare.includes(k))) {
              copyMatrix[i][j] = k;
              isChange = true;
              break;
            }
          }
        }
      }
    }
    checkMatrix();
  }

  while (!matrixSolved && step <= 9) {
    copyMatrix = matrix.map(el => [...el]);
    getSolution(step);
    step++;
  }

  return copyMatrix;
}
