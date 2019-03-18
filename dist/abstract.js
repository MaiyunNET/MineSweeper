define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EBlockType;
    (function (EBlockType) {
        EBlockType[EBlockType["UNKNWON"] = -1] = "UNKNWON";
        EBlockType[EBlockType["MARKED"] = -2] = "MARKED";
        EBlockType[EBlockType["QUESTION"] = -3] = "QUESTION";
        EBlockType[EBlockType["WRONG"] = -4] = "WRONG";
        EBlockType[EBlockType["MINE"] = -5] = "MINE";
        EBlockType[EBlockType["DEAD"] = -6] = "DEAD";
    })(EBlockType = exports.EBlockType || (exports.EBlockType = {}));
    var EGameStatus;
    (function (EGameStatus) {
        EGameStatus[EGameStatus["PLAYING"] = 0] = "PLAYING";
        EGameStatus[EGameStatus["WIN"] = 1] = "WIN";
        EGameStatus[EGameStatus["FAILED"] = 2] = "FAILED";
    })(EGameStatus = exports.EGameStatus || (exports.EGameStatus = {}));
    var EMarkStyle;
    (function (EMarkStyle) {
        EMarkStyle[EMarkStyle["NONE"] = 0] = "NONE";
        EMarkStyle[EMarkStyle["MINE"] = 1] = "MINE";
        EMarkStyle[EMarkStyle["QUESTION"] = 2] = "QUESTION";
    })(EMarkStyle = exports.EMarkStyle || (exports.EMarkStyle = {}));
});
