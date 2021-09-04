module.exports = function solveSudoku(matrix) {
  let matrixSolved = false;
  let stepsToEndChecking = 0;

  function checkMatrix() {                   // проверяем всё заполнено или нет
    let checkingArr = null;
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix.length; j++) {
        if (matrix[i][j] === 0) {
          checkingArr += 1;
        }
      }
    }
    if (!checkingArr) {
      matrixSolved = true
    }
  }

  function getSquare(row, col) {            // получаем подмассивы чисел
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

    let firstPart = square.slice(0, 3);
    let secondPart = square.slice(6, 9);
    let reverseMid = square.slice(3, 6).reverse();
    return [...firstPart, ...reverseMid, ...secondPart];
  }

  function getSolution() {                  // основное решение
    let isChange = false;
    for (let i = 0; i < matrix.length; i++) {
      if (isChange) {                       // проверяем есл было найдено число, начинаем сначала  
        i = 0;
        isChange = false;
      }

      for (let j = 0; j < matrix.length; j++) {
        if (matrix[i][j] === 0) {
          const getVertical = (col, line) => matrix.forEach(subArr => line.push(subArr[col]));
          let horizontal = matrix[i];
          let vertical = [];
          getVertical(j, vertical);
          let currentSquare = getSquare(i, j);
          let currentSquareLength = currentSquare.filter(e => e !== 0).length;
          let currentVerticalLength = vertical.filter(e => e !== 0).length;
          let currentHorizontalLength = horizontal.filter(e => e !== 0).length;

          function findCurrentIndex() {               // находим индекс текущего элемента в подмассиве
            matrix[i][j] = 555;
            currentSquare = getSquare(i, j);
            let idxOfEl = currentSquare.findIndex(el => el === 555);
            matrix[i][j] = 0;
            currentSquare = getSquare(i, j);
            return idxOfEl;
          }

          for (let k = 1; k <= 9; k++) {      // проверки в зависимости от положения числа в подмассиве
            // ===================================== первая проверка ===================================//
            let tempHorLines = [];
            let tempVerLines = [];
            if ((!horizontal.includes(k) && !vertical.includes(k) && !currentSquare.includes(k))
              && (currentSquareLength === 8 || currentVerticalLength === 8 || currentHorizontalLength === 8)) {
              matrix[i][j] = k;
              isChange = true;
              break;
            }

            if (stepsToEndChecking === 5) {
              if ((!horizontal.includes(k) && !vertical.includes(k) && !currentSquare.includes(k))
                && (currentSquareLength >= 5 || currentVerticalLength >= 5 || currentHorizontalLength >= 5)) {
                matrix[i][j] = k;
                isChange = true;
                stepsToEndChecking = 0;
                break;
              }
            }

            let idxOfEl = findCurrentIndex();
            function checkVerticalLines() {
              tempHorLines = [];
              if (currentVerticalLength >= 6) {
                matrix[i][j] = 555;                   // временно меняем чтобы не путать нули в линии
                vertical = [];
                getVertical(j, vertical);             // переопределяем текущую вертикальную линию
                for (let w = 0; w < 9; w++) {
                  if (vertical[w] === 0 && vertical[w] !== matrix[i][j]) {
                    tempHorLines.push(matrix[w]);
                  }
                }
                matrix[i][j] = 0;                 //возвращаем как было до
                vertical = [];
                getVertical(j, vertical);
              }
            }
            function checkHorizontalLines() {
              tempVerLines = [];
              if (currentHorizontalLength >= 6) {
                matrix[i][j] = 555;                   // временно меняем чтобы не путать нули в линии
                horizontal = matrix[i];           // переопределяем текущую вертикальную линию
                for (let w = 0; w < 9; w++) {
                  if (horizontal[w] === 0 && horizontal[w] !== matrix[i][j]) {
                    let tempLine = [];
                    getVertical(w, tempLine);
                    tempVerLines.push(tempLine);
                  }
                }
                matrix[i][j] = 0;                 //возвращаем как было до
                horizontal = matrix[i];
              }
            }

            if (idxOfEl === 0) {
              let v2 = [];
              let v3 = [];
              let h2 = matrix[i + 1];
              let h3 = matrix[i + 2];
              let h4 = matrix[i - 1];
              getVertical(j + 1, v2);
              getVertical(j + 2, v3);
              // ===================================== вторая проверка ===================================//

              if ((v2.includes(k) || currentSquare[1] !== 0)
                && (v3.includes(k) || currentSquare[2] !== 0)
                && (h2.includes(k) || currentSquare[5] !== 0)
                && (h3.includes(k) || currentSquare[6] !== 0)
                && !currentSquare.includes(k)
                && !vertical.includes(k)
                && !horizontal.includes(k)
                && h4 !== undefined) {
                matrix[i][j] = k;
                isChange = true;
                break;
              }

              // ===================================== третья проверка на вертикали ===================================//
              checkVerticalLines();
              if (tempHorLines.every(el => el.includes(k)) && tempHorLines.length !== 0 && !vertical.includes(k)) {
                matrix[i][j] = k;
                isChange = true;
                break;
              }

              checkHorizontalLines();
              if (tempVerLines.every(el => el.includes(k)) && tempVerLines.length !== 0 && !horizontal.includes(k)) {
                matrix[i][j] = k;
                isChange = true;
                break;
              }
            }


            if (idxOfEl === 1) {
              let v2 = [];
              let v3 = [];
              let h2 = matrix[i + 1];
              let h3 = matrix[i + 2];
              getVertical(j - 1, v2);
              getVertical(j + 1, v3);

              if ((v2.includes(k) || currentSquare[0] !== 0)
                && (v3.includes(k) || currentSquare[2] !== 0)
                && (h2.includes(k) || currentSquare[4] !== 0)
                && (h3.includes(k) || currentSquare[7] !== 0)
                && !currentSquare.includes(k)
                && !vertical.includes(k)
                && !horizontal.includes(k)) {
                matrix[i][j] = k;
                isChange = true;
                break;
              }

              checkVerticalLines();
              if (tempHorLines.every(el => el.includes(k)) && tempHorLines.length !== 0 && !vertical.includes(k)) {
                matrix[i][j] = k;
                isChange = true;
                break;
              }

              checkHorizontalLines();
              if (tempVerLines.every(el => el.includes(k)) && tempVerLines.length !== 0 && !horizontal.includes(k)) {
                matrix[i][j] = k;
                isChange = true;
                break;
              }

            }
            if (idxOfEl === 2) {
              let v2 = [];
              let v3 = [];
              let h2 = matrix[i + 1];
              let h3 = matrix[i + 2];
              getVertical(j - 1, v2);
              getVertical(j - 2, v3);

              if ((v2.includes(k) || currentSquare[1] !== 0)
                && (v3.includes(k) || currentSquare[0] !== 0)
                && (h2.includes(k) || currentSquare[3] !== 0)
                && (h3.includes(k) || currentSquare[8] !== 0)
                && !currentSquare.includes(k)
                && !vertical.includes(k)
                && !horizontal.includes(k)) {
                matrix[i][j] = k;
                isChange = true;
                break;
              }

              checkVerticalLines();
              if (tempHorLines.every(el => el.includes(k)) && tempHorLines.length !== 0 && !vertical.includes(k)) {
                matrix[i][j] = k;
                isChange = true;
                break;
              }

              checkHorizontalLines();
              if (tempVerLines.every(el => el.includes(k)) && tempVerLines.length !== 0 && !horizontal.includes(k)) {
                matrix[i][j] = k;
                isChange = true;
                break;
              }
            }


            if (idxOfEl === 3) {
              let v2 = [];
              let v3 = [];
              let h2 = matrix[i - 1];
              let h3 = matrix[i + 1];
              getVertical(j - 1, v2);
              getVertical(j - 2, v3);

              if ((v2.includes(k) || currentSquare[4] !== 0)
                && (v3.includes(k) || currentSquare[5] !== 0)
                && (h2.includes(k) || currentSquare[2] !== 0)
                && (h3.includes(k) || currentSquare[8] !== 0)
                && !currentSquare.includes(k)
                && !vertical.includes(k)
                && !horizontal.includes(k)) {
                matrix[i][j] = k;
                isChange = true;
                break;
              }

              checkVerticalLines();
              if (tempHorLines.every(el => el.includes(k)) && tempHorLines.length !== 0 && !vertical.includes(k)) {
                matrix[i][j] = k;
                isChange = true;
                break;
              }

              checkHorizontalLines();
              if (tempVerLines.every(el => el.includes(k)) && tempVerLines.length !== 0 && !horizontal.includes(k)) {
                matrix[i][j] = k;
                isChange = true;
                break;
              }
            }
            if (idxOfEl === 4) {
              let v2 = [];
              let v3 = [];
              let h2 = matrix[i - 1];
              let h3 = matrix[i + 1];
              getVertical(j - 1, v2);
              getVertical(j + 1, v3);

              if ((v2.includes(k) || currentSquare[5] !== 0)
                && (v3.includes(k) || currentSquare[3] !== 0)
                && (h2.includes(k) || currentSquare[1] !== 0)
                && (h3.includes(k) || currentSquare[7] !== 0)
                && !currentSquare.includes(k)
                && !vertical.includes(k)
                && !horizontal.includes(k)) {
                matrix[i][j] = k;
                isChange = true;
                break;
              }

              checkVerticalLines();
              if (tempHorLines.every(el => el.includes(k)) && tempHorLines.length !== 0 && !vertical.includes(k)) {
                matrix[i][j] = k;
                isChange = true;
                break;
              }

              checkHorizontalLines();
              if (tempVerLines.every(el => el.includes(k)) && tempVerLines.length !== 0 && !horizontal.includes(k)) {
                matrix[i][j] = k;
                isChange = true;
                break;
              }
            }


            if (idxOfEl === 5) {
              let v2 = [];
              let v3 = [];
              let h2 = matrix[i - 1];
              let h3 = matrix[i + 1];
              getVertical(j + 1, v2);
              getVertical(j + 2, v3);

              if ((v2.includes(k) || currentSquare[4] !== 0)
                && (v3.includes(k) || currentSquare[3] !== 0)
                && (h2.includes(k) || currentSquare[0] !== 0)
                && (h3.includes(k) || currentSquare[6] !== 0)
                && !currentSquare.includes(k)
                && !vertical.includes(k)
                && !horizontal.includes(k)) {
                matrix[i][j] = k;
                isChange = true;
                break;
              }

              checkVerticalLines();
              if (tempHorLines.every(el => el.includes(k)) && tempHorLines.length !== 0 && !vertical.includes(k)) {
                matrix[i][j] = k;
                isChange = true;
                break;
              }

              checkHorizontalLines();
              if (tempVerLines.every(el => el.includes(k)) && tempVerLines.length !== 0 && !horizontal.includes(k)) {
                matrix[i][j] = k;
                isChange = true;
                break;
              }
            }
            if (idxOfEl === 6) {
              let v2 = [];
              let v3 = [];
              let h2 = matrix[i - 1];
              let h3 = matrix[i - 2];
              getVertical(j + 1, v2);
              getVertical(j + 2, v3);

              if ((v2.includes(k) || currentSquare[7] !== 0)
                && (v3.includes(k) || currentSquare[8] !== 0)
                && (h2.includes(k) || currentSquare[5] !== 0)
                && (h3.includes(k) || currentSquare[0] !== 0)
                && !currentSquare.includes(k)
                && !vertical.includes(k)
                && !horizontal.includes(k)) {
                matrix[i][j] = k;
                isChange = true;
                break;
              }

              checkVerticalLines();
              if (tempHorLines.every(el => el.includes(k)) && tempHorLines.length !== 0 && !vertical.includes(k)) {
                matrix[i][j] = k;
                isChange = true;
                break;
              }

              checkHorizontalLines();
              if (tempVerLines.every(el => el.includes(k)) && tempVerLines.length !== 0 && !horizontal.includes(k)) {
                matrix[i][j] = k;
                isChange = true;
                break;
              }
            }
            if (idxOfEl === 7) {
              let v2 = [];
              let v3 = [];
              let h2 = matrix[i - 1];
              let h3 = matrix[i - 2];
              getVertical(j - 1, v2);
              getVertical(j + 1, v3);

              if ((v2.includes(k) || currentSquare[6] !== 0)
                && (v3.includes(k) || currentSquare[8] !== 0)
                && (h2.includes(k) || currentSquare[4] !== 0)
                && (h3.includes(k) || currentSquare[1] !== 0)
                && !currentSquare.includes(k)
                && !vertical.includes(k)
                && !horizontal.includes(k)) {
                matrix[i][j] = k;
                isChange = true;
                break;
              }

              checkVerticalLines();
              if (tempHorLines.every(el => el.includes(k)) && tempHorLines.length !== 0 && !vertical.includes(k)) {
                matrix[i][j] = k;
                isChange = true;
                break;
              }

              checkHorizontalLines();
              if (tempVerLines.every(el => el.includes(k)) && tempVerLines.length !== 0 && !horizontal.includes(k)) {
                matrix[i][j] = k;
                isChange = true;
                break;
              }
            }
            if (idxOfEl === 8) {
              let v2 = [];
              let v3 = [];
              let h2 = matrix[i - 1];
              let h3 = matrix[i - 2];
              getVertical(j - 1, v2);
              getVertical(j - 2, v3);

              if ((v2.includes(k) || currentSquare[7] !== 0)
                && (v3.includes(k) || currentSquare[6] !== 0)
                && (h2.includes(k) || currentSquare[3] !== 0)
                && (h3.includes(k) || currentSquare[2] !== 0)
                && !currentSquare.includes(k)
                && !vertical.includes(k)
                && !horizontal.includes(k)) {
                matrix[i][j] = k;
                isChange = true;
                break;
              }

              checkVerticalLines();
              if (tempHorLines.every(el => el.includes(k)) && tempHorLines.length !== 0 && !vertical.includes(k)) {
                matrix[i][j] = k;
                isChange = true;
                break;
              }

              checkHorizontalLines();
              if (tempVerLines.every(el => el.includes(k)) && tempVerLines.length !== 0 && !horizontal.includes(k)) {
                matrix[i][j] = k;
                isChange = true;
                break;
              }
            }
          }
        }
      }
      checkMatrix();
      if (i === 8 && !matrixSolved && stepsToEndChecking < 15) {
        i = 0;
        stepsToEndChecking++;
      }
    }
  }
  if (!matrixSolved && stepsToEndChecking < 15) {
    getSolution();
  }
  console.log(stepsToEndChecking)
  return matrix;
}

