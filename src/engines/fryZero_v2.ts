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

const fryZero_v2 = (idk_yet: any) => {}

export default fryZero_v2
