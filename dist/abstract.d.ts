export declare enum EBlockType {
    UNKNWON = -1,
    MARKED = -2,
    QUESTION = -3,
    WRONG = -4,
    MINE = -5,
    DEAD = -6
}
export declare enum EGameStatus {
    PLAYING = 0,
    WIN = 1,
    FAILED = 2
}
export declare enum EMarkStyle {
    NONE = 0,
    MINE = 1,
    QUESTION = 2
}
export interface IGameOptions {
    height: number;
    width: number;
    minesQuantity: number;
    showMinesOnlyOnFailed?: boolean;
}
export interface IMineSweeper {
    restart(): void;
    getWidth(): number;
    getHeight(): number;
    getMineQuantity(): number;
    getStatus(): EGameStatus;
    getRestMineQuantity(): number;
    getMap(): number[][];
    mark(x: number, y: number, style: EMarkStyle): boolean;
    sweep(x: number, y: number): EGameStatus;
    explore(x: number, y: number): EGameStatus;
    getUsedTime(): number;
}
