import { Capybara } from "@/entities/Capybara";

export interface GameState {
    isStarted: () => boolean;
    isPaused: () => boolean;
    isOver: () => boolean;
}

export function setupControls(
    capybara: Capybara,
    start: () => void,
    reset: () => void,
    pause: () => void,
    quit: () => void,
    state: GameState
) {
    const onKeyDown = (e: KeyboardEvent) => {
        const key = e.key.toLowerCase();

        if (e.code === "Space") {
            if (state.isStarted() && !state.isPaused() && !state.isOver()) {
                e.preventDefault();
                capybara.jump();
            }
            return;
        }

        if (e.code === "Enter") {
            e.preventDefault();
            if (!state.isStarted()) {
                start();
            } else if (state.isOver()) {
                reset();
            } else if (state.isPaused()) {
                pause();
            }
            return;
        }

        if (e.code === "Escape") {
            if (state.isStarted() && !state.isOver()) {
                e.preventDefault();
                pause();
            }
            return;
        }

        if (key === "q") {
            if (state.isPaused() || state.isOver()) {
                e.preventDefault();
                quit();
            }
        }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
}
