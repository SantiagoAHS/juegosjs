const canvas = document.getElementById('reversiCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 50;
const numCols = 8;
const numRows = 8;
const board = [];
const players = ['black', 'white'];
const humanPlayer = 0;
const aiPlayer = 1;
let currentPlayer = humanPlayer;

// Inicializar el tablero
function initializeBoard() {
    for (let row = 0; row < numRows; row++) {
        board[row] = [];
        for (let col = 0; col < numCols; col++) {
            board[row][col] = -1; // -1 representa una celda vacía
        }
    }

    // Posiciones iniciales de las fichas
    board[3][3] = 0; // Negro
    board[3][4] = 1; // Blanco
    board[4][3] = 1; // Blanco
    board[4][4] = 0; // Negro
}

// Dibujar el tablero y las fichas
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            ctx.fillStyle = (row + col) % 2 === 0 ? '#c2b280' : '#8b4513';
            ctx.fillRect(col * gridSize, row * gridSize, gridSize, gridSize);

            if (board[row][col] !== -1) {
                ctx.beginPath();
                ctx.arc(col * gridSize + gridSize / 2, row * gridSize + gridSize / 2, gridSize / 2.5, 0, Math.PI * 2);
                ctx.fillStyle = players[board[row][col]];
                ctx.fill();
                ctx.strokeStyle = '#333';
                ctx.stroke();
            }
        }
    }
}

// Manejar clics en el canvas
canvas.addEventListener('click', handleClick);

function handleClick(event) {
    if (currentPlayer === humanPlayer) {
        const mouseX = event.clientX - canvas.getBoundingClientRect().left;
        const mouseY = event.clientY - canvas.getBoundingClientRect().top;

        const clickedCol = Math.floor(mouseX / gridSize);
        const clickedRow = Math.floor(mouseY / gridSize);

        if (isValidMove(clickedRow, clickedCol)) {
            placePiece(clickedRow, clickedCol);
            flipPieces(clickedRow, clickedCol);
            switchPlayer();
            drawBoard();

            // Verificar si la máquina puede realizar un movimiento
            if (currentPlayer === aiPlayer) {
                setTimeout(() => {
                    makeAIMove();
                    switchPlayer();
                    drawBoard();
                }, 500);
            }
        }
    }
}

// Verificar si el movimiento es válido
function isValidMove(row, col) {
    if (board[row][col] !== -1) {
        return false; // La celda no está vacía
    }

    // Verificar si hay fichas del oponente cercanas para voltear
    for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
        for (let colOffset = -1; colOffset <= 1; colOffset++) {
            const checkRow = row + rowOffset;
            const checkCol = col + colOffset;

            if (isValidPosition(checkRow, checkCol) && board[checkRow][checkCol] === (1 - currentPlayer)) {
                if (checkDirection(row, col, rowOffset, colOffset)) {
                    return true;
                }
            }
        }
    }

    return false;
}

// Verificar si la posición está dentro de los límites del tablero
function isValidPosition(row, col) {
    return row >= 0 && row < numRows && col >= 0 && col < numCols;
}

// Verificar si se pueden voltear fichas en una dirección específica
function checkDirection(row, col, rowOffset, colOffset) {
    let currentRow = row + rowOffset;
    let currentCol = col + colOffset;

    while (isValidPosition(currentRow, currentCol) && board[currentRow][currentCol] === 1 - currentPlayer) {
        currentRow += rowOffset;
        currentCol += colOffset;
    }

    if (isValidPosition(currentRow, currentCol) && board[currentRow][currentCol] === currentPlayer) {
        return true;
    }

    return false;
}

// Colocar una ficha en la posición indicada
function placePiece(row, col) {
    board[row][col] = currentPlayer;
}

// Voltear las fichas en las direcciones válidas
function flipPieces(row, col) {
    for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
        for (let colOffset = -1; colOffset <= 1; colOffset++) {
            if (rowOffset !== 0 || colOffset !== 0) {
                flipDirection(row, col, rowOffset, colOffset);
            }
        }
    }
}

// Voltear fichas en una dirección específica
function flipDirection(row, col, rowOffset, colOffset) {
    let currentRow = row + rowOffset;
    let currentCol = col + colOffset;
    let flippedPieces = [];

    while (isValidPosition(currentRow, currentCol) && board[currentRow][currentCol] === 1 - currentPlayer) {
        flippedPieces.push({ row: currentRow, col: currentCol });
        currentRow += rowOffset;
        currentCol += colOffset;
    }

    if (isValidPosition(currentRow, currentCol) && board[currentRow][currentCol] === currentPlayer) {
        // Voltear las fichas capturadas
        flippedPieces.forEach(piece => {
            board[piece.row][piece.col] = currentPlayer;
        });
    }
}

// Verificar si hay movimientos válidos para el jugador actual
function hasValidMoves(player) {
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            if (isValidMove(row, col) && currentPlayer === player) {
                return true;
            }
        }
    }
    return false;
}

// Hacer un movimiento de la IA
function makeAIMove() {
    const possibleMoves = [];

    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            if (isValidMove(row, col)) {
                possibleMoves.push({ row, col });
            }
        }
    }

    // Elegir un movimiento al azar
    if (possibleMoves.length > 0) {
        const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        placePiece(randomMove.row, randomMove.col);
        flipPieces(randomMove.row, randomMove.col);
    }
}

// Cambiar al siguiente jugador
function switchPlayer() {
    currentPlayer = 1 - currentPlayer;
}

// Calcular y mostrar el resultado del juego
function showResult() {
    let blackCount = 0;
    let whiteCount = 0;

    // Contar fichas de cada color
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            if (board[row][col] === 0) {
                blackCount++;
            } else if (board[row][col] === 1) {
                whiteCount++;
            }
        }
    }

    // Mostrar el resultado
    if (blackCount > whiteCount) {
        alert('¡Negras ganan!');
    } else if (whiteCount > blackCount) {
        alert('¡Blancas ganan!');
    } else {
        alert('¡Empate!');
    }
}

// Verificar si el juego ha terminado
function checkGameOver() {
    if (!hasValidMoves(humanPlayer) && !hasValidMoves(aiPlayer)) {
        showResult();
    }
}

// Modificar la función handleClick para llamar a checkGameOver después de cambiar el jugador
function handleClick(event) {
    if (currentPlayer === humanPlayer) {
        const mouseX = event.clientX - canvas.getBoundingClientRect().left;
        const mouseY = event.clientY - canvas.getBoundingClientRect().top;

        const clickedCol = Math.floor(mouseX / gridSize);
        const clickedRow = Math.floor(mouseY / gridSize);

        if (isValidMove(clickedRow, clickedCol)) {
            placePiece(clickedRow, clickedCol);
            flipPieces(clickedRow, clickedCol);
            switchPlayer();
            drawBoard();
            checkGameOver();

            // Verificar si la máquina puede realizar un movimiento
            if (currentPlayer === aiPlayer) {
                setTimeout(() => {
                    makeAIMove();
                    switchPlayer();
                    drawBoard();
                    checkGameOver();
                }, 500);
            }
        }
    }
}


// Inicializar el tablero y dibujar el juego
initializeBoard();
drawBoard();
