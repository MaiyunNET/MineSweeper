declare class MineSweeper {
    static __loaded: boolean;
    static __creates: any[];
    static __root: string;
    static __ms: any;
    static create(el: string | HTMLElement): MineSweeper;
    static __create(el: string | HTMLElement, opt: any, ms: MineSweeper): void;
    __vue: any;
    __mis: any;
    static __headEle: HTMLHeadElement;
    private static _outPath;
    static __loadScript(paths: string[]): Promise<void>;
    private static _loadOutScript;
    static __loadImg(paths: string[]): Promise<void>;
}
