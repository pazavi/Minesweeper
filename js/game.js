
var MINE = '💣';
var gBoard;

var gLevel = {
    SIZE: 4,
    MINES: 2
};

gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};


function initGame() {
    gBoard = buildBoard();
    console.log('Sweeep Mines');
    // setMinesNegsCount();
    console.log('gBoard: ', gBoard);
    renderBoard(gBoard, '.board-container');


}

function buildBoard() {
    var SIZE = 4
    var board = [];
    for (var i = 0; i < SIZE; i++) {
        board.push([]);
        for (var j = 0; j < SIZE; j++) {
            var cell = { minesAroundCount: 4, isShown: true, isMine: false, isMarked: false }
            board[i][j] = cell;
        }
    }
    board[0][0].isMine = true;
    board[3][3].isMine = true;

    console.log('board: ', board);
    return board;
}


function renderBoard(gBoard, selector) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < gBoard.length; i++) {
      strHTML += '<tr>';
      for (var j = 0; j < gBoard[0].length; j++) {
        var cell = gBoard[i][j];
        var content ='';
        if (cell.isShown){
            if (cell.isMine){
                content=MINE;
            }else{
                content= cell.minesAroundCount
            }

        }
        var className = 'cell cell' + i + '-' + j;
        strHTML += '<td class="' + className + '"> ' + content + ' </td>'
      }
      strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
  }


function setMinesNegsCount() {
    var minesNegsCount = 0;

    for (var i = 0; i < gBoard.length; i++) {

        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j] === MINE) continue;
            else if (gBoard[i - 1][j - 1] === MINE) minesNegsCount++;
            else if (gBoard[i - 1][j] === MINE) minesNegsCount++;
            else if (gBoard[i - 1][j + 1] === MINE) minesNegsCount++;
            else if (gBoard[i][j - 1] === MINE) minesNegsCount++;
            else if (gBoard[i][j + 1] === MINE) minesNegsCount++;
            else if (gBoard[i - 1][j - 1] === MINE) minesNegsCount++;
            else if (gBoard[i - 1][j] === MINE) minesNegsCount++;
            else if (gBoard[i - 1][j + 1] === MINE) minesNegsCount++;
        }
    } console.log('mines count for negs: ', minesNegsCount);
}


// renderBoard(board)
// cellClicked(elCell, i, j)
// cellMarked(elCell)    
// checkGameOver()
// expandShown(board, elCell, i, j)
