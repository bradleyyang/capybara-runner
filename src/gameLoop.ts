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
  let rafId: number | null = null;

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

  const tick = () => {
    rafId = requestAnimationFrame(tick);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();

    if (isPaused()) {
      capybara.draw();
      obstacles.draw();
      drawHUD();
      drawPauseScreen();              
      return;
    }

    if (frame % SPAWN_INTERVAL === 0) obstacles.spawn(capybara);
    capybara.update();
    obstacles.update();

    if (checkCollision(capybara, obstacles.obstacles)) {
      setGameOver(true);
      drawGameOver();
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      return;
    }

    obstacles.draw();
    capybara.draw();

    score++;
    drawHUD();
    frame++;
  };

  const start = () => {
    if (rafId === null) {
      rafId = requestAnimationFrame(tick);
    }
  };

  const stop = () => {                 
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  const reset = () => {                
    stop();
    frame = 0;
    score = 0;
  };

  return { start, stop, reset };
}
