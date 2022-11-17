import { toBePartiallyChecked } from "@testing-library/jest-dom/dist/matchers"

export class MoveType {
    constructor(dr, dc) {
        this.deltar = dr;
        this.deltac = dc;
    }
}
export const Down = new MoveType(1, 0);
export const Up = new MoveType(-1, 0);
export const Left = new MoveType(0, -1);
export const Right = new MoveType(0, 1);
export const NoMove = new MoveType(0, 0);  // no move is possible


export class Coordinate {
    constructor(row, column) {
        this.row = row;
        this.column = column;
    }
}


export class NinjaSe {
    constructor(r, c){
        this.key = null
        this.row = r
        this.column = c
        this.key = null
    }

    move(direction) {
        this.row += direction.deltar;
        this.column += direction.deltac;
        if(this.key != null){
            this.key.row += direction.deltar;
            this.key.column += direction.deltac;
        }
    }

    location(){
        return new Coordinate(this.row, this.column);
    }

    setKey(key){
        if (this.key != null){
            this.key = null
        }
        this.key = key
    }
}


export class Key {
    constructor(r, c, color){
        this.row = r
        this.column = c
        this.color = color
    }
}

export class Cell {
    constructor(r, c) {
        this.row = r
        this.column = c
        this.color = "white"
        this.wall = false
        this.door = false
        this.key = null
    }

    isCovered() {
        if (this.door==false && this.wall==false){
            return false;
        }
        else{
            return true;
        }
    }
}

export class Puzzle {
    constructor(nr, nc, level) {
        this.nr = nr
        this.nc = nc

        //creating ninja-se
        this.ninja = new NinjaSe(level.ninjase.row, level.ninjase.column)

        // this is where you would create the nr x nc Cell objects that you need.
        // OPTION 1: Create what looks like a 2D array this.cells[R][C]
        this.cells = []
        for (let r = 0; r < nr; r++) { 
            this.cells[r] = []; 
            for (let c = 0; c < nc; c++) {
                this.cells[r][c] = new Cell(r, c)
            }
        }
        
        //setting cells as walls
        for(let w of level.walls){
            let r = w.row
            let c = w.column

            this.cells[r][c].wall = true
            this.cells[r][c].color = "black"
        }
        //setting cells as doors
        for(let d of level.doors){
            let doorColor = d.color
            let r = d.row
            let c = d.column

            this.cells[r][c].door = true
            this.cells[r][c].color = doorColor
        }
        //setting keys in each cell
        for(let k of level.keys){
            let keyColor = k.color
            let r = k.row
            let c = k.column

            this.cells[r][c].key = new Key(r, c, keyColor)
        }
    }

    availableMoves() {
        
        let moves = [];
        let coord = this.ninja.location();
        let ninjasKey = this.ninja.key;

        //if ninja is standing on door, unlock door and delete key
        if(this.cells[coord.row][coord.column].door == true){
            this.cells[coord.row][coord.column].door = false
            this.cells[coord.row][coord.column].color = "white"
            this.cells[coord.row][coord.column].key = null
            this.ninja.key.color = "white"
            this.ninja.key = null
        }
        
        // can move left?
        let available = false;
        if (coord.column > 0) {
            available = true;
            let nextCell = this.cells[coord.row][coord.column-1]
            if (nextCell.isCovered()) {
                available = false;
                //check if key can unlock door
                if(ninjasKey != null){
                    if(nextCell.color == ninjasKey.color){
                        available = true;
                    }
                } 
            }
        }
        if (available) {
            moves.push(Left);
        }
        
        // can move right?
        available = false;
        if (coord.column < (this.nc-1)) {
            available = true;
            let nextCell = this.cells[coord.row][coord.column+1]
            if (nextCell.isCovered()) {
                available = false;
                //check if key can unlock door
                if(ninjasKey != null){
                    if(nextCell.color == ninjasKey.color){
                        available = true;
                    }
                } 
            }
        }
        if (available) {
            moves.push(Right);
        }
        
        // can move up?
        available = false;
        if (coord.row > 0) {
            available = true;
            let nextCell = this.cells[coord.row-1][coord.column]
            if (nextCell.isCovered()) {
                available = false;
                //check if key can unlock door
                if(ninjasKey != null){
                    if(nextCell.color == ninjasKey.color){
                        available = true;
                    }
                } 
            }
        }
        if (available) {
            moves.push(Up);
        }
        
        // can move down?
        available = false;
        if (coord.row < (this.nr-1)) {
            available = true;
            let nextCell = this.cells[coord.row+1][coord.column]
            if (nextCell.isCovered()) {
                available = false;
                //check if key can unlock door
                if(ninjasKey != null){
                    if(nextCell.color == ninjasKey.color){
                        available = true;
                    }
                } 
            }
        }
        if (available) {
            moves.push(Down);
        }
        
        return moves;
    }

    keyAvailable(){
        let coord = this.ninja.location();
        let available = null
        //check if there is a key that can be picked up
        if(this.cells[coord.row][coord.column].key != null){
            available = this.cells[coord.row][coord.column].key;
        }
        return available;
    }

    isWinner(){
        let winner = true;
        for (let r = 0; r < this.nr; r++) {
            for (let c = 0; c < this.nc; c++) {
                if(this.cells[r][c].door == true){
                    winner = false
                }
            }
        }
        return winner;
    }
    
}

// Model knows the level (you need 3). Knows the Puzzle
export class Model {
    constructor(level) {
        this.level = level
        this.moveCount = 0
        this.victory = false

        let nr = level.rows
        let nc = level.columns
        this.puzzle = new Puzzle(nr, nc, level)
    }

    available(direction) {
        let allMoves = this.puzzle.availableMoves();
        return allMoves.includes(direction);
    }

    keyAvailable() {
        return this.puzzle.keyAvailable();
    }

    isVictorious() {
        return this.victory;
    }

}
