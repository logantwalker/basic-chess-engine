import { Chess, Piece, Square } from "chess.js"
declare const files: readonly ["a", "b", "c", "d", "e", "f", "g", "h"]
declare const ranks: readonly ["1", "2", "3", "4", "5", "6", "7", "8"]
declare type File = typeof files[number]
declare type Rank = typeof ranks[number]
declare type Key = "a0" | `${File}${Rank}`

export class fryZero_v0 {
  static randomMove(gameState: Chess) {
    const moves = gameState.moves()
    const move = moves[Math.floor(Math.random() * moves.length)]
    return move
  }

  static executeMove(gameState: Chess, move: any) {
    gameState.move(move)
  }

  static calculateMove(gameState: Chess) {
    let move
    if (gameState.history().length === 0) {
      const moves = [
        { from: "d2", to: "d4" },
        { from: "e2", to: "e4" },
        { from: "g1", to: "f3" },
      ]
      move = moves[Math.floor(Math.random() * moves.length)]
    } else if (gameState.history().length === 1) {
      if (gameState.get("d4").type === "p") {
        move = { from: "d7", to: "d5" }
      } else {
        move = { from: "e7", to: "e5" }
      }
    } else {
      move = this.randomMove(gameState)
    }

    this.executeMove(gameState, move)
  }
}
