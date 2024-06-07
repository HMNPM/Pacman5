const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const screen_width = canvas.width;
const screen_height = canvas.height;

const pacmanSize = 15;
let pacmanX = screen_width / 2;
let pacmanY = screen_height / 2;
const pacmanSpeed = 5;
let direction = '';

const tileSize = 20;
let score = 0;
let lives = 3;
let level = 1;

const ghostSize = 15;
let ghosts = [];
const ghostSpeed = 2;
const initialGhostDelay = 5000; // Delay in milliseconds before releasing each ghost

const rows = Math.floor(screen_height / tileSize);
const cols = Math.floor(screen_width / tileSize);
let grid = [];

// Initialize the grid with points
function initGrid() {
    grid = [];
    for (let row = 0; row < rows; row++) {
        grid[row] = [];
        for (let col = 0; col < cols; col++) {
            grid[row][col] = true;
        }
    }
    // Clear the center area for Pacman and ghosts
    grid[Math.floor(rows / 2)][Math.floor(cols / 2)] = false;
}

function drawPacman() {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(pacmanX, pacmanY, pacmanSize, 0.2 * Math.PI, 1.8 * Math.PI);
    ctx.lineTo(pacmanX, pacmanY);
    ctx.closePath();
    ctx.fill();
}

function clearScreen() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, screen_width, screen_height);
}

function drawPoints() {
    ctx.fillStyle = 'white';
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (grid[row][col]) {
                ctx.beginPath();
                ctx.arc(col * tileSize + tileSize / 2, row * tileSize + tileSize / 2, 3, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
    }
}

function drawGhosts() {
    ctx.fillStyle = 'red';
    ghosts.forEach(ghost => {
        ctx.beginPath();
        ctx.arc(ghost.x, ghost.y, ghostSize, 0, 2 * Math.PI);
        ctx.fill();
    });
}

function update() {
    clearScreen();
    drawPoints();
    drawPacman();
    drawGhosts();
}

function movePacman() {
    switch(direction) {
        case 'ArrowLeft':
            pacmanX -= pacmanSpeed;
            break;
        case 'ArrowRight':
            pacmanX += pacmanSpeed;
            break;
        case 'ArrowUp':
            pacmanY -= pacmanSpeed;
            break;
        case 'ArrowDown':
            pacmanY += pacmanSpeed;
            break;
    }

    // Prevent Pacman from going out of bounds
    if (pacmanX - pacmanSize < 0) pacmanX = pacmanSize;
    if (pacmanX + pacmanSize > screen_width) pacmanX = screen_width - pacmanSize;
    if (pacmanY - pacmanSize < 0) pacmanY = pacmanSize;
    if (pacmanY + pacmanSize > screen_height) pacmanY = screen_height - pacmanSize;

    // Check for collisions with points
    let row = Math.floor(pacmanY / tileSize);
    let col = Math.floor(pacmanX / tileSize);

    if (grid[row][col]) {
        grid[row][col] = false;
        score++;
        if (score === rows * cols - 1) {
            levelUp();
        }
    }

    // Check for collisions with ghosts
    ghosts.forEach(ghost => {
        if (Math.hypot(ghost.x - pacmanX, ghost.y - pacmanY) < pacmanSize + ghostSize) {
            lives--;
            resetPacman();
            if (lives === 0) {
                gameOver();
            }
        }
    });

    update();
}

function moveGhosts() {
    ghosts.forEach(ghost => {
        if (pacmanX < ghost.x) {
            ghost.x -= ghostSpeed;
        } else if (pacmanX > ghost.x) {
            ghost.x += ghostSpeed;
        }
        if (pacmanY < ghost.y) {
            ghost.y -= ghostSpeed;
        } else if (pacmanY > ghost.y) {
            ghost.y += ghostSpeed;
        }
    });
}

function resetPacman() {
    pacmanX = screen_width / 2;
    pacmanY = screen_height / 2;
    direction = '';
}

function levelUp() {
    level++;
    initGrid();
    resetPacman();
    spawnGhosts(level);
    score = 0;
}

function gameOver() {
    alert('Game Over!');
    lives = 3;
    level = 1;
    initGrid();
    resetPacman();
    ghosts = [];
    spawnGhosts(level);
    score = 0;
}

function spawnGhosts(count) {
    ghosts = [];
    for (let i = 0; i < count; i++) {
        ghosts.push({
            x: screen_width / 2,
            y: screen_height / 2,
        });
    }
    releaseGhosts();
}

function releaseGhosts() {
    ghosts.forEach((ghost, index) => {
        setTimeout(() => {
            ghost.released = true;
        }, initialGhostDelay * index);
    });
}

document.addEventListener('keydown', (e) => {
    direction = e.key;
});

setInterval(movePacman, 100);
setInterval(moveGhosts, 200);

initGrid();
spawnGhosts(level);
update();
