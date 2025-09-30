import { ctx, canvas } from "@/core/canvas";

export function drawGameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "36px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 40);

    ctx.font = "20px Arial";
    ctx.fillText(
        "Press Enter to Restart",
        canvas.width / 2,
        canvas.height / 2 + 10
    );
    ctx.fillText("Press Q to Quit", canvas.width / 2, canvas.height / 2 + 50);
}
