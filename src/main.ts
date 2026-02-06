function log(message: any, level: "info" | "warning" | "error" = "info") {
    console.log(`[${level}] ${message}`);
}

let canvas = document.querySelector("#drawArea") as HTMLCanvasElement;
let ctx = canvas.getContext("2d")!;

function draw() {
    let timeout = 2000;

    ctx.fillStyle = "rgb(200 0 0)";
    ctx.fillRect( (canvas.width / 2) - 25 , (canvas.height / 2) - 50, 50, 50);
    log("RED rectangle")

    ctx.fillStyle = "rgb(255 255 0 / 50%)";
    ctx.fillRect((canvas.width / 2) - 25 , (canvas.height / 2), 50, 50);
    log("YELLOW rectangle")

    ctx.fillStyle = "rgb(0 255 0 / 50%)";
    ctx.fillRect((canvas.width / 2) - 25 , (canvas.height / 2) + 50, 50, 50);
    log("GREEN rectangle")


    setTimeout(()=>{
        clear();
    }, timeout);

}


function clear() {
    let timeout = 1000;

    ctx.clearRect((canvas.width / 2) - 25 , (canvas.height / 2) - 50, 50, 50);
    ctx.clearRect((canvas.width / 2) - 25 , (canvas.height / 2), 50, 50);
    ctx.clearRect((canvas.width / 2) - 25 , (canvas.height / 2) + 50, 50, 50);

    setTimeout(()=>{
        draw();
    }, timeout);

}

draw();
