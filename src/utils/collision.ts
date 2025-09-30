import { Capybara } from "@/entities/Capybara";
import { type Obstacle } from "@/entities/Obstacles";

export function checkCollision(
    capybara: Capybara,
    obstacles: Obstacle[]
): boolean {
    const capyLeft = capybara.x;
    const capyRight = capybara.x + capybara.width;
    const capyTop = capybara.y;
    const capyBottom = capybara.y + capybara.height;

    for (const o of obstacles) {
        const obsLeft = o.x;
        const obsRight = o.x + o.width;
        const obsTop = o.y;
        const obsBottom = o.y + o.height;

        if (o.width <= 0 || o.height <= 0) continue;

        if (
            capyRight > obsLeft &&
            capyLeft < obsRight &&
            capyBottom > obsTop &&
            capyTop < obsBottom
        ) {
            return true;
        }
    }

    return false;
}
