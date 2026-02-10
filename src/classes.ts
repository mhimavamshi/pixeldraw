import type { Point, GridInput, ToolRegistry, ToolType, GridToolType } from "./types";
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
            this.empty = true;
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
        let index = (whichY * constants.NUM_PIXELS_X) + whichX;
        console.debug(`whichX = ${whichX}, whichY = ${whichY}, index = ${index}`);

        let pixel = this.pixels[index];
        if(!pixel) return;
        pixel.fill(constants.ctx, this.color);
    }

    clear(pt: Point) {
        let whichX = Math.floor(pt.x / constants.PIXEL_WIDTH);
        let whichY = Math.floor(pt.y / constants.PIXEL_HEIGHT);
        let index = (whichY * constants.NUM_PIXELS_X) + whichX;
        console.debug(`whichX = ${whichX}, whichY = ${whichY}, index = ${index}`);

        let pixel = this.pixels[index];
        if(!pixel) return;
        pixel.erase(constants.ctx);
    }

}
abstract class Tool implements ToolType {
    description: string;
    name: string;

    constructor() {
        this.name = "Primitive";
        this.description = "A Generic Tool";
    }

    register(registry: Record<string, ToolType>) {
        if(this.name in registry) {
            console.debug(`tool already exists, overriding: ${this.name}, ${this.description} `);
        }
        registry[this.name] = this;
    }

    abstract effect(grid: Grid): void;

}

abstract class GridTool extends Tool implements GridToolType {
    protected active = false;
    protected lastX = 0;
    protected lastY = 0;

    protected updatePosition(event: PointerEvent) {
        const rect = constants.canvas.getBoundingClientRect();
        this.lastX = event.clientX - rect.left;
        this.lastY = event.clientY - rect.top;
    }

    pointerDown({ event, grid }: GridInput) {
        const e = event as PointerEvent;
        if (e.button !== 0) return;
        this.active = true;
        constants.canvas.setPointerCapture(e.pointerId);
        this.pointerMove?.({ event: e, grid: grid });
    }

    pointerUp({ event }: GridInput) {
        const e = event as PointerEvent;
        this.active = false;
        constants.canvas.releasePointerCapture(e.pointerId);
    }

    pointerCancel() {
        this.active = false;
    }

    pointerMove({ event, grid }: GridInput) {
        if (!this.active) return;
        this.updatePosition(event as PointerEvent);
        this.effect(grid);
    }
}

class Pen extends GridTool {
    constructor() {
        super();
        this.name = "Pen";
        this.description = "Pen Tool";
    }

    effect(grid: Grid) {
        grid.click({ x: this.lastX, y: this.lastY });
    }
}

class Eraser extends GridTool {
    constructor() {
        super();
        this.name = "Eraser";
        this.description = "Eraser Tool";
    }

    effect(grid: Grid) {
        grid.clear({ x: this.lastX, y: this.lastY });
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

    effect(grid: Grid) {
        grid.color = this.pick;
    }

    pickColor(gridInput: GridInput) {
        let colorInput = gridInput.event.target as HTMLInputElement;
        this.pick = colorInput.value;
        this.effect(gridInput.grid);
    }

}

class Editor {
    grid: Grid;
    toolManager: ToolManager;
    
    constructor() {
        this.grid = new Grid();
        this.toolManager = new ToolManager(this.grid);
    }

    start() {
        this.grid.draw(constants.ctx);
    }

}


class ToolManager {

    registry: ToolRegistry;
    activeTool: GridToolType | null;
    activeToolUIElement: HTMLInputElement | null;
    grid: Grid;

    constructor(grid: Grid) {
        this.registry = {};
        this.setupTools();
        this.setupEvents();
        this.activeTool = null;
        this.activeToolUIElement = null;
        this.grid = grid;
    }

    handlePointerCancel(event: PointerEvent) {
        let tool = this.activeTool;
        if(tool === null) {
            return;
        }
        tool.pointerCancel?.({grid: this.grid, event: event});
    }

    handlePointerDown(event: PointerEvent) {
        let tool = this.activeTool;
        if(tool === null) {
            return;
        }
        tool.pointerDown?.({grid: this.grid, event: event});
    }

    handlePointerMove(event: PointerEvent) {
        let tool = this.activeTool;
        if(tool === null) {
            return;
        }
        tool.pointerMove({grid: this.grid, event: event});
    }

    handleColorChange(event: Event) {
        let tool = this.registry["Color Picker"] as ColorPicker;
        tool.pickColor({grid: this.grid, event: event});
    }

    handlePointerUp(event: PointerEvent) {
        let tool = this.activeTool;
        if(tool === null) {
            return;
        }
        tool.pointerUp?.({grid: this.grid, event: event});
    }

    handleToolClick(event: Event, tool: string) {
        this.activeToolUIElement?.classList.remove("active");
        if (this.activeTool?.name == tool) {
            this.activeTool = null;
            this.activeToolUIElement = null;
            console.info(`active tool change: tool = ${tool} , element = ${this.activeToolUIElement}`);
            console.info(`same tool clicked! deactivating`);
            return;
        }
        this.activeTool = this.registry[tool] as GridToolType;
        let target = event.currentTarget as HTMLInputElement;
        this.activeToolUIElement = target; 
        this.activeToolUIElement.classList.add("active");
        console.info(`active tool change: tool = ${tool} , element = ${this.activeToolUIElement}`)
    }

    setupEvents() {
        
        // UI events
        constants.colorPicker.addEventListener("change", (event: Event)=>{
            this.handleColorChange(event);
        }, false);

        constants.penTool.addEventListener("click", (event: Event)=>{
            this.handleToolClick(event, "Pen");
        })
        constants.eraserTool.addEventListener("click", (event: Event)=>{
            this.handleToolClick(event, "Eraser");
        })
        
        // canvas events
        constants.canvas.addEventListener("pointerdown", (event: PointerEvent)=>{
            this.handlePointerDown(event);
        });

        constants.canvas.addEventListener("pointermove", (event: PointerEvent) => {
            this.handlePointerMove(event);
        });

        constants.canvas.addEventListener("pointerup", (event: PointerEvent) => {
            this.handlePointerUp(event);
        });

        constants.canvas.addEventListener("pointercancel", (event) => {
            this.handlePointerCancel(event);
        });


    }

    handleUndo() {
        
    }

    handleRedo() {

    }

    setupTools() {
        let colorpicker = new ColorPicker();
        colorpicker.register(this.registry);
        let eraser = new Eraser();
        eraser.register(this.registry);
        let pen = new Pen();
        pen.register(this.registry);
    }


}


export { Editor, Grid, Tool };
