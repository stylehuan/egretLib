/**
 * Created by stylehuan on 2016/7/26.
 */
declare function getMatchSceneParam();

class GameManager {
    private static _singleton: boolean = true;
    private static _instance: GameManager;

    public constructor() {
        if (GameManager._singleton) {
            throw new Error("ֻ����getInstance()����ȡʵ��");
        }
    }

    public static getInstance(): GameManager {
        if (!GameManager._instance) {
            GameManager._singleton = false;
            GameManager._instance = new GameManager();
            GameManager._singleton = true;
        }
        return GameManager._instance;
    }

    public setUp(): void {
        SocketEvent.addEventListener(SocketEvent.CONNECTED_SERVER, this.connectServerSuccess, this);
        SQGameServer.getInstance().connectServer();

        SocketEvent.addEventListener(Global.LOGIN_IN.toString(), this.loginInSuccess, this);
        SocketEvent.addEventListener(Global.LSR_GET_LEVELINFO.toString(), this.leveInfoSuccess, this);
        SocketEvent.addEventListener(Global.SQR_ENTER_GAME.toString(), this.enterGameHandler, this);
        SocketEvent.addEventListener(Global.GR_RESPONE_ENTER_GAME_OK.toString(), this.waitIngHandler, this);
        SocketEvent.addEventListener(Global.GR_RESPONE_ENTER_GAME_DXXW.toString(), this.enterGameSuccessHandler, this);
        SocketEvent.addEventListener(Global.GR_START_SOLOTABLE.toString(), this.grStartSoloTable, this);

        SocketEvent.addEventListener(Global.GR_CATCH_CARD.toString(), this.grCardHandler, this);//摸牌
        SocketEvent.addEventListener(Global.GR_CARD_CAUGHT.toString(), this.grCardInform, this);//摸牌通知
        SocketEvent.addEventListener(Global.GR_THROW_CARDS.toString(), this.grThrowCardBack, this);//出牌
        SocketEvent.addEventListener(Global.GR_CARDS_THROW.toString(), this.grThrowCardInform, this);//出牌通知


        SocketEvent.addEventListener(Global.GR_PENG_CARD.toString(), this.grPengCardBack, this);//碰
        SocketEvent.addEventListener(Global.GR_CARD_PENG.toString(), this.grPengCardInform, this);//碰通知
        SocketEvent.addEventListener(Global.GR_CHI_CARD.toString(), this.grChiCardBack, this);//吃
        SocketEvent.addEventListener(Global.GR_CARD_CHI.toString(), this.grChiCardInform, this);//吃通知
        SocketEvent.addEventListener(Global.GR_MN_GANG_CARD.toString(), this.grMNGangCardBack, this);//明杠
        SocketEvent.addEventListener(Global.GR_CARD_MN_GANG.toString(), this.grMNGangCardInform, this);//明杠通知

        SocketEvent.addEventListener(Global.GR_AN_GANG_CARD.toString(), this.grANGangCardBack, this);//暗杠
        SocketEvent.addEventListener(Global.GR_CARD_AN_GANG.toString(), this.grANGangCardInform, this);//暗杠通知

        SocketEvent.addEventListener(Global.GR_PN_GANG_CARD.toString(), this.grPNGangCardBack, this);//碰杠
        SocketEvent.addEventListener(Global.GR_CARD_PN_GANG.toString(), this.grPNGangCardInform, this);//碰杠通知

        SocketEvent.addEventListener(Global.GR_HUA_CARD.toString(), this.grHUACardBack, this);//补花
        SocketEvent.addEventListener(Global.GR_CARD_HUA.toString(), this.grHUACardInform, this);//补花通知

        SocketEvent.addEventListener(Global.GR_OVER_HUA.toString(), this.grOverHUACardBack, this);//补花过
        SocketEvent.addEventListener(Global.GR_HUA_OVER.toString(), this.grOverHUACardInform, this);//补花过通知

        SocketEvent.addEventListener(Global.GR_GUO_CARD.toString(), this.grGuoCardHandler, this);//过
        SocketEvent.addEventListener(Global.GR_CARD_GUO.toString(), this.grCardGuoInform, this);//过通知

        SocketEvent.addEventListener(Global.GR_PREHU_CARD.toString(), this.grHuCardHandler, this);//胡
        SocketEvent.addEventListener(Global.GR_HU_GAINS_LESS.toString(), this.grCuoHuCardHandler, this);//错胡

        SocketEvent.addEventListener(Global.GR_GAME_WIN.toString(), this.grGameWinHandler, this);//结算

        // SocketEvent.addEventListener(Global.SQR_TOKEN_MISSING.toString(), this.grUserLeaveInform, this);//离线
        // SocketEvent.addEventListener(Global.SQR_TOKEN_PULSE.toString(), this.grUserBackInform, this);//回来

        SocketEvent.addEventListener(Global.LSR_PLAYER_STATUS.toString(), this.grUserStatusInform, this);

        SocketEvent.addEventListener(Global.LSR_FINALLY_RESULTS.toString(), this.grGameFinallyHandler, this);//最后一局结算

        // SocketEvent.addEventListener(Global.LSR_MATCH_RESULTS.toString(), this.grMatchResultHandler, this);//比赛最后一局

        SocketEvent.addEventListener(Global.LSR_DELAY_TIME.toString(), this.grYSHandler, this);//延时

        SocketEvent.addEventListener(Global.LSR_LEAVE_PLAYER.toString(), this.exitWGHandler, this);//延时

        SocketEvent.addEventListener(Global.GR_ASK_EXIT.toString(), this.grAskExitHandler, this);//请求强退
        SocketEvent.addEventListener(Global.GR_ALLOW_EXIT.toString(), this.grAllowExitHandler, this);//请求强退

        SocketEvent.addEventListener(Global.SQR_USERINFO_UPDATED.toString(), this.userInfoUpdated, this);//请求强退
    }

    public doEnterGameServer(uid: number): void {
        var sendData: egret.ByteArray = new egret.ByteArray();
        sendData.endian = egret.Endian.LITTLE_ENDIAN;
        sendData.writeInt(uid);

        SQGameServer.getInstance().sendCmd(Global.SQR_ENTER_GAME, sendData);   // 为什么这里之前要填 0 ？
    }

    private connectServerSuccess(e: SystemEvent = null): void {
        LoadingManager.showLoading();
        console.log("connectServerSuccess");
        SocketEvent.removeEventListener(SocketEvent.CONNECTED_SERVER, this.connectServerSuccess, this);
        SQGameServer.getInstance().sendCmd(Global.LSR_GET_LEVELINFO, new egret.ByteArray());
    }

    private loginInSuccess(e: SocketEvent): void {
        LoadingManager.hideLoading();
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            var cGamePlayerData: CGamePlayerData = new CGamePlayerData();
            CSerializable.Deserialization(cGamePlayerData, b);

            var _str: string;
            _str = CSerializable._Deserialization(_str, b, "string")
            _str = _str.replace(/-/g, "/");

            GlobalVar.loginServersDate = new Date(_str).getTime();
            GlobalVar.loginLocalDate = new Date().getTime();
            GlobalVar.ServerLocalDateOff = GlobalVar.loginServersDate - GlobalVar.loginLocalDate;

            var cgmnc: CGBMJMatchNewConfig = new CGBMJMatchNewConfig();
            CSerializable.Deserialization(cgmnc, b);
            console.log("cgmnc1:" + cgmnc.nMatchSeatLastTime.value + "  cgmnc2:" + cgmnc.nMatchSigninLastTime.value)
            GlobalVar.MatchSigninLastTime = cgmnc.nMatchSigninLastTime.value;
            GlobalVar.MatchSigninLastTime = cgmnc.nMatchSeatLastTime.value;

            //console.log("GlobalVar.loginServersDate:"+GlobalVar.loginServersDate+"  _str:"+_str)
            //console.log("GlobalVar.loginLocalDate:"+GlobalVar.loginLocalDate+"  GlobalVar.ServerLocalDateOff:"+GlobalVar.ServerLocalDateOff)

            SystemCenter.playSystem.selfPlayerInfo.gameUserInfo = cGamePlayerData.StatData;
            SystemCenter.playSystem.selfPlayerInfo.playerType = cGamePlayerData.UserInfo.dwUserType.value;
            SystemCenter.playSystem.selfPlayerInfo.gameStatus = cGamePlayerData.GameData.dwStatus.value;
            SystemCenter.playSystem.selfPlayerInfo.GameData = cGamePlayerData.GameData;
            SystemCenter.playSystem.selfPlayerInfo.MatchData = cGamePlayerData.matchData;
            SystemCenter.playSystem.selfPlayerInfo.MatchNewData = cGamePlayerData.matchNewData;

            SystemCenter.playSystem.selfPlayerInfo.SaiquCoin = cGamePlayerData.UserInfo.nSaiquCoin.value;
            //SystemCenter.playSystem.selfPlayerInfo.SaiquTicket = cGamePlayerData.matchData.nTurn1Ticket.value - cGamePlayerData.matchData.nTurn2Cost.value;
            //console.log("_curScene221:"+SystemCenter.playSystem.selfPlayerInfo.GameData.nScene.value+"   dd:"+SystemCenter.playSystem.selfPlayerInfo.GameData.dwStatus.value)
            console.log("uid:" + SystemCenter.playSystem.selfPlayerInfo.userID + "  .vWaitRoomID:" + cGamePlayerData.GameData.vWaitRoomID)
            if (GlobalVar.shellSaveToken != "") {
                var bty: egret.ByteArray = new egret.ByteArray();
                bty.writeUTFBytes(GlobalVar.shellSaveToken);
                SQGameServer.getInstance().sendCmd(Global.LSR_DEVICE_TOKEN, bty, 0);
            }

            if (baseUtil.isExitFlag(cGamePlayerData.UserInfo.dwUserType.value, Global.USER_TYPE_GM)) {
                GMManager.getInstance().isGm = true;
            }

            if (baseUtil.isExitFlag(cGamePlayerData.UserInfo.dwUserType.value, Global.USER_TYPE_LIVER)) {
                WGManager.getInstance().isCompere = true;
            }


            SystemCenter.playSystem.selfPlayerInfo.playerName = cGamePlayerData.UserInfo.sNickName;
            SystemCenter.playSystem.selfPlayerInfo.levelID = cGamePlayerData.StatData.nLevelID.value;
            SystemCenter.playSystem.selfPlayerInfo.levelName = LevelInfo.getLevelName(SystemCenter.playSystem.selfPlayerInfo.levelID);

            var _levelId: number = cGamePlayerData.StatData.nLevelID.value;
            var _fourAnimalLabel: number = cGamePlayerData.StatData.nFourBeast.value;
            if (LevelInfo.getLevelName(_levelId).indexOf("段") == -1) {
                _fourAnimalLabel = 0;
            }

            SystemCenter.playSystem.selfPlayerInfo.fourAnimalLabel = _fourAnimalLabel;

            this.initReady();
        } else {
            //this.checkResultMessage(e.data.request, e.data.result);
        }
    }

    private userInfoUpdated(e: SocketEvent): void {
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            console.log("userInfoUpdated");
            var cGamePlayerData: CGamePlayerData = new CGamePlayerData();
            CSerializable.Deserialization(cGamePlayerData, b);
            SystemCenter.playSystem.selfPlayerInfo.gameUserInfo = cGamePlayerData.StatData;
            SystemCenter.playSystem.selfPlayerInfo.playerType = cGamePlayerData.UserInfo.dwUserType.value;
            SystemCenter.playSystem.selfPlayerInfo.gameStatus = cGamePlayerData.GameData.dwStatus.value;
            SystemCenter.playSystem.selfPlayerInfo.GameData = cGamePlayerData.GameData;
            SystemCenter.playSystem.selfPlayerInfo.MatchData = cGamePlayerData.matchData;
            SystemCenter.playSystem.selfPlayerInfo.MatchNewData = cGamePlayerData.matchNewData;
        }
    }

    private leveInfoSuccess(e: SocketEvent): void {
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        SocketEvent.removeEventListener(Global.LSR_GET_LEVELINFO.toString(), this.leveInfoSuccess, this);
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            b.position = 0;
            b.endian = egret.Endian.LITTLE_ENDIAN;
            var _len: number = b.readInt();
            var _v: Array<CLSLevelItem> = new Array<CLSLevelItem>();

            for (var i: number = 0; i < _len; i++) {
                _v[i] = new CLSLevelItem();
                CSerializable.Deserialization(_v[i], b);
            }
            LevelInfo.LevelInfoTalbe = _v;

            var cGameLoginGame: CGameLogin = new CGameLogin();
            cGameLoginGame.nUserID.value = SystemCenter.playSystem.selfPlayerInfo.userID;
            cGameLoginGame.szHardID = SystemCenter.playSystem.selfPlayerInfo.sign;
            var sendData: egret.ByteArray = new egret.ByteArray();
            CSerializable.Serialization(cGameLoginGame, sendData);

            SQGameServer.getInstance().sendCmd(Global.LOGIN_IN, sendData);
        } else {
            //this.checkResultMessage(e.data.request, e.data.result);
        }
    }

    /**
     *进入游戏 等待分卓
     * @param e
     *
     */
    private enterGameHandler(e: SocketEvent): void {
        LoadingManager.hideLoading();

        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;

        //进游戏成功，但不在游戏中
        if (e.data.result == Global.SQR_WAIT_FOR_START) {

        }
        //断线续玩
        else if (e.data.result == Global.GR_RESPONE_ENTER_GAME_DXXW) {

        } else {
            if (GlobalVar.isTest) {

                //this.checkResultMessage(e.data.request, e.data.result);
            }
        }
    }

    // private triggerEntryGameEvent(): void {
    //     SystemEvent.dispatchEvents(new SystemEvent(SystemEvent.DESK_Animation_OVER));
    // }

    private enterGameSuccessHandler(e: SocketEvent) {
        LoadingManager.hideLoading();
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        b.position = 0;

        var cGameStartSoloTable = new CGameSOLOTABLE();
        CSerializable.Deserialization(cGameStartSoloTable, b);

        var cGamePlayerData = new Array<CGamePlayerData>(4);
        for (var i: number = 0; i < 4; i++) {
            cGamePlayerData[i] = new CGamePlayerData();
            CSerializable.Deserialization(cGamePlayerData[i], b);

            if (WGManager.getInstance().isWgIng()) {
                if (WGManager.getInstance().lookerID == cGamePlayerData[i].UserInfo.nUserID.value) {
                    WGManager.getInstance().chairNo = cGamePlayerData[i].GameData.nChairNO.value;
                }
            }
        }

        var cGameTableInfo = new CGameTableInfo();
        CSerializable.Deserialization(cGameTableInfo, b);

        this.clearDesk();
        this.initDesk();
        DeskManager.getInstance().isXw = true;

        WGManager.getInstance().wallData = cGameTableInfo.StartData.nWallCards.slice(0, 144);

        DeskManager.getInstance().soloTable = cGameStartSoloTable;
        DeskManager.getInstance().playerArr = cGamePlayerData;
        DeskManager.getInstance().gameInfoXW = cGameTableInfo;
        DeskManager.getInstance().init();


        if (!DeskManager.getInstance().isInGameScene) {
            SceneManagerExt.goGameScene();
        } else {
            this._desk.init();
            this._desk.deskDraw();
        }
    }

    /**
     *分桌完成，准备开始游戏
     * @param e
     *
     */
    private grStartSoloTable(e: SocketEvent = null): void {
        LoadingManager.hideLoading();
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            var i: number = 0;

            var cGameStartSoloTable = new CGameSOLOTABLE();
            CSerializable.Deserialization(cGameStartSoloTable, b);

            var cGamePlayerData = new Array<CGamePlayerData>(4);
            for (i = 0; i < 4; i++) {
                cGamePlayerData[i] = new CGamePlayerData();
                CSerializable.Deserialization(cGamePlayerData[i], b);

                //第一次点击围观进来
                if (WGManager.getInstance().isWgIng()) {
                    if (WGManager.getInstance().lookerID == cGamePlayerData[i].UserInfo.nUserID.value) {
                        WGManager.getInstance().chairNo = cGamePlayerData[i].GameData.nChairNO.value;
                    }
                }
            }

            var cGameStartInfo = new CGameStartInfo();
            CSerializable.Deserialization(cGameStartInfo, b);

            this.clearDesk();
            this.initDesk();

            WGManager.getInstance().wallData = cGameStartInfo.nWallCards.slice(0, 144);

            DeskManager.getInstance().nBeginNO = cGameStartInfo.nBeginNO.value;
            DeskManager.getInstance().isXw = false;
            DeskManager.getInstance().soloTable = cGameStartSoloTable;
            DeskManager.getInstance().playerArr = cGamePlayerData;
            DeskManager.getInstance().gameStartInfo = cGameStartInfo;

            DeskManager.getInstance().init();

            //判断主播是否在游戏中
            if (cGameStartSoloTable && WGManager.getInstance().isCompere) {
                var _uid: number = SystemCenter.playSystem.selfPlayerInfo.userID;
                if (cGameStartSoloTable.nUserIDs.indexOf(_uid) > -1) {
                    WGManager.getInstance().isCompereInGame = true;
                }
            }

            if (!DeskManager.getInstance().isInGameScene) {
                SceneManagerExt.goGameScene();
            } else {
                this._desk.init();
                this._desk.deskDraw();
            }
        } else {
            //this.checkResultMessage(e.data.request, e.data.result);
        }
    }

    /**
     *摸牌回调
     * @param e
     *
     */
    private grCardHandler(e: SocketEvent): void {
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {

            if (this._desk) {
            }
        } else {
            //this.checkResultMessage(e.data.request, e.data.result);
        }
    }

    /**
     *摸牌通知
     * @param e
     *
     */
    private grCardInform(e: SocketEvent): void {
        if (!SQGameServer.getInstance().isConnect) return;
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            var cgameCardCaught: CGameCardCaught = new CGameCardCaught();
            CSerializable.Deserialization(cgameCardCaught, b);
            if (this._desk) {
                this._desk.see_cardCaughtInform(cgameCardCaught);
            }
        } else {
            //this.checkResultMessage(e.data.request, e.data.result);
        }
    }


    /**
     *出牌通知
     * @param e
     *
     */
    private grThrowCardInform(e: SocketEvent): void {
        if (!SQGameServer.getInstance().isConnect) return;
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        LoadingManager.hideLoading();
        console.log("------------------------grThrowCardInform 出牌通知 22170");
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            var cgameCardsThrow: CGameCardsThrow = new CGameCardsThrow();
            CSerializable.Deserialization(cgameCardsThrow, b)
            if (this._desk) {
                this._desk.see_cardThrowInform(cgameCardsThrow);
            }
        } else {
            if (GlobalVar.isTest) {
                //this.checkResultMessage(e.data.request, e.data.result);
            }
        }
    }

    /**
     *碰通知
     * @param e
     *
     */
    private grPengCardInform(e: SocketEvent): void {
        if (!SQGameServer.getInstance().isConnect) return;
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;

        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            var cGamePengCard: CGameCombCard = new CGameCombCard();
            CSerializable.Deserialization(cGamePengCard, b);
            if (this._desk) {
                this._desk.see_pengCardInform(cGamePengCard);
            }
        } else {
            if (GlobalVar.isTest) {
                //this.checkResultMessage(e.data.request, e.data.result);
            }
        }
    }

    private grChiCardInform(e: SocketEvent): void {
        if (!SQGameServer.getInstance().isConnect) return;
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;

        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            var cGameChiCard: CGameCombCard = new CGameCombCard();
            CSerializable.Deserialization(cGameChiCard, b);
            if (this._desk) {
                this._desk.see_chiCardInform(cGameChiCard);
            }
        } else {
            if (GlobalVar.isTest) {
                //this.checkResultMessage(e.data.request, e.data.result);
            }
        }
    }

    private grChiCardBack(e: SocketEvent): void {
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            LoadingManager.hideLoading();
        } else {
            // this.checkResultMessage(e.data.request, e.data.result);
        }
    }

    private grMNGangCardBack(e: SocketEvent): void {
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            LoadingManager.hideLoading();
        } else {
            //this.checkResultMessage(e.data.request, e.data.result);
        }
    }

    private grMNGangCardInform(e: SocketEvent): void {
        if (!SQGameServer.getInstance().isConnect) return;
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            var cgameMnGangCard: CGameCombCard = new CGameCombCard();
            CSerializable.Deserialization(cgameMnGangCard, b);
            if (this._desk) {
                this._desk.see_mGangcardInform(cgameMnGangCard);
            }
        } else {
            if (GlobalVar.isTest) {
                //this.checkResultMessage(e.data.request, e.data.result);
            }
        }
    }

    private grANGangCardInform(e: SocketEvent): void {
        if (!SQGameServer.getInstance().isConnect) return;
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            var cgameMnGangCard: CGameCombCard = new CGameCombCard();
            CSerializable.Deserialization(cgameMnGangCard, b)
            if (this._desk) {
                this._desk.see_aGangCardInform(cgameMnGangCard);
            }
        } else {
            if (GlobalVar.isTest) {
                //this.checkResultMessage(e.data.request, e.data.result);
            }
        }
    }

    private grANGangCardBack(e: SocketEvent): void {
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            LoadingManager.hideLoading();
            //				if(_desk)
            //				{
            //					//					_desk.see_cardMnGangBack();
            //				}
        } else {
            if (GlobalVar.isTest) {
                //this.checkResultMessage(e.data.request, e.data.result);
            }
        }
    }

    private grPNGangCardBack(e: SocketEvent): void {
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
        } else {
            if (GlobalVar.isTest) {
                //this.checkResultMessage(e.data.request, e.data.result);
            }
        }
    }

    private grPNGangCardInform(e: SocketEvent): void {
        if (!SQGameServer.getInstance().isConnect) return;
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            var cgamePNGangCard: CGameCombCard = new CGameCombCard();
            CSerializable.Deserialization(cgamePNGangCard, b)
            if (this._desk) {
                this._desk.see_pnGangCardInform(cgamePNGangCard);
            }
        } else {
            if (GlobalVar.isTest) {
                //this.checkResultMessage(e.data.request, e.data.result);
            }
        }
    }

    private grHUACardBack(e: SocketEvent): void {
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            LoadingManager.hideLoading();
            //				if(_desk)
            //				{
            //					//					_desk.see_cardMnGangBack();
            //				}
        } else {
            if (GlobalVar.isTest) {
                //this.checkResultMessage(e.data.request,e.data.result);
            }
        }
    }

    private grHUACardInform(e: SocketEvent): void {
        if (!SQGameServer.getInstance().isConnect) return;
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            var cHuaCard: CGameThrowCards = new CGameThrowCards();
            CSerializable.Deserialization(cHuaCard, b)
            if (this._desk) {
                this._desk.see_HUAInform(cHuaCard);
            }
        } else {
            if (GlobalVar.isTest) {
                //this.checkResultMessage(e.data.request, e.data.result);
            }
        }
    }

    private grOverHUACardBack(e: SocketEvent): void {
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            LoadingManager.hideLoading();
            //				if(_desk)
            //				{
            //					//					_desk.see_cardMnGangBack();
            //				}
        } else {
            if (GlobalVar.isTest) {
                //this.checkResultMessage(e.data.request, e.data.result);
            }
        }
    }

    private grOverHUACardInform(e: SocketEvent): void {
        if (!SQGameServer.getInstance().isConnect) return;
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            var cgameHuaOver: CGameHuaOver = new CGameHuaOver();
            CSerializable.Deserialization(cgameHuaOver, b)
            if (this._desk) {
                this._desk.see_HUAOverInform(cgameHuaOver);
            }
        } else {
            if (GlobalVar.isTest) {
                //this.checkResultMessage(e.data.request, e.data.result);
            }
        }
    }

    /**
     *过牌回调
     * @param e
     *
     */
    private grGuoCardHandler(e: SocketEvent): void {
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            //				var cgameCardsThrow:CGameCardsThrow = new CGameCardsThrow();
            //				cgameCardsThrow.Deserialization(b);

            if (this._desk) {
                //					_desk.see_cardGuoBack(cgameCardsThrow);
            }
        } else {
            //this.checkResultMessage(e.data.request, e.data.result);
        }
    }


    /**
     *过牌通知
     * @param e
     *
     */
    private grCardGuoInform(e: SocketEvent): void {
        if (!SQGameServer.getInstance().isConnect) return;
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            var cgameCardGuo: CGameCombCard = new CGameCombCard();
            CSerializable.Deserialization(cgameCardGuo, b);
            if (this._desk) {
                this._desk.see_cardGuoInform(cgameCardGuo);
            }
        } else {
            if (GlobalVar.isTest) {
                //this.checkResultMessage(e.data.request, e.data.result);
            }
        }
    }

    /**
     *胡
     *
     */
    private grHuCardHandler(e: SocketEvent): void {
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {

        } else {
            if (GlobalVar.isTest) {
                //this.checkResultMessage(e.data.request,e.data.result);
            }
        }
    }

    private grCuoHuCardHandler(e: SocketEvent): void {
        if (!SQGameServer.getInstance().isConnect) return;
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            var cgameCuoHu: CGameCuoHu = new CGameCuoHu();
            CSerializable.Deserialization(cgameCuoHu, b)
            if (this._desk) {
                this._desk.see_gameCuoHu(cgameCuoHu);
            }
        } else {
            if (GlobalVar.isTest) {
                //this.checkResultMessage(e.data.request, e.data.result);
            }
        }
    }

    private grGameWinHandler(e: SocketEvent): void {
        if (!SQGameServer.getInstance().isConnect) return;
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            var cgameWin: CGameWinResult = new CGameWinResult();
            CSerializable.Deserialization(cgameWin, b)
            var cgameHuDetails: CGameHU_DETAILS = new CGameHU_DETAILS();
            CSerializable.Deserialization(cgameHuDetails, b)
            if (this._desk) {
                this._desk.see_gameWin(cgameWin, cgameHuDetails);
            }
        } else {
            if (GlobalVar.isTest) {
                //this.checkResultMessage(e.data.request, e.data.result);
            }
        }
    }

    private grUserLeaveInform(e: SocketEvent): void {
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            b.endian = egret.Endian.LITTLE_ENDIAN;
            var userId: number = b.readInt();

            if (this._desk) {
                this._desk.see_userLeaveInform(userId);
            }
        }
    }

    private grUserBackInform(e: SocketEvent): void {
        if (!SQGameServer.getInstance().isConnect) return;
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            b.endian = egret.Endian.LITTLE_ENDIAN;
            var userId: number = b.readInt();

            if (this._desk) {
                this._desk.see_userBackInform(userId);
            }
        }
    }

    private grGameFinallyHandler(e: SocketEvent): void {
        if (!SQGameServer.getInstance().isConnect) return;
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            var _arr: Array<LSR_FINALLY_RESULTS> = new Array<LSR_FINALLY_RESULTS>();
            for (var i: number = 0; i < 4; i++) {
                var _playerResultItem: LSR_FINALLY_RESULTS = new LSR_FINALLY_RESULTS();
                CSerializable.Deserialization(_playerResultItem, b);
                _arr.push(_playerResultItem);
            }
            if (this._desk) {
                this._desk.see_FinallyResultInform(_arr);
            }

        }
        else {
            //this.checkResultMessage(e.data.request, e.data.result);
        }
    }

    private exitWGHandler(e: SocketEvent): void {
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        b.position = 0;
        b.endian = egret.Endian.LITTLE_ENDIAN;
        if (e.data.positive) {
            if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {

            }
        } else {

        }
    }

    private grAllowExitHandler(e: SocketEvent): void {
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        b.position = 0;
        if (!e.data.positive) {
            var _allowExit: CLSALLOW_EXIT = new CLSALLOW_EXIT();
            CSerializable.Deserialization(_allowExit, b);

            if (this._desk) {
                this._desk.see_AllowExit(_allowExit);
            }
        }
    }

    private grAskExitHandler(e: SocketEvent): void {
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        if (!e.data.positive) {
            var _askExit: CLSAskExit = new CLSAskExit();
            CSerializable.Deserialization(_askExit, b);
            if (this._desk) {
                this._desk.see_askExit(_askExit);
            }
        }
    }

    private grYSHandler(e: SocketEvent): void {
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data
        b.position = 0;
        b.endian = egret.Endian.LITTLE_ENDIAN;
        if (!e.data.positive) {
            var uid: number = b.readInt();
            if (this._desk) {
                this._desk.see_YSInform(uid);
            }
        }
        else if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            if (this._desk) {
                this._desk.see_YSBack();
            }
        }
    }

    private grUserStatusInform(e: SocketEvent): void {
        if (!SQGameServer.getInstance().isConnect) return;
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        b.position = 0;
        b.endian = egret.Endian.LITTLE_ENDIAN;
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            var _arr: Array<number> = new Array<number>();
            for (var i: number = 0; i < 4; i++) {
                _arr.push(b.readInt());
            }

            if (this._desk) {
                this._desk.see_userStatusInform(_arr);
            }
        }
    }

    /**
     *打牌回调
     * @param e
     *
     */
    private grThrowCardBack(e: SocketEvent): void {
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            LoadingManager.hideLoading();
        } else {
            //this.checkResultMessage(e.data.request, e.data.result);
        }
    }

    /**
     *碰牌回调
     * @param e
     *
     */
    private grPengCardBack(e: SocketEvent): void {
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        console.log("------------------------碰牌回调");
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            LoadingManager.hideLoading();
        } else {
            //this.checkResultMessage(e.data.request, e.data.result);
        }
    }


    private _desk: MahjongDeskView;

    private initDesk() {
        if (!this._desk) {
            this._desk = MahjongDeskView.getInstance();
        }

        GameStatus.status = GameStatus.STATUS_READYING;
    }

    private clearDesk(): void {
        if (this._desk) {
            this._desk.clearEmpty();
        }
    }

    private waitIngHandler(e: SocketEvent = null): void {
        LoadingManager.hideLoading();
        SocketEvent.removeEventListener(Global.GR_RESPONE_ENTER_GAME_OK.toString(), this.enterGameHandler, this);
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        b.position = 0;
        b.endian = egret.Endian.LITTLE_ENDIAN;
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            var djs: number = b.readInt();
            console.log("djs:" + djs);
            var _cGameStartSoloTable: CGameSOLOTABLE = new CGameSOLOTABLE();
            CSerializable.Deserialization(_cGameStartSoloTable, b);
            var _cGamePlayerData = new Array<CGamePlayerData>(4);
            for (var i: number = 0; i < 4; i++) {
                _cGamePlayerData[i] = new CGamePlayerData();
                CSerializable.Deserialization(_cGamePlayerData[i], b);
            }

            DeskManager.getInstance().waitIngDJS = djs;
            DeskManager.getInstance().soloTable = _cGameStartSoloTable;
            DeskManager.getInstance().playerArr = _cGamePlayerData;

            if (SystemCenter.playSystem.selfPlayerInfo.GameData.nRoomID.value % 2 == 0) {
                var _enterText: Object = JSON.parse(SystemCenter.playSystem.selfPlayerInfo.RoomInfo.sPropertyText);
                GlobalVar.CurMatchInfo = {
                    roomId: SystemCenter.playSystem.selfPlayerInfo.GameData.nRoomID.value,
                    playerCount: _enterText["PlayerCount"],
                    isHaiXuan: (SystemCenter.playSystem.selfPlayerInfo.GameData.nRoomID.value % 2 == 0)
                };
            }

            SceneManager.getInstance().runWithScene(WaitScene);
        }
    }

    private initReady(): void {
        var gameStatus = SystemCenter.playSystem.selfPlayerInfo.gameStatus;
        var params;
        //网页打开比赛
        if (UIAdapter.getInstance().isPC) {
            try {
                params = getMatchSceneParam();

                if (params) {
                    if (params["isHx"] == 1) {
                        GlobalVar.CurMatchInfo["isHaiXuan"] = true;
                        GlobalVar.CurMatchInfo["matchId"] = params["matchId"];
                    }
                }
            } catch (err) {

            }
        }

        if (WGManager.getInstance().isCompere) {
            WgMsgAdaptive.getInstance().setUp();
            if (baseUtil.isExitFlag(SystemCenter.playSystem.selfPlayerInfo.GameData.dwStatus.value, Global.LSPLAYER_STATUS_GHOST)) {
                WGManager.getInstance().isCompereIng = true;
                WGManager.getInstance().roomId = SystemCenter.playSystem.selfPlayerInfo.GameData.nGostRoomId.value;
                WGManager.getInstance().tableNo = SystemCenter.playSystem.selfPlayerInfo.GameData.nGostTableNO.value;

                WGManager.getInstance().sendCompereWg();
                return;
            }
        }

        //如果已经在旁观
        if (baseUtil.isExitFlag(gameStatus, Global.LSPLAYER_STATUS_LOOKING)) {
            SystemEvent.addEventListener(SystemEvent.GET_PLAYERDATA, this.onPlayerDataSuccess, this);

            //获取旁观对象的playerData
            var _nTarget: number = SystemCenter.playSystem.selfPlayerInfo.GameData.nTarget.value;

            this.getPlayerData(_nTarget);
            return;
        }

        //游戏中
        if (baseUtil.isExitFlag(gameStatus, Global.PLAYER_STATUS_PLAYING)) {
            if (params && params["isHx"]) {
                var _roomId: number = Match.getInstance().getRoomId(params["matchId"], true);
                //不是一个房间
                if (_roomId != SystemCenter.playSystem.selfPlayerInfo.GameData.nRoomID.value) {
                    PopUpManager.alert("友情提示", "您还在牌局中，无法参加比赛！");
                }
            }


            DeskManager.getInstance().isXw = true;
            GameManager.getInstance().doEnterGameServer(SystemCenter.playSystem.selfPlayerInfo.userID);
        }
        //两局中间
        else if (baseUtil.isExitFlag(gameStatus, Global.LSPLAYER_STATUS_MULBOUT)) {
            DeskManager.getInstance().isXw = true;
            DeskManager.getInstance().isWaiting = true;
            GameManager.getInstance().doEnterGameServer(SystemCenter.playSystem.selfPlayerInfo.userID);
        }
        //场景内
        else if (baseUtil.isExitFlag(gameStatus, Global.LSPLAYER_STATUS_INSCENE)) {
            if (params && params["isHx"]) {
                //不在联赛场景
                if (SystemCenter.playSystem.selfPlayerInfo.GameData.nScene.value == Global.LSSCENE_FRIEND) {
                    Match.getInstance().leaveSceneNextFunc = function () {
                        Match.getInstance().entryScene();
                    };
                    Match.getInstance().leaveScene();
                    return;
                }
            }

            if (SystemCenter.playSystem.selfPlayerInfo.GameData.nScene.value == Global.LSSCENE_FRIEND) {
                if (baseUtil.isExitFlag(gameStatus, Global.PLAYER_STATUS_WAITING)) {
                    SystemCenter.playSystem.selfPlayerInfo.RoomInfo = new CGameRoom();
                    SystemCenter.playSystem.selfPlayerInfo.RoomInfo.nRoomID = SystemCenter.playSystem.selfPlayerInfo.GameData.vWaitRoomID[0];
                }
                SceneManager.getInstance().runWithScene(FriendScene);
            } else if (SystemCenter.playSystem.selfPlayerInfo.GameData.nScene.value == Global.LS_SCENE_MATCH_NEW) {
                console.log("baseUtil.isExitFlag(gameStatus, Global.PLAYER_STATUS_WAITING):" + baseUtil.isExitFlag(gameStatus, Global.PLAYER_STATUS_WAITING))
                if (baseUtil.isExitFlag(gameStatus, Global.PLAYER_STATUS_WAITING)) {
                    if (SystemCenter.playSystem.selfPlayerInfo.GameData.vWaitRoomID.getLen() > 0) {
                        SystemCenter.playSystem.selfPlayerInfo.MatchRoomId = SystemCenter.playSystem.selfPlayerInfo.GameData.vWaitRoomID.getAt(0).value;
                    }
                    SceneManager.getInstance().runWithScene(WaitScene);
                } else {
                    Match.getInstance().getRoomInfo();
                    // SceneManager.getInstance().runWithScene(MatchScene);
                }
            }
        } else {

            //网页打开比赛
            if (UIAdapter.getInstance().isPC) {
                if (params) {
                    if (params["isHx"] == 1) {
                        Match.getInstance().entryScene();
                        return;
                    }
                }
            }
            SceneManager.getInstance().runWithScene(MainScene);
        }
    }

    private getPlayerData(userId: number): void {
        SocketEvent.addEventListener(Global.LSR_GET_PLAYERDATA.toString(), this.getPlayerDataHandler, this);
        var sendData: egret.ByteArray = new egret.ByteArray();
        sendData.endian = egret.Endian.LITTLE_ENDIAN;
        sendData.writeInt(userId);

        SQGameServer.getInstance().sendCmd(Global.LSR_GET_PLAYERDATA, sendData);
    }

    private getPlayerDataHandler(e: SocketEvent = null): void {
        SocketEvent.addEventListener(Global.LSR_GET_PLAYERDATA.toString(), this.getPlayerDataHandler, this);
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            var _playerData: CGamePlayerData = new CGamePlayerData();
            CSerializable.Deserialization(_playerData, b);

            SystemEvent.dispatchEvents(new SystemEvent(SystemEvent.GET_PLAYERDATA, _playerData));
        }
    }

    private onPlayerDataSuccess(e: SystemEvent): void {
        SystemEvent.removeEventListener(SystemEvent.GET_PLAYERDATA, this.onPlayerDataSuccess, this);
        var _playerData: CGamePlayerData = e.data as CGamePlayerData;

        //如果旁观对象在游戏中
        if (baseUtil.isExitFlag(_playerData.GameData.dwStatus.value, Global.PLAYER_STATUS_PLAYING)) {
            WGManager.getInstance().lookerID = _playerData.UserInfo.nUserID.value;
            DeskManager.getInstance().isXw = true;
            DeskManager.getInstance().firstPerson = WGManager.getInstance().lookerID;
            GameManager.getInstance().doEnterGameServer(DeskManager.getInstance().firstPerson);
        }
        //在等待分卓
        else if (baseUtil.isExitFlag(_playerData.GameData.dwStatus.value, Global.LSPLAYER_STATUS_MULBOUT)) {
            SceneManagerExt.goWaitScene();
        }
        else {
            WGManager.getInstance().sendExitWG();
        }
    }
}