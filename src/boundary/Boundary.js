// redraw the Puzzle so I can see it

// Scaling Constants for Canvas
var BOXSIZE = 100;
var KEYSIZE = 30;
const OFFSET = 8;

/** Represents a rectangle. */
export class Square {
    constructor(x, y, size, color) {
      this.x = x
      this.y = y
      this.size = size
    }
}

export function computeSquare(cell) {
    return new Square(BOXSIZE*cell.column + OFFSET, BOXSIZE*cell.row + OFFSET, BOXSIZE - 2*OFFSET, BOXSIZE-2*OFFSET)
}


/** Redraw entire canvas from model. */
export function redrawCanvas(model, canvasObj) {
    const ctx = canvasObj.getContext('2d');
    ctx.clearRect( 0,0, canvasObj.width, canvasObj.height);  
    
    // showing the outermost information
    let nr = model.puzzle.nr
    let nc = model.puzzle.nc

    ctx.fillStyle = 'black'

    for (let r = 0; r < nr; r++) {
        for (let c = 0; c < nc; c++) {
            let cell = model.puzzle.cells[r][c]
            let sq = computeSquare(cell)

            // HERE is where you draw everything about this cell that you know about...
            ctx.beginPath()
            ctx.rect(sq.x, sq.y, sq.size, sq.size)

            if (cell.wall) {
                ctx.fillStyle = 'black'
                ctx.fillRect(sq.x, sq.y, sq.size, sq.size)
            }

            if(cell.door){
                ctx.fillStyle = "black"
                ctx.fillRect(sq.x, sq.y, sq.size, sq.size)
                ctx.fillStyle = cell.color
                ctx.fillRect(sq.x+10, sq.y+10, sq.size-20, sq.size-20)
                ctx.fillStyle = "white"
                ctx.fillRect(sq.x+25, sq.y+25, KEYSIZE, KEYSIZE)
            }

            if(cell.key != null){
                let k = computeSquare(cell.key)

                ctx.fillStyle = cell.key.color
                ctx.fillRect(k.x+25, k.y+25, KEYSIZE, KEYSIZE)
            }

            ctx.stroke()
        }
    }

    //draw ninja-se
    let ninja = model.puzzle.ninja
    let sq = computeSquare(ninja)
    ctx.beginPath()
    ctx.rect(sq.x, sq.y, sq.size, sq.size)
    ctx.fillStyle = 'purple'
    ctx.fillRect(sq.x+10, sq.y+10, sq.size-20, sq.size-20)
    //draw ninja-se key  
    if(ninja.key != null){
        let key = ninja.key
        ctx.fillStyle = key.color
        ctx.fillRect(sq.x+15, sq.y+15, KEYSIZE, KEYSIZE)
    }

}