import { ctx, canvas } from "@/core/canvas";
import { homescreenImg } from "@/assets";

export function drawWelcomeScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (homescreenImg.complete && homescreenImg.naturalWidth !== 0) {
        ctx.drawImage(homescreenImg, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = "#A7D9A7";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.fillStyle = "#001F3F";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Capybara Runner", canvas.width / 2, canvas.height / 2 - 40);

    ctx.font = "20px Arial";
    ctx.fillStyle = "#001F3F";
    ctx.fillText(
        "Press Enter to Start",
        canvas.width / 2,
        canvas.height / 2 + 20
    );
    ctx.fillText(
        "Press Esc to Pause",
        canvas.width / 2,
        canvas.height / 2 + 50
    );
}
