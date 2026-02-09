import type { Point } from "./types";
import * as constants from "./constants";



class Pixel {
    width: number = 0;
    height: number = 0;
    x: number = 0;
    y: number = 0;

    constructor(pt: Point, width: number, height: number) {
        this.x = pt.x;
        this.y = pt.y;
        this.width = width;
        this.height = height;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = "black";
        ctx.strokeRect(
            this.x ,
            this.y,
            this.width,
            this.height
        );
        console.debug(`filled pixel at (${this.x}, ${this.y})`);
    }

    

}

class Grid {
    pixels: Pixel[] = [];

    constructor() {
    }

    draw(ctx: CanvasRenderingContext2D) {
        let position = {x: 0, y: 0};

        for(let i = 0; i < constants.NUM_PIXELS; ++i) {
            let pixel = new Pixel(position, constants.PIXEL_WIDTH, constants.PIXEL_HEIGHT);
            pixel.draw(ctx);
            this.pixels.push(pixel);
            position = this.forwardPosition(position);
        }

    }

    forwardPosition(pt: Point): Point {
        let next_x = pt.x + constants.PIXEL_WIDTH;
        let underflow = next_x < constants.canvas.width;

        let new_point = {
            x:  underflow? next_x: 0,
            y:  underflow? pt.y: pt.y + constants.PIXEL_HEIGHT
        } 

        console.debug(`forwarding position from (${pt.x}, ${pt.y}) -> (${new_point.x}, ${new_point.y})`);
        return new_point;
    }

    click(pt: Point) {

    }

}


class Editor {
    grid: Grid;
    
    constructor() {
        this.grid = new Grid();
    }

    setupEvents() {

    }

    start() {
        this.setupEvents();
        this.grid.draw(constants.ctx);
    }

}


export { Editor };
