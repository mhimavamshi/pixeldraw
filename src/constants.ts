const CANVAS_ID = "#drawArea";

type CanvasBundle = {
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
}

function getCanvasBundle(): CanvasBundle {
    let canvas = document.querySelector(CANVAS_ID) as (HTMLCanvasElement | null); 
    if (canvas == null) { 
        throw new Error(`coudln't load ${CANVAS_ID} as canvas`);
    }
    let ctx = canvas.getContext("2d");
    if (ctx == null) { 
        throw new Error(`coudln't load 2d context from ${CANVAS_ID} canvas`);
    }
    return {
        canvas: canvas,
        ctx: ctx
    }
}

const {canvas, ctx} = getCanvasBundle();

const PIXEL_WIDTH = 20;
const PIXEL_HEIGHT = 20;
const PIXEL_AREA = PIXEL_WIDTH * PIXEL_HEIGHT;
const CANVAS_AREA = canvas.width * canvas.height;

const NUM_PIXELS = CANVAS_AREA / PIXEL_AREA; // make it divisible

const NUM_PIXELS_X = canvas.width / PIXEL_WIDTH;
const NUM_PIXELS_Y = canvas.height / PIXEL_HEIGHT;

console.info(`canvas width: ${canvas.width}, canvas height: ${canvas.height}`);
console.info(`pixel width: ${PIXEL_WIDTH}, pixel height: ${PIXEL_HEIGHT}`);
console.info(`total number of pixels: ${NUM_PIXELS}`);

export { CANVAS_ID, NUM_PIXELS, PIXEL_WIDTH, PIXEL_HEIGHT, canvas, ctx };