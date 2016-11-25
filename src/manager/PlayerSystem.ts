class PlayerSystem {
    /**
     * 玩家自已的用户信息
     */
    private _selfPlayerInfo: PlayerInfo;

    private _playerList: HashMap<number,PlayerInfo>;

    public constructor() {
    }

    /**
     * 数据中心初始化
     *
     */
    public setup(): void {
        this._selfPlayerInfo = this.initialInformation();
        this._playerList = new HashMap<number,PlayerInfo>();
    }

    private initialInformation(): PlayerInfo {
        return new PlayerInfo();
    }

    public init(): void {
    }

    /**
     *
     * @param level 当前级别
     * @return
     *
     */
    public getLevelUpExp(level: number = 0): number {
        return 1;
    }


    /**
     * 取得用户角色信息
     * @param userID
     * @return
     *
     */
    public getPlayerInfo(playerID: number = 0): PlayerInfo {
        var info: PlayerInfo = this._playerList.get(playerID);
        return info ? info : this._selfPlayerInfo;
    }

    /**
     * 更新用户信息
     * @param info 旧的用户信息，如果有
     * @return
     *
     */
    public updatePlayerInfo(info: PlayerInfo): PlayerInfo {
        var oldInfo: PlayerInfo = this._playerList.get(info.userID);
        this._playerList.set(info.userID, info);
        return oldInfo;
    }

    /**
     * 取得玩家自已的信息
     * @return
     *
     */
    public get selfPlayerInfo(): PlayerInfo {
        return this._selfPlayerInfo;
    }


    /**
     * 缓存用户信息列表
     */
    public get playerList(): HashMap<number,PlayerInfo> {
        return this._playerList;
    }

    /**
     * 删除所有玩家
     */
    public removePlayers(): void {
        this._playerList.clear();
    }

}