"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
window.onerror = function (msg, uri, line, col, err) {
    if (err) {
        alert("Error:\n" + err.message + "\n" + err.stack + "\nLine: " + line + "\nColumn: " + col);
    }
    else {
        console.log(msg);
    }
};
var MineSweeper = (function () {
    function MineSweeper() {
    }
    MineSweeper.create = function (el) {
        var $el;
        if (typeof el === "string") {
            $el = document.querySelector(el);
        }
        else {
            $el = el;
        }
        $el.classList.add("MineSweeper", "MineSweeper--init");
        var html = "" +
            "<div class=\"MineSweeper__top\">" +
            "<div class=\"MineSweeper__number\">" +
            "<div class=\"MineSweeper__num\" :class=\"['MineSweeper__num'+mine[0]]\"></div>" +
            "<div class=\"MineSweeper__num\" :class=\"['MineSweeper__num'+mine[1]]\"></div>" +
            "<div class=\"MineSweeper__num\" :class=\"['MineSweeper__num'+mine[2]]\"></div>" +
            "</div>" +
            "<div class=\"MineSweeper__tcenter\">" +
            "<div class=\"MineSweeper__tbtn\"></div>" +
            "</div>" +
            "<div class=\"MineSweeper__number\">" +
            "<div class=\"MineSweeper__num\" :class=\"['MineSweeper__num'+time[0]]\"></div>" +
            "<div class=\"MineSweeper__num\" :class=\"['MineSweeper__num'+time[1]]\"></div>" +
            "<div class=\"MineSweeper__num\" :class=\"['MineSweeper__num'+time[2]]\"></div>" +
            "</div>" +
            "</div>" +
            "<div class=\"MineSweeper__box\">" +
            "<div v-for=\"(line, y) of blocks\" class=\"MineSweeper__line\">" +
            "<div v-for=\"(num, x) of line\" class=\"MineSweeper__block\" :class=\"[" +
            "num > 0 ? 'MineSweeper__block--' + num : ''," +
            "num === -6 ? 'MineSweeper__block--red' : ''," +
            "num === -2 ? 'MineSweeper__block--flag' : ''," +
            "num === -3 ? 'MineSweeper__block--qm' : ''," +
            "{" +
            "'MineSweeper__block--t': [-1, -2, -3].indexOf(num) !== -1," +
            "'MineSweeper__block--flag': num === -2," +
            "'MineSweeper__block--mine': [-5, -6].indexOf(num) !== -1," +
            "'MineSweeper__block--minex': num === -3," +
            "'MineSweeper__block--qm': num === -3," +
            "}" +
            "]\" @click=\"sweep(x, y)\"></div>" +
            "</div>" +
            "</div>" +
            "<div class=\"MineSweeper__mask\">" +
            "<div class=\"MineSweeper__spin MineSweeper__spin-spinning\"><span class=\"MineSweeper__spin-dot\"><i></i><i></i><i></i><i></i></span></div>" +
            "</div>";
        $el.innerHTML = html;
        var ms = new MineSweeper();
        if (this.__loaded) {
            this.__create($el, {}, ms);
        }
        else {
            this.__creates.push([$el, {}, ms]);
        }
        return ms;
    };
    MineSweeper.__create = function (el, opt, ms) {
        ms.__mis = MineSweeper.__ms.createMineSweeper(9, 9, 10);
        ms.__vue = new Vue({
            el: el,
            data: {
                mineNum: 10,
                timeNum: 0,
                blocks: [
                    [],
                ]
            },
            computed: {
                mine: function () {
                    return this.pad(this.mineNum);
                },
                time: function () {
                    return this.pad(this.timeNum);
                }
            },
            methods: {
                pad: function (num) {
                    var l = 3 - num.toString().length;
                    if (l > 0) {
                        var str = "";
                        for (var k = 0; k < l; ++k) {
                            str += "0";
                        }
                        return str + num.toString();
                    }
                    else {
                        return num.toString();
                    }
                },
                sweep: function (x, y) {
                    ms.__mis.sweep(x, y);
                    ms.__vue.blocks = ms.__mis.getMap();
                }
            },
            mounted: function () {
                this.$nextTick(function () {
                    var $el = ms.__vue.$el;
                    $el.classList.remove("MineSweeper--init");
                    $el.removeChild($el.querySelector(".MineSweeper__mask"));
                });
            }
        });
        ms.__vue.blocks = ms.__mis.getMap();
    };
    MineSweeper.__loadScript = function (paths) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var i, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!(paths.length > 0)) return [3, 4];
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < paths.length)) return [3, 4];
                        if (!(this._outPath.indexOf(paths[i]) === -1)) return [3, 3];
                        this._outPath.push(paths[i]);
                        return [4, this._loadOutScript(paths[i])];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        ++i;
                        return [3, 1];
                    case 4:
                        resolve();
                        return [3, 6];
                    case 5:
                        e_1 = _a.sent();
                        reject(e_1);
                        return [3, 6];
                    case 6: return [2];
                }
            });
        }); });
    };
    MineSweeper._loadOutScript = function (path) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var script;
            return __generator(this, function (_a) {
                script = document.createElement("script");
                script.addEventListener("load", function () {
                    resolve();
                });
                script.addEventListener("error", function () {
                    reject("Load error.");
                });
                script.src = path;
                this.__headEle.appendChild(script);
                return [2];
            });
        }); });
    };
    MineSweeper.__loadImg = function (paths) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var pl, $div, _i, paths_1, path, $img;
            return __generator(this, function (_a) {
                pl = paths.length;
                $div = document.createElement("div");
                $div.classList.add("MineSweeper__loadImg");
                document.body.appendChild($div);
                for (_i = 0, paths_1 = paths; _i < paths_1.length; _i++) {
                    path = paths_1[_i];
                    $img = document.createElement("img");
                    $img.addEventListener("load", function () {
                        --pl;
                        if (pl === 0) {
                            document.body.removeChild($div);
                            resolve();
                        }
                    });
                    $img.setAttribute("src", this.__root + "img/" + path);
                    $div.appendChild($img);
                }
                return [2];
            });
        }); });
    };
    MineSweeper.__loaded = false;
    MineSweeper.__creates = [];
    MineSweeper.__root = "";
    MineSweeper._outPath = [];
    return MineSweeper;
}());
document.addEventListener("DOMContentLoaded", function () {
    MineSweeper.__headEle = document.getElementsByTagName("head")[0];
    var callback = function () { return __awaiter(_this, void 0, void 0, function () {
        var imgList, i, i, i, _a, _i, _b, item;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4, MineSweeper.__loadScript(["https://cdn.jsdelivr.net/combine/npm/vue@2.6.9/dist/vue.min.js,npm/systemjs@0.21.6/dist/system.min.js"])];
                case 1:
                    _c.sent();
                    imgList = [
                        "flag.png", "mine.png", "minex.png", "qm.png"
                    ];
                    for (i = 1; i <= 8; ++i) {
                        imgList.push(i + ".png");
                    }
                    for (i = 0; i <= 4; ++i) {
                        imgList.push("face" + i + ".png");
                    }
                    for (i = 0; i <= 9; ++i) {
                        imgList.push("t" + i + ".png");
                    }
                    return [4, MineSweeper.__loadImg(imgList)];
                case 2:
                    _c.sent();
                    System.config({
                        packages: {
                            "http:": { defaultExtension: "js" },
                            "https:": { defaultExtension: "js" }
                        },
                    });
                    _a = MineSweeper;
                    return [4, System.import(MineSweeper.__root + "MineSweeper")];
                case 3:
                    _a.__ms = _c.sent();
                    MineSweeper.__loaded = true;
                    for (_i = 0, _b = MineSweeper.__creates; _i < _b.length; _i++) {
                        item = _b[_i];
                        MineSweeper.__create(item[0], item[1], item[2]);
                    }
                    return [2];
            }
        });
    }); };
    if (typeof Promise !== "function") {
        var script = document.createElement("script");
        script.addEventListener("load", function () {
            callback();
        });
        script.addEventListener("error", function () {
            alert("Load error.");
        });
        script.src = "https://cdn.jsdelivr.net/npm/promise-polyfill@8.1.0/dist/polyfill.min.js";
        MineSweeper.__headEle.appendChild(script);
    }
    else {
        callback();
    }
});
document.addEventListener("touchstart", function () { });
(function () {
    var MineSweeperSrc = document.currentScript.src;
    if (MineSweeperSrc.indexOf("/") !== -1) {
        MineSweeper.__root = MineSweeperSrc.substr(0, MineSweeperSrc.lastIndexOf("/") + 1);
    }
})();
if (!Number.isInteger) {
    Number.isInteger = function (num) {
        return typeof num === "number" && num % 1 === 0;
    };
}
