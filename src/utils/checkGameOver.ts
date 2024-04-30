import { Coordinate } from "../types/types";


export const checkGameOver = (snakeHead: Coordinate, boundaries: any):boolean => {
    return(
        snakeHead.x < boundaries.xMin ||
        snakeHead.x > boundaries.xMax ||
        snakeHead.y < boundaries.xMin ||
        snakeHead.y > boundaries.xMax
    )
}