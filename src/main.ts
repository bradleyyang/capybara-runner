import { Capybara } from "@/entities/Capybara";
import { ObstacleManager } from "@/entities/Obstacles";
import { drawWelcomeScreen } from "@/scenes/WelcomeScene";
import { drawPauseScreen } from "@/scenes/PauseScene";
import { createGameLoop } from "./gameLoop";
import { setupControls } from "@/core/controls";

const capybara = new Capybara();
const obstacles = new ObstacleManager();
let gameStarted = false;
let paused = false;
let gameOver = false;

const loop = createGameLoop(
    capybara,
    obstacles,
    () => paused,
    (val) => (gameOver = val)
);

setupControls(
    capybara,
    () => {
        gameStarted = true;
        paused = false;
        loop.start();
    },
    resetGame,
    () => {
        if (!gameOver) paused = !paused;
        if (paused) drawPauseScreen();
        else loop.start();
    },
    quitToMenu
);

function resetGame() {
    obstacles.obstacles = [];
    capybara.y = 410;
    capybara.dy = 0;
    capybara.jumping = false;
    gameOver = false;
    paused = false;
    loop.reset();
    loop.start();
}

function quitToMenu() {
    gameStarted = false;
    paused = false;
    gameOver = false;
    obstacles.obstacles = [];
    capybara.y = 410;
    capybara.dy = 0;
    capybara.jumping = false;
    requestAnimationFrame(main);
}

function main() {
    if (!gameStarted) {
        drawWelcomeScreen();
        requestAnimationFrame(main);
    } else {
        loop.start();
    }
}

main();
