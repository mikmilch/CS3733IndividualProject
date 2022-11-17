import React from 'react';
import { level1, level2, level3 } from './model/Levels.js'
import { redrawCanvas} from './boundary/Boundary.js'
import { Model } from './model/Model.js'
import { Up, Down, Left, Right } from './model/Model.js';
import {movePiece, pickUpKey} from './controller/Controller.js';

// you might try this quick and dirty way to position buttons where you want (and other elements)
const upbutton = {
  position: "absolute",
  left: 530,
  top: 80,
}
const downbutton = {
  position: "absolute",
  left: 530,
  top: 160,
}
const leftbutton = {
  position: "absolute",
  left: 500,
  top: 120,
}
const rightbutton = {
  position: "absolute",
  left: 560,
  top: 120,
}
const pickupkeybutton = {
  position: "absolute",
  left: 630,
  top: 120,
}


const resetbutton = {
  position: "absolute",
  left: 700,
  top: 10,
}


//LEVELS
const levelbutton = {
  position: "absolute",
  left: 530,
  top: 10,
}
const levelone = {
  position: "absolute",
  left: 585,
  top: 10,
}
const leveltwo = {
  position: "absolute",
  left: 610,
  top: 10,
}
const levelthree = {
  position: "absolute",
  left: 635,
  top: 10,
}

const movesLabel = {
  position: "absolute",
  left:500,
  top:50,
  color:"black",
  width:150,
}

const victoryLabel = { 
  position: "absolute",
  left:200,
  top:200,
  color:"black",
  width:400,
  fontSize: "xx-large",
}



function App() {
  const [model, setModel] = React.useState(new Model(level1));
  const [redraw, forceRedraw] = React.useState(0);       // used to conveniently request redraw after model change
  const canvasRef = React.useRef(null);   // need to be able to refer to Canvas

  /** Ensures initial rendering is performed, and that whenever model changes, it is re-rendered. */
  React.useEffect (() => {

    redrawCanvas(model, canvasRef.current)
  }, [model, redraw])   // arguments that determine when to refresh


  const movePieceHandler = (direction) => {
    movePiece(model, direction);
    forceRedraw(redraw+1)   // react to changes, if model has changed.
  }

  const pickUpKeyHandler = () => {
    pickUpKey(model);
    forceRedraw(redraw+1)   // react to changes, if model has changed.
  }

  const changeLevelHandler = (lev) => {
    setModel(new Model(lev))
  }
  

  return (
    <main>
      <canvas tabIndex="1"  
        className="App-canvas"
        ref={canvasRef}
        width  = "800"
        height = "800" />
      
      
      {/* Using '?' construct is proper React way to make image visible only when victorious. */}  
      { model.isVictorious() ? (<label style={victoryLabel}>You've Won!</label>) : null }
      
      <label style={movesLabel}>{"number moves: " + model.moveCount}</label>
      
      <button style={upbutton}    onClick={(e) => movePieceHandler(Up)} disabled={!model.available(Up)}       >^</button>
      <button style={downbutton}  onClick={(e) => movePieceHandler(Down)} disabled={!model.available(Down)}   >v</button>
      <button style={leftbutton}  onClick={(e) => movePieceHandler(Left)} disabled={!model.available(Left)}   >&lt;</button>
      <button style={rightbutton} onClick={(e) => movePieceHandler(Right)} disabled={!model.available(Right)} >&gt;</button>
      
      <button style={pickupkeybutton} onClick={(e) => pickUpKeyHandler()} disabled={model.keyAvailable() == null}   >pick up key</button> 

      <button style={resetbutton} onClick={(e) => changeLevelHandler(model.level)}  >reset</button>

      <button style={levelbutton}>levels</button>
      <button style={levelone}  onClick={(e) => changeLevelHandler(level1)}  >1</button>
      <button style={leveltwo}  onClick={(e) => changeLevelHandler(level2)} >2</button>
      <button style={levelthree} onClick={(e) => changeLevelHandler(level3)}   >3</button>
    </main>
  );
}

export default App;