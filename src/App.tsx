import { useState, useEffect } from "react";
import "./App.css";

//@ts-ignore
import Chessground from "@react-chess/chessground";
import { Chess } from "chess.js";
declare const files: readonly ["a", "b", "c", "d", "e", "f", "g", "h"];
declare const ranks: readonly ["1", "2", "3", "4", "5", "6", "7", "8"];
declare type File = typeof files[number];
declare type Rank = typeof ranks[number];
declare type Key = "a0" | `${File}${Rank}`;
// these styles must be imported somewhere
import "chessground/assets/chessground.base.css";
import "chessground/assets/chessground.brown.css";
import "chessground/assets/chessground.cburnett.css";
import { move } from "chessground/drag";

function App() {
    const game = new Chess();

    const SQUARES = [
        "a1",
        "b1",
        "c1",
        "d1",
        "e1",
        "f1",
        "g1",
        "h1",
        "a2",
        "b2",
        "c2",
        "d2",
        "e2",
        "f2",
        "g2",
        "h2",
        "a3",
        "b3",
        "c3",
        "d3",
        "e3",
        "f3",
        "g3",
        "h3",
        "a4",
        "b4",
        "c4",
        "d4",
        "e4",
        "f4",
        "g4",
        "h4",
        "a5",
        "b5",
        "c5",
        "d5",
        "e5",
        "f5",
        "g5",
        "h5",
        "a6",
        "b6",
        "c6",
        "d6",
        "e6",
        "f6",
        "g6",
        "h6",
        "a7",
        "b7",
        "c7",
        "d7",
        "e7",
        "f7",
        "g7",
        "h7",
        "a8",
        "b8",
        "c8",
        "d8",
        "e8",
        "f8",
        "g8",
        "h8",
    ];

    const [gameState, setGame] = useState<Chess>(game);
    const [turn, setTurn] = useState<"white" | "black">("white");
    const [legal_moves, set_legal_moves] = useState<Map<Key, Key[]>>();
    const [inCheck, check] = useState(false);

    const BoardLogic = {
        updateGame: function (game: Chess) {
            setGame(game);
            check(game.inCheck());
        },

        findLegalMoves: function (chess: Chess) {
            const dests = new Map();

            SQUARES.forEach((s: any) => {
                const ms = chess.moves({ square: s, verbose: true });
                if (ms.length)
                    dests.set(
                        s,
                        ms.map((m: any) => m.to)
                    );
            });

            set_legal_moves(dests);
        },
        checkColor: function (chess: Chess) {
            setTurn(chess.turn() === "w" ? "white" : "black");
        },

        handleMove: function (
            orig: string,
            dest: string,
            capturedPiece: any,
            chess: Chess
        ) {
            chess.move({ from: orig, to: dest });
            this.checkColor(chess);
            BoardLogic.findLegalMoves(gameState);
            this.updateGame(chess);
        },
    };

    useEffect(() => {
        BoardLogic.findLegalMoves(gameState);
    }, []);

    const cg = (
        <Chessground
            height={750}
            width={750}
            config={{
                check: inCheck,
                turnColor: turn,
                movable: {
                    free: false,
                    dests: legal_moves,
                    showDests: true,
                    color: turn,
                    events: {
                        after: (
                            orig: string,
                            dest: string,
                            capturedPiece: any
                        ) => {
                            BoardLogic.handleMove(
                                orig,
                                dest,
                                capturedPiece,
                                gameState
                            );
                        },
                    },
                },
                events: {},
            }}
        />
    );

    return (
        <div className="App">
            <div className="chess-container">{cg}</div>
        </div>
    );
}

export default App;
