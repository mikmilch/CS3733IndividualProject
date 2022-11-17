import { Cell } from "../model/Model";

export function movePiece(model, direction) {
    let ninja = model.puzzle.ninja

    if (model.puzzle.isWinner() == true) {
        model.victory = true;
    } else {
        ninja.move(direction);
        model.moveCount += 1;
    }
}

export function pickUpKey(model) {
    let ninja = model.puzzle.ninja
    let key = model.puzzle.keyAvailable()
    if(model.puzzle.cells[key.row][key.column].door == true){
        model.puzzle.cells[key.row][key.column].key = null
    }
    else{
        model.puzzle.cells[key.row][key.column].key = model.puzzle.ninja.key
    }
    ninja.setKey(key);
    model.moveCount += 1;
}