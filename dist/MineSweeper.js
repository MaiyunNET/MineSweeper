define(["require", "exports", "./abstract"], function (require, exports, A) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MINE_FLAG = -1;
    var MineSweeper = (function () {
        function MineSweeper(_width, _height, _mineQuantity) {
            this._width = _width;
            this._height = _height;
            this._mineQuantity = _mineQuantity;
            if (!Number.isInteger(this._width) ||
                !Number.isInteger(this._height) ||
                !Number.isInteger(this._mineQuantity) ||
                this._mineQuantity < 1 ||
                this._height < 2 ||
                this._mineQuantity < 2) {
                throw new Error("INVALID_GAME_MAP");
            }
            if (this._mineQuantity >= this._width * this._height) {
                throw new Error("TOO_MANY_MINES");
            }
            this.restart();
        }
        MineSweeper.prototype.getUsedTime = function () {
            return Date.now() - this._context.startedAt;
        };
        MineSweeper.prototype.getRestMineQuantity = function () {
            return this._context.restMines;
        };
        MineSweeper.prototype.getStatus = function () {
            return this._context.status;
        };
        MineSweeper.prototype.getHeight = function () {
            return this._height;
        };
        MineSweeper.prototype.getWidth = function () {
            return this._width;
        };
        MineSweeper.prototype.getMineQuantity = function () {
            return this._mineQuantity;
        };
        MineSweeper.prototype._checkCoordinate = function (x, y) {
            return Number.isInteger(x) && x >= 0 && x < this._width &&
                Number.isInteger(y) && y >= 0 && y < this._height;
        };
        MineSweeper.prototype.mark = function (x, y, style) {
            if (this._context.status !== A.EGameStatus.PLAYING) {
                return false;
            }
            var blk = this.getBlock(x, y);
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
        };
        MineSweeper.prototype.sweep = function (x, y) {
            var blk = this.getBlock(x, y);
            if (this._context.status !== A.EGameStatus.PLAYING ||
                blk !== A.EBlockType.UNKNWON) {
                return blk;
            }
            if (this._context.mines[y][x] === MINE_FLAG) {
                this._die(x, y);
            }
            else {
                this._cleanBlock(x, y);
                this._context.blocks[y][x] = this._context.mines[y][x];
                if (this._context.unknowns === 0 &&
                    this._context.restMines === 0) {
                    this._context.startedAt = A.EGameStatus.WIN;
                }
            }
            return this._context.status;
        };
        MineSweeper.prototype._findBlocksAround = function (x, y) {
            var blocks = [];
            for (var cY = y - 1; cY < y + 2; cY++) {
                for (var cX = x - 1; cX < x + 2; cX++) {
                    if ((x === cX && y === cY) ||
                        !this._checkCoordinate(cX, cY)) {
                        continue;
                    }
                    blocks.push({ x: cX, y: cY });
                }
            }
            return blocks;
        };
        MineSweeper.prototype.explore = function (x, y) {
            var _this = this;
            var blk = this.getBlock(x, y);
            if (this._context.status !== A.EGameStatus.PLAYING ||
                blk < 0) {
                return this._context.status;
            }
            var blks = this._findBlocksAround(x, y);
            var marks = blks.reduce(function (p, b) { return p + (_this._context.blocks[b.y][b.x] === A.EBlockType.MARKED ? 1 : 0); }, 0);
            if (marks >= this._context.mines[y][x]) {
                for (var _i = 0, blks_1 = blks; _i < blks_1.length; _i++) {
                    var b = blks_1[_i];
                    if (this._context.blocks[b.y][b.x] === A.EBlockType.UNKNWON) {
                        this.sweep(b.x, b.y);
                    }
                    if (this._context.status !== A.EGameStatus.PLAYING) {
                        return this._context.status;
                    }
                }
            }
            return this._context.status;
        };
        MineSweeper.prototype._die = function (x, y) {
            var ctx = this._context;
            ctx.status = A.EGameStatus.FAILED;
            ctx.blocks[y][x] = A.EBlockType.DEAD;
            for (y = 0; y < this._height; y++) {
                for (x = 0; x < this._width; x++) {
                    var blk = ctx.blocks[y][x];
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
                        }
                    }
                }
            }
        };
        MineSweeper.prototype._cleanBlock = function (x, y) {
            if (!this._checkCoordinate(x, y)) {
                return;
            }
            if (this._context.mines[y][x]) {
                return;
            }
            var blks = this._findBlocksAround(x, y);
            var nextBlks = [];
            for (var _i = 0, blks_2 = blks; _i < blks_2.length; _i++) {
                var b = blks_2[_i];
                if (this._context.blocks[b.y][b.x] !== A.EBlockType.UNKNWON) {
                    continue;
                }
                this._context.blocks[b.y][b.x] = this._context.mines[b.y][b.x];
                this._context.unknowns--;
                if (!this._context.mines[b.y][b.x]) {
                    nextBlks.push(b);
                }
            }
            for (var _a = 0, nextBlks_1 = nextBlks; _a < nextBlks_1.length; _a++) {
                var b = nextBlks_1[_a];
                this._cleanBlock(b.x, b.y);
            }
        };
        MineSweeper.prototype.restart = function () {
            var ctx = this._context = {
                blocks: new Array(this._height),
                mines: new Array(this._height),
                restMines: this._mineQuantity,
                startedAt: Date.now(),
                status: A.EGameStatus.PLAYING,
                unknowns: this._height * this._width
            };
            for (var y = 0; y < this._height; y++) {
                ctx.blocks[y] = new Array(this._width);
                ctx.mines[y] = new Array(this._width);
                ctx.blocks[y].fill(A.EBlockType.UNKNWON);
                ctx.mines[y].fill(0);
            }
            var mines = this._mineQuantity;
            while (mines) {
                var y = Math.floor(Math.random() * this._height);
                var x = Math.floor(Math.random() * this._width);
                if (ctx.mines[y][x] === MINE_FLAG) {
                    continue;
                }
                ctx.mines[y][x] = MINE_FLAG;
                for (var i = y - 1; i < y + 2; i++) {
                    for (var j = x - 1; j < x + 2; j++) {
                        if (!this._checkCoordinate(j, i) || ctx.mines[i][j] === MINE_FLAG) {
                            continue;
                        }
                        ctx.mines[i][j]++;
                    }
                }
                mines--;
            }
        };
        MineSweeper.prototype.getBlock = function (x, y) {
            if (!this._checkCoordinate(x, y)) {
                throw new Error("OUT_TO_BOUNDARY");
            }
            return this._context.blocks[y][x];
        };
        MineSweeper.prototype.getMap = function () {
            return this._context.blocks.map(function (x) { return x.slice(); });
        };
        return MineSweeper;
    }());
    function createMineSweeper(width, height, mineQuantity) {
        return new MineSweeper(width, height, mineQuantity);
    }
    exports.createMineSweeper = createMineSweeper;
});
