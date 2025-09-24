// ====== Setup ======
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ====== Constants (easy to tweak) ======
const GROUND_Y = 150; // top y of the player when standing on ground
const JUMP_STRENGTH = -15; // initial dy when jump starts
const GRAVITY = 1.2;
const OBSTACLE_SPEED = 6;
const SPAWN_INTERVAL = 100; // frames between spawns

// ====== Game state ======
let capybara = {
    x: 50,
    y: GROUND_Y,
    width: 40,
    height: 40,
    dy: 0,
    jumping: false,
};
let obstacles = [];
let score = 0;
let frame = 0;
let gameOver = false;
let gameStarted = false;

// ====== Controls ======
document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        e.preventDefault(); // stops page from scrolling on Space
        if (!capybara.jumping && gameStarted && !gameOver) {
            capybara.dy = JUMP_STRENGTH;
            capybara.jumping = true;
        }
    }
    if (e.code === "Enter") {
        if (!gameStarted) {
            gameStarted = true;
            resetGame();
        } else if (gameOver) {
            resetGame();
        }
    }
});

// Touch support for mobile
canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    if (gameStarted && !capybara.jumping && !gameOver) {
        capybara.dy = JUMP_STRENGTH;
        capybara.jumping = true;
    }
});

// ====== Player physics ======
function updateCapybara() {
    capybara.y += capybara.dy;
    if (capybara.jumping) capybara.dy += GRAVITY;

    // ground collision (clamp to ground)
    if (capybara.y >= GROUND_Y) {
        capybara.y = GROUND_Y;
        capybara.jumping = false;
        capybara.dy = 0;
    }
}

// ====== Obstacles ======
function spawnObstacle() {
    let size = 20 + Math.random() * 30;
    // place obstacle so its bottom sits on the same ground as the capybara
    const bottom = capybara.y + capybara.height; // e.g., 150 + 40 = 190
    obstacles.push({
        x: canvas.width,
        y: bottom - size,
        width: size,
        height: size,
    });
}

function updateObstacles() {
    for (let o of obstacles) {
        o.x -= OBSTACLE_SPEED;
    }
    // remove off-screen obstacles
    obstacles = obstacles.filter((o) => o.x + o.width > 0);
}

// ====== Collision (AABB) ======
function checkCollision() {
    for (let o of obstacles) {
        if (
            capybara.x < o.x + o.width &&
            capybara.x + capybara.width > o.x &&
            capybara.y < o.y + o.height &&
            capybara.y + capybara.height > o.y
        ) {
            return true;
        }
    }
    return false;
}

// Welcome screen
function drawWelcomeScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    ctx.font = "36px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
        "🐼 Capybara Runner 🐼",
        canvas.width / 2,
        canvas.height / 2 - 40
    );

    ctx.font = "20px Arial";
    ctx.fillText(
        "Press Enter to Start",
        canvas.width / 2,
        canvas.height / 2 + 20
    );
    ctx.fillText(
        "Press Space to Jump",
        canvas.width / 2,
        canvas.height / 2 + 50
    );
}

function resetGame() {
    obstacles = [];
    score = -1;
    frame = 0;
    capybara.y = GROUND_Y;
    capybara.dy = 0;
    capybara.jumping = false;
    gameOver = false;
    requestAnimationFrame(gameLoop);
}

// ====== Main loop ======
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateCapybara();

    if (frame % SPAWN_INTERVAL === 0) spawnObstacle();
    updateObstacles();

    // Draw capybara
    ctx.fillStyle = "green";
    ctx.fillRect(capybara.x, capybara.y, capybara.width, capybara.height);

    // Draw obstacles
    ctx.fillStyle = "red";
    for (let o of obstacles) ctx.fillRect(o.x, o.y, o.width, o.height);

    // Score
    score++;
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.fillText("Score: " + score, canvas.width - 100, 20);

    // Collision check
    if (checkCollision()) {
        ctx.fillStyle = "black";
        ctx.font = "24px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
            "Game Over - Press Enter to Restart",
            canvas.width / 2,
            100
        );
        ctx.textAlign = "start"; // reset if needed later
        gameOver = true;
        return; // stop the loop
    }

    frame++;
    if (!gameOver) requestAnimationFrame(gameLoop);
}

function main() {
    if (!gameStarted) {
        drawWelcomeScreen();
        requestAnimationFrame(main);
    }
}

main();
