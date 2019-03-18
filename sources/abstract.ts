/**
 * 块类型枚举
 */
export enum EBlockType {

    /**
     * 未探测地区
     */
    UNKNWON = -1,

    /**
     * 已标记为雷区
     */
    MARKED = -2,

    /**
     * 已标记为未知
     */
    QUESTION = -3,

    /**
     * 【在游戏失败后可见】错误的雷区标记
     */
    WRONG = -4,

    /**
     * 【在游戏失败后可见】雷区
     */
    MINE = -5,

    /**
     * 【在游戏失败后可见】因为点错而爆炸导致失败的雷区
     */
    DEAD = -6
}

/**
 * 游戏状态
 */
export enum EGameStatus {

    /**
     * 进行中
     */
    PLAYING,

    /**
     * 已胜利
     */
    WIN,

    /**
     * 已失败
     */
    FAILED
}

/**
 * 标注类型
 */
export enum EMarkStyle {

    /**
     * 无标注
     */
    NONE,

    /**
     * 雷区
     */
    MINE,

    /**
     * 未知
     */
    QUESTION
}

export interface IMineSweeper {

    /**
     * 开启一局新游戏。
     */
    restart(): void;

    /**
     * 获取地图宽度。
     */
    getWidth(): number;

    /**
     * 获取地图高度。
     */
    getHeight(): number;

    /**
     * 获取总雷数。
     */
    getMineQuantity(): number;

    /**
     * 获取当前游戏的状态。
     */
    getStatus(): EGameStatus;

    /**
     * 获取当前这局剩余的雷数。
     */
    getRestMineQuantity(): number;

    /**
     * 获取所有位置的块描述信息。
     */
    getMap(): number[][];

    /**
     * 将指定的块标记为雷区，成功返回 true，失败返回 false。
     *
     * @param x         横坐标
     * @param y         纵坐标
     * @param style     标注类型
     */
    mark(x: number, y: number, style: EMarkStyle): boolean;

    /**
     * 探索一个地区。
     *
     * @param x 横坐标
     * @param y 纵坐标
     */
    sweep(x: number, y: number): EGameStatus;

    /**
     * 无雷扫描。
     *
     * @param x 横坐标
     * @param y 纵坐标
     */
    explore(x: number, y: number): EGameStatus;

    /**
     * 获取从游戏开始到现在，已经使用的时间。（毫秒）
     */
    getUsedTime(): number;
}
