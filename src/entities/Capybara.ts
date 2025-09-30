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

    frames = [
        { x: 0, y: 0, w: 60, h: 48 },
        { x: 60, y: 0, w: 60, h: 48 },
        { x: 0, y: 48, w: 60, h: 48 },
    ];
    frameIndex = 0;
    frameTick = 0;
    frameDelay = 8;

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
        const frame = this.jumping ? this.frames[1] : this.frames[this.frameIndex];

        if (!this.jumping) {
            this.frameTick++;
            if (this.frameTick >= this.frameDelay) {
                this.frameIndex = (this.frameIndex + 1) % (this.frames.length - 1);
                this.frameTick = 0;
            }
        }

        ctx.drawImage(
            capybaraImg,
            frame!.x,
            frame!.y,
            frame!.w,
            frame!.h,
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
        this.frameIndex = 0;
        this.frameTick = 0;
    }
}
