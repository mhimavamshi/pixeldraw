import { Grid } from "./classes";

type Point = {
    x: number,
    y: number,
}

// also i know its circular imports, but i dont know why i want to seperate types and classes
type GridInput = {
    grid: Grid, 
    metadata: Record<string, any> // weak for now
}


export { Point, GridInput };
