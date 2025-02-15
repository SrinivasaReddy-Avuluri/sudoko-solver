let selectedCell = null;
let board = Array(9).fill().map(() => Array(9).fill(0));
let originalBoard = Array(9).fill().map(() => Array(9).fill(0));

function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    
    // Update theme toggle icon
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.innerHTML = newTheme === 'light' 
        ? '<i class="fas fa-moon"></i>' 
        : '<i class="fas fa-sun"></i>';
    
    // Save theme preference
    localStorage.setItem('theme', newTheme);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.innerHTML = savedTheme === 'light' 
        ? '<i class="fas fa-moon"></i>' 
        : '<i class="fas fa-sun"></i>';
}

function createBoard() {
    const boardDiv = document.getElementById('board');
    boardDiv.innerHTML = '';
    
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            
            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = 1;
            input.dataset.row = i;
            input.dataset.col = j;
            
            // Only allow numbers 1-9
            input.addEventListener('input', (e) => {
                const value = e.target.value;
                if (!/^[1-9]$/.test(value)) {
                    e.target.value = '';
                }
                updateBoardFromInput(i, j, e.target.value);
            });

            // Add focus events for cell selection
            input.addEventListener('focus', (e) => {
                // Remove selected class from all cells
                document.querySelectorAll('.cell').forEach(cell => {
                    cell.classList.remove('selected');
                });
                // Add selected class to parent cell
                e.target.parentElement.classList.add('selected');
            });

            input.addEventListener('blur', (e) => {
                // Optional: remove selected class on blur
                // e.target.parentElement.classList.remove('selected');
            });

            // Add hover effect for entire row and column
            cell.addEventListener('mouseenter', (e) => {
                highlightRowAndColumn(i, j);
            });

            cell.addEventListener('mouseleave', (e) => {
                removeHighlight();
            });

            cell.appendChild(input);
            boardDiv.appendChild(cell);
        }
    }
}

function updateBoardFromInput(row, col, value) {
    board[row][col] = value === '' ? 0 : parseInt(value);
    validateCell(row, col);
}

function validateCell(row, col) {
    const num = board[row][col];
    if (num === 0) {
        return true;
    }
    
    // Check row
    for (let j = 0; j < 9; j++) {
        if (j !== col && board[row][j] === num) {
            showMessage('Invalid input: Duplicate number in row ' + (row + 1), true);
            return false;
        }
    }
    
    // Check column
    for (let i = 0; i < 9; i++) {
        if (i !== row && board[i][col] === num) {
            showMessage('Invalid input: Duplicate number in column ' + (col + 1), true);
            return false;
        }
    }
    
    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = boxRow; i < boxRow + 3; i++) {
        for (let j = boxCol; j < boxCol + 3; j++) {
            if (i !== row && j !== col && board[i][j] === num) {
                showMessage('Invalid input: Duplicate number in 3x3 box', true);
                return false;
            }
        }
    }
    
    showMessage(''); // Clear error message if valid
    return true;
}

function generateNewPuzzle() {
    // Remove this function's content since we want user input
    clearBoard();
}

function solveSudoku() {
    if (!isValidInput()) {
        showMessage('Invalid input! The current configuration cannot lead to a valid solution.', true);
        return false;
    }

    const emptyCell = findEmptyCell();
    if (!emptyCell) return true;
    
    const [row, col] = emptyCell;
    
    for (let num = 1; num <= 9; num++) {
        if (isValid(row, col, num)) {
            board[row][col] = num;
            
            if (solveSudoku()) {
                updateBoardDisplay();
                showMessage('Puzzle solved successfully!');
                return true;
            }
            
            board[row][col] = 0;
        }
    }
    
    showMessage('This puzzle cannot be solved!', true);
    return false;
}

function isValidInput() {
    // Check if the current board configuration is valid
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] !== 0) {
                const temp = board[i][j];
                board[i][j] = 0;
                if (!isValid(i, j, temp)) {
                    board[i][j] = temp;
                    return false;
                }
                board[i][j] = temp;
            }
        }
    }
    return true;
}

function findEmptyCell() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] === 0) {
                return [i, j];
            }
        }
    }
    return null;
}

function isValid(row, col, num) {
    // Check row
    for (let j = 0; j < 9; j++) {
        if (j !== col && board[row][j] === num) return false;
    }
    
    // Check column
    for (let i = 0; i < 9; i++) {
        if (i !== row && board[i][col] === num) return false;
    }
    
    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = boxRow; i < boxRow + 3; i++) {
        for (let j = boxCol; j < boxCol + 3; j++) {
            if (i !== row && j !== col && board[i][j] === num) return false;
        }
    }
    
    return true;
}

function updateBoardDisplay() {
    const inputs = document.querySelectorAll('.cell input');
    inputs.forEach(input => {
        const row = parseInt(input.dataset.row);
        const col = parseInt(input.dataset.col);
        input.value = board[row][col] || '';
    });
}

function clearBoard() {
    board = Array(9).fill().map(() => Array(9).fill(0));
    originalBoard = Array(9).fill().map(() => Array(9).fill(0));
    updateBoardDisplay();
    showMessage(''); // Clear any existing messages
}

function checkSolution() {
    // Check if there are any numbers entered
    let hasNumbers = false;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] !== 0) {
                hasNumbers = true;
                break;
            }
        }
        if (hasNumbers) break;
    }

    if (!hasNumbers) {
        showMessage('Please enter some numbers first!', true);
        return;
    }

    // Check if current configuration is valid
    if (isValidInput()) {
        showMessage('Current configuration is valid! You can continue solving.');
    } else {
        showMessage('Current configuration is invalid! Please check your numbers.', true);
    }
}

function showMessage(text, isError = false) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = 'message ' + (isError ? 'error' : 'success');
}

function highlightRowAndColumn(row, col) {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        const cellRow = Math.floor(index / 9);
        const cellCol = index % 9;
        
        if (cellRow === row || cellCol === col) {
            cell.style.backgroundColor = 'var(--cell-hover)';
        }
    });
}

function removeHighlight() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.style.backgroundColor = '';
    });
}

// Initialize the board when the page loads
window.onload = () => {
    createBoard();
    generateNewPuzzle();
};

// Add event listener for theme toggle
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    createBoard();
}); 