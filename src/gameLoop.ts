import { ctx, canvas } from "@/core/canvas";
import { Capybara } from "@/entities/Capybara";
import { ObstacleManager } from "@/entities/Obstacles";
import { SPAWN_INTERVAL } from "@/core/constants";
import { checkCollision } from "@/utils/collision";
import { drawGameOver } from "@/scenes/GameOverScene";
import { backgroundImg } from "./assets";

let frame = 0;
let score = 0;

export function createGameLoop(
    capybara: Capybara,
    obstacles: ObstacleManager,
    isPaused: () => boolean,
    setGameOver: (val: boolean) => void
) {
    function loop() {
        if (isPaused()) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawBackground();

        capybara.update();
        capybara.draw();

        if (frame % SPAWN_INTERVAL === 0) obstacles.spawn(capybara);
        obstacles.update();
        obstacles.draw();

        score++;
        ctx.fillStyle = "black";
        ctx.font = "16px Arial";
        ctx.fillText(`Score: ${score}`, canvas.width - 100, 20);

        if (checkCollision(capybara, obstacles.obstacles)) {
            setGameOver(true);
            drawGameOver();
            return;
        }

        frame++;
        requestAnimationFrame(loop);
    }

    function drawBackground() {
        ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    }

    return {
        start: () => loop(),
        reset: () => {
            frame = 0;
            score = 0;
        },
    };
}
