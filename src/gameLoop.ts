import { ctx, canvas } from "@/core/canvas";
import { Capybara } from "@/entities/Capybara";
import { ObstacleManager } from "@/entities/Obstacles";
import { SPAWN_INTERVAL } from "@/core/constants";
import { checkCollision } from "@/utils/collision";
import { drawGameOver } from "@/scenes/GameOverScene";
import { backgroundImg } from "@/assets";
import { drawPauseScreen } from "@/scenes/PauseScene";

export function createGameLoop(
    capybara: Capybara,
    obstacles: ObstacleManager,
    isPaused: () => boolean,
    setGameOver: (val: boolean) => void
) {
    let frame = 0;
    let score = 0;
    let requestAnimationFrameId: number | null = null;

    const drawBackground = () => {
        if (backgroundImg.complete && backgroundImg.naturalWidth !== 0) {
            ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
        } else {
            ctx.fillStyle = "#A7D9A7";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    };

    const drawHUD = () => {
        ctx.fillStyle = "black";
        ctx.font = "16px Arial";
        ctx.textAlign = "left";
        ctx.fillText(`Score: ${score}`, canvas.width - 120, 24);
    };

    function loop() {
        requestAnimationFrameId = requestAnimationFrame(loop);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground();

        if (isPaused()) {
            capybara.draw();
            obstacles.draw();
            drawHUD();
            drawPauseScreen();
            return;
        }

        capybara.update();
        capybara.draw();

        if (frame % SPAWN_INTERVAL === 0) obstacles.spawn(capybara);
        obstacles.update();
        obstacles.draw();

        score++;
        drawHUD();

        if (checkCollision(capybara, obstacles.obstacles)) {
            setGameOver(true);
            drawGameOver();
            if (requestAnimationFrameId !== null) {
                cancelAnimationFrame(requestAnimationFrameId);
                requestAnimationFrameId = null;
            }
            return;
        }

        frame++;
    }

    return {
        start: () => {
            if (requestAnimationFrameId === null) loop();
        },
        stop: () => {
            if (requestAnimationFrameId !== null) {
                cancelAnimationFrame(requestAnimationFrameId);
                requestAnimationFrameId = null;
            }
        },
        reset: () => {
            if (requestAnimationFrameId !== null) {
                cancelAnimationFrame(requestAnimationFrameId);
                requestAnimationFrameId = null;
            }
            frame = 0;
            score = 0;
        },
    };
}
