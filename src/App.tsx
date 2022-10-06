import { useState, useEffect } from "react";
import "./App.css";

//@ts-ignore
import Chessground from "@react-chess/chessground";
import { Chess } from "chess.js";

// these styles must be imported somewhere
import "chessground/assets/chessground.base.css";
import "chessground/assets/chessground.brown.css";
import "chessground/assets/chessground.cburnett.css";
import { move } from "chessground/drag";

function App() {
    const chess = new Chess();

    const [fenState, setFen] = useState(chess.fen());

    const [legal_moves, set_legal_moves] = useState<any>();

    const handleMove = (orig: string, dest: string, capturedPiece: any) => {
        chess.move(dest);
        const fen = chess.fen();
        console.log(fen);
        setFen(fen);
    };

    const findLegalMoves = (sq: any) => {
        const allMoves = chess.moves();
        console.log(allMoves);
        const verboseMoves: Array<any> = chess.moves({
            square: sq,
            verbose: true,
        });
        console.log(verboseMoves);
        const moves: Array<string> = [];
        verboseMoves.forEach((move) => moves.push(move.to));
        const moveObj = new Map();
        moveObj.set(sq, moves);
        console.log(moveObj);
        set_legal_moves(moveObj);
    };

    return (
        <div className="App">
            <div className="chess-container">
                <Chessground
                    height={750}
                    width={750}
                    config={{
                        fen: fenState,
                        movable: {
                            free: false,
                            dests: legal_moves,
                            showDests: true,
                            events: {
                                after: (
                                    orig: string,
                                    dest: string,
                                    capturedPiece: any
                                ) => {
                                    handleMove(orig, dest, capturedPiece);
                                },
                            },
                        },
                        selectable: {
                            enabled: false,
                        },
                        events: {
                            select: (key: any) => {
                                if (chess.moves({ square: key }).length) {
                                    findLegalMoves(key);
                                }
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
}

export default App;
