/*----- constants -----*/
const COLORS = {
    '0': 'white',
    '1': 'black',
    '-1': 'red'
};

/*----- app's state (variables) -----*/
let board;  // array of column arrays / elements will hold 1/-1 for the players or 0 -> empty
let turn;   // 1 or -1
let winner; // null -> game in progress; 1/-1 a player has won; 'T' -> Tie

/*----- cached element references -----*/
const btnEl = document.querySelector('button');
const msgEl = document.querySelector('h1');
const markerEls = [...document.querySelectorAll('#markers > div')];

/*----- event listeners -----*/
btnEl.addEventListener('click', init);

document.querySelector('#markers')
    .addEventListener('click', handleMove);

/*----- functions -----*/
init();
// Initialize all state, then call render()
function init() {
    // Visualize mapping to DOM by rotating
    // 90 degrees counter-clockwise
    board = [
        [0, 0, 0, 0, 0, 0],  // column 0
        [0, 0, 0, 0, 0, 0],  // column 1
        [0, 0, 0, 0, 0, 0],  // column 2
        [0, 0, 0, 0, 0, 0],  // column 3
        [0, 0, 0, 0, 0, 0],  // column 4
        [0, 0, 0, 0, 0, 0],  // column 5
        [0, 0, 0, 0, 0, 0],  // column 6
    ];
    turn = 1;
    winner = null;
    render();
}

function render() {
    btnEl.style.visibility = winner ? 'visible' : 'hidden';
    console.log(board)
    renderBoard();
    renderMessage();
    renderMarkers();
}

function renderBoard() {
    board.forEach(function (colArr, colIdx) {
        colArr.forEach(function (playerVal, rowIdx) {
            const divId = `c${colIdx}r${rowIdx}`;  // e.g. "c6r5"
            const divEl = document.getElementById(divId);
            divEl.style.backgroundColor = COLORS[playerVal];
        });
    });
}

function renderMessage() {
    if (winner === 'T') {
        msgEl.innerHTML = "It's a Tie!!!";
    } else if (winner) {
        msgEl.innerHTML = `<span style="color: ${COLORS[winner]}">${COLORS[winner].toUpperCase()}</span> Wins!`;
    } else {
        msgEl.innerHTML = `<span style="color: ${COLORS[turn]}">${COLORS[turn].toUpperCase()}</span>'s Turn`;
    }
}


function renderMarkers() {
    markerEls.forEach(function (el, colIdx) {
        const showMarker = board[colIdx].includes(0);
        el.style.visibility = showMarker ? 'visible' : 'hidden';
    });
}

// called by the event listener (marker click)
// Update all impacted state, then call render()
function handleMove(evt) {
    const colIdx = markerEls.indexOf(evt.target);
    if (colIdx === -1 || winner) return;
    const colArr = board[colIdx];
    const rowIdx = colArr.indexOf(0);
    colArr[rowIdx] = turn;
    winner = getWinner(colIdx, rowIdx);
    turn *= -1;
    render();
}

function getWinner(colIdx, rowIdx) {
    const winner = 
        checkVertWin(colIdx, rowIdx) || 
        checkHorzWin(colIdx, rowIdx) ||
        checkDiagWinLeft(colIdx, rowIdx) || 
        checkDiagWinRight(colIdx, rowIdx) ||
        (!board.flat().includes(0) ? "T" : null);

    return winner;
}

function checkVertWin(colIdx, rowIdx) {
    const player = board[colIdx][rowIdx];  // 1 or -1
    let count = 1;
    rowIdx--;
    while (rowIdx >= 0 && board[colIdx][rowIdx] === player) {
        count++;
        rowIdx--;
    }
    return count === 4 ? player : null;
}

function checkHorzWin(colIdx, rowIdx) {
    const player = board[colIdx][rowIdx];  // 1 or -1
    let count = 1;
    // Count to the left
    let col = colIdx - 1;
    while (col >= 0 && board[col][rowIdx] === player) {
        count++;
        col--;
    }

    // Count to the right
    col = colIdx + 1
    while (col < board.length && board[col][rowIdx] === player) {
        count++;
        col++;
    }
    return count >= 4 ? player : null;
}

function checkDiagWinLeft(columnIdx, rowIdx) {
    const player = board[columnIdx][rowIdx];
    let count = 1;
    let idx1 = columnIdx - 1;
    let idx2 = rowIdx + 1;
    while (idx1 >= 0 && idx2 < board[0].length && board[idx1][idx2] === player) {
        count++;
        idx1--;
        idx2++;
    }
    idx1 = columnIdx + 1;
    idx2 = rowIdx - 1;
    while (idx1 < board.length && idx2 >= 0 && board[idx1][idx2] === player) {
        count++;
        idx1++;
        idx2--;
    }
    return count >= 4 ? winner = turn : null
}

function checkDiagWinRight(columnIdx, rowIdx) {
    const player = board[columnIdx][rowIdx];
    let count = 1;
    let idx1 = columnIdx + 1;
    let idx2 = rowIdx + 1;
    while (idx1 < board.length && idx2 < board[0].length && board[idx1][idx2] === player) {
        count++;
        idx1++;
        idx2++;
    }
    idx1 = columnIdx - 1;
    idx2 = rowIdx - 1;
    while (idx1 >= 0 && idx2 >= 0 && board[idx1][idx2] === player) {
        count++;
        idx1--;
        idx2--;
    }
    return count >= 4 ? winner = turn : null
}
