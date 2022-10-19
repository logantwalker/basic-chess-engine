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

const fryZero_v2 = (gameState: Chess) => {}

export default fryZero_v2
