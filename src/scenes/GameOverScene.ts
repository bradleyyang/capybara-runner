import { ctx, canvas } from "@/core/canvas";

export function drawGameOver() {
    ctx.fillStyle = "black";
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, 100);

    ctx.font = "20px Arial";
    ctx.fillText("Press Enter to Restart", canvas.width / 2, 160);
    ctx.fillText("Press Q to Quit", canvas.width / 2, 200);
}
