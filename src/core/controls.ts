import { Capybara } from "@/entities/Capybara";

export function setupControls(
    capybara: Capybara,
    start: () => void,
    reset: () => void,
    pause: () => void,
    quit: () => void
) {
    document.addEventListener("keydown", (e) => {
        if (e.code === "Space") {
            e.preventDefault();
            capybara.jump();
        }
        if (e.code === "Enter") start();
        if (e.code === "Escape") pause();
        if (e.key.toLowerCase() === "q") quit();
    });
}
