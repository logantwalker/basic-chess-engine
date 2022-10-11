import { Chess, Piece, Square } from "chess.js"
declare const files: readonly ["a", "b", "c", "d", "e", "f", "g", "h"]
declare const ranks: readonly ["1", "2", "3", "4", "5", "6", "7", "8"]
declare type File = typeof files[number]
declare type Rank = typeof ranks[number]
declare type Key = "a0" | `${File}${Rank}`

export class fryZero_v1 {
  static executeMove(gameState: Chess, move: any) {
    gameState.move(move)
  }

  static calculateMove(gameState: Chess) {
    let game = new Chess(gameState.fen())
    let move
    if (gameState.history().length === 1) {
      console.log("opening move")
      move = this.openingMoves(game)
    } else {
      move = this.minimaxRoot(3, game, false)
    }
    this.executeMove(gameState, move)
  }

  static openingMoves(game: Chess) {
    let move
    if (game.get("d4").type === "p") {
      move = { from: "d7", to: "d5" }
    } else {
      move = { from: "e7", to: "e5" }
    }

    return move
  }

  static minimaxRoot(depth: number, game: Chess, isMaximisingPlayer: boolean) {
    let newGameMoves = game.moves()
    let bestMove = -9999
    let bestMoveFound

    for (var i = 0; i < newGameMoves.length; i++) {
      var newGameMove = newGameMoves[i]
      game.move(newGameMove)
      var value = this.minimax(depth, game, -10000, 10000, !isMaximisingPlayer)
      game.undo()
      if (value >= bestMove) {
        bestMove = value
        bestMoveFound = newGameMove
      }
    }
    return bestMoveFound
  }

  static minimax(
    depth: number,
    game: Chess,
    alpha: any,
    beta: any,
    isMaximisingPlayer: boolean,
  ) {
    if (depth === 0) {
      return -1 * this.evaluateBoard(game.board())
    }

    var newGameMoves = game.moves()

    if (isMaximisingPlayer) {
      var bestMove = -9999
      for (var i = 0; i < newGameMoves.length; i++) {
        game.move(newGameMoves[i])
        bestMove = Math.max(
          bestMove,
          this.minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer),
        )
        game.undo()
        alpha = Math.max(alpha, bestMove)
        if (beta <= alpha) {
          return bestMove
        }
      }
      return bestMove
    } else {
      var bestMove = 9999
      for (var i = 0; i < newGameMoves.length; i++) {
        game.move(newGameMoves[i])
        bestMove = Math.min(
          bestMove,
          this.minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer),
        )
        game.undo()
        beta = Math.min(beta, bestMove)
        if (beta <= alpha) {
          return bestMove
        }
      }
      return bestMove
    }
  }

  static evaluateBoard(board: any) {
    var totalEvaluation = 0
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        totalEvaluation =
          totalEvaluation + this.getPieceValue(board[i][j], i, j)
      }
    }
    return totalEvaluation
  }

  static reverseArray(array: Array<any>) {
    return array.slice().reverse()
  }

  static pawnEvalWhite = [
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0],
    [1.0, 1.0, 2.0, 3.0, 3.0, 2.0, 1.0, 1.0],
    [0.5, 0.5, 1.0, 2.5, 2.5, 1.0, 0.5, 0.5],
    [0.0, 0.0, 0.0, 2.0, 2.0, 0.0, 0.0, 0.0],
    [0.5, -0.5, -1.0, 0.0, 0.0, -1.0, -0.5, 0.5],
    [0.5, 1.0, 1.0, -5.0, -5.0, 1.0, 1.0, 0.5],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  ]

  static pawnEvalBlack = this.reverseArray(this.pawnEvalWhite)

  static knightEval = [
    [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
    [-4.0, -2.0, 0.0, 0.0, 0.0, 0.0, -2.0, -4.0],
    [-3.0, 0.0, 1.0, 1.5, 1.5, 1.0, 0.0, -3.0],
    [-3.0, 0.5, 1.5, 2.0, 2.0, 1.5, 0.5, -3.0],
    [-3.0, 0.0, 1.5, 2.0, 2.0, 1.5, 0.0, -3.0],
    [-3.0, 0.5, 1.0, 1.5, 1.5, 1.0, 0.5, -3.0],
    [-4.0, -2.0, 0.0, 0.5, 0.5, 0.0, -2.0, -4.0],
    [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
  ]

  static bishopEvalWhite = [
    [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
    [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 1.0, 1.0, 0.5, 0.0, -1.0],
    [-1.0, 0.5, 0.5, 1.0, 1.0, 0.5, 0.5, -1.0],
    [-1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, -1.0],
    [-1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0],
    [-1.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, -1.0],
    [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
  ]

  static bishopEvalBlack = this.reverseArray(this.bishopEvalWhite)

  static rookEvalWhite = [
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [0.0, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0],
  ]

  static rookEvalBlack = this.reverseArray(this.rookEvalWhite)

  static evalQueen = [
    [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
    [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
    [-0.5, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
    [0.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
    [-1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, -1.0],
    [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
  ]

  static kingEvalWhite = [
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
    [-1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
    [2.0, 2.0, 0.0, 0.0, 0.0, 0.0, 2.0, 2.0],
    [2.0, 3.0, 1.0, 0.0, 0.0, 1.0, 3.0, 2.0],
  ]

  static kingEvalBlack = this.reverseArray(this.kingEvalWhite)

  static getPieceValue(piece: Piece, x: any, y: any) {
    if (piece === null) {
      return 0
    }
    var getAbsoluteValue = function (
      piece: Piece,
      isWhite: boolean,
      x: any,
      y: any,
    ) {
      if (piece.type === "p") {
        return (
          100 +
          (isWhite
            ? fryZero_v1.pawnEvalWhite[y][x]
            : fryZero_v1.pawnEvalBlack[y][x])
        )
      } else if (piece.type === "r") {
        return (
          500 +
          (isWhite
            ? fryZero_v1.rookEvalWhite[y][x]
            : fryZero_v1.rookEvalBlack[y][x])
        )
      } else if (piece.type === "n") {
        return 3 + fryZero_v1.knightEval[y][x]
      } else if (piece.type === "b") {
        return (
          350 +
          (isWhite
            ? fryZero_v1.bishopEvalWhite[y][x]
            : fryZero_v1.bishopEvalBlack[y][x])
        )
      } else if (piece.type === "q") {
        return 900 + fryZero_v1.evalQueen[y][x]
      } else if (piece.type === "k") {
        return (
          1500 +
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
}
