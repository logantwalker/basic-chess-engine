import { Chess } from "chess.js"

export class fryZero_v0 {
  static randomMove(gameState: Chess) {
    const moves = gameState.moves()
    const move = moves[Math.floor(Math.random() * moves.length)]
    gameState.move(move)
  }
}
