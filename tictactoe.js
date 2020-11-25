const playgroundArray = [[,,,], [,,,], [,,,]];
let currentPlayerSymbol = 'O';
let winnerExists = false;

const playgroundDivCells = document.querySelectorAll('.cell');
const playerLabel1 = document.querySelector('.label-player1');
const playerLabel2 = document.querySelector('.label-player2');
const resultLabel = document.querySelector('.label--result');
const newGameButton = document.querySelector('.button-newGame');

initialize();

function initialize() {
    currentPlayerSymbol = 'O';
    winnerExists = false;
    initPlaygroundArray();
    initPlaygroundDivCells();
    initLabels();
    newGameButton.addEventListener('click', initialize);
}

function initPlaygroundArray() {
    playgroundArray.forEach(row => row.fill(null));
}
function initPlaygroundDivCells() {
    playgroundDivCells.forEach(cell => cell.addEventListener('click', handleCellClick));
    playgroundDivCells.forEach(cell => cell.addEventListener('keypress', handleCellKeyPress));
    playgroundDivCells.forEach(cell => cell.textContent = '' );
    playgroundDivCells.forEach(cell => cell.classList.remove('cell--winner'));
    playgroundDivCells[0].focus();
}

function initLabels() {
    playerLabel2.classList.remove('label--active');
    resultLabel.classList.remove('label-result--filled');
    resultLabel.textContent = '-';

    if(!playerLabel1.classList.contains('label--active')) {
        playerLabel1.classList.add('label--active');
    }
}

function handleCellClick(e) {
    if(e.currentTarget.textContent === '') {
        e.currentTarget.textContent = currentPlayerSymbol;
        setAndCheckPlaygroundArray(e.currentTarget.tabIndex);
        if(!winnerExists) {
            swapPlayer();
            if(playgroundArray.flat().every(item => item != null)) {
                showDraw();
            }
        } else {
            showWinner();
        }
    }
}

function handleCellKeyPress(e) {
    if(e.keyCode == 13) {
        handleCellClick(e);
    }
}


function setAndCheckPlaygroundArray(divTabIndex){
    let rowIndex = Math.floor((divTabIndex - 1) / 3);
    let columnIndex = (divTabIndex - 1) % 3;

    playgroundArray[rowIndex][columnIndex] = currentPlayerSymbol;
    checkAndHandleWinner(divTabIndex - 1, rowIndex, columnIndex);
}

function swapPlayer() {
    if(currentPlayerSymbol === 'O'){
        currentPlayerSymbol = 'X';
        playerLabel1.classList.remove('label--active');
        playerLabel2.classList.add('label--active');
    } else {
        currentPlayerSymbol = 'O';
        playerLabel2.classList.remove('label--active');
        playerLabel1.classList.add('label--active');
    }
}

function showDraw() {
    resultLabel.textContent = 'Döntetlen!';
    resultLabel.classList.add('label-result--filled');
}

function showWinner(){
    playgroundDivCells.forEach(cell => cell.removeEventListener('click', handleCellClick));
    playgroundDivCells.forEach(cell => cell.removeEventListener('keypress', handleCellKeyPress));
    currentPlayerSymbol === 'O' ? 
        resultLabel.textContent =  playerLabel1.textContent + ' Nyert!' : 
        resultLabel.textContent =  playerLabel2.textContent + ' Nyert!';
    resultLabel.classList.add('label-result--filled');
}

function checkAndHandleWinner(divIndex, rowIndex, columnIndex) {
    if(playgroundArray[rowIndex].every(item => item === currentPlayerSymbol)) {
        markWinnerRow(rowIndex);
    }
    if(getPlaygroundArrayColumn(columnIndex).every(item => item === currentPlayerSymbol)) {
        markWinnerColumn(columnIndex);
    }
    if (divIndex % 2 === 0) {       
        markWinnerDiagonals();
    }
}

function markWinnerRow(rowIndex) {
    playgroundDivCells
        .forEach(cell => {
                if(cell.tabIndex - 1 >= rowIndex * 3 && cell.tabIndex - 1 < rowIndex * 3 + 3)
                    cell.classList.add('cell--winner')
            });
    
    winnerExists = true;
}

function markWinnerColumn(columnIndex) {
    playgroundDivCells
        .forEach(cell => {
                if((cell.tabIndex - 1) % 3 === columnIndex % 3)
                    cell.classList.add('cell--winner')
            });
    winnerExists = true;
}

function markWinnerDiagonals() {
    let winnerIndexes = [4];

    if(playgroundArray
        .map((item, index) => item[index])
        .every(item => item === currentPlayerSymbol)) {
            winnerIndexes.push(0);
            winnerIndexes.push(8);
    }
    if(playgroundArray
        .map((item, index) => item[(-index + 2) % 3])
        .every(item => item === currentPlayerSymbol)) {
            winnerIndexes.push(2);
            winnerIndexes.push(6);
    }
    if(winnerIndexes.length > 2) {
        markWinnerDiagonalDivs(winnerIndexes);
    }
}

function markWinnerDiagonalDivs(winnerIndexes) {
    playgroundDivCells
         .forEach(diagCell => {
             if(winnerIndexes.includes(diagCell.tabIndex - 1)) { 
                 diagCell.classList.add('cell--winner');
                }});
    
    winnerExists = true;
}

function getPlaygroundArrayColumn(columnIndex) {
    let columnArray = [];
    for(let i = playgroundArray.length - 1; i >= 0; i--) {
        columnArray.push(playgroundArray[i][columnIndex]);
    }
    return columnArray;
}