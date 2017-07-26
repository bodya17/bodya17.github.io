(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// https://gist.github.com/paulirish/12fb951a8b893a454b32
window.$ = document.querySelectorAll.bind(document);

Node.prototype.on = window.on = function (name, fn) {
  this.addEventListener(name, fn);
}

Node.prototype.off = window.off = function (name, fn) {
  this.removeEventListener(name, fn);
}

NodeList.prototype.__proto__ = Array.prototype;

NodeList.prototype.on = NodeList.prototype.addEventListener = function (name, fn) {
  this.forEach(function (elem, i) {
    elem.on(name, fn);
  });
}

NodeList.prototype.off = NodeList.prototype.removeEventListener = function (name, fn) {
  this.forEach(function (elem, i) {
    elem.off(name, fn);
  });
}
},{}],2:[function(require,module,exports){
exports.getSecondaryDiagonal = twoDimArr => twoDimArr.map((el, i, arr) => twoDimArr[i][arr.length - 1 - i]);
exports.getMainDiagonal = twoDimArr => twoDimArr.map((el, i) => twoDimArr[i][i]);
exports.getRow = (twoDimArr, rowNum) => twoDimArr[rowNum];
exports.getColumn = (twoDimArr, colNum) => twoDimArr.map((el, i) => twoDimArr[i][colNum]);
},{}],3:[function(require,module,exports){
require('./bling');
const { getSecondaryDiagonal, getMainDiagonal, getRow, getColumn } = require('./helpers');

const board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

let moves = 0;

function whereWinHappened(board) {
    if (allValuesTheSame(getMainDiagonal(board))) {
        return 'main-diagonal';
    }
    if (allValuesTheSame(getSecondaryDiagonal(board))) {
        return 'secondary-diagonal';
    }
    if (allValuesTheSame(getColumn(board, 0))) {
        return 'first-column';
    }
    if (allValuesTheSame(getColumn(board, 1))) {
        return 'middle-column';
    }
    if (allValuesTheSame(getColumn(board, 2))) {
        return 'third-column';
    }
    if (allValuesTheSame(board[0])) {
        return 'first-row';
    }
    if (allValuesTheSame(board[1])) {
        return 'middle-row';
    }
    if (allValuesTheSame(board[2])) {
        return 'third-row';
    }
}

const allValuesTheSame = arr => arr.indexOf('') === -1 && new Set(arr).size === 1;

function checkDiagonals(board) {
    return allValuesTheSame(getMainDiagonal(board)) || allValuesTheSame(getSecondaryDiagonal(board));
}

function checkRows(board) {
    return board.map(allValuesTheSame).some(el => el === true);
}

function checkColumns(board) {
    return board.map((el, i) => allValuesTheSame(getColumn(board, i))).some(el => el === true);
}

function checkWin(board) {
    return [checkColumns, checkRows, checkDiagonals].map(f => f(board)).some(el => el === true);
}

$('td').on('click', function clickListener() {
    const [x, y] = this.getAttribute('data-pos').split('');
    if (board[x][y] === '') {
        const char = ++moves % 2 ? 'X' : '0';
        this.classList.add('player' + char);
        setTimeout(() => {
            this.classList.add('active');
        }, 100);
        board[x][y] = char;
        if (checkWin(board)) {
            const crossClass = whereWinHappened(board);
            console.log(`Winner: ${char}`);
            const resultInfo = document.createElement('h3');
            resultInfo.classList.add('info');
            resultInfo.textContent = `${char} is winner!`;
            $('body')[0].appendChild(resultInfo);
            $('td').off('click', clickListener);
            $('table')[0].classList.add(crossClass);
        } else {
            console.log('No winner yet');
        }
    } 
});

},{"./bling":1,"./helpers":2}]},{},[3]);
