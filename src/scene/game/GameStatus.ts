/**
 * Created by stylehuan on 2016/8/4.
 */
class GameStatus {
    public static STATUS_READYING:string = "STATUS_READYING";//准备中
    public static STATUS_GAME_DEAL:string = "STATUS_DEAL";//发牌
    public static STATUS_GAME_BUHUA:string = "STATUS_GAME_BUHUA";
    public static STATUS_GAME_PLAYING:string = "STATUS_GAME_PLAYING";
    public static STATUS_GAME_END:string = "STATUS_GAME_END";

    private static _curStatus:string;

    public static reset():void {
        this._curStatus = this.STATUS_READYING;
    }

    public static get status():string {
        return this._curStatus;
    }

    public static set status(value:string) {
        this._curStatus = value;
    }

    public static isReadying():boolean {
        return this._curStatus == this.STATUS_READYING;
    }

    public static isGameBuHua():boolean {
        return this._curStatus == this.STATUS_GAME_BUHUA;
    }

    public static isGamePlaying():boolean {
        return this._curStatus == this.STATUS_GAME_PLAYING;
    }

    public static isGameEnd():boolean {
        return this._curStatus == this.STATUS_GAME_END;
    }
}