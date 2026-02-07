import type { Point } from "./types";

const CANVAS_ID = "#drawArea";
let canvas = document.querySelector(CANVAS_ID) as HTMLCanvasElement;
let ctx = canvas.getContext("2d");

const PIXEL_WIDTH = 20;
const PIXEL_HEIGHT = 20;
const PIXEL_AREA = PIXEL_WIDTH * PIXEL_HEIGHT;
const CANVAS_AREA = canvas.width * canvas.height;

const NUM_PIXELS = CANVAS_AREA / PIXEL_AREA;

const NUM_PIXELS_X = canvas.width / PIXEL_WIDTH;
const NUM_PIXELS_Y = canvas.height / PIXEL_HEIGHT;

console.info(`canvas width: ${canvas.width}, canvas height: ${canvas.height}`);
console.info(`pixel width: ${PIXEL_WIDTH}, pixel height: ${PIXEL_HEIGHT}`);
console.info(`total number of pixels: ${NUM_PIXELS}`);

function drawAGrid(ctx: CanvasRenderingContext2D | null) {
    if(ctx == null) {
        console.error(`couldn't set context of canvas ${CANVAS_ID}`);
        return;
    }
    let position = {x: 0, y: 0};

    for(let i = 0; i < NUM_PIXELS; ++i) {
        drawRectangle(ctx, position);
        position = forwardPosition(position);
    }

}

function forwardPosition(pt: Point): Point {
    let next_x = pt.x + PIXEL_WIDTH;
    let underflow = next_x < canvas.width;

    let new_point = {
        x:  underflow? next_x: 0,
        y:  underflow? pt.y: pt.y + PIXEL_HEIGHT
    } 

    console.debug(`forwarding position from (${pt.x}, ${pt.y}) -> (${new_point.x}, ${new_point.y})`);
    return new_point;
}

function drawRectangle(ctx: CanvasRenderingContext2D, pt: Point) {
    ctx.strokeStyle = "black";
    ctx.beginPath(); 
    ctx.rect(pt.x, pt.y, PIXEL_WIDTH, PIXEL_HEIGHT); 
    ctx.stroke(); 
    console.debug(`drew a rectangle at ${pt.x} and ${pt.y}`);
}

drawAGrid(ctx);


class Pixel {
    
}

class Grid {
    
}


