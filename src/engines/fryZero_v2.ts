import { Chess, Piece, Square } from "chess.js"
import { pieceSquares } from "./util/pieceSquares"
declare const files: readonly ["a", "b", "c", "d", "e", "f", "g", "h"]
declare const ranks: readonly ["1", "2", "3", "4", "5", "6", "7", "8"]
declare type File = typeof files[number]
declare type Rank = typeof ranks[number]
declare type Key = "a0" | `${File}${Rank}`

const fryZero_v2 = (fen: string) => {
  let game = new Chess(fen)

  //this is the function where the final move will be returned
  const calculateMove = (game: Chess) => {
    let move = minimaxRoot(3, game)
    return move
  }

  //this will be the minimax or kick off the minimax algo
  const minimaxRoot = (depth: number, game: Chess) => {
    let availableMoves = game.moves()
    let bestMove = -99999
    let bestMoveFound
  }

  //here's where we will calculate the numerical value of the current board
  const evaluateBoard = () => {}

  const getPieceValue = (piece: Piece, x: any, y: any) => {
    if (piece === null) {
      return 0
    }
    const getAbsoluteValue = (
      piece: Piece,
      isWhite: boolean,
      x: any,
      y: any,
    ) => {
      if (piece.type === "p") {
        return (
          100 *
          (isWhite
            ? fryZero_v1.pawnEvalWhite[y][x]
            : fryZero_v1.pawnEvalBlack[y][x])
        )
      } else if (piece.type === "r") {
        return (
          500 *
          (isWhite
            ? fryZero_v1.rookEvalWhite[y][x]
            : fryZero_v1.rookEvalBlack[y][x])
        )
      } else if (piece.type === "n") {
        return 3 * fryZero_v1.knightEval[y][x]
      } else if (piece.type === "b") {
        return (
          350 *
          (isWhite
            ? fryZero_v1.bishopEvalWhite[y][x]
            : fryZero_v1.bishopEvalBlack[y][x])
        )
      } else if (piece.type === "q") {
        return 900 * fryZero_v1.evalQueen[y][x]
      } else if (piece.type === "k") {
        return (
          1500 *
          (isWhite
            ? fryZero_v1.kingEvalWhite[y][x]
            : fryZero_v1.kingEvalBlack[y][x])
        )
      }
      throw "Unknown piece type: " + piece.type
    }

    var absoluteValue = getAbsoluteValue(piece, piece.color === "b", x, y)
    return piece.color === "w" ? absoluteValue : -absoluteValue
  }

  const bestMove = calculateMove(game)

  return bestMove
}

export default fryZero_v2
