const gridContainer = document.getElementById("grid-container");
const messageContainer = document.getElementById("message-container");

let grid = [[0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]];

function setup() {
    drawGrid();
    generateRandomTile();
    generateRandomTile();
}

function drawGrid() {
    gridContainer.innerHTML = ""; // Clear the grid container
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            const gridItem = document.createElement("div");
            gridItem.classList.add("grid-item");
            gridItem.textContent = grid[i][j] !== 0 ? grid[i][j] : "";
            gridItem.style.backgroundColor = getTileColor(grid[i][j]);
            gridContainer.appendChild(gridItem);
        }
    }
}

function getTileColor(value) {
    const colors = {
        2: "#eee4da",
        4: "#ede0c8",
        8: "#f2b179",
        16: "#f59563",
        32: "#f67c5f",
        64: "#f65e3b",
        128: "#edcf72",
        256: "#edcc61",
        512: "#edc850",
        1024: "#edc53f",
        2048: "#edc22e"
    };
    return colors[value] || "#3c3a32";
}

function keyPressed(event) {
    const keyCode = event.keyCode;
    let moved = false;

    if (keyCode === 37) { // Left arrow key
        moved = moveLeft();
    } else if (keyCode === 38) { // Up arrow key
        moved = moveUp();
    } else if (keyCode === 39) { // Right arrow key
        moved = moveRight();
    } else if (keyCode === 40) { // Down arrow key
        moved = moveDown();
    }

    if (moved) {
        generateRandomTile();
        if (checkGameOver()) {
            messageContainer.textContent = "Game Over!";
        }
        drawGrid();
    }
}

function moveLeft() {
    let moved = false;
    for (let i = 0; i < grid.length; i++) {
        for (let j = 1; j < grid[i].length; j++) {
            if (grid[i][j] !== 0) {
                for (let k = 0; k < j; k++) {
                    if (grid[i][k] === 0 && noObstaclesInRow(i, k, j)) {
                        grid[i][k] = grid[i][j];
                        grid[i][j] = 0;
                        moved = true;
                        break;
                    } else if (grid[i][k] === grid[i][j] && noObstaclesInRow(i, k, j)) {
                        grid[i][k] *= 2;
                        grid[i][j] = 0;
                        moved = true;
                        break;
                    }
                }
            }
        }
    }
    return moved;
}

function moveRight() {
    flipGrid();
    const moved = moveLeft();
    flipGrid();
    return moved;
}

function moveUp() {
    transposeGrid();
    const moved = moveLeft();
    transposeGrid();
    return moved;
}

function moveDown() {
    transposeGrid();
    flipGrid();
    const moved = moveLeft();
    flipGrid();
    transposeGrid();
    return moved;
}

function noObstaclesInRow(row, start, end) {
    for (let i = start + 1; i < end; i++) {
        if (grid[row][i] !== 0) {
            return false;
        }
    }
    return true;
}

function flipGrid() {
    for (let i = 0; i < grid.length; i++) {
        grid[i].reverse();
    }
}

function transposeGrid() {
    const newGrid = [[0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]];
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            newGrid[i][j] = grid[j][i];
        }
    }
    grid = newGrid;
}

function generateRandomTile() {
    const emptySpots = [];
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === 0) {
                emptySpots.push({ row: i, col: j });
            }
        }
    }

    if (emptySpots.length > 0) {
        const spot = emptySpots[Math.floor(Math.random() * emptySpots.length)];
        grid[spot.row][spot.col] = Math.random() < 0.9 ? 2 : 4;
    }
}

function checkGameOver() {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === 0) {
                return false;
            }
            if (j < grid[i].length - 1 && grid[i][j] === grid[i][j + 1]) {
                return false;
            }
            if (i < grid.length - 1 && grid[i][j] === grid[i + 1][j]) {
                return false;
            }
        }
    }
    return true;
}

setup();
document.addEventListener("keydown", keyPressed);
