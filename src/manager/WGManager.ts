/**
 * Created by stylehuan on 2016/7/26.
 */
class WGManager {
    private static _instance: WGManager;

    private _roomID: number;
    private _chairNo: number;
    private _lookerID: number;
    private _tableNo: number;

    private _wallData: Array<any>;//牌山数据
    private _isCompere: boolean = false;//是否是主播
    private _isCompereIng: boolean = false;//是否在解说中
    private _isCompereInGame: boolean = false;//解说是否在游戏
    private _isShowCardMount: boolean = false;//是否显示牌山
    private _isShowOtherCardHand: boolean = true;//是否显示其他玩家手牌

    public isInLiveRoom:boolean=false;

    public static getInstance(): WGManager {
        if (!this._instance) {
            this._instance = new WGManager();
        }
        return this._instance;
    }

    public setUp(): void {
        SocketEvent.addEventListener(Global.LSR_LEAVE_PLAYER.toString(), this.exitWGHandler, this);//退出围观
    }

    public get isShowOtherCardHand(): boolean {
        return this._isShowOtherCardHand;
    }

    public set isShowOtherCardHand(value: boolean) {
        this._isShowOtherCardHand = value;
    }

    public get isShowCardMount(): boolean {
        return this._isShowCardMount;
    }

    public set isShowCardMount(value: boolean) {
        this._isShowCardMount = value;
    }

    public get roomId(): number {
        return this._roomID;
    }

    public set roomId(value: number) {
        this._roomID = value;
    }

    public get tableNo(): number {
        return this._tableNo;
    }

    public set tableNo(value: number) {
        this._tableNo = value;
    }

    public get isCompere(): boolean {
        return this._isCompere;
    }

    public set isCompere(value: boolean) {
        this._isCompere = value;
    }

    public get isCompereIng(): boolean {
        return this._isCompereIng;
    }

    public set isCompereIng(value: boolean) {
        this._isCompereIng = value;
    }

    public get lookerID(): number {
        return this._lookerID;
    }

    public set lookerID(value: number) {
        this._lookerID = value;
    }

    public get chairNo(): number {
        return this._chairNo;
    }

    public set chairNo(value: number) {
        this._chairNo = value;
    }

    public get wallData(): Array<number> {
        return this._wallData;
    }

    public set wallData(value: Array<number>) {
        this._wallData = value;
    }

    public get isCompereInGame(): boolean {
        return this._isCompereInGame;
    }

    public set isCompereInGame(value: boolean) {
        this._isCompereInGame = value;
    }

    public isWgIng(): boolean {
        return this._lookerID > 0;
    }


    public sendExitWG(): void {
        //解说中
        if (this.isCompereIng) {
            this.compereExit();
        } else {
            this.playerExit();
        }
    }

    public  sendCompereWg(): void {
        var sendData: egret.ByteArray = new egret.ByteArray();
        var _wg: GHOST_ENTER_GAME = new GHOST_ENTER_GAME();
        _wg.nRoomID.value = this.roomId;
        _wg.nTableNO.value = this.tableNo;
        _wg.nLookerID.value = SystemCenter.playSystem.selfPlayerInfo.userID;
        CSerializable.Serialization(_wg, sendData);

        SQGameServer.getInstance().sendCmd(Global.SQR_GHOST_ENTERGAME, sendData);
    }

    private  playerExit(): void {
        var sendData: egret.ByteArray = new egret.ByteArray();
        var _leavePlayer: CLSLeavePlayer = new CLSLeavePlayer();
        _leavePlayer.nUserID.value = SystemCenter.playSystem.selfPlayerInfo.userID;
        _leavePlayer.nTarget.value = this.lookerID;

        LoadingManager.showLoading();
        CSerializable.Serialization(_leavePlayer, sendData);
        SQGameServer.getInstance().sendCmd(Global.LSR_LEAVE_PLAYER, sendData);
    }

    private  compereExit(): void {
        var sendData: egret.ByteArray = new egret.ByteArray();
        var _leavePlayer: GHOST_LEAVE_GAME = new GHOST_LEAVE_GAME();
        _leavePlayer.nRoomID.value = this.roomId;
        _leavePlayer.nTableNO.value = this.tableNo;
        _leavePlayer.nLookerID.value = SystemCenter.playSystem.selfPlayerInfo.userID;

        LoadingManager.showLoading();
        CSerializable.Serialization(_leavePlayer, sendData);
        SQGameServer.getInstance().sendCmd(Global.SQR_GHOST_LEAVEGAME, sendData);
    }

    private exitWGHandler(e: SocketEvent): void {
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        b.position = 0;
        b.endian = egret.Endian.LITTLE_ENDIAN;
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            this.exitSceneHandler();
        } else {
            this.exitSceneHandler();
        }
    }

    public  exitSceneHandler(): void {
        this.lookerID = -1;
        this.isCompereIng = false;

        SceneManagerExt.backCurrScene();
    }
}