import { Capybara } from "@/entities/Capybara";
import { ObstacleManager } from "@/entities/Obstacles";
import { drawWelcomeScreen } from "@/scenes/WelcomeScene";
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

const disposeControls = setupControls(
    capybara,
    () => {
        if (gameOver) resetGame();
        gameStarted = true;
        paused = false;
        loop.start();
    },
    resetGame,
    () => {
        if (!gameOver) {
            paused = !paused;
            loop.start();
        }
    },
    quitToMenu,
    {
        isStarted: () => gameStarted,
        isPaused: () => paused,
        isOver: () => gameOver,
    }
);

function resetGame() {
    obstacles.reset();
    capybara.reset();
    gameOver = false;
    paused = false;
    loop.reset();
    loop.start();
}

function quitToMenu() {
    gameStarted = false;
    paused = false;
    gameOver = false;
    obstacles.reset();
    capybara.reset();
    loop.stop();
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

if (import.meta.hot) {
    import.meta.hot.dispose(() => {
        disposeControls?.();
        loop.stop();
    });
}
