import { Capybara } from "@/entities/Capybara";
import { type Obstacle } from "@/entities/Obstacles";

export function checkCollision(
    capybara: Capybara,
    obstacles: Obstacle[]
): boolean {
    const capyCenterX = capybara.x + capybara.width / 2;
    const capyCenterY = capybara.y + capybara.height / 2;
    const capyRadius = capybara.width / 2.5;

    for (let o of obstacles) {
        const rockCenterX = o.x + o.width / 2;
        const rockCenterY = o.y + o.height / 2;
        const rockRadius = o.width / 2.5;

        const dx = capyCenterX - rockCenterX;
        const dy = capyCenterY - rockCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < capyRadius + rockRadius) return true;
    }
    return false;
}
