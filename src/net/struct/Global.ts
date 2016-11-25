class Global {
    public static LS_REQ_BASE: number = 800000;
    public static GAME_REQ_BASE_EX: number = 200000;
    public static REQ_BASE: number = 800000;
    public static SQREQ_BASE: number = 500000;

    public static MJ_CHAIR_CARDS: number = 32;
    public static LSR_CALC_GAINS: number = Global.REQ_BASE + 666;
    public static APP_NAME: string = "zgda";
    public static VER_MAJOR: number = 1;
    public static VER_MINOR: number = 0;
    public static VER_BUILDNO: number = 20140603;

    public static GAME_ID: number = 53;
    public static GAME_PORT: number = 31353;

    public static ServerIp: string;
    public static ServerPort: number = 0;


    /**
     *围观延时5分钟
     */
    public static SQR_GHOST_ENTERGAME: number = (Global.SQREQ_BASE + 205);
    public static SQR_GHOST_LEAVEGAME: number = (Global.SQREQ_BASE + 210);
    public static SQR_GHOST_NOTIFYDATA: number = (Global.SQREQ_BASE + 215);
    public static LSPLAYER_STATUS_GHOST: number = 0x01000000; // GHOST旁观

    public static LSR_GET_ONE_GHOSTROOMINFO: number = (Global.LS_REQ_BASE + 315)
    public static LSR_GET_SCENE_GHOSTROOMINFO: number = (Global.LS_REQ_BASE + 320)
    public static LSR_GET_ADD_GHOSTROOM: number = (Global.LS_REQ_BASE + 325)
    public static LSR_GET_REMOVE_GHOSTROOM: number = (Global.LS_REQ_BASE + 330)

    public static USER_TYPE_LIVER: number = 1;
    public static USER_TYPE_GM: number = 2;

    //struct
    public static TOTAL_CHAIRS: number = 4;
    public static MAX_CHAIR_COUNT: number = 8;
    public static CHAIR_CARDS: number = 32;
    public static MAX_DICE_NUM: number = 4//骰子的数量

    public static MJ_TOTAL_CARDS: number = 152//骰子的数量

    public static MJ_MAX_GANG: number = 6;
    public static MJ_MAX_CHI: number = 6;
    public static MJ_MAX_OUT: number = 36;
    public static MJ_MAX_HUA: number = 36;
    public static MJ_UNIT_LEN: number = 4;
    public static MJ_CHAIR_COUNT: number = 4;
    public static MJ_MAX_PENG: number = 6;
    public static MAX_CHAIRS_PER_TABLE: number = 8;
    public static HU_MAXTYPE: number = 100;

    public static MJ_HU_FLAGS_ARYSIZE: number = 4
    public static MJ_HU_GAINS_ARYSIZE: number = 32
    public static MJ_MAX_UNITS: number = 8;

    //HU_DETAILS
    public static MJ_CT_SHUN: number = 0x00000001	// 顺子
    public static MJ_CT_KEZI: number = 0x00000002	// 刻子
    public static MJ_CT_DUIZI: number = 0x00000004	// 麻将小对子
    public static MJ_CT_GANG: number = 0x00000008	// 杠子


    public static UR_REQ_BASE: number = 0;

    //public static  GR_GET_VERSION		:number = GAME_REQ_BASE_EX + 1001;	// 获取版本信息
    //public static  GR_TABLE_INFO		:number = GAME_REQ_BASE_EX + 1140;	// 获取桌面信息
    public static GR_BANKER_AUCTION: number = Global.GAME_REQ_BASE_EX + 21165;	// 玩家叫庄通知
    public static GR_AUCTION_FINISHED: number = Global.GAME_REQ_BASE_EX + 21168;	// 叫庄结束通知
    public static GR_CARDS_PASS: number = Global.GAME_REQ_BASE_EX + 23100;	// 玩家放弃通知
    //public static  GR_GAME_PULSE		:number = GAME_REQ_BASE_EX + 1020;	//
    //public static  GR_GAME_START		:number = GAME_REQ_BASE_EX + 11040;
    public static GR_TOCLIENT_OFFLINE: number = Global.GAME_REQ_BASE_EX + 11240;
    //public static  GR_ENTER_GAME_EX		:number = GAME_REQ_BASE_EX + 110;
    // 斗地主web - 发给服务端的信息
    public static GR_AUCTION_BANKER: number = Global.GAME_REQ_BASE_EX + 21070;	// 玩家叫庄信息
    public static GR_PASS_CARDS: number = Global.GAME_REQ_BASE_EX + 23000;		// 玩家出牌信息
    public static GR_SENDMSG_TO_SERVER: number = Global.GAME_REQ_BASE_EX + 29510   // 发送消息
    public static GR_SENDMSG_TO_PLAYER: number = Global.GAME_REQ_BASE_EX + 29500   // 系统通知，转发其他玩家
    public static GR_CHAT_FROM_TALBE: number = Global.GAME_REQ_BASE_EX + 11200   // 通知用户消息
    //public static  GR_TABLE_INFO	:number= GAME_REQ_BASE_EX + 10005;		// 返回桌面信息
    //public static  GR_INVALID_IDENTITY	:number= GAME_REQ_BASE_EX + 10008;		// 验证身份失败
    //public static  GR_GAME_NOT_READY	:number= GAME_REQ_BASE_EX + 10010;		// 返游戏没有开始
    //public static  GR_HAVE_NO_CHAIR	:number= GAME_REQ_BASE_EX + 10020;		// 没有可用座位
    //public static  GR_BREAK_CUT_YES	:number= GAME_REQ_BASE_EX + 10030;		// 逃跑扣银成立
    //public static  GR_BREAK_CUT_NOT	:number= GAME_REQ_BASE_EX + 10040;		// 逃跑不会扣银
    //public static  GR_WAIT_FEW_SECONDS	:number= GAME_REQ_BASE_EX + 10050;		// 需要等待几秒
    public static GR_HARDID_MISMATCH: number = Global.GAME_REQ_BASE_EX + 10060;		// 硬件验证失败
    public static GR_ROOM_TOKENID_MISMATCH: number = Global.GAME_REQ_BASE_EX + 10070;		// 令牌验证失败
    public static GR_ROOMTABLECHAIR_MISMATCH: number = Global.GAME_REQ_BASE_EX + 10078;		// 位置验证失败
    //public static  GR_LEAVEGAME_TOOFAST	:number= GAME_REQ_BASE_EX + 10085;		// 太快退出游戏，不能退出
    //public static  GR_LEAVEGAME_PLAYING	:number= GAME_REQ_BASE_EX + 10086;		// 游戏正在进行中，不能退出

    public static USER_GAME_START: number = Global.GAME_REQ_BASE_EX + 1160;

    //** 都地主web版消息

    //public static 	SQR_LOGIN_GAME			:number = SQREQ_BASE + 15;
    public static SQR_ENTER_ROOM: number = Global.REQ_BASE + 20;
    public static SQR_LEAVE_ROOM: number = Global.REQ_BASE + 25;
    public static SQR_ENTER_GAME: number = Global.GAME_REQ_BASE_EX + 110;

    public static GBMJR_MATCHNEW_ENTERROOM: number = Global.REQ_BASE + 370;
    public static GBMJR_MATCHNEW_LEAVEROOM: number = Global.REQ_BASE + 375;


    public static SQR_TOKEN_MISSING: number = Global.SQREQ_BASE + 10;//离线
    public static SQR_TOKEN_PULSE: number = Global.SQREQ_BASE + 5;//回来

    public static LSR_GET_LEVELINFO: number = Global.LS_REQ_BASE + 170;
    public static LSR_PLAYER_STATUS: number = Global.LS_REQ_BASE + 180;//玩家状态
    public static LSPLAYER_STATUS_LOOKING: number = 0x00080000;	// 旁观

    public static SQR_SEND_BRIEF: number = Global.SQREQ_BASE + 200;//走马灯
    public static LSR_HU_BIGFAN: number = Global.LS_REQ_BASE + 270;//走马灯

    //游戏消息

    public static GR_START_GAME: number = Global.GAME_REQ_BASE_EX + 1160		// 玩家开始游戏
    public static GR_GIVE_UP_GAME: number = Global.GAME_REQ_BASE_EX + 1180		// 玩家认输不玩

    public static GR_START_SOLOTABLE: number = Global.GAME_REQ_BASE_EX + 11028;
    public static GR_CATCH_CARD: number = Global.GAME_REQ_BASE_EX + 29000;// 玩家抓牌
    public static GR_CARD_CAUGHT: number = Global.GAME_REQ_BASE_EX + 29160		// 玩家抓牌通知
    public static GR_THROW_CARDS: number = Global.GAME_REQ_BASE_EX + 22080		// 玩家出牌
    public static GR_CARDS_THROW: number = Global.GAME_REQ_BASE_EX + 22170		// 玩家出牌通知

    public static GR_RESPONE_ENTER_GAME_OK: number = Global.GAME_REQ_BASE_EX + 10200		//用户进入游戏成功，不在游戏中,带ENTER_GAME_INFO结构
    public static GR_RESPONE_ENTER_GAME_DXXW: number = Global.GAME_REQ_BASE_EX + 10210		//用户进入游戏成功，断线续完，带GAME_TABLE_INFO结构

    public static MJ_PENG: number = 0x00000010	// 碰
    public static MJ_CHI: number = 0x00000040	// 吃
    public static MJ_HU: number = 0x00000080	// 胡
    public static MJ_HUA: number = 0x00000100	// 补花
    public static MJ_GUO: number = 0x00000200	// 过牌


    public static MJ_GANG_MN: number = 0x00001000	// 明杠
    public static MJ_GANG_PN: number = 0x00002000	// 碰杠
    public static MJ_GANG_AN: number = 0x00004000 //暗杠


    public static MJ_PGCH_SUCC: number = 0x10000000	//


    public static MJ_HU_FANG: number = 0x00000001	// 放冲
    public static MJ_HU_ZIMO: number = 0x00000002 // 自摸
    public static MJ_HU_QGNG: number = 0x00000004// 抢杠
    public static MJ_CT_BUKAOSHUN: number = 0x00001000	// 不靠顺子

    public static GR_PREPENG_CARD: number = Global.GAME_REQ_BASE_EX + 29010		// 玩家准备碰牌
    public static GR_PREGANG_CARD: number = Global.GAME_REQ_BASE_EX + 29015		// 玩家准备杠牌
    public static GR_PRECHI_CARD: number = Global.GAME_REQ_BASE_EX + 29020		// 玩家准备吃牌
    public static GR_PREHU_CARD: number = Global.GAME_REQ_BASE_EX + 29081		// 玩家胡牌
    public static GR_HU_GAINS_LESS: number = Global.GAME_REQ_BASE_EX + 29100		// 胡牌失败花数不够


    public static GR_PREMN_GANG_CARD: number = Global.GAME_REQ_BASE_EX + 29015		// 玩家杠牌明杠
    //		public static  GR_PREAN_GANG_CARD:number = 	Global.GAME_REQ_BASE_EX + 29017		// 玩家杠牌暗杠
    //		public static  GR_PREPN_GANG_CARD:number = 	Global.GAME_REQ_BASE_EX + 29019		// 玩家杠牌碰杠


    public static GR_GUO_CARD: number = Global.GAME_REQ_BASE_EX + 29005		// 玩家过牌
    public static GR_PENG_CARD: number = Global.GAME_REQ_BASE_EX + 29025		// 玩家碰牌
    public static GR_CHI_CARD: number = Global.GAME_REQ_BASE_EX + 29030		// 玩家吃牌
    public static GR_MN_GANG_CARD: number = Global.GAME_REQ_BASE_EX + 29045		// 玩家杠牌明杠
    public static GR_AN_GANG_CARD: number = Global.GAME_REQ_BASE_EX + 29047		// 玩家杠牌暗杠
    public static GR_PN_GANG_CARD: number = Global.GAME_REQ_BASE_EX + 29049		// 玩家杠牌碰杠
    public static GR_HUA_CARD: number = Global.GAME_REQ_BASE_EX + 29060		// 玩家补花
    public static GR_HU_CARD: number = Global.GAME_REQ_BASE_EX + 29080		// 玩家胡牌

    public static GR_OVER_HUA: number = Global.GAME_REQ_BASE_EX + 22180		// 结束补花

    // 名
    //通知
    public static GR_CARD_PENG: number = Global.GAME_REQ_BASE_EX + 29185		// 玩家碰牌
    public static GR_CARD_CHI: number = Global.GAME_REQ_BASE_EX + 29190		// 玩家吃牌
    public static GR_CARD_MN_GANG: number = Global.GAME_REQ_BASE_EX + 29195		// 玩家杠牌明杠
    public static GR_CARD_AN_GANG: number = Global.GAME_REQ_BASE_EX + 29197		// 玩家杠牌暗杠
    public static GR_CARD_PN_GANG: number = Global.GAME_REQ_BASE_EX + 29199		// 玩家杠牌碰杠
    public static GR_CARD_HUA: number = Global.GAME_REQ_BASE_EX + 29210		// 玩家补花
    public static GR_CARD_GUO: number = Global.GAME_REQ_BASE_EX + 29165	// 玩家过牌
    public static GR_HUA_OVER: number = Global.GAME_REQ_BASE_EX + 22185		// 补花结束


    public static GR_GAME_WIN: number = Global.GAME_REQ_BASE_EX + 11080		// 玩家出牌获胜

    public static SQR_GET_ROOMINFO: number = 800080   //


    // result define
    public static UR_OPERATE_SUCCEEDED: number = Global.UR_REQ_BASE + 10   //
    public static UR_OPERATE_FAILED: number = Global.UR_REQ_BASE + 10100    //

    //
    public static ENCRYPT_AES: number = 0x00000100;
    public static COMPRESS_ZIP: number = 0x00000400;

    public static GameStatus: string = "";
    public static Game_Status_Ready: string = "";
    public static Game_Status_Gameing: string = "";

    public static TS_PLAYING_GAME: number = 0x00000001 //游戏进行中
    public static TS_WAITING_HUA: number = 0x00200000  //补花流程
    public static TS_WAITING_THROW: number = 0x00000100 //// 续完等待出牌
    public static TS_WAITING_PGCH: number = 0x00100000  //PGCH

    public static MJ_TS_GANG_PN: number = 0x04000000	// 抢碰杠状态

    public static TS_AFTER_HUA: number = 0x00010000  //刚吃过一张牌
    public static TS_AFTER_CHI: number = 0x00020000  //刚吃过一张牌
    public static TS_AFTER_PENG: number = 0x00040000  //刚碰过一张牌
    public static TS_AFTER_GANG: number = 0x00080000  //刚杠过一张牌


    public static PLAYER_STATUS_INROOM: number = 0x00002000 // 房间内
    public static PLAYER_STATUS_PLAYING: number = 0x00004000 // 玩游戏中
    public static PLAYER_STATUS_WAITING: number = 0x00008000 // 玩游戏中  == server wait
    public static LSPLAYER_STATUS_MULBOUT: number = 0x00020000//多局游戏中，每局的游戏中间


    // card status
    public static CARD_STATUS_WAITDEAL: number = 0x00000001;  //等待发牌
    public static CARD_STATUS_INHAND: number = 0x00000002      //手中
    public static CARD_STATUS_THROWDOWN: number = 0x00000004   //被打出
    public static CARD_STATUS_COST: number = 0x00000008       //废牌
    public static CARD_STATUS_LAYDOWN: number = 0x00000010     //放牌
    public static CARD_STATUS_TRIBUTE: number = 0x00000020     //进贡
    public static CARD_STATUS_SCORECARD: number = 0x00000040   //分牌
    public static CARD_STATUS_HIDE: number = 0x00000080        //隐藏
    public static CARD_STATUS_BOTTOM: number = 0x00000100		 //底牌

    /**
     * 玩家状态
     */
    public static US_USER_ENTERED: number = 0x00000001 // 玩家已进入
    public static US_GAME_STARTED: number = 0x00000002 // 游戏已开始
    public static US_CALL_DONE: number = 0x00000004 // 已叫牌
    public static US_USER_OFFLINE: number = 0x00000008 // 掉线
    public static US_USER_AUTOPLAY: number = 0x00000010 // 客户端托管
    public static US_USER_QUIT: number = 0x00000020 // 离开
    public static US_USER_WAITNEWTABLE: number = 0x00000040 // 等待分桌状态


    /**
     * 消息定义
     */

    public static LOGIN_IN: number = Global.SQREQ_BASE + 15;//登陆


    public static SQR_DATALEN_MISMATCH: number = Global.SQREQ_BASE + 505;	  // 数据长度不匹配
    public static SQR_SOAPOPERATE_FAILED: number = Global.SQREQ_BASE + 510;	 // soap 连接不上
    public static SQR_DBOPERATE_FAILED: number = Global.SQREQ_BASE + 515;	 // 数据库连接失败
    public static SQR_PLAYER_NOTEXIST: number = Global.SQREQ_BASE + 520;		// 用户不存在
    public static SQR_PLAYERSTATUS_MISMATCH: number = Global.SQREQ_BASE + 525;	// 玩家状态错误
    public static SQR_PLAYERDATA_MISMATCH: number = Global.SQREQ_BASE + 530;	 // 玩家数据错误
    public static SQR_ROOM_NOTEXIST: number = Global.SQREQ_BASE + 535;		//  房间不存在
    public static SQR_ROOM_CLOSED: number = Global.SQREQ_BASE + 540;			// 房间已关闭
    public static SQR_ROOM_FILLED: number = Global.SQREQ_BASE + 545;			// 房间已满
    public static SQR_ROOM_DISABLE: number = Global.SQREQ_BASE + 550;		// 房间已关
    public static SQR_NOTENOUGHT_VALUE: number = Global.SQREQ_BASE + 555;		// 金币不足  如果是需要体力的时候，显示体力不够，如果是金币的时候，显示金币不够
    public static SQR_EXCEED_VALUE: number = Global.SQREQ_BASE + 560;
    public static SQR_NOTENOUGHT_PLAYER: number = Global.SQREQ_BASE + 565;
    public static SQR_EXCEED_PLAYER: number = Global.SQREQ_BASE + 570;   // 休息结束被T
    public static SQR_SOLO_FAILED: number = Global.SQREQ_BASE + 575

    //友人新增
    public static LSR_FRIEND_READY: number = (Global.LS_REQ_BASE + 285);
    public static LSR_FRIEND_UNREADY: number = (Global.LS_REQ_BASE + 290)
    public static LSR_FRIEND_SITDOWN: number = (Global.LS_REQ_BASE + 295)
    public static LSR_FRIEND_STANDUP: number = (Global.LS_REQ_BASE + 300)
    public static GR_ASK_EXIT: number = (Global.GAME_REQ_BASE_EX + 1212)// 玩家请求强退
    public static GR_ALLOW_EXIT: number = (Global.GAME_REQ_BASE_EX + 1213)	// 玩家同意协商强退


    public static SQR_RESULT_UNSAVE: number = Global.SQREQ_BASE + 580;
    public static SQR_LOADSCRIPT_FAILED: number = Global.SQREQ_BASE + 585;   // 休息结束被T
    public static SQR_COOLDOWN_OVER: number = Global.SQREQ_BASE + 590
    public static SQR_SYSTEM_ISBUSY: number = Global.SQREQ_BASE + 595

    public static JJR_PLAYER_FORBID: number = Global.SQREQ_BASE + 590;   // 不让进T
    public static JJR_EXIT_GAME: number = Global.SQREQ_BASE + 20;   // 不让进T
    public static TS_WAITING_ROB: number = 0x00010000;   // 等待出牌

    public static JJR_GET_WEALTH: number = Global.SQREQ_BASE + 100  // 有通关奖励了

    public static GR_ROB_BANKER: number = Global.GAME_REQ_BASE_EX + 22010;
    public static GR_BANKER_ROB: number = Global.GAME_REQ_BASE_EX + 22020;
    public static GR_ROB_FINISHED: number = Global.GAME_REQ_BASE_EX + 22030;

    public static GBMJR_BROADCAST_PLAYERCOUNT: number = Global.LS_REQ_BASE + 165;
    public static LSR_GET_PLAYERDATA: number = Global.LS_REQ_BASE + 175;

    public static LSR_ENTER_SCENE: number = Global.LS_REQ_BASE + 185;
    public static LSR_LEAVE_SCENE: number = Global.LS_REQ_BASE + 190;

    public static LSR_FRIEND_CREATEROOM: number = Global.LS_REQ_BASE + 195;
    public static LSR_FRIEND_DELETEROOM: number = Global.LS_REQ_BASE + 200;
    public static LSR_FRIEND_ENTERROOM: number = Global.LS_REQ_BASE + 205;
    public static LSR_FRIEND_LEAVEROOM: number = Global.LS_REQ_BASE + 210;
    public static LSR_GET_ROOMUSER: number = Global.LS_REQ_BASE + 215;

    public static LSSCENE_LEVEL: number = 1;
    public static LSSCENE_FRIEND: number = 2;
    public static LSSCENE_TRAIN: number = 4;
    public static LS_SCENE_MATCH: number = 8;
    public static LS_SCENE_MATCH_NEW: number = 16;

    public static LSPLAYER_STATUS_INSCENE: number = 0x00040000;

    public static UI_PERSON_HEIGHT: number = 100;

    public static SQR_ROOM_OVERFLOW: number = Global.SQREQ_BASE + 545;
    public static SQR_PASSWORD_MISMATCH: number = Global.SQREQ_BASE + 660;
    public static LSR_GET_ONE_ROOMINFO: number = Global.LS_REQ_BASE + 75;

    public static LSR_FINALLY_RESULTS: number = (Global.LS_REQ_BASE + 230)//最后排

    //蛐蛐
    public static SQR_RECEIVE_GRIG: number = (Global.SQREQ_BASE + 230)
    public static SQR_GET_GRIGLIST: number = (Global.SQREQ_BASE + 235)

    /**
     *比赛
     */
    public static LSR_MATCH_ENTERROOM: number = (Global.LS_REQ_BASE + 235);
    public static LSR_MATCH_LEAVEROOM: number = (Global.LS_REQ_BASE + 240);
    public static LSR_MATCH_RESULTS: number = (Global.LS_REQ_BASE + 245)

    public static LSR_TRACK_PLAYER: number = (Global.LS_REQ_BASE + 220)
    public static LSR_LEAVE_PLAYER: number = (Global.LS_REQ_BASE + 225)


    public static LSR_GET_MATCHRANK: number = (Global.LS_REQ_BASE + 250);
    public static LSR_BROADCAST_RANK: number = (Global.LS_REQ_BASE + 255)
    public static LSR_MATCH_END: number = (Global.LS_REQ_BASE + 140);
    public static LSR_MATCH_END2: number = (Global.LS_REQ_BASE + 145);
    public static LSR_MATCH_BEGIN: number = (Global.LS_REQ_BASE + 135);

    public static SQR_WAIT_FOR_START: number = (Global.SQREQ_BASE + 665);

    public static LSR_DELAY_TIME: number = (Global.LS_REQ_BASE + 260);//延时
    public static LSR_DEVICE_TOKEN: number = (Global.LS_REQ_BASE + 310); //将机器编号发给服务端

    public static LSR_FRIEND_KICKOFF_PLAYER = (Global.LS_REQ_BASE + 306);//GM踢人通知

    public static LSR_KICK_OFF_TABLE: number = (Global.LS_REQ_BASE + 307); //GM散桌通知

    public static SQR_DELAY_TEST: number = (Global.SQREQ_BASE + 25); //GM散桌通知

    public static SQR_USERINFO_UPDATED: number = (Global.SQREQ_BASE + 160); //数据被改变


    public static GBMJ_ROOMID_MATCHNEW_BASE: number = 1000000000


}