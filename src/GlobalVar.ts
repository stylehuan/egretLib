class GlobalVar {

    public static ConfigData: any;

    public static IsNative: boolean = false;
    public static IsBrowh: boolean = false;

    public static isDebug: boolean = false;
    public static isTest: boolean = false;
    public static isLocal: boolean = false;

    public static headTime: number = 30 * 1000;


    //吃碰杠胡
    public static MJ_PENG = 0x00000010;
    public static MJ_GANG = 0x00000020;
    public static MJ_CHI = 0x00000040;
    public static MJ_GANG_MN = 0x00001000;
    public static MJ_GANG_PN = 0x00002000;
    public static MJ_GANG_AN = 0x00004000;

    public static IsLiveMode: boolean = false;

    public static LoadDomain: string;


    //public static RemoteUrl: string = "http://gbmj.saiqu.com";         //正式
    //public static MainRemoteUrl: string = "http://www.saiqu.com";         //正式
    //public static ClientIp: string = "svr.saiqu.com"; //"47.88.136.117";//    //"42.121.113.56"    121.41.74.115;    svr.saiqu.com

    public static autoDelay: number = 2 * 1000;
    public static IS_BOUT_TIMEOUT: boolean = false;
    public static cuoHuTimeDown: number = 4;
    public static isReady: boolean = false;//是否准备就绪
    public static isBuHuaing: boolean = false;

    //public static LSR_CALC_GAINS:number = (thLS_REQ_BASE + 666);

    public static isInGame: boolean = false;//只胡自摸

    public static DanmuClientPort: number = 1855;   // 1855 弹幕服务器    - 1852 游戏服务器
    public static cardPool: number = 2;
    public static cardHand: number = 1;
    public static cardMount: number = 3;
    public static cardCH: number = 4;

    public static nRoomID: number;
    public static nBoutCount: number;

    public static UserID: number = -1;
    //public static LiveCode: number = 4;
    //public static FmsUrl: number = 4;
    public static UserName: string = "";  // 账号名

    public static IsLogin: boolean = false;
    public static ticket: string = "";


    public static IS_LOGIN_TIMEOUT: boolean;

    public static LoadingTimeoutNum: number = 10000;
    public static CARDCOUNT: number = 144;
    public static PLAYERCOUNT: number = 4;
    public static isDeal: boolean = false;//是否发牌
    public static actChairNo: number = 0;//当前活动椅子号

    public static sss = "登录失败:";
    public static nChairNo: number = 0;
    public static cardIndexCount: number = 144;
    public static maxCardType: number = 42;
    public static HandCardCount: number = 13;  //手牌数量

    public static msg_chi: string = "MSG_CHI";
    public static msg_peng: string = "MSG_PENG";
    public static msg_mgang: string = "MSG_MING_GANG";
    public static msg_hua: string = "MSG_HUA";
    public static msg_huaover: string = "MSG_HUA_OVER";
    public static msg_throw: string = "MSG_THROW";
    public static msg_caught: string = "MSG_CAUGHT";
    public static msg_pgang: string = "MSG_PENG_GANG";
    public static msg_agang: string = "MSG_AN_GANG";
    public static msg_cuohu: string = "MSG_CUO_HU";
    public static msg_guo: string = "MSG_GUO";
    public static msg_hu: string = "MSG_HU";
    public static msg_ys: string = "MSG_YS";

    public static isGameEnd: Boolean = true;//游戏是否结束

    //算番器用
    public static CurMatchID = 0;
    public static CurMultiID = 0;
    public static CurMultiBoutCount = 0;

    public static GameStatus: number = 0;  // 0-主场景 1, "段位联赛");    2, "友人房");    4, "练习场"   8:个人公开赛);

    public static CurBoutIndex = 0;
    public static Font_YaHei = "微软雅黑";
    public static FanDetailArr: Array<string>;

    public static dice: FixedArray;

    public static MAX_TIMEOUTNUMS: number = 2;

    public static BackBtnX: number = 5;
    public static BackBtnY: number = 5;

    public static isGodWGIng: boolean = false;
    public static wgUserChairNo: number;//围观的i椅子号
    public static wgUserId: number

    public static loginServersDate: number;//服务端时间
    public static loginLocalDate: number;//本地时间
    public static ServerLocalDateOff: number;
    public static MatchSigninLastTime: number;
    public static MatchSeatLastTime: number;

    public static CurMatchInfo: Object = {};
    public static CurMatchIndex: number = -1;

    public static isAutoPD: boolean = false;//是否自动排队。

    /**
     * 统一的计时器和帧刷管理类
     * @type {TimerManager}
     */
    public static get TimerManager(): TimerManager {
        return TimerManager.getInstance();
    }

    public static isAnd(source: number, target: number): boolean {
        if ((source & target) == target) {
            return true;
        }
        return false;
    }

    public static IndexTabType: number;//首页登录类型


    public static inputPwWg: string = "inputPwWg";
    public static inputPwSitDown: string = "inputPwSitDown";


    public static enterRoomID: number = 0;
    public static enterRoomPw: string = "";

    public static shellSaveToken: string = "";

    public static TweenMax_Normal_Speed: number = .6;
}