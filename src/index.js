module.exports = function solveSudoku(matrix) {
  const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  function checkMatrix() {
    let checkSolve = [];
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix.length; j++) {
        if (matrix[i][j] === 0) {
          checkSolve.push('Matrix isn`t solve');
        }
      }
    }
    if (!checkSolve) return matrix;
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

      case (2 <= row) && (3 <= col && col <= 5):
        fillSquare(0, 3); break;
      case (3 <= row && row <= 5) && (3 <= col && col <= 5):
        fillSquare(3, 3); break;
      case (6 <= row && row <= 8) && (3 <= col && col <= 5):
        fillSquare(6, 3); break;

      case (2 <= row) && (6 <= col && col <= 8):
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

  for (let i = 0; i < matrix.length; i++) {
    checkMatrix();
    for (let j = 0; j < matrix.length; j++) {
      if (matrix[i][j] === 0) {
        let horizontal = matrix[i];
        let vertical = [];

        matrix.forEach(subArr => vertical.push(subArr[j]));

        for (let k = 1; k <= DIGITS.length; k++) {
          if (!(horizontal.includes(k) && horizontal.includes(k))) {
            matrix[i][j] = k;
            break;
          }
        }
      }
    }
    // i = -1;
  }

  return matrix;
}
