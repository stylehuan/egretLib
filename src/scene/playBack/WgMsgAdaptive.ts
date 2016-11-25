/**
 * Created by stylehuan on 2016/9/29.
 */
class WgMsgAdaptive {
    public _desk: MahjongDeskView;
    private static _instance: WgMsgAdaptive;

    public static getInstance(): WgMsgAdaptive {
        if (!WgMsgAdaptive._instance) {
            WgMsgAdaptive._instance = new WgMsgAdaptive();
        }
        return WgMsgAdaptive._instance;
    }

    public setUp(): void {
        SocketEvent.addEventListener(Global.SQR_GHOST_ENTERGAME.toString(), this.grGhostEnterHandler, this);//进入围观
        SocketEvent.addEventListener(Global.SQR_GHOST_NOTIFYDATA.toString(), this.grGhostNotifyHandler, this);//牌局中的消息
        SocketEvent.addEventListener(Global.SQR_GHOST_LEAVEGAME.toString(), this.grGhostLeaveHandler, this);//牌局中的消息

        SystemEvent.addEventListener(SystemEvent.ChangeView, this.changeViewHandler, this);
    }

    private _roomId: number;
    private _tableNO: number;
    private _bout: number;
    private _userIds: FixedArray;
    private _cards: FixedArray;
    private _nikeNames: Array<string> = [];
    private _banker: number;
    private _dices: FixedArray;
    private _beginNO: number;
    private _huChair: number = -1;
    private _huCardId: number = -1;
    private _nLoseChair: number;
    private _nCurrentChair: number = -1;
    private _cuohuChairs: Array<number> = [-1, -1, -1, -1];

    private _isScoreDiff: boolean = false;//判断是否结束
    private _isWatingBankThrowCard: boolean = true;
    private _isHuaOver: boolean = false;

    private _initScore: Array<number>;
    private _initLevel: Array<number>;
    private _initFourBeast: Array<number>;

    private _nCurrentCatch: number;

    private _isEntry: boolean = true;

    private grGhostEnterHandler(e: SocketEvent): void {
        LoadingManager.hideLoading();
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            var _s: string = CSerializable.readGB2312Bytes(b, b.bytesAvailable);

            if (_s == "") {
                this.initGameSleep();
                this._isEntry = false;
                return;
            }

            if (_s.indexOf("ScoreDiff") > -1) {
                this.initGameSleep();
                this._isEntry = false;
                return;
            }

            //初始化数据
            this.adaptive(_s);

            if (_s.indexOf("Dices") == -1) {
                this._isEntry = false;
                return;
            }

            if (_s.indexOf("Catch") == -1) {
                this._isEntry = false;
                return;
            }

            this.grSoloTableXw();
            this._isEntry = false;
        }
    }

    private initGameSleep(): void {
        SceneManagerExt.goWaitScene();
    }

    private changeViewHandler(e: SystemEvent): void {
        if (this._isScoreDiff) {
            this.initGameSleep();
            return;
        }

        this.grSoloTableXw();
    }

    private grGhostLeaveHandler(e: SocketEvent): void {
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        LoadingManager.hideLoading();

        if (e.data.result == Global.UR_OPERATE_SUCCEEDED || this._isLastRound) {
            this.destroy();
            WGManager.getInstance().exitSceneHandler();
        }
        else if (e.data.result == 500525) {
            this.destroy();
            WGManager.getInstance().exitSceneHandler();
        }
    }

    private reset(): void {
        this._userIds = new FixedArray("int", Global.MAX_CHAIR_COUNT);
        this._cards = new FixedArray("int", 144);
        this._nikeNames = [];
        this._dices = new FixedArray("int", 4);
        this._huChair = -1;
        this._huCardId = -1;
        this._nLoseChair = -1;
        this._cuohuChairs = [-1, -1, -1, -1];

        this._initLevel = null;
        this._initScore = null;

        this._isScoreDiff = false;

        this._nTotalResult = null;

        this._isLastRound = false;
        this._initFourBeast = null;

        this._nCurrentChair = -1;
        this._isHuaOver = false;

        this._isWatingBankThrowCard = true;

        this._cGameHU_DETAILS = null;
    }

    public destroy(): void {
        this._isEntry = true;

        SystemEvent.removeEventListener(SystemEvent.ChangeView, this.changeViewHandler, this);

        SocketEvent.removeEventListener(Global.SQR_GHOST_ENTERGAME.toString(), this.grGhostEnterHandler, this);//进入围观
        SocketEvent.addEventListener(Global.SQR_GHOST_NOTIFYDATA.toString(), this.grGhostNotifyHandler, this);//牌局中的消息
        SocketEvent.addEventListener(Global.SQR_GHOST_LEAVEGAME.toString(), this.grGhostLeaveHandler, this);//牌局中的消息

        this._nTotalResult = null;

        if (this._desk) {
            this._desk.destroy();
            this._desk = null;
        }

        this._userIds = null
        this._cards = null;
        this._nikeNames = null;
        this._dices = null;

        this._initLevel = null;
        this._initScore = null;
        this._initFourBeast = null;
    }

    private grGhostNotifyHandler(e: SocketEvent): void {
        LoadingManager.hideLoading();
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            if (this._isEntry) return;
            var _s: string = CSerializable.readGB2312Bytes(b, b.bytesAvailable);
            this.adaptive(_s);
        }
    }

    private adaptive(data: String): void {
        var arrLine: Array<string> = data.split("\n");
        for (var i: number = 0; i < arrLine.length; i++) {
            var sLine: string = arrLine[i];
            var scan: MJScanner = new MJScanner(sLine);
            var _t: String = scan.ReadType();
            switch (_t) {
                case "Format"://版本号
                    this.reset();
                    break;
                case "RoomID":
                    this._roomId = scan.ReadInt();
                    break;
                case "TableNO":
                    this._tableNO = scan.ReadInt();
                    break;
                case "BeginNO":
                    this._beginNO = scan.ReadInt();
                    this._nCurrentCatch = this._beginNO;
                    break;
                case "Bout":
                    this._bout = scan.ReadInt();
                    break;
                case "Players":
                    for (var nChairNO: number = 0; true; nChairNO++) {
                        this._userIds.setAt(nChairNO, new int(scan.ReadInt()));
                        if (!scan.HasNext()) break;
                    }
                    break;
                case "Cards":
                    for (var j: number = 0; j < 144; j++) {
                        this._cards.setAt(j, new int(scan.ReadInt()));
                    }
                    break;
                case "NickName":
                    for (j = 0; j < 4; j++) {
                        this._nikeNames[j] = scan.ReadName();
                    }
                    break;
                case "Banker":
                    this._banker = scan.ReadInt(1);
                    break;
                case "InitScore":
                    this.grInitScore(scan);
                    break;
                case "Level":
                    this.grInitLevel(scan);
                    break;
                case "FourBeast":
                    this.grInitFourBeast(scan);
                    break;
                case "Dices":
                    for (j = 0; j < 4; j++) {
                        this._dices[j] = scan.ReadInt();
                    }

                    this.grStartSoloTable();
                    break;
                case "Catch":
                    this.grCardInform(scan);
                    break;
                case "Throw":
                    this._isWatingBankThrowCard = false;
                    this.grThrowCardInform(scan);
                    break;
                case "Peng":
                    this.grPengCardInform(scan);
                    break;
                case "Chi":
                    this.grChiCardInform(scan);
                    break;
                case "Gang":
                    // this.grGangCardInform(scan);
                    break;
                case "MnGang":
                    this.grMNGangCardInform(scan);
                    break;
                case "AnGang":
                    this.grANGangCardInform(scan);
                    break;
                case "PnGang":
                    this.grPNGangCardInform(scan);
                    break;
                case "Hua":
                    this.grHUACardInform(scan);
                    break;
                case "HuaOver":
                    this._isHuaOver = true;
                    this.grOverHUACardInform(scan);
                    break;
                case "Hu":
                    this._huChair = scan.ReadInt(1);
                    var bManu: boolean = (scan.ReadChar() == "M");
                    this._nLoseChair = scan.ReadInt(1);
                    this._huCardId = scan.ReadInt();

                    //自摸
                    if (this._huChair == this._nLoseChair) {
                        this._nLoseChair = -1;
                    }
                    break;
                case "CuoHu":
                    this.grCuoHuHandler(scan);
                    break;
                case "ScoreDiff":
                    this.grGameWinHandler(scan);
                    break;
                case "Finally":
                    this.grGameWinTotalFinallyHandler(scan);
                    break;
                case "Rank":
                    this.grGameWinTotalRankHandler(scan);
                    break;
                case "HuUnits":
                    this.grHuUnits(scan);
                    break;
                case "HuGains":
                    this.grHuGains(scan);
                    break;
                case ""://end
                    break;
                default://unsupport
                    break;
            }
        }
    }

    private _cGameStartSoloTable: CGameSOLOTABLE;
    private _cGameStartInfo: CGameStartInfo;
    private _cGamePlayerData: Array<CGamePlayerData>;
    private _cGameTableInfo: CGameTableInfo;
    private _cGameHU_DETAILS: CGameHU_DETAILS;

    private chariCards: FixedArray;
    private _cGameMJPlayerData: TCGameMJPlayData;

    /**
     *分桌完成，准备开始游戏
     * @param e
     *
     */
    private grStartSoloTable(): void {
        this._cGameStartSoloTable = new CGameSOLOTABLE();
        this._cGamePlayerData = new Array<CGamePlayerData>(4);
        this._cGameStartInfo = new CGameStartInfo();

        this._cGameStartSoloTable.nRoomID.value = this._roomId;
        this._cGameStartSoloTable.nTableNO.value = this._tableNO;
        this._cGameStartSoloTable.nUserIDs = this._userIds;


        this._cGameStartInfo.nWallCards = this._cards;
        this._cGameStartInfo.nBanker.value = this._banker;
        this._cGameStartInfo.nBoutCount.value = this._bout;
        this._cGameStartInfo.nBeginNO.value = this._beginNO;
        this._cGameStartInfo.nDices = this._dices;

        this._cGameStartInfo.nStartWait.value = 8;

        var _sourceArr: FixedArray = this.getChairCards();
        var _cardsHand: FixedArray = this.combHandCard(_sourceArr);
        if (_cardsHand.getLen()) {
            this._cGameStartInfo.nChairCards = _cardsHand;
        }

        this.chariCards = this.getChairCards();

        if (!WGManager.getInstance().lookerID) {
            WGManager.getInstance().lookerID = this._userIds.getAt(0).value;
        }

        this._cGameMJPlayerData = new TCGameMJPlayData();

        for (var i: number = 0; i < 4; i++) {
            var _playerDataItem: CGamePlayerData = new CGamePlayerData();
            _playerDataItem.UserInfo = new CGmaeUserInfo();
            _playerDataItem.GameData = new CGameUserGameData();
            _playerDataItem.StatData = new CGameUserStatData();

            _playerDataItem.UserInfo.nUserID.value = this._userIds.getAt(i).value;
            _playerDataItem.UserInfo.sNickName = this._nikeNames[i];

            _playerDataItem.GameData.nChairNO.value = i;
            _playerDataItem.GameData.nUserID.value = this._userIds.getAt(i).value;
            _playerDataItem.GameData.nTempScore.value = this._initScore[i];

            _playerDataItem.StatData.nLevelID.value = this._initLevel[i];
            _playerDataItem.StatData.nFourBeast.value = this._initFourBeast[i];

            this._cGameStartInfo.nCardsCount.setAt(i, new int(13));

            if (WGManager.getInstance().lookerID == _playerDataItem.UserInfo.nUserID.value) {
                WGManager.getInstance().isCompereIng = true;
                WGManager.getInstance().chairNo = _playerDataItem.GameData.nChairNO.value;
            }
            this._cGamePlayerData[i] = _playerDataItem;
        }

        this.clearDesk();
        this.initDesk();

        WGManager.getInstance().wallData = this._cGameStartInfo.nWallCards.slice(0, 144);

        DeskManager.getInstance().nBeginNO = this._cGameStartInfo.nBeginNO.value;
        DeskManager.getInstance().isXw = false;
        DeskManager.getInstance().soloTable = this._cGameStartSoloTable;
        DeskManager.getInstance().playerArr = this._cGamePlayerData;
        DeskManager.getInstance().gameStartInfo = this._cGameStartInfo;

        DeskManager.getInstance().init();

        if (!this._isEntry) {
            if (!DeskManager.getInstance().isInGameScene) {
                SceneManagerExt.goGameScene();
            } else {
                this._desk.init();
                this._desk.deskDraw();
            }
        }
    }

    private grSoloTableXw(): void {
        var nTailTaken: number = 0;
        for (var i: number = 0; i < 4; i++) {
            //花
            nTailTaken += this._cGameMJPlayerData.nHuaCards[i].length;
            //明杠
            nTailTaken += this._cGameMJPlayerData.MnGangCards[i].length;
            //暗杠
            nTailTaken += this._cGameMJPlayerData.AnGangCards[i].length;
            //碰杠
            nTailTaken += this._cGameMJPlayerData.PnGangCards[i].length;
        }

        this._cGameStartInfo.nTailTaken.value = nTailTaken;
        this._cGameStartInfo.nCurrentChair.value = this._nCurrentChair;
        this._cGameStartInfo.nCurrentCatch.value = (this._nCurrentCatch + 52 - nTailTaken) % 144;
        this._cGameTableInfo = new CGameTableInfo();
        this._cGameTableInfo.StartData = this._cGameStartInfo;

        this._cGameTableInfo.PlayData = new CGameMJPlayData();

        //判断是不是开局补花流程
        if (!this._isHuaOver) {
            this._cGameTableInfo.StartData.dwStatus.value |= Global.TS_WAITING_HUA;
            this._cGameTableInfo.StartData.dwStatus.value |= Global.TS_WAITING_THROW;
        }

        //开局等待庄家出牌阶段。点了切视角当前活动椅子号标记问题
        if (this._isWatingBankThrowCard && this._isHuaOver) {
            this._cGameStartInfo.nCurrentChair.value = this._banker;
        }


        for (i = 0; i < Global.MJ_CHAIR_COUNT; i++) {
            for (var j: number = 0; j < Global.MJ_MAX_PENG; j++) {
                var _cGamePengCardsUnit: CGameCardsUnit = this.createInitCardsUnit();
                var _cGameChiCardsUnit: CGameCardsUnit = this.createInitCardsUnit();
                var _cGameMgCardsUnit: CGameCardsUnit = this.createInitCardsUnit();
                var _cGameAgCardsUnit: CGameCardsUnit = this.createInitCardsUnit();
                var _cGamePgCardsUnit: CGameCardsUnit = this.createInitCardsUnit();

                if (this._cGameMJPlayerData.PengCards[i].length > j) {
                    _cGamePengCardsUnit.nCardChair = this._cGameMJPlayerData.PengCards[i][j].nCardChair;
                    _cGamePengCardsUnit.nCardIDs.arr[0] = this._cGameMJPlayerData.PengCards[i][j].nCardIDs.getAt(0);
                    _cGamePengCardsUnit.nCardIDs.arr[1] = this._cGameMJPlayerData.PengCards[i][j].nCardIDs.getAt(1);
                    _cGamePengCardsUnit.nCardIDs.arr[2] = this._cGameMJPlayerData.PengCards[i][j].nCardIDs.getAt(2);
                }

                if (this._cGameMJPlayerData.ChiCards[i].length > j) {
                    _cGameChiCardsUnit.nCardChair = this._cGameMJPlayerData.ChiCards[i][j].nCardChair;
                    _cGameChiCardsUnit.nCardIDs.arr[0] = this._cGameMJPlayerData.ChiCards[i][j].nCardIDs.getAt(0);
                    _cGameChiCardsUnit.nCardIDs.arr[1] = this._cGameMJPlayerData.ChiCards[i][j].nCardIDs.getAt(1);
                    _cGameChiCardsUnit.nCardIDs.arr[2] = this._cGameMJPlayerData.ChiCards[i][j].nCardIDs.getAt(2);
                    _cGameChiCardsUnit.nCardIDs.arr[3].value = -1;
                }


                if (this._cGameMJPlayerData.MnGangCards[i].length > j) {
                    _cGameMgCardsUnit.nCardChair = this._cGameMJPlayerData.MnGangCards[i][j].nCardChair;
                    _cGameMgCardsUnit.nCardIDs.arr[0] = this._cGameMJPlayerData.MnGangCards[i][j].nCardIDs.getAt(0);
                    _cGameMgCardsUnit.nCardIDs.arr[1] = this._cGameMJPlayerData.MnGangCards[i][j].nCardIDs.getAt(1);
                    _cGameMgCardsUnit.nCardIDs.arr[2] = this._cGameMJPlayerData.MnGangCards[i][j].nCardIDs.getAt(2);
                    _cGameMgCardsUnit.nCardIDs.arr[3] = this._cGameMJPlayerData.MnGangCards[i][j].nCardIDs.getAt(3);
                }


                if (this._cGameMJPlayerData.AnGangCards[i].length > j) {
                    _cGameAgCardsUnit.nCardChair = this._cGameMJPlayerData.AnGangCards[i][j].nCardChair;
                    _cGameAgCardsUnit.nCardIDs.arr[0] = this._cGameMJPlayerData.AnGangCards[i][j].nCardIDs.getAt(0);
                    _cGameAgCardsUnit.nCardIDs.arr[1] = this._cGameMJPlayerData.AnGangCards[i][j].nCardIDs.getAt(1);
                    _cGameAgCardsUnit.nCardIDs.arr[2] = this._cGameMJPlayerData.AnGangCards[i][j].nCardIDs.getAt(2);
                    _cGameAgCardsUnit.nCardIDs.arr[3] = this._cGameMJPlayerData.AnGangCards[i][j].nCardIDs.getAt(3);
                }

                if (this._cGameMJPlayerData.PnGangCards[i].length > j) {
                    _cGamePgCardsUnit.nCardChair = this._cGameMJPlayerData.PnGangCards[i][j].nCardChair;
                    _cGamePgCardsUnit.nCardIDs.arr[0] = this._cGameMJPlayerData.PnGangCards[i][j].nCardIDs.getAt(1);
                    _cGamePgCardsUnit.nCardIDs.arr[1] = this._cGameMJPlayerData.PnGangCards[i][j].nCardIDs.getAt(1);
                    _cGamePgCardsUnit.nCardIDs.arr[2] = this._cGameMJPlayerData.PnGangCards[i][j].nCardIDs.getAt(2);
                    _cGamePgCardsUnit.nCardIDs.arr[3] = this._cGameMJPlayerData.PnGangCards[i][j].nCardIDs.getAt(3);
                }

                this._cGameTableInfo.PlayData.PengCards.setAt(i * Global.MJ_MAX_PENG + j, _cGamePengCardsUnit);
                this._cGameTableInfo.PlayData.ChiCards.setAt(i * Global.MJ_MAX_PENG + j, _cGameChiCardsUnit);
                this._cGameTableInfo.PlayData.MnGangCards.setAt(i * Global.MJ_MAX_PENG + j, _cGameMgCardsUnit);
                this._cGameTableInfo.PlayData.AnGangCards.setAt(i * Global.MJ_MAX_PENG + j, _cGameAgCardsUnit);
                this._cGameTableInfo.PlayData.PnGangCards.setAt(i * Global.MJ_MAX_PENG + j, _cGamePgCardsUnit);

            }
        }

        for (i = 0; i < Global.MJ_CHAIR_COUNT; i++) {
            for (j = 0; j < Global.MJ_MAX_OUT; j++) {
                var _outCardId: number = -1;
                var _huaCardId: number = -1;

                if (this._cGameMJPlayerData.nOutCards[i].length > j) {
                    _outCardId = this._cGameMJPlayerData.nOutCards[i][j];
                }

                if (this._cGameMJPlayerData.nHuaCards[i].length > j) {
                    _huaCardId = this._cGameMJPlayerData.nHuaCards[i][j];
                }

                this._cGameTableInfo.PlayData.nOutCards.setAt(i * Global.MJ_MAX_OUT + j, new int(_outCardId));
                this._cGameTableInfo.PlayData.nHuaCards.setAt(i * Global.MJ_MAX_OUT + j, new int(_huaCardId));
            }
            this._cGameTableInfo.PlayData.nHuaCount.setAt(i, new int(this._cGameMJPlayerData.nHuaCards[i].length));

            console.log("this.chariCards.getAt(i).length)" + this.chariCards.getAt(i).length);

            this._cGameStartInfo.nCardsCount.setAt(i, new int(this.chariCards.getAt(i).length));
        }

        var _cardsHand: FixedArray = this.combHandCard(this.chariCards);
        if (_cardsHand.getLen()) {
            this._cGameStartInfo.nChairCards = _cardsHand;
        }

        this.clearDesk();
        this.initDesk();
        DeskManager.getInstance().isXw = true;

        WGManager.getInstance().wallData = this._cGameTableInfo.StartData.nWallCards.slice(0, 144);
        DeskManager.getInstance().soloTable = this._cGameStartSoloTable;
        DeskManager.getInstance().playerArr = this._cGamePlayerData;
        DeskManager.getInstance().gameInfoXW = this._cGameTableInfo;
        DeskManager.getInstance().init();


        if (!DeskManager.getInstance().isInGameScene) {
            SceneManagerExt.goGameScene();
        } else {
            this._desk.init();
            this._desk.deskDraw();
        }
    }

    private createInitCardsUnit(): CGameCardsUnit {
        var _tempCardIds: FixedArray = new FixedArray("int", Global.MJ_UNIT_LEN);
        _tempCardIds.arr[0].value = -1;
        _tempCardIds.arr[1].value = -1;
        _tempCardIds.arr[2].value = -1;
        _tempCardIds.arr[3].value = -1;

        var _cGameCardsUnit: CGameCardsUnit = new CGameCardsUnit();
        _cGameCardsUnit.nCardChair.value = -1;
        _cGameCardsUnit.nCardIDs = _tempCardIds;

        return _cGameCardsUnit;
    }


    private getChairCards(): FixedArray {
        var _tempCards: Array<number> = new Array<number>();
        var _copyCards: Array<number> = new Array<number>();
        var _spliteCards: Array<number> = new Array<number>();
        var cards: number = 4;
        var _chairNoE: Array<number> = new Array<number>();
        var _chairNoS: Array<number> = new Array<number>();
        var _chairNoW: Array<number> = new Array<number>();
        var _chairNoN: Array<number> = new Array<number>();

        if (this._cards) {
            for (var i: number = 0; i < 52; i++) {
                var _begin: number = (i + this._beginNO) % 144;
                if (this._cards.getAt(_begin).value > -1) {
                    _tempCards[i] = this._cards.getAt(_begin).value;
                }
            }
        }

        for (i = 0; i < 4; i++) {
            if (i == 3) cards = 1;

            for (var j: number = 0; j < GlobalVar.PLAYERCOUNT; j++) {
                _spliteCards = _tempCards.slice(i * 16 + j * cards, i * 16 + (j + 1) * cards);
                switch (j) {
                    case 0:
                        _chairNoE = _chairNoE.concat(_spliteCards);
                        break;
                    case 1:
                        _chairNoS = _chairNoS.concat(_spliteCards);
                        break;
                    case 2:
                        _chairNoW = _chairNoW.concat(_spliteCards);
                        break;
                    case 3:
                        _chairNoN = _chairNoN.concat(_spliteCards);
                        break;
                }
            }
        }

        var _tempArr: FixedArray = new FixedArray("Array", 4);
        if (this._banker == 0) {
            _tempArr.setAt(0, _chairNoE);
            _tempArr.setAt(1, _chairNoN);
            _tempArr.setAt(2, _chairNoW);
            _tempArr.setAt(3, _chairNoS);
        }
        else if (this._banker == 1) {
            _tempArr.setAt(0, _chairNoS);
            _tempArr.setAt(1, _chairNoE);
            _tempArr.setAt(2, _chairNoN);
            _tempArr.setAt(3, _chairNoW);
        }
        else if (this._banker == 2) {
            _tempArr.setAt(0, _chairNoW);
            _tempArr.setAt(1, _chairNoS);
            _tempArr.setAt(2, _chairNoE);
            _tempArr.setAt(3, _chairNoN);
        } else {
            _tempArr.setAt(0, _chairNoN);
            _tempArr.setAt(1, _chairNoW);
            _tempArr.setAt(2, _chairNoS);
            _tempArr.setAt(3, _chairNoE);
        }

        return _tempArr;
    }

    private combHandCard(sourceArr: FixedArray): FixedArray {

        var copyData: FixedArray = sourceArr.concat();

        var len: number = copyData.getLen();
        var _arr: FixedArray = new FixedArray("int", len);

        for (var i: number = 0; i < len; i++) {
            // var _item: FixedArray = sourceArr[i].concat();
            var _item: Array<number> = copyData.getAt(i);
            _arr.setAt(i, _item)
        }

        for (i = 0; i < 4; i++) {
            len = Global.CHAIR_CARDS - copyData.getAt(i).length;
            for (var j: number = 0; j < len; j++) {
                var _item: Array<number> = _arr.getAt(i);
                _item.push(-1);
            }
        }

        var _temp0: Array<number> = _arr.getAt(0);
        var _temp1: Array<number> = _arr.getAt(1);
        var _temp2: Array<number> = _arr.getAt(2);
        var _temp3: Array<number> = _arr.getAt(3);

        var _concatArr: Array<number> = _temp0.concat(_temp1).concat(_temp2).concat(_temp3);
        var returnFixedArray: FixedArray = new FixedArray("int", 128);

        for (i = 0; i < _concatArr.length; i++) {
            returnFixedArray.setAt(i, new int(_concatArr[i]));
        }
        return returnFixedArray;
    }

    private CalcCatchFrom(nBanker: number, nDices: Array<number>): number {
        var nBeginNO: number = 0;
        var nTotalChairs: number = 4;
        var m_nTotalCards: number = 144;

        var nTotal: number = nDices[0] + nDices[1];
        var nSide: number = nTotal % nTotalChairs;

        var nChair: number = 0;

        switch (nSide) {
            case 1://自己这一边
                nChair = nBanker;
                break;
            case 2://下家
                nChair = (nBanker + 3) % nTotalChairs;
                break;
            case 3://对家
                nChair = (nBanker + 2) % nTotalChairs;
                break;
            case 0://上家
                nChair = (nBanker + 1) % nTotalChairs;
                break;
            default:
                break;
        }

        var nTotal2: number = nTotal + nDices[2] + nDices[3];
        var nCardsPerSide: number = m_nTotalCards / nTotalChairs;

        switch (nChair) {
            case 0:
                nBeginNO = nCardsPerSide * 3 + nTotal2 * 2;
                break;
            case 3:
                nBeginNO = nCardsPerSide * 2 + nTotal2 * 2;
                break;
            case 2:
                nBeginNO = nCardsPerSide + nTotal2 * 2;
                break;
            case 1:
                nBeginNO = 0 + nTotal2 * 2;
                break;
        }

        nBeginNO = nBeginNO % m_nTotalCards;
        return nBeginNO;
    }

    private getRoomInfo(roomId: number): void {
        var sendData: egret.ByteArray = new egret.ByteArray();
        sendData.endian = egret.Endian.LITTLE_ENDIAN;
        sendData.writeInt(roomId);

        SocketEvent.addEventListener(Global.LSR_GET_ONE_GHOSTROOMINFO.toString(), this.getRoomInfoHandler, this);
        SQGameServer.getInstance().sendCmd(Global.LSR_GET_ONE_GHOSTROOMINFO, sendData);
    }

    private _isLastRound: boolean = false;

    private getRoomInfoHandler(e: SocketEvent): void {
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        SocketEvent.removeEventListener(Global.LSR_GET_ONE_GHOSTROOMINFO.toString(), this.getRoomInfoHandler, this);
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            var cgameRoomInfo: CGameRoom;
            var _uid: number = SystemCenter.playSystem.selfPlayerInfo.userID;
            while (b.bytesAvailable) {
                cgameRoomInfo = new CGameRoom();
                CSerializable.Deserialization(cgameRoomInfo, b);
            }

            if (cgameRoomInfo.nBoutCount.value === this._bout) {
                this._isLastRound = true;
            }
        }
    }

    private grMNGangCardInform(scan: MJScanner): void {
        var nChairNO: number = scan.ReadInt(1);
        var bManu: boolean = (scan.ReadChar() == "M");
        var nCardChair: number = scan.ReadInt(1);
        var unit: FixedArray = new FixedArray("int", 4);
        unit.arr[0].value = scan.ReadInt();
        unit.arr[1].value = scan.ReadInt();
        unit.arr[2].value = scan.ReadInt();
        unit.arr[3].value = scan.ReadInt();

        this._nCurrentChair = nChairNO;

        var cGameCombCard: CGameCombCard = new CGameCombCard();
        cGameCombCard.nUserID = this._userIds.getAt(nChairNO);
        cGameCombCard.nCardID = unit.getAt(0);
        cGameCombCard.nCardChair.value = nCardChair;
        cGameCombCard.nBaseIDs.arr[0] = unit.getAt(1);
        cGameCombCard.nBaseIDs.arr[1] = unit.getAt(2);
        cGameCombCard.nBaseIDs.arr[2] = unit.getAt(3);
        cGameCombCard.dwFlags2.value = Global.MJ_PGCH_SUCC;

        var tCGameCardsUnit: TCGameCardsUnit = new TCGameCardsUnit();
        tCGameCardsUnit.nCardChair.value = nCardChair;
        tCGameCardsUnit.nCardIDs = unit;

        this._cGameMJPlayerData.MnGangCards[nChairNO].push(tCGameCardsUnit);
        this._cGameMJPlayerData.nOutCards[nCardChair].splice(this._cGameMJPlayerData.nOutCards[nCardChair].indexOf(unit.getAt(0).value), 1);

        this.chariCards.getAt(nChairNO).splice(this.chariCards.getAt(nChairNO).indexOf(unit.getAt(1).value), 1);
        this.chariCards.getAt(nChairNO).splice(this.chariCards.getAt(nChairNO).indexOf(unit.getAt(2).value), 1);
        this.chariCards.getAt(nChairNO).splice(this.chariCards.getAt(nChairNO).indexOf(unit.getAt(3).value), 1);

        if (!this._isEntry) {
            this._desk.see_mGangcardInform(cGameCombCard);
        }
    }

    private grANGangCardInform(scan: MJScanner): void {
        var nChairNO: number = scan.ReadInt(1);
        var bManu: boolean = (scan.ReadChar() == "M");
        var nCardChair: number = scan.ReadInt(1);
        var unit: FixedArray = new FixedArray("int", 4);
        unit.arr[0].value = scan.ReadInt();
        unit.arr[1].value = scan.ReadInt();
        unit.arr[2].value = scan.ReadInt();
        unit.arr[3].value = scan.ReadInt();

        this._nCurrentChair = nChairNO;

        var cGameCombCard: CGameCombCard = new CGameCombCard();
        cGameCombCard.nUserID = this._userIds.getAt(nChairNO);

        cGameCombCard.nCardID = unit.getAt(0);
        cGameCombCard.nCardChair.value = nCardChair;
        cGameCombCard.nBaseIDs.arr[0] = unit.getAt(1);
        cGameCombCard.nBaseIDs.arr[1] = unit.getAt(2);
        cGameCombCard.nBaseIDs.arr[2] = unit.getAt(3);


        cGameCombCard.dwFlags2.value = Global.MJ_PGCH_SUCC;

        var tCGameCardsUnit: TCGameCardsUnit = new TCGameCardsUnit();
        tCGameCardsUnit.nCardChair.value = nCardChair;
        tCGameCardsUnit.nCardIDs = unit;

        this._cGameMJPlayerData.AnGangCards[nChairNO].push(tCGameCardsUnit);


        this.chariCards.getAt(nChairNO).splice(this.chariCards.getAt(nChairNO).indexOf(unit.getAt(0).value), 1);
        this.chariCards.getAt(nChairNO).splice(this.chariCards.getAt(nChairNO).indexOf(unit.getAt(1).value), 1);
        this.chariCards.getAt(nChairNO).splice(this.chariCards.getAt(nChairNO).indexOf(unit.getAt(2).value), 1);
        this.chariCards.getAt(nChairNO).splice(this.chariCards.getAt(nChairNO).indexOf(unit.getAt(3).value), 1);

        if (!this._isEntry) {
            this._desk.see_aGangCardInform(cGameCombCard);
        }
    }

    private grHUACardInform(scan: MJScanner): void {
        var nChairNO: number = scan.ReadInt(1);
        var bManu: boolean = (scan.ReadChar() == "M");
        var nCardID: number = scan.ReadInt();


        this._nCurrentChair = nChairNO;
        var cHuaCard: CGameThrowCards = new CGameThrowCards();
        cHuaCard.nUserID.value = this._userIds.getAt(nChairNO).value;
        cHuaCard.nCardID.value = nCardID;

        this._cGameMJPlayerData.nHuaCards[nChairNO].push(nCardID);

        this.chariCards.getAt(nChairNO).splice(this.chariCards.getAt(nChairNO).indexOf(nCardID), 1);

        if (!this._isEntry) {
            this._desk.see_HUAInform(cHuaCard);
        }
    }


    private grOverHUACardInform(scan: MJScanner): void {
        var cgameHuaOver: CGameHuaOver = new CGameHuaOver();
        cgameHuaOver.nNextChair.value = -1;

        if (!this._isEntry) {
            this._desk.see_HUAOverInform(cgameHuaOver);
        }
    }


    private grPNGangCardInform(scan: MJScanner): void {
        var nChairNO: number = scan.ReadInt(1);
        var bManu: boolean = (scan.ReadChar() == "M");
        var nCardChair: number = scan.ReadInt(1);
        var unit: FixedArray = new FixedArray("int", 4);
        unit.arr[0].value = scan.ReadInt();
        unit.arr[1].value = scan.ReadInt();
        unit.arr[2].value = scan.ReadInt();
        unit.arr[3].value = scan.ReadInt();

        this._nCurrentChair = nChairNO;

        var cGameCombCard: CGameCombCard = new CGameCombCard();
        cGameCombCard.nUserID = this._userIds.getAt(nChairNO);
        cGameCombCard.nCardID = unit.getAt(0);
        cGameCombCard.nCardChair.value = nCardChair;
        cGameCombCard.nBaseIDs.arr[0] = unit.getAt(1);
        cGameCombCard.nBaseIDs.arr[1] = unit.getAt(2);
        cGameCombCard.nBaseIDs.arr[2] = unit.getAt(3);

        cGameCombCard.dwFlags2.value = Global.MJ_PGCH_SUCC;

        var tCGameCardsUnit: TCGameCardsUnit = new TCGameCardsUnit();
        tCGameCardsUnit.nCardChair.value = nCardChair;
        tCGameCardsUnit.nCardIDs = unit;

        this._cGameMJPlayerData.PnGangCards[nChairNO].push(tCGameCardsUnit);

        this.chariCards.getAt(nChairNO).splice(this.chariCards.getAt(nChairNO).indexOf(unit.getAt(0).value), 1);

        if (!this._isEntry) {
            this._desk.see_pnGangCardInform(cGameCombCard);
        }
    }

    private grHuUnits(scan: MJScanner): void {
        var _s: string = scan.m_s;
        var _arr: Array<string>;
        if (!this._cGameHU_DETAILS) {
            this._cGameHU_DETAILS = new CGameHU_DETAILS();
        }

        if (_s != "") {
            _arr = _s.split("],");

            if (_arr.length != 1) {
                for (var i: number = 0; i < Global.MJ_MAX_UNITS; i++) {
                    var _cGameHU_UNIT: CGameHU_UNIT = new CGameHU_UNIT();
                    _cGameHU_UNIT.dwFlag.value = 0;
                    if (_arr[i]) {
                        var _sArrItem: string = _arr[i].replace(/[\[\]]/g, "");
                        var _filterType: string = _sArrItem.replace(/^[P|C|G]/, "");
                        var _arrItem: Array<string> = _filterType.split(",");

                        _cGameHU_UNIT.dwType.value = this.setDwType(_arrItem);

                        for (var j: number = 0; j < 4; j++) {
                            _cGameHU_UNIT.aryIndexes.arr[j].value = -1;
                        }

                        for (j = 0; j < _arrItem.length; j++) {
                            if (parseInt(_arrItem[j], 10) == this._huCardId) {
                                _cGameHU_UNIT.dwFlag.value |= Global.MJ_HU;
                            }

                            if (_sArrItem.toString().charAt(0) == "P") {
                                _cGameHU_UNIT.dwFlag.value |= Global.MJ_PENG;
                            }

                            if (_sArrItem.toString().charAt(0) == "C") {
                                _cGameHU_UNIT.dwFlag.value |= Global.MJ_CHI;
                            }

                            if (_sArrItem.toString().charAt(0) == "G") {
                                _cGameHU_UNIT.dwFlag.value |= Global.MJ_GANG_MN;
                            }

                            _cGameHU_UNIT.aryIndexes.arr[j].value = CardData.getIndexByCardId(parseInt(_arrItem[j]));
                        }
                    }
                    this._cGameHU_DETAILS.HU_UNIT.arr[i] = _cGameHU_UNIT;
                }
            }
            else {
                for (i = 0; i < Global.MJ_MAX_UNITS; i++) {
                    _cGameHU_UNIT = new CGameHU_UNIT();
                    _cGameHU_UNIT.dwFlag.value = 0;
                    this._cGameHU_DETAILS.HU_UNIT.arr[i].value = _cGameHU_UNIT;
                }
            }
        }
    }

    private setDwType(_arrItem: Array<string>): number {
        if (_arrItem) {
            _arrItem.sort(function (a: string, b: string): number {
                return CardData.getIndexByCardId(parseInt(a, 10)) - CardData.getIndexByCardId(parseInt(b, 10))
            })
        }

        switch (_arrItem.length) {
            case 2:
                return Global.MJ_CT_DUIZI;
                break;
            case 3:
                var _item0: number = CardData.getIndexByCardId(parseInt(_arrItem[0]));
                var _item1: number = CardData.getIndexByCardId(parseInt(_arrItem[1]))

                if (_item1 - _item0 == 0) {
                    return Global.MJ_CT_KEZI;
                } else if (_item1 - _item0 == 1) {
                    return Global.MJ_CT_SHUN;
                } else if (_item1 - _item0 == 3) {
                    return Global.MJ_CT_BUKAOSHUN;
                }
                break;
            case 4:
                return Global.MJ_CT_GANG;
        }
        return 0;
    }

    private grHuGains(scan: MJScanner): void {
        var _temp: FixedArray = new FixedArray("int", Global.HU_MAXTYPE);
        var _nGain: number = 0;
        if (!this._cGameHU_DETAILS) {
            this._cGameHU_DETAILS = new CGameHU_DETAILS();
        }

        while (scan.HasNext()) {
            var _fanId: number = scan.ReadInt();
            _temp.arr[_fanId].value = FanData.getFanMax(_fanId);
            _nGain += FanData.getFanMax(_fanId);
        }
        this._cGameHU_DETAILS.nHuGains = _temp;
        this._cGameHU_DETAILS.nGains.value = _nGain
    }

    private grInitLevel(scan: MJScanner): void {
        this._initLevel = [scan.ReadInt(), scan.ReadInt(), scan.ReadInt(), scan.ReadInt()];
    }

    private grInitFourBeast(scan: MJScanner): void {
        this._initFourBeast = [scan.ReadInt(), scan.ReadInt(), scan.ReadInt(), scan.ReadInt()];
    }

    private grInitScore(scan: MJScanner): void {
        this._initScore = [scan.ReadInt(), scan.ReadInt(), scan.ReadInt(), scan.ReadInt()];
    }

    private grCuoHuHandler(scan: MJScanner): void {
        var nChairNO: number = scan.ReadInt(1);
        var bManu: boolean = (scan.ReadChar() == "M");
        var nCardChair: number = scan.ReadInt(1);
        var nCardID: number = scan.ReadInt();

        var cgameCuoHu: CGameCuoHu = new CGameCuoHu();
        cgameCuoHu.nUserID.value = this._userIds.getAt(nChairNO);
        cgameCuoHu.nCardsCount.value = Global.CHAIR_CARDS;
        cgameCuoHu.nChairCards = this.getChairCard(nChairNO);

        this._cuohuChairs[nChairNO] = nChairNO;

        //错胡会发胡消息，这里需要重写胡的值，不然流局会报错
        this._huChair = -1;
        this._nLoseChair = -1;
        this._huCardId = -1;

        if (this._desk) {
            this._desk.see_gameCuoHu(cgameCuoHu);
        }

    }

    private getChairCard(chair: number): FixedArray {
        var _cards: FixedArray = this.combHandCard(this.chariCards);
        var _arr: Array<any> = _cards.slice(Global.CHAIR_CARDS * chair, Global.CHAIR_CARDS * (chair + 1));

        var _newFixedArray: FixedArray = new FixedArray("int", _arr.length);
        _newFixedArray.arr = _arr;
        return _newFixedArray;
    }

    private cgameWin: CGameWinResult;

    private grGameWinHandler(scan: MJScanner): void {
        this._isScoreDiff = true;

        this.cgameWin = new CGameWinResult();
        this.cgameWin.gamewinMJ = new CGameWinMJ();
        this.cgameWin.gamewinMJ.gamewin = new CGAMEWIN();
        this.cgameWin.gamewinMJ.gamewin.nScoreDiffs.arr[0].value = scan.ReadInt();
        this.cgameWin.gamewinMJ.gamewin.nScoreDiffs.arr[1].value = scan.ReadInt();
        this.cgameWin.gamewinMJ.gamewin.nScoreDiffs.arr[2].value = scan.ReadInt();
        this.cgameWin.gamewinMJ.gamewin.nScoreDiffs.arr[3].value = scan.ReadInt();

        this.cgameWin.gamewinMJ.gamewin.nOldScores.arr[0].value = this._initScore[0];
        this.cgameWin.gamewinMJ.gamewin.nOldScores.arr[1].value = this._initScore[1];
        this.cgameWin.gamewinMJ.gamewin.nOldScores.arr[2].value = this._initScore[2];
        this.cgameWin.gamewinMJ.gamewin.nOldScores.arr[3].value = this._initScore[3];

        this.cgameWin.gamewinMJ.nHuCard.value = this._huCardId;
        this.cgameWin.gamewinMJ.nLoseChair.value = this._nLoseChair;

        this.cgameWin.gamewinMJ.nHuChair = new FixedArray("int", 4);
        this.cgameWin.gamewinMJ.nHuChair.arr[0].value = -1;
        this.cgameWin.gamewinMJ.nHuChair.arr[1].value = -1;
        this.cgameWin.gamewinMJ.nHuChair.arr[2].value = -1;
        this.cgameWin.gamewinMJ.nHuChair.arr[3].value = -1;

        if (this._huChair > -1) {
            this.cgameWin.gamewinMJ.nHuChair.arr[this._huChair].value = 1;
        }

        this.cgameWin.nChairCards = this.combHandCard(this.chariCards);

        for (var i: number = 0; i < this._cuohuChairs.length; i++) {
            if (this._cuohuChairs[i] > -1) {
                this.cgameWin.gamewinMJ.nResults.arr[i].value = -1;
            }
        }

        if (this._isLastRound) {
            this.cgameWin.gamewinMJ.nNewRound.value = 1
        }

        if (this._desk) {
            this._desk.see_gameWin(this.cgameWin, this._cGameHU_DETAILS);
        }
    }

    private _nTotalResult: Array<number>;

    private grGameWinTotalFinallyHandler(scan: MJScanner): void {
        this._nTotalResult = new Array<number>(scan.ReadInt(), scan.ReadInt(), scan.ReadInt(), scan.ReadInt());
    }

    private grGameWinTotalRankHandler(scan: MJScanner): void {
        var _nRank: Array<number> = new Array<number>(scan.ReadInt(), scan.ReadInt(), scan.ReadInt(), scan.ReadInt());

        var _arr: Array<LSR_FINALLY_RESULTS> = [];
        for (var i: number = 0; i < 4; i++) {
            var _playerResultItem: LSR_FINALLY_RESULTS = new LSR_FINALLY_RESULTS();
            _playerResultItem.nUserID = this._userIds.getAt(i);
            _playerResultItem.nScore.value = this._nTotalResult[i];
            _playerResultItem.nRank.value = _nRank[i];
            _arr.push(_playerResultItem);
        }

        if (this._desk) {
            this._desk.see_FinallyResultInform(_arr);
        }
    }

    /**
     *出牌通知
     * @param e
     *
     */
    private grThrowCardInform(scan: MJScanner): void {
        var nChairNO: number = scan.ReadInt(1);
        var bManu: boolean = (scan.ReadChar() == "M");
        var nCardID: number = scan.ReadInt();

        var cGameCardsThrow: CGameCardsThrow = new CGameCardsThrow();
        cGameCardsThrow.nUserID = this._userIds.getAt(nChairNO);
        cGameCardsThrow.vCardID.value = nCardID;

        this._nCurrentChair = nChairNO;

        this._cGameMJPlayerData.nOutCards[nChairNO].push(nCardID);
        this.chariCards.getAt(nChairNO).splice(this.chariCards.getAt(nChairNO).indexOf(nCardID), 1);

        if (!this._isEntry) {
            this._desk.see_cardThrowInform(cGameCardsThrow);
        }
    }

    /**
     *摸牌通知
     * @param e
     *
     */
    private grCardInform(scan: MJScanner): void {
        var nChairNO: number = scan.ReadInt(1);
        var bManu: boolean = (scan.ReadChar() == "M");
        var nCardID: number = scan.ReadInt();
        var nCardNo: number = scan.ReadInt();

        var _cGameCardCaught: CGameCardCaught = new CGameCardCaught();
        _cGameCardCaught.nCardID.value = nCardID;
        _cGameCardCaught.nCardNO.value = nCardNo;
        _cGameCardCaught.nUserID = this._userIds.getAt(nChairNO);

        this.chariCards.getAt(nChairNO).push(nCardID);

        this._nCurrentCatch += 1;
        this._nCurrentChair = nChairNO;

        if (!this._isEntry) {
            this._desk.see_cardCaughtInform(_cGameCardCaught);
        }
    }

    /**
     *碰通知
     * @param e
     *
     */
    private grPengCardInform(scan: MJScanner): void {
        var nChairNO: number = scan.ReadInt(1);
        var bManu: boolean = (scan.ReadChar() == "M");
        var nCardChair: number = scan.ReadInt(1);

        var unit: FixedArray = new FixedArray("int", 4);
        unit.arr[0].value = scan.ReadInt();
        unit.arr[1].value = scan.ReadInt();
        unit.arr[2].value = scan.ReadInt();
        unit.arr[3].value = -1;

        this._nCurrentChair = nChairNO;

        var cGameCombCard: CGameCombCard = new CGameCombCard();
        cGameCombCard.nUserID = this._userIds.getAt(nChairNO);

        cGameCombCard.nCardID = unit.getAt(0);
        cGameCombCard.nCardChair.value = nCardChair;
        cGameCombCard.nBaseIDs.arr[0] = unit.getAt(1);
        cGameCombCard.nBaseIDs.arr[1] = unit.getAt(2);
        cGameCombCard.nBaseIDs.arr[2].value = -1;


        var cGameCardsUnit: TCGameCardsUnit = new TCGameCardsUnit();
        cGameCardsUnit.nCardChair.value = nCardChair;
        cGameCardsUnit.nCardIDs = unit;

        this._cGameMJPlayerData.PengCards[nChairNO].push(cGameCardsUnit);
        this._cGameMJPlayerData.nOutCards[nCardChair].splice(this._cGameMJPlayerData.nOutCards[nCardChair].indexOf(unit.getAt(0).value), 1);

        this.chariCards.getAt(nChairNO).splice(this.chariCards.getAt(nChairNO).indexOf(unit.getAt(1).value), 1);
        this.chariCards.getAt(nChairNO).splice(this.chariCards.getAt(nChairNO).indexOf(unit.getAt(2).value), 1);

        if (!this._isEntry) {
            this._desk.see_pengCardInform(cGameCombCard);
        }
    }

    private grChiCardInform(scan: MJScanner): void {
        var nChairNO: number = scan.ReadInt(1);
        var bManu: boolean = (scan.ReadChar() == "M");
        var nCardChair: number = scan.ReadInt(1);
        var unit: FixedArray = new FixedArray("int", 3);
        unit.arr[0].value = scan.ReadInt();
        unit.arr[1].value = scan.ReadInt();
        unit.arr[2].value = scan.ReadInt();

        this._nCurrentChair = nChairNO;

        var cGameCombCard: CGameCombCard = new CGameCombCard();
        cGameCombCard.nUserID = this._userIds.getAt(nChairNO);

        cGameCombCard.nCardID = unit.getAt(0);
        cGameCombCard.nCardChair.value = nCardChair;
        cGameCombCard.nBaseIDs.arr[0] = unit.getAt(1);
        cGameCombCard.nBaseIDs.arr[1] = unit.getAt(2);
        cGameCombCard.nBaseIDs.arr[2].value = -1;


        var tCGameCardsUnit: TCGameCardsUnit = new TCGameCardsUnit();
        tCGameCardsUnit.nCardChair.value = nCardChair;
        tCGameCardsUnit.nCardIDs = unit;

        this._cGameMJPlayerData.ChiCards[nChairNO].push(tCGameCardsUnit);
        this._cGameMJPlayerData.nOutCards[nCardChair].splice(this._cGameMJPlayerData.nOutCards[nCardChair].indexOf(unit.getAt(0).value), 1);

        this.chariCards.getAt(nChairNO).splice(this.chariCards.getAt(nChairNO).indexOf(unit.getAt(1).value), 1);
        this.chariCards.getAt(nChairNO).splice(this.chariCards.getAt(nChairNO).indexOf(unit.getAt(2).value), 1);

        if (!this._isEntry) {
            this._desk.see_chiCardInform(cGameCombCard);
        }
    }

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
}