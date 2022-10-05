import { useState, useEffect } from "react";
import "./App.css";

//@ts-ignore
import Chessground from "@react-chess/chessground";
import { Chess } from "chess.js";

// these styles must be imported somewhere
import "chessground/assets/chessground.base.css";
import "chessground/assets/chessground.brown.css";
import "chessground/assets/chessground.cburnett.css";

function App() {
    const chess = new Chess();

    const [fenState, setFen] = useState(chess.fen());

    const handleMove = (orig: string, dest: string, capturedPiece: any) => {
        chess.move(dest);
        console.log(chess.board());
    };

    const getEval = (fen: string) => {};

    return (
        <div className="App">
            <div className="chess-container">
                <Chessground
                    config={{
                        events: {
                            move: (
                                orig: string,
                                dest: string,
                                capturedPiece: any
                            ) => {
                                handleMove(orig, dest, capturedPiece);
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
}

export default App;
