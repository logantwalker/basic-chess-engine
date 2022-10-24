import { useState, useEffect } from "react"
import "./App.css"

//@ts-ignore
import Chessground from "@react-chess/chessground"
import { Chess, Square } from "chess.js"
declare const files: readonly ["a", "b", "c", "d", "e", "f", "g", "h"]
declare const ranks: readonly ["1", "2", "3", "4", "5", "6", "7", "8"]
declare type File = typeof files[number]
declare type Rank = typeof ranks[number]
declare type Key = "a0" | `${File}${Rank}`
// these styles must be imported somewhere
import "chessground/assets/chessground.base.css"
import "chessground/assets/chessground.brown.css"
import "chessground/assets/chessground.cburnett.css"

import { fryZero_v1 } from "./engines/fryZero_v1"
import wukong_ts from "./engines/fryZero_v2"

function App() {
  const game = new Chess()
  const engine = wukong_ts()

  console.log(engine)
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
  ]

  const [humanSide, setHumanSide] = useState<"white" | "black">("white")
  const [gameState, setGame] = useState<Chess>(game)
  const [fen, setFen] = useState(gameState.fen())
  const [turn, setTurn] = useState<"white" | "black">("white")
  const [legal_moves, set_legal_moves] = useState<Map<Key, Key[]>>()
  const [inCheck, check] = useState(false)
  const [gameOver, set_gameOver] = useState(false)
  const [overBy, setOverBy] = useState("")

  const findComputerMove = (game: Chess) => {
    let currentFen = game.fen()
    engine.setBoard(currentFen)
    let bestMove = engine.searchTime(1000) // search for 1 second
    engine.makeMove(bestMove)
    let stringMove = engine.moveToString(bestMove)

    BoardLogic.handleMove(
      stringMove.slice(0, 2),
      stringMove.slice(2),
      null,
      game,
    )
  }

  const BoardLogic = {
    updateGame: function (game: Chess) {
      BoardLogic.findLegalMoves(game)
      setGame(game)
      setFen(game.fen())
      check(game.inCheck())
    },

    findLegalMoves: function (chess: Chess) {
      const dests = new Map()

      SQUARES.forEach((s: any) => {
        const ms = chess.moves({ square: s, verbose: true })
        if (ms.length)
          dests.set(
            s,
            ms.map((m: any) => m.to),
          )
        else {
          if (chess.isCheckmate()) {
            setOverBy("checkmate")
          } else if (chess.isInsufficientMaterial()) {
            setOverBy("insufficient material")
          } else if (chess.isThreefoldRepetition()) {
            setOverBy("three fold repition")
          } else if (chess.isStalemate()) {
            setOverBy("stalemate")
          } else if (chess.isDraw()) {
            setOverBy("draw")
          }
          set_gameOver(chess.isGameOver())
        }
      })
      set_legal_moves(dests)
    },

    checkColor: function (chess: Chess) {
      setTurn(chess.turn() === "w" ? "white" : "black")
    },

    handleMove: function (orig: any, dest: any, _: any, chess: Chess) {
      let promotion = undefined
      if (
        (dest[1] === "1" || dest[1] === "8") &&
        chess.get(orig).type === "p"
      ) {
        promotion = "q"
      }

      chess.move({ from: orig, to: dest, promotion: promotion })
      this.updateGame(chess)
      this.checkColor(chess)
    },
  }

  useEffect(() => {
    BoardLogic.findLegalMoves(gameState)
  }, [])

  // useEffect(() => {
  //   const computerSide = humanSide === "white" ? "b" : "w"
  //   if (gameState.turn() === computerSide) {
  //     findComputerMove(gameState)
  //   }
  // }, [turn])

  useEffect(() => {
    if (gameState.turn() === "b") {
      findComputerMove(gameState)
    }
  }, [turn])

  return (
    <div className="flex w-full justify-center">
      <div className="color-shift mt-10 mb-5 w-full min-w-min flex-col justify-center overflow-hidden rounded-sm border border-stone-500 bg-stone-100 p-2.5 align-middle text-stone-900 shadow-lg dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 sm:w-1/2">
        <div>{gameOver ? <h1>game over by {overBy}</h1> : null}</div>
        <button>start</button>
        <div className="border-t border-b border-stone-600 dark:border-stone-400">
          <Chessground
            height={700}
            width={700}
            config={{
              fen: fen,
              orientation: humanSide,
              check: inCheck,
              turnColor: turn,
              movable: {
                free: false,
                dests: legal_moves,
                showDests: true,
                color: humanSide,
                events: {
                  after: (orig: any, dest: any, capturedPiece: any) => {
                    BoardLogic.handleMove(orig, dest, capturedPiece, gameState)
                  },
                },
              },
              events: {
                change: () => {},
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default App
