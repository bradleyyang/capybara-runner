import { GROUND_Y, GRAVITY, JUMP_STRENGTH } from "@/core/constants";
import { ctx } from "@/core/canvas";
import { capybaraImg } from "@/assets";

export class Capybara {
    x = 50;
    y = GROUND_Y;
    width = 60;
    height = 48;
    dy = 0;
    jumping = false;

    private runFrame = { x: 0, y: 0, w: 60, h: 48 };
    private jumpFrame = { x: 60, y: 0, w: 60, h: 48 };

    update() {
        this.y += this.dy;

        if (this.y < GROUND_Y || this.dy < 0) {
            this.dy += GRAVITY;
        }

        if (this.y >= GROUND_Y) {
            this.y = GROUND_Y;
            this.dy = 0;
            this.jumping = false;
        }
    }

    jump() {
        if (!this.jumping && this.y >= GROUND_Y) {
            this.dy = JUMP_STRENGTH;
            this.jumping = true;
        }
    }

    draw() {
        const frame = this.jumping ? this.jumpFrame : this.runFrame;

        ctx.drawImage(
            capybaraImg,
            frame.x,
            frame.y,
            frame.w,
            frame.h,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }

    reset() {
        this.y = GROUND_Y;
        this.dy = 0;
        this.jumping = false;
    }
}
