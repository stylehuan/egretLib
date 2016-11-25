class PlayerInfo {
    private _userID: number = 0;
    private _playerName: string;  // 昵称
    private _levelName: string;
    private _levelID: number = 0;

    private _sign: string;
    private _cookie: string;
    private _headIcon: egret.Texture;

    private _roleId: number = 0;
    private _chairNo: number = 0;
    private _gameStatus: number;
    private _gameData: CGameUserGameData;
    private _gameUserInfo: CGameUserStatData;

    private _matchData: CLSUserMatchData;
    private _matchNewData: CGBMJUserMatchNewData;

    private _fourAnimalLabel: number;

    private _roomInfo: CGameRoom;
    private _userType: number;

    private _SaiquTicket: number;
    private _SaiquCoin: number;

    private _matchRoomId: number;

    public constructor() {

    }

    public get headIcon(): egret.Texture {
        return this._headIcon;
    }

    public set headIcon(value: egret.Texture) {
        this._headIcon = value;
    }

    public get SaiquCoin(): number {
        return this._SaiquCoin;
    }

    public set SaiquCoin(value: number) {
        this._SaiquCoin = value;
    }

    public get MatchRoomId(): number {
        return this._matchRoomId;
    }

    public set MatchRoomId(value: number) {
        this._matchRoomId = value;
    }


    public get SaiquTicket(): number {
        return this._SaiquTicket;
    }

    public set SaiquTicket(value: number) {
        this._SaiquTicket = value;
    }

    public get playerType(): number {
        return this._userType;
    }

    public set playerType(value: number) {
        this._userType = value;
    }

    public get chairNo(): number {
        return this._chairNo;
    }

    public set chairNo(value: number) {
        this._chairNo = value;
    }

    public get roleId(): number {
        return this._roleId;
    }

    public set userID(value: number) {
        if (!value) return;
        this._userID = value;
    }

    public get userID(): number {
        return this._userID;
    }


    /**
     * 玩家名称
     */
    public get playerName(): string {
        return this._playerName;
    }

    public get levelName(): string {
        return this._levelName;
    }

    public set levelName(value: string) {
        if (!value) return;
        this._levelName = value;
    }

    public get levelID(): number {
        return this._levelID;
    }

    public set levelID(value: number) {
        this._levelID = value;
    }

    public get sign(): string {
        return this._sign;
    }

    public set sign(value: string) {
        this._sign = value;
    }

    public set roleId(value: number) {
        this._roleId = value;
    }

    public set playerName(value: string) {
        this._playerName = value;
    }

    public get gameStatus(): number {
        return this._gameStatus;
    }

    public set gameStatus(value: number) {
        this._gameStatus = value;
    }

    public get fourAnimalLabel(): number {
        return this._fourAnimalLabel;
    }

    public set fourAnimalLabel(value: number) {
        this._fourAnimalLabel = value;
    }


    public get GameData(): CGameUserGameData {
        return this._gameData;
    }

    public set GameData(value: CGameUserGameData) {
        this._gameData = value;
    }

    public get MatchData(): CLSUserMatchData {
        return this._matchData;
    }

    public set MatchData(value: CLSUserMatchData) {
        this._matchData = value;
    }

    public get MatchNewData(): CGBMJUserMatchNewData {
        return this._matchNewData;
    }

    public set MatchNewData(value: CGBMJUserMatchNewData) {
        this._matchNewData = value;
    }


    public get gameUserInfo(): CGameUserStatData {
        return this._gameUserInfo;
    }

    public set gameUserInfo(value: CGameUserStatData) {
        this._gameUserInfo = value;
    }

    public get RoomInfo(): CGameRoom {
        return this._roomInfo;
    }

    public set RoomInfo(value: CGameRoom) {
        this._roomInfo = value;
    }

    /**
     * 返回用户密码
     * @returns {string}
     */
    //public static getPassword(): string {
    //    //return StorageManager.GetPdwByUserName(GlobalVar.UserName);
    //}
}