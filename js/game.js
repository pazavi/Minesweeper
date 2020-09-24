
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
    getCellPos();
    console.log('gBoard: ', gBoard);
    renderBoard(gBoard, '.board-container');


}

function buildBoard() {
    var SIZE = 4
    var board = [];
    for (var i = 0; i < SIZE; i++) {
        board.push([]);
        for (var j = 0; j < SIZE; j++) {
            var cell = { minesAroundCount: 4, isShown: false, isMine: false, isMarked: false }
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
            var content = '';
            if (cell.isShown) {
                if (cell.isMine) {
                    content = MINE;
                } else {
                    content = cell.minesAroundCount
                }

            }
            var className = 'cell cell' + i + '-' + j;
            var tdId = '' + i + ',' + j;

            strHTML += '<td id="' + tdId + '" onclick="cellClicked(this, ' + i + ', ' + j + ')" ' +
                '<td class="' + className + '"> ' + content + ' </td>'
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;



}


function getCellPos() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var minesCount = setMinesNegsCount(i, j);
            gBoard[i][j].minesAroundCount = minesCount;
        }
    }
}

function setMinesNegsCount(posI, posJ) {

    var minesNegsCounter = 0;
    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;

        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue;
            if (i === posI && j === posJ) continue;
            var negcell = gBoard[i][j];
            if (negcell.isMine) minesNegsCounter++;;

        }
    }
    return minesNegsCounter;
}

function cellClicked(elCell, i, j) {
    var str = elCell.id;
    console.log(str);

    console.log(gBoard);
    if (gBoard[i][j].minesAroundCount >= 0) {
        gBoard[i][j].isShown = true;

        // renderCell();
    }


}

// function renderCell()


// renderBoard(board)
// cellClicked(elCell, i, j)
// cellMarked(elCell)    
// checkGameOver()
// expandShown(board, elCell, i, j);

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
