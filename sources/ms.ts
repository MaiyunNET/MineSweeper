/*
 * MineSweeper
 * Author: Han Guoshuai
 * Github: https://github.com/MaiyunNET/MineSweeper
 */

window.onerror = (msg, uri, line, col, err) => {
    if (err) {
        alert("Error:\n" + err.message + "\n" + err.stack + "\nLine: " + line + "\nColumn: " + col);
    } else {
        console.log(msg);
    }
};

class MineSweeper {
    public static __loaded: boolean = false;
    public static __creates: any[] = [];
    public static __root: string = "";
    public static __ms: any;

    /**
     * --- 在 DOM 处创建画布 ---
     * @param el 元素
     */
    public static create(el: string | HTMLElement): MineSweeper {
        let $el;
        if (typeof el === "string") {
            $el = <HTMLElement>document.querySelector(el);
        } else {
            $el = el;
        }
        $el.classList.add("MineSweeper", "MineSweeper--init");
        // $el.setAttribute("@contextmenu", "event.preventDefault()");
        let html = `` +
        `<div class="MineSweeper__top">` +
            `<div class="MineSweeper__number">` +
                `<div class="MineSweeper__num" :class="['MineSweeper__num'+mine[0]]"></div>` +
                `<div class="MineSweeper__num" :class="['MineSweeper__num'+mine[1]]"></div>` +
                `<div class="MineSweeper__num" :class="['MineSweeper__num'+mine[2]]"></div>` +
            `</div>` +
            `<div class="MineSweeper__tcenter">` +
                `<div class="MineSweeper__tbtn"></div>` +
            `</div>` +
            `<div class="MineSweeper__number">` +
                `<div class="MineSweeper__num" :class="['MineSweeper__num'+time[0]]"></div>` +
                `<div class="MineSweeper__num" :class="['MineSweeper__num'+time[1]]"></div>` +
                `<div class="MineSweeper__num" :class="['MineSweeper__num'+time[2]]"></div>` +
            `</div>` +
        `</div>` +
        `<div class="MineSweeper__box">` +
            `<div v-for="(line, y) of blocks" class="MineSweeper__line">` +
                `<div v-for="(num, x) of line" class="MineSweeper__block" :class="[` +
                    `num > 0 ? 'MineSweeper__block--' + num : '',` +
                    `num === -6 ? 'MineSweeper__block--red' : '',` +
                    `num === -2 ? 'MineSweeper__block--flag' : '',` +
                    `num === -3 ? 'MineSweeper__block--qm' : '',` +
                    `{` +
                        `'MineSweeper__block--t': [-1, -2, -3].indexOf(num) !== -1,` +
                        `'MineSweeper__block--flag': num === -2,` +
                        `'MineSweeper__block--mine': [-5, -6].indexOf(num) !== -1,` +
                        `'MineSweeper__block--minex': num === -3,` +
                        `'MineSweeper__block--qm': num === -3,` +
                    `}` +
                `]" @click="sweep(x, y)"></div>` +
            `</div>` +
        `</div>` +
        `<div class="MineSweeper__mask">` +
            `<div class="MineSweeper__spin MineSweeper__spin-spinning"><span class="MineSweeper__spin-dot"><i></i><i></i><i></i><i></i></span></div>` +
        `</div>`;
        $el.innerHTML = html;
        let ms = new MineSweeper();
        if (this.__loaded) {
            this.__create($el, {}, ms);
        } else {
            this.__creates.push([$el, {}, ms]);
        }
        return ms;
    }
    public static __create(el: string | HTMLElement, opt: any, ms: MineSweeper): void {
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
                mine: function(this: any) {
                    return this.pad(this.mineNum);
                },
                time: function(this: any) {
                    return this.pad(this.timeNum);
                }
            },
            methods: {
                pad: function(num: number): string {
                    let l = 3 - num.toString().length;
                    if (l > 0) {
                        let str: string = "";
                        for (let k = 0; k < l; ++k) {
                            str += "0";
                        }
                        return str + num.toString();
                    } else {
                        return num.toString();
                    }
                },
                // --- 点击 ---
                sweep: function(x: number, y: number) {
                    ms.__mis.sweep(x, y);
                    ms.__vue.blocks = ms.__mis.getMap();
                }
            },
            mounted: function () {
                this.$nextTick(() => {
                    // --- 移除 init ---
                    let $el = (<HTMLElement>ms.__vue.$el);
                    $el.classList.remove("MineSweeper--init");
                    $el.removeChild(<Node>$el.querySelector(".MineSweeper__mask"));
                });
            }
        });
        // --- 初始化 ---
        ms.__vue.blocks = ms.__mis.getMap();
    }

    // --- 以下是实例化 ---
    public __vue: any;
    public __mis: any;

    // --- 以下是工具 ---

    /** head 标签 */
    public static __headEle: HTMLHeadElement;
    /** 已加载的外部路径 */
    private static _outPath: string[] = [];

    /**
     * --- 顺序加载 js 后再执行 callback ---
     * @param paths 要加载文件的路径数组
     * @param cb 加载完后执行的回调
     */
    public static __loadScript(paths: string[]): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                if (paths.length > 0) {
                    for (let i = 0; i < paths.length; ++i) {
                        if (this._outPath.indexOf(paths[i]) === -1) {
                            this._outPath.push(paths[i]);
                            await this._loadOutScript(paths[i]);
                        }
                    }
                }
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }

    // --- 加载 script 标签（1条）并等待返回成功（无视是否已经加载过） ---
    private static _loadOutScript(path: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            let script = document.createElement("script");
            script.addEventListener("load", () => {
                resolve();
            });
            script.addEventListener("error", () => {
                reject("Load error.");
            });
            script.src = path;
            this.__headEle.appendChild(script);
        });
    }

    /**
     * --- 预加载 img 资源 ---
     * @param paths 要加载的图片列表
     */
    public static __loadImg(paths: string[]): Promise<void> {
        return new Promise(async (resolve, reject) => {
            let pl = paths.length;
            let $div = document.createElement("div");
            $div.classList.add("MineSweeper__loadImg");
            document.body.appendChild($div);
            for (let path of paths) {
                let $img = document.createElement("img");
                $img.addEventListener("load", () => {
                    --pl;
                    if (pl === 0) {
                        document.body.removeChild($div);
                        resolve();
                    }
                });
                $img.setAttribute("src", this.__root + "img/" + path);
                $div.appendChild($img);
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    MineSweeper.__headEle = document.getElementsByTagName("head")[0];
    // --- 先加载异步对象，这个很重要 ---
    let callback = async () => {
        // --- 加载 script ---
        await MineSweeper.__loadScript(["https://cdn.jsdelivr.net/combine/npm/vue@2.6.9/dist/vue.min.js,npm/systemjs@0.21.6/dist/system.min.js"]);
        // --- 加载图片 ---
        let imgList: string[] = [
            "flag.png", "mine.png", "minex.png", "qm.png"
        ];
        for (let i = 1; i <= 8; ++i) {
            imgList.push(i + ".png");
        }
        for (let i = 0; i <= 4; ++i) {
            imgList.push("face" + i + ".png");
        }
        for (let i = 0; i <= 9; ++i) {
            imgList.push("t" + i + ".png");
        }
        await MineSweeper.__loadImg(imgList);
        // --- 加载核心类 ---
        System.config({
            packages: {
                "http:": {defaultExtension: "js"},
                "https:": {defaultExtension: "js"}
            },
        });
        MineSweeper.__ms = await System.import(MineSweeper.__root + "MineSweeper");
        // --- 组件注册 ---
        // --- 没有要注册的组件 ---
        // --- 全部加载完成，标记加载完成 ---
        MineSweeper.__loaded = true;
        for (let item of MineSweeper.__creates) {
            MineSweeper.__create(item[0], item[1], item[2]);
        }
    };
    if (typeof Promise !== "function") {
        let script = document.createElement("script");
        script.addEventListener("load", () => {
            callback();
        });
        script.addEventListener("error", () => {
            alert("Load error.");
        });
        script.src = "https://cdn.jsdelivr.net/npm/promise-polyfill@8.1.0/dist/polyfill.min.js";
        MineSweeper.__headEle.appendChild(script);
    } else {
        callback();
    }
});
document.addEventListener("touchstart", function() {});

(() => {
    let  MineSweeperSrc = (<HTMLScriptElement>document.currentScript).src;
    if (MineSweeperSrc.indexOf("/") !== -1) {
        MineSweeper.__root = MineSweeperSrc.substr(0, MineSweeperSrc.lastIndexOf("/") + 1);
    }
})();

if (!Number.isInteger) {
    Number.isInteger = (num: any): boolean => {
        return typeof num === "number" && num % 1 === 0;
    };
}

