/**
 * Created by stylehuan on 2016/8/4.
 */
class DeskManager {
    private static _instance: DeskManager;

    public static getInstance(): DeskManager {
        if (!this._instance) {
            this._instance = new DeskManager();
        }
        return this._instance;
    }

    public isAutoMD: boolean = false;
    public isAutoBH: boolean = true;
    public isOnlyHuZimo: boolean = false;
    public isNoChi: boolean = false;
    public isNoPeng: boolean = false;
    public isNoGang: boolean = false;


    public delayCount: number;//延迟次数
    public timeDownCount: number = 0;//倒计时自动到0的次数
    public askExitCount: number = 0;//请求退出次数

    public checkHandCardNum: number = 0;// 检查手牌超过10次，肯定是网络不太好
    public firstPerson: number = -1;//第一人称id

    public makeCuohuCount: number = 0//记录错胡次数

    public waitIngDJS: number;


    public soloTable: CGameSOLOTABLE;
    public playerArr: Array<CGamePlayerData>;
    public gameInfoXW: CGameTableInfo;
    public gameStartInfo: CGameStartInfo;

    public cGameWin: CGameWinResult;
    public cGameHuDetails: CGameHU_DETAILS;
    public finallyResultData: Array<LSR_FINALLY_RESULTS>;

    public todoTaskPipe: Array<any>;
    public surplusCard: number = 144;

    public nChairNo: number;
    public actChairNo: number;
    public dice: FixedArray;
    public nBanker: number;
    public nRoomID: number;
    public nBoutCount: number;
    public catchCardBegin: number;
    public nBeginNO: number;

    public isXw: boolean = false;
    public isAllowDaChu: boolean = false;

    public isPDIng: boolean = false;//排队中

    public isBuhuaDraw: boolean = false;//补花是否重绘

    public tempTimer: number;

    public dealerTimer: egret.Timer;//发牌时间
    public dealerCount: number = 0;//发牌次数

    public isWaiting: boolean = false;//是否是两局中间
    public isInGameScene: boolean = false;//是否在游戏场景

    public huChair: number = -1;

    public init() {

        this.todoTaskPipe = [];
        var gameStartInfo = this.gameStartInfo;
        var soloTable = this.soloTable;

        if (this.isXw) {
            gameStartInfo = this.gameInfoXW.StartData;
        }

        this.delayCount = gameStartInfo.nDelayCount.value;
        this.askExitCount = gameStartInfo.nAskExitCount.value;

        this.firstPerson = SystemCenter.playSystem.selfPlayerInfo.userID;
        //如果是围观
        if (WGManager.getInstance().isWgIng()) {
            this.firstPerson = WGManager.getInstance().lookerID;
        }

        this.nChairNo = soloTable.nUserIDs.indexOf(this.firstPerson);
        this.actChairNo = gameStartInfo.nCurrentChair.value;
        this.dice = gameStartInfo.nDices;
        this.nBanker = gameStartInfo.nBanker.value;
        this.nRoomID = soloTable.nRoomID.value;
        this.nBoutCount = gameStartInfo.nBoutCount.value;
        this.catchCardBegin = gameStartInfo.nBeginNO.value;

        if (this.isXw) {
            this.delayCount = gameStartInfo.nDelayCount.value - this.gameInfoXW.PlayData.nPlayerDelay.getAt(this.nChairNo).value;
        }
    }

    public reset(): void {
        this.dealerTimer = null;
        this.dealerCount = 0;

        this.huChair = -1;

        this.isAutoMD = false;
        this.isAutoBH = true;
        this.isOnlyHuZimo = false;
        this.isNoChi = false;
        this.isNoPeng = false;
        this.isNoGang = false;

        this.isBuhuaDraw = false;


        this.delayCount = 0;//延迟次数
        this.timeDownCount = 0;//倒计时自动到0的次数
        this.askExitCount = 0;//请求退出次数

        this.checkHandCardNum = 0;// 检查手牌超过10次，肯定是网络不太好
        this.firstPerson = -1;//第一人称id

        this.makeCuohuCount = 0;//记录错胡次数


        this.soloTable = null;
        this.playerArr = null;
        this.gameInfoXW = null;
        this.gameStartInfo = null;
        this.todoTaskPipe = null;
        this.surplusCard = 144;

        this.cGameWin = null;
        this.cGameHuDetails = null;
        this.finallyResultData = null;

        this.nChairNo = -1;
        this.actChairNo = -1;
        this.dice = null;
        this.nBanker = -1;
        this.nRoomID = -1;
        this.nBoutCount = -1;
        this.catchCardBegin = -1;


        this.isXw = false;
        this.isAllowDaChu = false;

        this.isPDIng = false;//排队中

        egret.clearTimeout(this.tempTimer);
        this.tempTimer = 0;
    }

    public getCardPoolByDir(dir: number = 0): DeskPoolContainer {
        switch (dir) {
            case 1:
                return MahjongDeskView.getInstance()._topPoolContainer;
            case 2:
                return MahjongDeskView.getInstance()._rightPoolContainer;
            case 3:
                return MahjongDeskView.getInstance()._downPoolContainer;
            case 4:
                return MahjongDeskView.getInstance()._leftPoolContainer;
        }
        return null;
    }
}