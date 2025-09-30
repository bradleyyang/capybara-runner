import { ctx, canvas } from "@/core/canvas";
import { GROUND_Y, OBSTACLE_SPEED } from "@/core/constants";
import { rocks } from "@/assets";
import { Capybara } from "./Capybara";

export interface Obstacle {
    x: number;
    y: number;
    width: number;
    height: number;
    img: HTMLImageElement;
}

export class ObstacleManager {
    obstacles: Obstacle[] = [];

    spawn(capybara: Capybara) {
        const index = Math.floor(Math.random() * rocks.length);
        const rock = rocks[index];
        const size = rock!.width || (index === 0 ? 50 : index === 1 ? 40 : 30);

        this.obstacles.push({
            x: canvas.width,
            y: GROUND_Y + capybara.height - size,
            width: size,
            height: size,
            img: rock!,
        });
    }

    update() {
        this.obstacles.forEach((o) => (o.x -= OBSTACLE_SPEED));
        this.obstacles = this.obstacles.filter((o) => o.x + o.width > 0);
    }

    draw() {
        this.obstacles.forEach((o) =>
            ctx.drawImage(o.img, o.x, o.y, o.width, o.height)
        );
    }
}
