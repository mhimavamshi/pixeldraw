import type { Point, GridInput } from "./types";
import * as constants from "./constants";



class Pixel {
    width: number;
    height: number;
    x: number;
    y: number;
    empty: boolean;

    constructor(pt: Point, width: number, height: number) {
        this.x = pt.x;
        this.y = pt.y;
        this.width = width;
        this.height = height;
        this.empty = true;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = "black";
        ctx.lineWidth = 0.2; 
        ctx.strokeRect(
            this.x ,
            this.y,
            this.width,
            this.height
        );
        console.debug(`filled pixel at (${this.x}, ${this.y})`);
    }

    fill(ctx: CanvasRenderingContext2D, color: string = "black") {
        ctx.fillStyle = color; 
        ctx.fillRect(this.x, this.y, this.width, this.height);
        this.empty = false;
    }
    
    erase(ctx: CanvasRenderingContext2D) {
        if(!this.empty) {
            ctx.clearRect(this.x, this.y, this.width, this.height);
        }
    }

}

class Grid {
    pixels: Pixel[] = [];
    color: string; 
    // manage history of diffs

    constructor() {
        this.color = "black";
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
        let whichX = Math.floor(pt.x / constants.PIXEL_WIDTH);
        let whichY = Math.floor(pt.y / constants.PIXEL_HEIGHT);
        let index = (whichY * constants.NUM_PIXELS_Y) + whichX;
        console.debug(`whichX = ${whichX}, whichY = ${whichY}, index = ${index}`);

        let pixel = this.pixels[index];
        pixel.fill(constants.ctx, this.color);
    }

}


abstract class Tool {
    description: string;
    name: string;
    // im thinking, should we dispatch events and each tool attaches their own event listeners
    // or should it be, like now, editor manages each events and calls tools (maybe a generic function in future)

    constructor() {
        this.name = "Primitive";
        this.description = "A Generic Tool";
    }

    register(registry: Record<string, Tool>) {
        if(this.name in registry) {
            console.debug(`tool already exists, overriding: ${this.name}, ${this.description} `);
        }
        registry[this.name] = this;
    }

    abstract effect(gridInput: GridInput): void;

}

class Eraser extends Tool {

    constructor() {
        super();
        this.name = "Eraser";
        this.description = "Eraser Tool";
    }

    effect(grid: GridInput): void {
        // TODO: need some tool state management
    }

}

class ColorPicker extends Tool {
    
    pick: string;

    constructor() {
        super();
        this.name = "Color Picker";
        this.description = "Color Picking Tool";
        this.pick = "#000000";
    }

    effect(gridInput: GridInput) {
        this.pick = gridInput.metadata["color"];
        gridInput.grid.color = this.pick;
    }

}

class Editor {
    grid: Grid;
    tools: Record<string, Tool>;
    drawing: boolean;
    
    constructor() {
        this.grid = new Grid();
        this.tools = {};
        this.drawing = false; // for tracking moving mouse 
    }

    // this is just a tool effect, i just kept it before tool to check if pixel will be filled! move to a tool
    handleMouseClick(event: PointerEvent) {
        const rect = constants.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        console.log("Click coordinates: X=" + x + ", Y=" + y);

        this.grid.click({x: x, y: y});
    }

    handleColorChange(event: Event) {
        let colorpicker = this.tools["Color Picker"] as ColorPicker;
        let colorInput = event.target as HTMLInputElement;
        // it would be cool if some method of colorpicker that returns a list of what to call or takes super set of all arguments
        // and sets up everything before calling effect so i dont have to do setColor or some other functions before calling effect
        colorpicker.effect({grid: this.grid, metadata: {"color": colorInput.value}});
    }

    setupEvents() {
        constants.canvas.addEventListener('click', (event: PointerEvent)=>{
            this.handleMouseClick(event);
        }, false);

        constants.colorPicker.addEventListener("change", (event: Event)=>{
            this.handleColorChange(event);
        }, false);

        // we also need to keep track of which tools are enabled or disabled, i.e. state of each tool
        // and consider it before applying effects to grid.

        constants.canvas.addEventListener("pointerdown", (event: PointerEvent)=>{
            if (event.button !== 0) return; 
            this.drawing = true;

            constants.canvas.setPointerCapture(event.pointerId);

            this.handleMouseClick(event);
        });

        constants.canvas.addEventListener("pointermove", (event: PointerEvent) => {
            if (!this.drawing) return;
            this.handleMouseClick(event);
        });

        constants.canvas.addEventListener("pointerup", (event: PointerEvent) => {
            if (event.button !== 0) return;
            this.drawing = false;
            constants.canvas.releasePointerCapture(event.pointerId);
        });

        constants.canvas.addEventListener("pointercancel", () => {
            this.drawing = false;
        });

    }

    setupTools() {
        // if i could iterate over all children of tools and call register it'll be cool, no registering each
        let colorpicker = new ColorPicker();
        colorpicker.register(this.tools);
        let eraser = new Eraser();
        eraser.register(this.tools);
    }

    undo() {

    }

    redo() {

    }

    start() {
        this.setupTools();
        this.setupEvents();
        this.grid.draw(constants.ctx);
    }

}


export { Editor, Grid };
