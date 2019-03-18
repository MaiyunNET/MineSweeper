import * as A from "./abstract";

interface IBlock {

    x: number;

    y: number;
}

const MINE_FLAG = -1;

interface IContext {

    blocks: number[][];

    mines: number[][];

    restMines: number;

    startedAt: number;

    status: A.EGameStatus;

    unknowns: number;
}

class MineSweeper implements A.IMineSweeper {

    private _context!: IContext;

    public constructor(
        private _width: number,
        private _height: number,
        private _mineQuantity: number,
    ) {

        if (
            !Number.isInteger(this._width) ||
            !Number.isInteger(this._height) ||
            !Number.isInteger(this._mineQuantity) ||
            this._mineQuantity < 1 ||
            this._height < 2 ||
            this._mineQuantity < 2
        ) {

            throw new Error("INVALID_GAME_MAP");
        }

        if (this._mineQuantity >= this._width * this._height) {

            throw new Error("TOO_MANY_MINES");
        }

        this.restart();
    }

    public getUsedTime(): number {

        return Date.now() - this._context.startedAt;
    }

    public getRestMineQuantity(): number {

        return this._context.restMines;
    }

    public getStatus(): A.EGameStatus {

        return this._context.status;
    }

    public getHeight(): number {

        return this._height;
    }

    public getWidth(): number {

        return this._width;
    }

    public getMineQuantity(): number {

        return this._mineQuantity;
    }

    private _checkCoordinate(x: number, y: number): boolean {

        return Number.isInteger(x) && x >= 0 && x < this._width &&
               Number.isInteger(y) && y >= 0 && y < this._height;
    }

    public mark(x: number, y: number, style: A.EMarkStyle): boolean {

        if (this._context.status !== A.EGameStatus.PLAYING) {

            return false;
        }

        const blk = this.getBlock(x, y);

        switch (blk) {

            case A.EBlockType.MARKED: {

                switch (style) {

                    case A.EMarkStyle.MINE: {

                        break;
                    }
                    case A.EMarkStyle.NONE: {

                        this._context.restMines++;
                        this._context.unknowns++;
                        this._context.blocks[y][x] = A.EBlockType.UNKNWON;

                        break;
                    }
                    case A.EMarkStyle.QUESTION: {

                        this._context.restMines++;
                        this._context.unknowns++;
                        this._context.blocks[y][x] = A.EBlockType.QUESTION;

                        break;
                    }
                }

                return true;
            }
            case A.EBlockType.QUESTION: {

                switch (style) {

                    case A.EMarkStyle.MINE: {

                        this._context.restMines--;
                        this._context.unknowns--;
                        this._context.blocks[y][x] = A.EBlockType.MARKED;
                        break;
                    }
                    case A.EMarkStyle.NONE: {

                        this._context.blocks[y][x] = A.EBlockType.UNKNWON;
                        break;
                    }
                    case A.EMarkStyle.QUESTION: {

                        break;
                    }
                }

                return true;
            }
            case A.EBlockType.UNKNWON: {

                switch (style) {

                    case A.EMarkStyle.MINE: {

                        this._context.restMines--;
                        this._context.unknowns--;
                        this._context.blocks[y][x] = A.EBlockType.MARKED;
                        break;
                    }
                    case A.EMarkStyle.NONE: {

                        break;
                    }
                    case A.EMarkStyle.QUESTION: {

                        this._context.blocks[y][x] = A.EBlockType.QUESTION;
                        break;
                    }
                }

                return true;
            }

            default: {

                return false;
            }
        }
    }

    public sweep(x: number, y: number): A.EGameStatus {

        const blk = this.getBlock(x, y);

        if (
            this._context.status !== A.EGameStatus.PLAYING ||
            blk !== A.EBlockType.UNKNWON
        ) {

            return blk;
        }

        if (this._context.mines[y][x] === MINE_FLAG) {

            this._die(x, y);
        }
        else {

            this._cleanBlock(x, y);

            this._context.blocks[y][x] = this._context.mines[y][x];

            if (
                this._context.unknowns === 0 &&
                this._context.restMines === 0
            ) {

                this._context.startedAt = A.EGameStatus.WIN;
            }
        }

        return this._context.status;
    }

    private _findBlocksAround(x: number, y: number): IBlock[] {

        const blocks: IBlock[] = [];

        for (let cY = y - 1; cY < y + 2; cY++) {

            for (let cX = x - 1; cX < x + 2; cX++) {

                if (
                    (x === cX && y === cY) ||
                    !this._checkCoordinate(cX, cY)
                ) {

                    continue;
                }

                blocks.push({ x: cX, y: cY });
            }
        }

        return blocks;
    }

    public explore(x: number, y: number): A.EGameStatus {

        const blk = this.getBlock(x, y);

        if (
            this._context.status !== A.EGameStatus.PLAYING ||
            blk < 0
        ) {

            return this._context.status;
        }

        const blks = this._findBlocksAround(x, y);

        const marks = blks.reduce(
            (p, b) => p + (this._context.blocks[b.y][b.x] === A.EBlockType.MARKED ? 1 : 0),
            0
        );

        if (marks >= this._context.mines[y][x]) {

            for (const b of blks) {

                if (this._context.blocks[b.y][b.x] === A.EBlockType.UNKNWON) {

                    this.sweep(b.x, b.y);
                }

                if (this._context.status !== A.EGameStatus.PLAYING) {

                    return this._context.status;
                }
            }
        }

        return this._context.status;
    }

    private _die(x: number, y: number): void {

        const ctx = this._context;

        ctx.status = A.EGameStatus.FAILED;

        ctx.blocks[y][x] = A.EBlockType.DEAD;

        for (y = 0; y < this._height; y++) {

            for (x = 0; x < this._width; x++) {

                const blk = ctx.blocks[y][x];

                switch (blk) {

                    case A.EBlockType.MARKED: {

                        if (ctx.mines[y][x] !== MINE_FLAG) {

                            ctx.blocks[y][x] = A.EBlockType.WRONG;
                        }

                        break;
                    }

                    case A.EBlockType.QUESTION:
                    case A.EBlockType.UNKNWON: {

                        if (ctx.mines[y][x] === MINE_FLAG) {

                            ctx.blocks[y][x] = A.EBlockType.MINE;
                        }
                        else {

                            ctx.blocks[y][x] = ctx.mines[y][x];
                        }

                        break;
                    }

                    default: {

                        // do nothing.
                    }
                }
            }
        }
    }

    private _cleanBlock(x: number, y: number): void {

        if (!this._checkCoordinate(x, y)) {

            return;
        }

        if (this._context.mines[y][x]) {

            return;
        }

        const blks = this._findBlocksAround(x, y);

        const nextBlks: IBlock[] = [];

        for (let b of blks) {

            if (this._context.blocks[b.y][b.x] !== A.EBlockType.UNKNWON) {

                continue;
            }

            this._context.blocks[b.y][b.x] = this._context.mines[b.y][b.x];
            this._context.unknowns--;

            if (!this._context.mines[b.y][b.x]) {

                nextBlks.push(b);
            }
        }

        for (let b of nextBlks) {

            this._cleanBlock(b.x, b.y);
        }
    }

    public restart(): void {

        const ctx = this._context = {
            blocks: new Array(this._height) as number[][],
            mines: new Array(this._height) as number[][],
            restMines: this._mineQuantity,
            startedAt: Date.now(),
            status: A.EGameStatus.PLAYING,
            unknowns: this._height * this._width
        };

        for (let y = 0; y < this._height; y++) {

            ctx.blocks[y] = new Array(this._width);
            ctx.mines[y] = new Array(this._width);

            ctx.blocks[y].fill(A.EBlockType.UNKNWON);
            ctx.mines[y].fill(0);
        }

        let mines = this._mineQuantity;

        while (mines) {

            const y = Math.floor(Math.random() * this._height);
            const x = Math.floor(Math.random() * this._width);

            if (ctx.mines[y][x] === MINE_FLAG) {

                continue;
            }

            ctx.mines[y][x] = MINE_FLAG;

            for (let i = y - 1; i < y + 2; i++) {

                for (let j = x - 1; j < x + 2; j++) {

                    if (!this._checkCoordinate(j, i) || ctx.mines[i][j] === MINE_FLAG) {

                        continue;
                    }

                    ctx.mines[i][j]++;
                }
            }

            mines--;
        }
    }

    public getBlock(x: number, y: number): number {

        if (!this._checkCoordinate(x, y)) {

            throw new Error("OUT_TO_BOUNDARY");
        }

        return this._context.blocks[y][x];
    }

    public getMap(): number[][] {

        return this._context.blocks.map(
            (x) => x.slice()
        );
    }
}

export function createMineSweeper(
    width: number,
    height: number,
    mineQuantity: number
): A.IMineSweeper {

    return new MineSweeper(width, height, mineQuantity);
}
