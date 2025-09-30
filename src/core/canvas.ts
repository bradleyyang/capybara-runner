const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

canvas.width = 900;
canvas.height = 525;

export { canvas, ctx };
