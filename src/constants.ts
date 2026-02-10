const CANVAS_ID = "#drawArea";
const COLOR_PICKER_ID = "#colorPicker";
const PEN_TOOL_ID = "#penTool";
const ERASER_TOOL_ID = "#eraserTool";
const COLOR_SELECTOR_TOOL_ID = "#colorSelectorTool";

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

type ElementInput = {
    id: string,
    description: string
}

function getHTMLElement(input: ElementInput): HTMLInputElement {
    let element = document.querySelector(input.id) as (HTMLInputElement | null);
    if (element == null) {
        throw new Error(`couldn't load ${input.id} as ${input.description}`);
    }
    return element;
}

const colorPicker = getHTMLElement({ id: COLOR_PICKER_ID, description: "colorPicker tool" });
const penTool = getHTMLElement({ id: PEN_TOOL_ID, description: "penTool tool" });
const eraserTool = getHTMLElement({ id: ERASER_TOOL_ID, description: "eraserTool tool" });
const colorSelectorTool = getHTMLElement({ id: COLOR_SELECTOR_TOOL_ID, description: "colorSelectorTool tool" });

const { canvas, ctx } = getCanvasBundle();

const PIXEL_WIDTH = 16;
const PIXEL_HEIGHT = 16;
const PIXEL_AREA = PIXEL_WIDTH * PIXEL_HEIGHT;
const CANVAS_AREA = canvas.width * canvas.height;

const NUM_PIXELS = CANVAS_AREA / PIXEL_AREA; // make it divisible

const NUM_PIXELS_X = canvas.width / PIXEL_WIDTH;
const NUM_PIXELS_Y = canvas.height / PIXEL_HEIGHT;

console.info(`canvas width: ${canvas.width}, canvas height: ${canvas.height}`);
console.info(`pixel width: ${PIXEL_WIDTH}, pixel height: ${PIXEL_HEIGHT}`);
console.info(`total number of pixels: ${NUM_PIXELS}`);

export { CANVAS_ID, NUM_PIXELS, NUM_PIXELS_X, NUM_PIXELS_Y, PIXEL_WIDTH, PIXEL_HEIGHT, canvas, ctx, colorPicker, penTool, eraserTool, colorSelectorTool };