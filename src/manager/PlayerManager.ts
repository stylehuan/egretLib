class PlayerManager {
    public static myPlayer:PlayerData;
    public static upPlayer:PlayerData;
    public static leftPlayer:PlayerData;
    public static rightPlayer:PlayerData;

    public static positionToPlayer:Array<PlayerData>;

    /**
     * 创建初始玩家数据
     */
    public static init():void {
        PlayerManager.positionToPlayer = new Array<PlayerData>(4);
    }

    public static createPlayerData():void {
        if (!PlayerManager.myPlayer) {
            PlayerManager.myPlayer = new PlayerData();
        }
        if (!PlayerManager.upPlayer) {
            PlayerManager.upPlayer = new PlayerData();
        }
        if (!PlayerManager.leftPlayer) {
            PlayerManager.leftPlayer = new PlayerData();
        }
        if (!PlayerManager.rightPlayer) {
            PlayerManager.rightPlayer = new PlayerData();
        }

    }

    /**
     * 对chair进行方向关联
     */
    public static linkePostion(myChair:number = 0):void {
        if (myChair == 0) {
            PlayerManager.positionToPlayer[0] = PlayerManager.myPlayer;
            PlayerManager.positionToPlayer[1] = PlayerManager.leftPlayer;
            PlayerManager.positionToPlayer[2] = PlayerManager.upPlayer;
            PlayerManager.positionToPlayer[3] = PlayerManager.rightPlayer;
        } else if (myChair == 1) {
            PlayerManager.positionToPlayer[1] = PlayerManager.myPlayer;
            PlayerManager.positionToPlayer[2] = PlayerManager.leftPlayer;
            PlayerManager.positionToPlayer[3] = PlayerManager.upPlayer;
            PlayerManager.positionToPlayer[0] = PlayerManager.rightPlayer;
        } else if (myChair == 2) {
            PlayerManager.positionToPlayer[2] = PlayerManager.myPlayer;
            PlayerManager.positionToPlayer[3] = PlayerManager.leftPlayer;
            PlayerManager.positionToPlayer[0] = PlayerManager.upPlayer;
            PlayerManager.positionToPlayer[1] = PlayerManager.rightPlayer;
        } else if (myChair == 3) {
            PlayerManager.positionToPlayer[3] = PlayerManager.myPlayer;
            PlayerManager.positionToPlayer[0] = PlayerManager.leftPlayer;
            PlayerManager.positionToPlayer[1] = PlayerManager.upPlayer;
            PlayerManager.positionToPlayer[2] = PlayerManager.rightPlayer;
        }
    }

    public static getPlayerHandData(chairNo:number = 0):Array<any> {
        return PlayerManager.positionToPlayer[chairNo].handArr;
    }


    /**
     * 增加手牌
     */
    public static addCardData(chairNo:number, index:number = 0):void {
        PlayerManager.positionToPlayer[chairNo].addCardData(index);

    }

    /**
     * 删除手牌
     */
    public static delCardData(chairNo:number, index:number = 0):void {
        PlayerManager.positionToPlayer[chairNo].delCardData(index);
    }

    /**
     * 清理所有玩家数据
     */
    public static clearPlayerData():void {
        if (PlayerManager.myPlayer) {
            PlayerManager.myPlayer.destroy();
            PlayerManager.myPlayer = null;
        }
        if (PlayerManager.upPlayer) {
            PlayerManager.upPlayer.destroy();
            PlayerManager.upPlayer = null;
        }
        if (PlayerManager.rightPlayer) {
            PlayerManager.rightPlayer.destroy();
            PlayerManager.rightPlayer = null;
        }
        if (PlayerManager.leftPlayer) {
            PlayerManager.leftPlayer.destroy();
            PlayerManager.leftPlayer = null;
        }
    }

    public static getPlayerData(chairNo:number):PlayerData {
        return this.positionToPlayer[chairNo];
    }
}