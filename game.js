// ====== Setup ======
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 900;
canvas.height = 525;

// Capybara dimensions
const capybaraWidth = 60;
const capybaraHeight = 48;

// Spritesheet frames
const capybaraFrames = [
    { x: 0, y: 0, w: capybaraWidth, h: capybaraHeight }, // top-left
    { x: capybaraWidth, y: 0, w: capybaraWidth, h: capybaraHeight }, // top-right
    { x: 0, y: capybaraHeight, w: capybaraWidth, h: capybaraHeight }, // bottom-left
];
let frameCount = capybaraFrames.length;
let frameDelay = 8; // frames between animation frames
let frameIndex = 0;
let frameTick = 0;

// ====== Assets =====
const capybaraImg = new Image();
capybaraImg.src = "assets/capybara.png";

const backgroundImg = new Image();
backgroundImg.src = "assets/background.png";

// ====== Constants (easy to tweak) ======
const GROUND_Y = 410; // adjusted 20 pixels lower
const JUMP_STRENGTH = -15; // initial dy when jump starts
const GRAVITY = 1.2;
const OBSTACLE_SPEED = 6;
const SPAWN_INTERVAL = 100; // frames between spawns

// ====== Game state ======
let capybara = {
    x: 50,
    y: GROUND_Y,
    width: 60, // scaled width
    height: 48, // scaled height
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

// Draw player
function drawCapybara() {
    const frame = capybaraFrames[frameIndex];
    ctx.drawImage(
        capybaraImg,
        frame.x,
        frame.y,
        frame.w,
        frame.h,
        capybara.x,
        capybara.y,
        capybara.width,
        capybara.height
    );

    // Animate frames
    frameTick++;
    if (frameTick % frameDelay === 0) {
        frameIndex = (frameIndex + 1) % frameCount;
    }
}

// Draw background
function drawBackground() {
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
}

// ====== Obstacles ======
function spawnObstacle() {
    let size = 20 + Math.random() * 20;
    const bottom = capybara.y + capybara.height;
    obstacles.push({
        x: canvas.width,
        y: GROUND_Y + capybara.height - size, // sit on the ground
        width: size,
        height: size,
    });
}

function updateObstacles() {
    for (let o of obstacles) {
        o.x -= OBSTACLE_SPEED;
    }
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

// Reset game
function resetGame() {
    obstacles = [];
    score = 0;
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

    // Draw background first
    drawBackground();

    // Update player
    updateCapybara();

    // Spawn and update obstacles
    if (frame % SPAWN_INTERVAL === 0) spawnObstacle();
    updateObstacles();

    // Draw player
    drawCapybara();

    // Draw obstacles
    ctx.fillStyle = "black";
    for (let o of obstacles) ctx.fillRect(o.x, o.y, o.width, o.height);

    // Draw score
    score++;
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.fillText("Score: " + score, canvas.width - 100, 20);

    // Check collisions
    if (checkCollision()) {
        ctx.fillStyle = "black";
        ctx.font = "24px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
            "Game Over - Press Enter to Restart",
            canvas.width / 2,
            100
        );
        ctx.textAlign = "start";
        gameOver = true;
        return;
    }

    frame++;
    if (!gameOver) requestAnimationFrame(gameLoop);
}

// Start
function main() {
    if (!gameStarted) {
        drawWelcomeScreen();
        requestAnimationFrame(main);
    } else {
        requestAnimationFrame(gameLoop);
    }
}

main();
