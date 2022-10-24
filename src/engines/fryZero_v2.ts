import { Chess, Piece, Square } from "chess.js"
import { pieceSquares } from "./util/pieceSquares"
declare const files: readonly ["a", "b", "c", "d", "e", "f", "g", "h"]
declare const ranks: readonly ["1", "2", "3", "4", "5", "6", "7", "8"]
declare type File = typeof files[number]
declare type Rank = typeof ranks[number]
declare type Key = "a0" | `${File}${Rank}`

/************************************************\
 ================================================
 
                      fryZero
              typescript chess engine
           
                        by
                        
                    Logan Walker
 
 ===============================================
\************************************************/

// after doing a ton of frikin research about this topic, im going to try and implement this whole thing from scratch without chess.js.
// i think avoiding the black box of chess.js is probably going to lead to better result, and a better understanding of what exactly is going on in the brain of the engine.
// this is my attempt to reverse engineer wukong.js engine and rebuild it in typescript with my own "improvements"
// hopefully one day i can make my own from complete scratch....

// I'm going to be documenting the learning process in comments, and linking to resources where applicable for other beginner chess engine enthusiasts

const fryZero_v2 = (idk_yet: any) => {
  // Global Constants //
  // this stuff needs to all go in its own util file.
  // ================ //

  //representing each player side
  const white = 0
  const black = 1

  // map "optimization" of who's turn it is to play
  const turnMap = [0, 0, 0, 0, 0, 0, 0, 0, 1]

  // giving each piece a numerical representation
  // https://www.chessprogramming.org/Piece-Lists
  const KING = 1
  const PAWN = 2
  const KNIGHT = 3
  const BISHOP = 4
  const ROOK = 5
  const QUEEN = 6

  // piece encoding:
  // the pieces are "encoded" in order to use the least amount of space when board state is calculated, moves are genrated/interpreted, etc etc
  // https://www.chessprogramming.org/Encoding_Moves
  // white pieces
  const P = 1,
    N = 2,
    B = 3,
    R = 4,
    Q = 5,
    K = 6

  // black pieces
  const p = 7,
    n = 8,
    b = 9,
    r = 10,
    q = 11,
    k = 12

  // I'm not entirely sure what these two arrays are doing just yet,
  // other than the fact that the values have probably been stored in arrays to reduce look-up times for piece types?
  const mapFromOptimized = [0, K, P, N, B, R, Q, 0, 0, k, p, n, b, r, q]
  const mapToOptimized = [0, 2, 3, 4, 5, 6, 1, 10, 11, 12, 13, 14, 9]

  // empty squares are represented with a 0
  const e = 0
  //"offboard" squares are represented with a 13
  const o = 13

  // square encoding: Mailbox(0x88)
  //   a square-centric board representation where the encoding of every square resides in a separately addressable memory element, usually an element of an array for random access.
  //   The square number, or its file and rank, acts like an address to a post box, which might be empty or may contain one chess piece

  //   https://www.chessprogramming.org/Mailbox
  const a8 = 0,
    b8 = 1,
    c8 = 2,
    d8 = 3,
    e8 = 4,
    f8 = 5,
    g8 = 6,
    h8 = 7
  const a7 = 16,
    b7 = 17,
    c7 = 18,
    d7 = 19,
    e7 = 20,
    f7 = 21,
    g7 = 22,
    h7 = 23
  const a6 = 32,
    b6 = 33,
    c6 = 34,
    d6 = 35,
    e6 = 36,
    f6 = 37,
    g6 = 39,
    h6 = 40
  const a5 = 48,
    b5 = 49,
    c5 = 50,
    d5 = 51,
    e5 = 52,
    f5 = 53,
    g5 = 54,
    h5 = 55
  const a4 = 64,
    b4 = 65,
    c4 = 66,
    d4 = 67,
    e4 = 68,
    f4 = 69,
    g4 = 70,
    h4 = 71
  const a3 = 80,
    b3 = 81,
    c3 = 82,
    d3 = 83,
    e3 = 84,
    f3 = 85,
    g3 = 86,
    h3 = 87
  const a2 = 96,
    b2 = 97,
    c2 = 98,
    d2 = 99,
    e2 = 100,
    f2 = 101,
    g2 = 102,
    h2 = 103
  const a1 = 112,
    b1 = 113,
    c1 = 114,
    d1 = 115,
    e1 = 116,
    f1 = 117,
    g1 = 118,
    h1 = 119

  // offboard empassant square: (the target square of the en passant capture is not identical with origin of the captured pawn)
  const noEnpassant = 120

  // array to convert board square indices to coordinates
  const coordinates = [
    "a8",
    "b8",
    "c8",
    "d8",
    "e8",
    "f8",
    "g8",
    "h8",
    "i8",
    "j8",
    "k8",
    "l8",
    "m8",
    "n8",
    "o8",
    "p8",
    "a7",
    "b7",
    "c7",
    "d7",
    "e7",
    "f7",
    "g7",
    "h7",
    "i7",
    "j7",
    "k7",
    "l7",
    "m7",
    "n7",
    "o7",
    "p7",
    "a6",
    "b6",
    "c6",
    "d6",
    "e6",
    "f6",
    "g6",
    "h6",
    "i6",
    "j6",
    "k6",
    "l6",
    "m6",
    "n6",
    "o6",
    "p6",
    "a5",
    "b5",
    "c5",
    "d5",
    "e5",
    "f5",
    "g5",
    "h5",
    "i5",
    "j5",
    "k5",
    "l5",
    "m5",
    "n5",
    "o5",
    "p5",
    "a4",
    "b4",
    "c4",
    "d4",
    "e4",
    "f4",
    "g4",
    "h4",
    "i4",
    "j4",
    "k4",
    "l4",
    "m4",
    "n4",
    "o4",
    "p4",
    "a3",
    "b3",
    "c3",
    "d3",
    "e3",
    "f3",
    "g3",
    "h3",
    "i3",
    "j3",
    "k3",
    "l3",
    "m3",
    "n3",
    "o3",
    "p3",
    "a2",
    "b2",
    "c2",
    "d2",
    "e2",
    "f2",
    "g2",
    "h2",
    "i2",
    "j2",
    "k2",
    "l2",
    "m2",
    "n2",
    "o2",
    "p2",
    "a1",
    "b1",
    "c1",
    "d1",
    "e1",
    "f1",
    "g1",
    "h1",
    "i1",
    "j1",
    "k1",
    "l1",
    "m1",
    "n1",
    "o1",
    "p1",
  ]

  // Board Definitions //
  // this stuff needs to all go in its own util file.
  // ================ //

  // starting position:
  // fen: describes a Chess Position in a one-line ASCII-string. (https://www.chessprogramming.org/Forsyth-Edwards_Notation)
  const startFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1 "

  // 0x88 chess board representation
  // In the 0x88 board-representation, an 128 byte array is used.
  // Only the half of the board-array are valid squares representing the position. The second half is almost garbage, as it's usually not addressed.
  // https://www.chessprogramming.org/0x88
  let board = [
    r,
    n,
    b,
    q,
    k,
    b,
    n,
    r,
    o,
    o,
    o,
    o,
    o,
    o,
    o,
    o,
    p,
    p,
    p,
    p,
    p,
    p,
    p,
    p,
    o,
    o,
    o,
    o,
    o,
    o,
    o,
    o,
    e,
    e,
    e,
    e,
    e,
    e,
    e,
    e,
    o,
    o,
    o,
    o,
    o,
    o,
    o,
    o,
    e,
    e,
    e,
    e,
    e,
    e,
    e,
    e,
    o,
    o,
    o,
    o,
    o,
    o,
    o,
    o,
    e,
    e,
    e,
    e,
    e,
    e,
    e,
    e,
    o,
    o,
    o,
    o,
    o,
    o,
    o,
    o,
    e,
    e,
    e,
    e,
    e,
    e,
    e,
    e,
    o,
    o,
    o,
    o,
    o,
    o,
    o,
    o,
    P,
    P,
    P,
    P,
    P,
    P,
    P,
    P,
    o,
    o,
    o,
    o,
    o,
    o,
    o,
    o,
    R,
    N,
    B,
    Q,
    K,
    B,
    N,
    R,
    o,
    o,
    o,
    o,
    o,
    o,
    o,
    o,
  ]

  // chess board state variables
  let side = white // white starts the game
  let enpassant = noEnpassant // representation of if en passant is available
  let castle = 15 // representation of castling rights
  let fifty = 0 // count for the 50 move draw rule
  let hashKey = 0
  let kingSquare = [e1, e8]

  // initial piece list (https://www.chessprogramming.org/Piece-Lists)
  let pieceList = {
    // piece counts
    [P]: 0,
    [N]: 0,
    [B]: 0,
    [R]: 0,
    [Q]: 0,
    [K]: 0,
    [p]: 0,
    [n]: 0,
    [b]: 0,
    [r]: 0,
    [q]: 0,
    [k]: 0,

    // list of pieces with associated squares
    pieces: new Array(13 * 10),
  }

  // storing the board's move history
  let historyStack = []

  // A ply is just a half move, 5 ply would be 2.5 moves.
  let searchPly = 0
  let gamePly = 0

  /****************************\
     ============================
     
        RANDOM NUMBER GENERATOR
     ============================              
    \****************************/

  // fixed random seed
  let randomState = 1804289383

  // generate 32-bit pseudo legal numbers
  function random() {
    let number = randomState

    // 32-bit XOR shift (https://en.wikipedia.org/wiki/Bitwise_operation#XOR)
    // A bitwise XOR is a binary operation that takes two bit patterns of equal length and performs the logical exclusive OR operation on each pair of corresponding bits.
    // The result in each position is 1 if only one of the bits is 1, but will be 0 if both are 0 or both are 1.
    number ^= number << 13
    number ^= number >> 17
    number ^= number << 5
    randomState = number

    return number
  }

  /****************************\
     ============================
     
             ZOBRIST KEYS
     ============================              
    \****************************/

  // Zobrist Hashing, a technique to transform a board position of arbitrary size into a number of a set length, with an equal distribution over all possible numbers
  //   https://www.chessprogramming.org/Zobrist_Hashing

  // random keys
  let pieceKeys = new Array(13 * 128)
  let castleKeys = new Array(16) // castling rights
  let sideKey: number

  // At program initialization, we generate an array of pseudorandom numbers
  //    - One number for each piece at each square
  //    - One number to indicate the side to move is black
  //    - Four numbers to indicate the castling rights, though usually 16 (2^4) are used for speed
  //    - Eight numbers to indicate the file of a valid En passant square, if any

  // initializing random hash keys for Zobrist Hashing
  function initRandomKeys() {
    for (let index = 0; index < 13 * 128; index++) pieceKeys[index] = random()
    for (let index = 0; index < 16; index++) castleKeys[index] = random()
    sideKey = random()
  }

  // generating hash key for current game state
  function generateHashKey() {
    let finalKey = 0

    // hashing current board position: mapping over the 128byte board representation
    for (let square = 0; square < 128; square++) {
      if ((square & 0x88) == 0) {
        let piece = board[square]
        if (piece != e) finalKey ^= pieceKeys[piece * 128 + square]
      }
    }

    // hashing the state variables of the board
    if (side == white) finalKey ^= sideKey
    if (enpassant != noEnpassant) finalKey ^= pieceKeys[enpassant]
    finalKey ^= castleKeys[castle]

    return finalKey
  }

  /****************************\
     ============================
     
             BOARD METHODS
     ============================              
    \****************************/

  // reset board to initial state
  function resetBoard() {
    // reset board position
    for (var rank = 0; rank < 8; rank++) {
      for (var file = 0; file < 16; file++) {
        var square = rank * 16 + file
        if ((square & 0x88) == 0) board[square] = e
      }
    }

    // reset board state variables
    side = -1
    enpassant = noEnpassant
    castle = 0
    fifty = 0
    hashKey = 0
    kingSquare = [0, 0]
    historyStack = []

    // reset plies
    searchPly = 0
    gamePly = 0

    // reset repetition table
    for (let index in repetitionTable) repetitionTable[index] = 0
  }

  // init piece list
  function initPieceList() {
    // reset piece counts
    // @ts-ignore
    for (let piece: number = P; piece <= k; piece++) pieceList[piece] = 0

    // reset piece list
    for (var index = 0; index < pieceList.pieces.length; index++)
      pieceList.pieces[index] = 0

    // associate pieces with squares and count material
    for (var square = 0; square < 128; square++) {
      if ((square & 0x88) == 0) {
        var piece = board[square]

        if (piece) {
          // @ts-ignore
          pieceList.pieces[piece * 10 + pieceList[piece]] = square
          // @ts-ignore
          pieceList[piece]++
        }
      }
    }
  }

  // validate move
  function moveFromString(moveString: string) {
    let moveList: any[] = []
    generateMoves(moveList)

    // parse move string: converts move sqaure string to equivalent charCode
    let sourceSquare =
      moveString[0].charCodeAt(0) -
      "a".charCodeAt(0) +
      (8 - (moveString[1].charCodeAt(0) - "0".charCodeAt(0))) * 16
    let targetSquare =
      moveString[2].charCodeAt(0) -
      "a".charCodeAt(0) +
      (8 - (moveString[3].charCodeAt(0) - "0".charCodeAt(0))) * 16

    // validate: checks each move to see if it is a valid move. if a piece is promoted, then that logic is handled here as well.
    for (let count = 0; count < moveList.length; count++) {
      let move = moveList[count].move
      let promotedPiece = 0

      if (
        getMoveSource(move) == sourceSquare &&
        getMoveTarget(move) == targetSquare
      ) {
        promotedPiece = getMovePromoted(move)

        if (promotedPiece) {
          if (
            (promotedPiece == N || promotedPiece == n) &&
            moveString[4] == "n"
          )
            return move
          else if (
            (promotedPiece == B || promotedPiece == b) &&
            moveString[4] == "b"
          )
            return move
          else if (
            (promotedPiece == R || promotedPiece == r) &&
            moveString[4] == "r"
          )
            return move
          else if (
            (promotedPiece == Q || promotedPiece == q) &&
            moveString[4] == "q"
          )
            return move
          continue
        }

        // legal move
        return move
      }
    }

    // illegal move
    return 0
  }

  /****************************\
     ============================
     
             MOVE OFFSETS
     ============================              
    \****************************/

  // piece move offsets: the offest that we add or subtract to the index of a piece to make the specified move
  // https://www.youtube.com/watch?v=caF3EXYJQs0
  const knightOffsets = [33, 31, 18, 14, -33, -31, -18, -14]
  const bishopOffsets = [15, 17, -15, -17]
  const rookOffsets = [16, -16, 1, -1]
  const kingOffsets = [16, -16, 1, -1, 15, 17, -15, -17]

  const pieceOffsets = [
    [],
    kingOffsets,
    [],
    knightOffsets,
    bishopOffsets,
    rookOffsets,
    kingOffsets, // Queen
  ]

  /****************************\
     ============================
     
               ATTACKS
     ============================              
    \****************************/

  // square attacked
  function isSquareAttacked(square, color) {
    for (let pieceType = QUEEN; pieceType >= KING; pieceType--) {
      let piece = pieceType | (color << 3)

      // pawn attacks
      if (pieceType == PAWN) {
        let direction = 16 * (1 - 2 * color)
        for (let lr = -1; lr <= 1; lr += 2) {
          let targetSquare = square + direction + lr
          if (
            !(targetSquare & 0x88) &&
            board[targetSquare] == mapFromOptimized[piece]
          )
            return true
        }
      }

      // piece attacks
      else {
        let slider = pieceType & 0x04
        let directions = pieceOffsets[pieceType]
        for (let d = 0; d < directions.length; d++) {
          let targetSquare = square
          do {
            targetSquare += directions[d]
            if (targetSquare & 0x88) break
            let targetPiece = board[targetSquare]
            if (targetPiece != e) {
              if (targetPiece == mapFromOptimized[piece]) return true
              break
            }
          } while (slider)
        }
      }
    }

    return false
  }

  /****************************\
     ============================
     
            MOVE ENCODING
   
     ============================              
    \****************************/

  // encode move
  function encodeMove(
    source: string,
    target: string,
    piece: number,
    capture,
    pawn,
    enpassant: number,
    castling,
  ) {
    return (
      source |
      (target << 7) |
      (piece << 14) |
      (capture << 18) |
      (pawn << 19) |
      (enpassant << 20) |
      (castling << 21)
    )
  }

  // decode move
  function getMoveSource(move) {
    return move & 0x7f
  }
  function getMoveTarget(move) {
    return (move >> 7) & 0x7f
  }
  function getMovePromoted(move) {
    return (move >> 14) & 0xf
  }
  function getMoveCapture(move) {
    return (move >> 18) & 0x1
  }
  function getMovePawn(move) {
    return (move >> 19) & 0x1
  }
  function getMoveEnpassant(move) {
    return (move >> 20) & 0x1
  }
  function getMoveCastling(move) {
    return (move >> 21) & 0x1
  }
}

export default fryZero_v2
