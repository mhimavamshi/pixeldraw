import { Grid, Tool } from "./classes";

type Point = {
    x: number,
    y: number,
}

// also i know its circular imports, but i dont know why i want to seperate types and classes
type GridInput = {
    grid: Grid, 
    event: Event 
}


interface ToolType {
    description: string;
    name: string;
    register(registry: Record<string, ToolType>): void;
    effect(grid: Grid): void;
}

interface GridToolType extends ToolType {
    pointerDown?(gridInput: GridInput): void,
    pointerUp?(gridInput: GridInput): void,
    pointerCancel?(gridInput: GridInput): void,
    pointerMove(gridInput: GridInput): void,
}

type ToolRegistry = Record<string, GridToolType | ToolType>;

export { Point, GridInput, ToolRegistry, ToolType, GridToolType };
