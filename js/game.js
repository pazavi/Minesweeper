'use strict'

var MINE = '<img src="imgs/mine.png">';
var FLAG = '<img src="imgs/flag.png">';
var EMPTY = '<img src="imgs/empty.png">';
var LIFE = '<img src="imgs/lifebuoy.png">';
var GREY_LIFE = '<img src="imgs/greylifebuoy.png">';
var GREY_HINT = '<img src="imgs/idea2.png" onclick="onHintClick(this)">';
var VICTORY = '<img src="imgs/victory3.gif">';
var LOST = '<img src="imgs/gameover.gif">';

var SMILEY = '😃';
var SMILEY_VICTORY = '😎';
var SMILEY_LOSE = '😰';


var gBoard;
var gTimerInterval = 0;
var gIsHint = false;
var gElClickedHint = null;

var gBeginnerBestScore = 0;
var gMediumBestScore = 0;
var gExpertBestScore = 0;





var gLevel = {
    size: 12,
    minesCount: 30
};

var gGame = null;

function chooseLevel(size, minesCount) {
    gLevel = {
        size,
        minesCount
    }

    initGame();


}


function initGame() {
    clearInterval(gTimerInterval);
    gTimerInterval = null;
    gGame = {
        isOn: true,
        isFirstClick: true,
        lifeCount: 3,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    };

    gBoard = buildBoard();
    renderBoard(gBoard);
    initDisplay();


}




function buildBoard() {


    var board = [];
    for (var i = 0; i < gLevel.size; i++) {
        board.push([]);
        for (var j = 0; j < gLevel.size; j++) {
            var cell = { minesAroundCount: 0, isShown: false, isMine: false, isMarked: false, isShownBeforeHint: false }
            board[i][j] = cell;
        }
    }


    return board
}

function setMines(i, j) {
    var count = 0;
    while (count < gLevel.minesCount) {
        var randIdx1 = getRandomIntInclusive(0, gLevel.size - 1);
        var randIdx2 = getRandomIntInclusive(0, gLevel.size - 1);
        if (i === randIdx1 && j === randIdx2) continue;
        if (gBoard[randIdx1][randIdx2].isMine) continue;
        gBoard[randIdx1][randIdx2].isMine = true;
        count++;

    }

}

function renderBoard(board) {
    var strHTML = '<table><tbody>';

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            var content = EMPTY;
            if (cell.isShown) {
                content = cell.isMine ? MINE : cell.minesAroundCount;
            } else content = cell.isMarked ? FLAG : EMPTY;

            var className = `cell cell ${i} '-' ${j}`;
            var tdId = `${i}, ${j}`;

            strHTML += `<td id="${tdId}" onclick="cellClicked(this, ${i},${j})" oncontextmenu="cellMarked(this, ${i}, ${j}); return false;" class="${className}"> ${content} </td>`;

            //strHTML += '<td id="' + tdId + '" onclick="cellClicked(this, ' + i + ', ' + j + ')" ' + '" oncontextmenu="cellMarked(this, ' + i + ', ' + j + ')" ' +
            //'<td class="' + className + '"> ' + content + ' </td>';    

        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector('.board-container');
    elContainer.innerHTML = strHTML;
}


function getCellMinesAround() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var minesCount = setMinesNegsCount(i, j);
            gBoard[i][j].minesAroundCount = minesCount;
        }
    }
}

function setMinesNegsCount(posI, posJ) {

    var minesNegsCounter = '';
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
    if (!gGame.isOn) return;

    if (gIsHint) {
        if (gGame.isFirstClick) {
            setMines();
            getCellMinesAround();
            gGame.isFirstClick = false;
        }
        revealNeighbors(gBoard, i, j);
        setTimeout(function () {
            hideNeighbors(gBoard, i, j);
            removeClickedHint();
            gIsHint = false;
        }, 1000);
        return;
    }

    if (gGame.isFirstClick) {
        setMines(i, j);
        getCellMinesAround();
        renderBoard(gBoard);
        gGame.isFirstClick = false;
    }

    if (!gTimerInterval) {
        startTimer();
    }

    if (!gBoard[i][j].isMarked && !gBoard[i][j].isShown) {
        gBoard[i][j].isShown = true;
        gGame.shownCount++
        elCell.innerHTML = gBoard[i][j].isMine ? MINE : gBoard[i][j].minesAroundCount;
        expandShown(gBoard, i, j);

        if (gBoard[i][j].isMine) {
            gGame.lifeCount--;
            renderLivesCount(gGame.lifeCount);
            if (!gGame.lifeCount) gameOver();
            setTimeout(function () {
                gBoard[i][j].isShown = false;
                gGame.shownCount--;
                renderBoard(gBoard);

            }, 2000)
        }
    } checkIfVictory();
}

function revealNeighbors(board, posI, posJ) {
    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j >= board[0].length) continue;
            var currCell = board[i][j];
            if (currCell.isShown) {
                currCell.isShownBeforeHint = true;
                continue;
            }
            currCell.isShown = true;
        }
    }
    renderBoard(board);
}

function hideNeighbors(board, posI, posJ) {
    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j >= board[0].length) continue;
            var currCell = board[i][j];
            if (currCell.isShownBeforeHint) {
                currCell.isShownBeforeHint = false;
                continue;
            }
            currCell.isShown = false;
        }
    }
    renderBoard(board);
}

function renderLivesCount(livesCount) {
    var elLivesContainer = document.querySelector('.lives');

    var strHTML = '';
    for (var i = 0; i < (3 - livesCount); i++) {
        strHTML += GREY_LIFE;
    }

    for (i = 0; i < livesCount; i++) {
        strHTML += LIFE;

    }
    elLivesContainer.innerHTML = strHTML;

}

function renderSmiley(smiley) {
    document.querySelector('.smiley').innerText = smiley;

}

function renderHints(GREY_HINT) {
    document.querySelector('.hints').innerHTML = GREY_HINT + GREY_HINT + GREY_HINT;

}

function revealAllMines(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            var cell = board[i][j];
            if (cell.isMine) {
                cell.isShown = true;
                renderBoard(board);
            }
        }
    }
}

function cellMarked(elCell, i, j) {
    if (!gGame.isOn) return;
    if (!gBoard[i][j].isShown) {
        if (gBoard[i][j].isMarked) {
            gBoard[i][j].isMarked = false;
            gGame.markedCount--;
            elCell.innerHTML = EMPTY;


        }
        else {
            gBoard[i][j].isMarked = true;
            elCell.innerHTML = FLAG;
            gGame.markedCount++
            document.querySelector('.counter').innerText = gLevel.minesCount - gGame.markedCount;

        }
    } checkIfVictory();
}

function expandShown(board, posI, posJ) {

    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i >= board.length) continue;

        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j >= board[0].length) continue;
            if (i === posI && j === posJ) continue;
            var negCell = board[i][j];
            if (!negCell.isMine && !negCell.isMarked && !negCell.isShown) {
                negCell.isShown = true;
                gGame.shownCount++;
                if (!negCell.minesAroundCount) expandShown(gBoard, i, j);
            }

           
        }
    }
    renderBoard(board);
}


function checkIfVictory() {
    if (gGame.markedCount === gLevel.minesCount && gGame.shownCount === (gLevel.size ** 2 - gLevel.minesCount)) {
        gameOver(true);
        isLevelBestScore (gGame.secsPassed);
        if (isLevelBestScore)
        // console.log('secs passed: ', gGame.secsPassed)
        renderSmiley(SMILEY_VICTORY);
        var elVictory = document.querySelector('.victory');
        elVictory.innerHTML = VICTORY;
        elVictory.style.display = 'block';
    }
}


function startTimer() {
    clearInterval(gTimerInterval);
    var start = Date.now();
    gTimerInterval = setInterval(function () {
        var delta = Date.now() - start;

        var secDelta = (Math.floor(delta / 1000));
        gGame.secsPassed = secDelta;
        var formatedTimer = formatTimer(secDelta);
        document.querySelector('.timer').innerText = formatedTimer;

    }, 1000);
}

function formatTimer(secs) {
    var totalSeconds = secs;
    var hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds % 60;

    minutes = String(minutes).padStart(2, "0");
    hours = String(hours).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");
    var formatedTimer = (hours + ":" + minutes + ":" + seconds);

    return formatedTimer;

}

function gameOver() {
    gGame.isOn = false;
    clearInterval(gTimerInterval);
    gTimerInterval = null;
   

    var elContainer = document.querySelector('.board-container');
    elContainer.style.animation = 'shake 0.4s';
    elContainer.style.animationIterationCount = '5';

    var elVictory = document.querySelector('.victory');
    elVictory.innerHTML = LOST;
    elVictory.style.display = 'block';

    renderSmiley(SMILEY_LOSE);
    revealAllMines(gBoard);



}

function initDisplay() {

    renderLivesCount(3);
    document.querySelector('.timer').innerText = '00:00:00';
    document.querySelector('.victory').style.display = 'none';
    renderSmiley(SMILEY);
    renderHints(GREY_HINT);
    document.querySelector('.counter').innerText = gLevel.minesCount;


}


function onHintClick(elImg) {
    if (gIsHint) return;
    gElClickedHint = elImg;
    elImg.src = 'imgs/idea1.png';
    gIsHint = true;
}

function removeClickedHint() {
    gElClickedHint.disabled = true;
    gElClickedHint.style.opacity = 0;
    gElClickedHint.style.cursor = 'unset';
}

function closeHint(elImg) {
    elImg.style.display = 'none';
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isLevelBestScore (secs) {
    if (gLevel.size ===4){
        if (gGame.secsPassed < gBeginnerBestScore || gBeginnerBestScore ===0) {
            gBeginnerBestScore = gGame.secsPassed;
            localStorage.setItem("beginnerBestScore", gBeginnerBestScore);
            document.querySelector('.best-score').innerHTML = localStorage.getItem("beginnerBestScore");
            return true;
        }
        return false; 
    }

    if (gLevel.size ===8){
        if (gGame.secsPassed > gMediumBestScore) {
            gMediumBestScore = gGame.secsPassed;
            localStorage.setItem("mediumBestScore", gMediumBestScore);
            document.querySelector('.best-score').innerHTML = localStorage.getItem("mediumBestScore");
            return true;
        }
        return false; 
    }

    if (gLevel.size ===12){
        if (gGame.secsPassed > gExpertBestScore) {
            gExpertBestScore = gGame.secsPassed;
            localStorage.setItem("expertBestScore", gExpertBestScore);
            document.querySelector('.best-score').innerHTML = localStorage.getItem("expertBestScore");
            return true;
        }
        return false; 
    }
}



