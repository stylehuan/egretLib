/**
 * Created by stylehuan on 2016/9/20.
 */
class GameResultSinglePanel extends egret.DisplayObjectContainer {
    public constructor() {
        super();
        this.initial();
    }

    private _bg: egret.Bitmap;
    private totalFanText: SQ.SimplicityTextField;
    private curWind: SQ.SimplicityTextField;
    private nextBtn: SQ.Button;
    private nextTimeDown: SQ.SimplicityTextField;
    private timer: egret.Timer;
    private liuIcon: egret.Bitmap;
    private pendant: egret.Bitmap;

    private playerContainer: egret.DisplayObjectContainer;
    private fanList: egret.DisplayObjectContainer;
    private handCards: egret.DisplayObjectContainer;
    private mingCards: egret.DisplayObjectContainer;

    private repeat: number;

    public initial(): void {
        this.pendant = new egret.Bitmap();
        this.pendant.texture = RES.getRes("game_result.modify");
        this.addChild(this.pendant);

        this._bg = new egret.Bitmap();
        this._bg.texture = RES.getRes("result_bg.png");
        this.addChild(this._bg);

        this.width = this._bg.width;
        this.height = this._bg.height;


        this.pendant.x = -150;
        this.pendant.y = this.height - this.pendant.height;

        var textStyle: SQ.TextStyleConfig = new SQ.TextStyleConfig();
        textStyle.maxLen = 10;
        textStyle.size = 18;
        textStyle.isBold = true;
        textStyle.textColor = 0x4c1d00;

        var _strWind = this.createCurWindLoop();
        this.curWind = new SQ.SimplicityTextField(_strWind, textStyle);
        this.addChild(this.curWind);
        this.curWind.x = 210;
        this.curWind.y = 105;

        this.nextBtn = new SQ.Button("game_result.game_result_btn2", "game_result.game_result_btn1", "game_result.game_result_btn31", "game_result.game_result_btn4");
        this.addChild(this.nextBtn);
        this.nextBtn.x = 410;
        this.nextBtn.y = 380;

        this.handCards = new egret.DisplayObjectContainer();
        this.addChild(this.handCards);
        this.handCards.y = 20;

        this.mingCards = new egret.DisplayObjectContainer();
        this.addChild(this.mingCards);
        this.mingCards.x = 60;
        this.mingCards.y = 20;

        this.playerContainer = new egret.DisplayObjectContainer();
        this.addChild(this.playerContainer);
        this.playerContainer.x = 30;
        this.playerContainer.y = 135;


        this.fanList = new egret.DisplayObjectContainer();
        this.addChild(this.fanList);
        this.fanList.x = 305;
        this.fanList.y = 138;


        var manager = DeskManager.getInstance();
        var _gameWin = manager.cGameWin;
        var _cGameHuDetails = manager.cGameHuDetails;

        //玩家积分
        this.gameWinCreateScore(_gameWin);


        //流局
        if (manager.huChair != -1) {
            if (manager.huChair == DeskManager.getInstance().nChairNo) {
                SoundManager.getInstance().playEffect("Snd_win");
            } else {
                SoundManager.getInstance().playEffect("Snd_lose");
            }

            //绘制手牌和副露
            this.gameWinCreateCard(_gameWin, _cGameHuDetails);

            this.handCards.x = this.mingCards.width + this.mingCards.x + 10;

            //绘制胡牌番种
            this.gameWinCreateHuFan(_gameWin, _cGameHuDetails);

            textStyle.textFlow = (new egret.HtmlTextParser).parser(
                '共' +
                '<font color="#047003">' + _cGameHuDetails.nGains.value + '</font>' +
                '番'
            );

            this.totalFanText = new SQ.SimplicityTextField("", textStyle);
            this.addChild(this.totalFanText);
            this.totalFanText.x = 464;
            this.totalFanText.y = 105;

            this.showStackFan();
        } else {
            this.liuIcon = new egret.Bitmap();
            this.liuIcon.texture = RES.getRes("game_result.icon_liu");
            this.addChild(this.liuIcon);

            this.liuIcon.x = this.width * .5 - this.liuIcon.width * .5;
            this.liuIcon.y = 175;
        }

        textStyle.textColor = 0xffffff;
        textStyle.isBold = false;
        textStyle.size = 16;

        this.nextTimeDown = new SQ.SimplicityTextField("", textStyle);
        this.addChild(this.nextTimeDown);
        this.nextTimeDown.x = this.nextBtn.x + this.nextBtn.width - 45;
        this.nextTimeDown.y = 397;

        this.nextBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gameOverGoOnBtn, this);

        this.repeat = DeskManager.getInstance().gameStartInfo.nStartWait.value;
        var _repeat = this.repeat;
        this.nextTimeDown.setText(_repeat + "");
        this.timer = new egret.Timer(1000, _repeat);
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.timeDown, this);
        this.timer.start();

        if (WGManager.getInstance().isWgIng()) {
            this.nextBtn.visible = false;
            this.nextTimeDown.x = this.width * .5 - this.nextTimeDown.width * .5
        }


        this.x = LayerManager.stage.stageWidth * .5 - this.width * .5;
        this.y = LayerManager.stage.stageHeight * .5 - this.height * .5;
    }

    private showStackFan(): void {
        var huFanType: FixedArray = DeskManager.getInstance().cGameHuDetails.nHuGains;
        var _tempArr: Array<number> = [];
        for (var i: number = 0; i < huFanType.getLen(); i++) {
            if (huFanType.getAt(i).value > 0) {
                var _fanValue: number = huFanType.getAt(i).value;

                if (_fanValue >= 16) {
                    _tempArr.push(i);
                } else {
                    //如果是特殊番种
                    if (GameResultTransition.specialFan.indexOf(_fanValue) > -1) {
                        _tempArr.push(_fanValue);
                    }
                }
            }
        }

        if (_tempArr.length) {
            this.showFanAnimation(_tempArr);
        }
    }

    private showFanAnimation(arr: Array<number>): void {
        if (arr.length < 1) return;

        var _bgIndex: number = this.getChildIndex(this._bg);
        var showFanPanel: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
        showFanPanel.x = 20;
        showFanPanel.y = 270;
        this.addChild(showFanPanel);
        this.setChildIndex(showFanPanel, _bgIndex - 1);

        var self = this;
        var index: number = -1;
        var func = function () {
            var _self = arguments.callee;
            index += 1;
            if (index >= arr.length) return;
            var showFan: number = arr[index];
            var fanName: string = FanData.getFanName(showFan);
            var fanIcon: egret.DisplayObjectContainer = self.createShowFan(fanName);
            var len: number = showFanPanel.numChildren;
            showFanPanel.addChild(fanIcon);

            if (len == 0) {
                TweenMax.to(fanIcon, .6, {
                    rotation: -40,
                    onComplete: function (): void {
                        _self();
                    },
                    onCompleteParams: [fanIcon],
                    ease: Bounce.easeOut
                });
            } else {
                fanIcon.rotation = -40;

                showFanPanel.setChildIndex(fanIcon, 0);

                var lastFanIcon = showFanPanel.getChildAt(1);
                fanIcon.x = lastFanIcon.x;
                fanIcon.y = lastFanIcon.y;

                TweenMax.to(fanIcon, .4, {
                    x: fanIcon.x - 32,
                    y: fanIcon.y - 35,
                    onComplete: function (): void {
                        _self();
                    },
                    onCompleteParams: [fanIcon],
                    ease: Bounce.easeOut
                });
                SoundManager.getInstance().playEffect("Snd_plank");
            }
        };

        func();
    }

    private createShowFan(fanName: string): egret.DisplayObjectContainer {
        var _sp: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
        var _bg: egret.Bitmap = new egret.Bitmap();
        _bg.texture = RES.getRes("game_result.plank");
        _sp.addChild(_bg);
        var txtStyle: SQ.TextStyleConfig = new SQ.TextStyleConfig();
        txtStyle.size = 18;
        txtStyle.textColor = 0xfffbe3;
        txtStyle.stroke = 2;
        txtStyle.strokeColor = 0x783b00;
        txtStyle.isBold = true;
        txtStyle.fontFamily = "Microsoft Yahei,KaiTi";
        txtStyle.maxLen = 12;

        var txt: SQ.SimplicityTextField = new SQ.SimplicityTextField(fanName, txtStyle);
        txt.y = 10;
        txt.x = _bg.width * .5 - txt.width * .5;

        _sp.addChild(txt);

        _sp.anchorOffsetX = _sp.width * .5;
        _sp.anchorOffsetY = _sp.height;

        return _sp;
    }

    private timeDown(e: Event): void {
        var repeatStr = "";
        this.repeat -= 1;
        var repeatStr = this.repeat < 10 ? "0" + this.repeat : this.repeat + "";
        this.nextTimeDown.setText(repeatStr);
        if (this.repeat == 0) {
            if (WGManager.getInstance().isWgIng()) {
                //最后一局
                if (DeskManager.getInstance().finallyResultData) {
                    this.createTotalBount();
                }
                return;
            }
            this.gameOverGoOnBtn();
        }
    }

    private createFanText(fanType: string, fanVal: number): egret.DisplayObjectContainer {
        var fanNameText: SQ.STTextField;
        var fanValText: SQ.STTextField;
        var container: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
        container.width = 240;

        fanNameText = new egret.TextField();
        fanNameText.size = 14;
        fanNameText.text = fanType;
        fanNameText.textColor = 0x4c1d00;
        fanNameText.bold = true;
        fanNameText.width = 120;
        fanNameText.height = 20;
        fanNameText.textAlign = "center";
        container.addChild(fanNameText);

        fanValText = new egret.TextField();
        fanValText.size = 14;
        fanValText.bold = true;
        fanValText.text = fanVal + "";
        fanValText.textColor = 0x4c1d00;
        fanValText.width = 75;
        fanValText.height = 20;
        fanValText.textAlign = "center";
        fanValText.x = container.width - fanValText.width;
        container.addChild(fanValText);

        var _bg = new egret.Bitmap();
        _bg.texture = RES.getRes("game_result.game_result_fan_bg");
        container.addChild(_bg);
        _bg.y = container.height;

        return container;
    }

    private createUserHead(cgamePlayer: CGamePlayerData, totalPoint: number, curPoint: number, icon: egret.Bitmap = null): egret.DisplayObjectContainer {
        var _bg: egret.Bitmap = new egret.Bitmap();
        var container: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
        var userNameText: SQ.SimplicityTextField;
        var totalPointText: SQ.SimplicityTextField;
        var curPointText: SQ.SimplicityTextField;
        var userHead: UserHead;

        _bg.texture = RES.getRes("game_result.player_bg");
        container.addChild(_bg);

        userHead = new UserHead();
        userHead.userId = cgamePlayer.UserInfo.nUserID.value;
        userHead.levelId = cgamePlayer.StatData.nLevelID.value;
        userHead.fourAnimalLabel = cgamePlayer.StatData.nFourBeast.value;
        userHead.draw();
        container.addChild(userHead);
        userHead.scaleX = userHead.scaleY = .7;

        var textStyle: SQ.TextStyleConfig = new SQ.TextStyleConfig();
        textStyle.size = 14;
        textStyle.isBold = true;
        textStyle.textColor = 0x4c1d00;
        textStyle.maxLen = 10;

        userNameText = new SQ.SimplicityTextField(cgamePlayer.UserInfo.sNickName, textStyle);
        userNameText.x = 80;
        userNameText.y = 34;

        totalPointText = new SQ.SimplicityTextField(totalPoint + "", textStyle);
        totalPointText.x = 80;
        totalPointText.y = 10;

        textStyle.textColor = 0xe80000;
        var _curPointStr = curPoint >= 0 ? "+" + curPoint : curPoint;
        curPointText = new SQ.SimplicityTextField(_curPointStr + "", textStyle);
        curPointText.x = totalPointText.x + totalPointText.width + 10;
        curPointText.y = totalPointText.y;

        container.addChild(userNameText);
        container.addChild(totalPointText);
        container.addChild(curPointText);

        if (icon) {
            container.addChild(icon);
            icon.x = 175;
            icon.y = 20;
        }

        container.height = _bg.height;
        return container;
    }

    private createCurWindLoop(): string {
        var manager = DeskManager.getInstance();
        var _getWindStr = function (index: number): string {
            switch (index) {
                case 1:
                    return "东";
                case 2:
                    return "南";
                case 3:
                    return "西";
                case 4:
                    return "北";
            }
        };
        var fullStr = "";
        var _loop: number = Math.ceil(manager.nBoutCount / 4);
        var _doorWind: number = manager.nBoutCount % 4 == 0 ? 4 : manager.nBoutCount % 4;
        fullStr += _getWindStr(_loop) + "风" + _getWindStr(_doorWind);

        return fullStr;
    }

    private gameWinCreateScore(cGameWin: CGameWinResult): void {
        if (!cGameWin) return;

        var manager = DeskManager.getInstance();

        if (manager.playerArr) {
            //this._totoalPoint = [];
            for (var i: number = 0; i < manager.playerArr.length; i++) {
                var _cgamePlayer: CGamePlayerData = manager.playerArr[i];
                var _nChairNo: number = _cgamePlayer.GameData.nChairNO.value;
                var _point: number = cGameWin.gamewinMJ.gamewin.nScoreDiffs.getAt(_nChairNo).value;
                var _total: number;

                _total = cGameWin.gamewinMJ.gamewin.nScoreDiffs.getAt(_nChairNo).value + cGameWin.gamewinMJ.gamewin.nOldScores.getAt(_nChairNo).value;

                var _icon: egret.Bitmap = null;
                //错胡
                if (cGameWin.gamewinMJ.nResults.getAt(_nChairNo).value < 0) {
                    if (_nChairNo != manager.huChair) {
                        _icon = new egret.Bitmap();
                        _icon.texture = RES.getRes("game_result.icon_wrong")
                    }
                }
                //判断不是流庄，且是自摸
                if (cGameWin.gamewinMJ.nLoseChair.value == -1 && _nChairNo == manager.huChair) {
                    _icon = new egret.Bitmap();
                    _icon.texture = RES.getRes("game_result.icon_zm")
                }					//放冲
                else if (_nChairNo == manager.huChair && cGameWin.gamewinMJ.nLoseChair.value > -1) {
                    _icon = new egret.Bitmap();
                    _icon.texture = RES.getRes("game_result.icon_hu")
                }
                else if (cGameWin.gamewinMJ.nLoseChair.value == _nChairNo) {
                    _icon = new egret.Bitmap();
                    _icon.texture = RES.getRes("game_result.icon_dp")
                }

                var playerItem: egret.DisplayObjectContainer = this.createUserHead(_cgamePlayer, _total, _point, _icon);

                playerItem.y = this.playerContainer.height + 8;
                if (this.playerContainer.numChildren == 0) {
                    playerItem.y = 0;
                }
                this.playerContainer.addChild(playerItem);
            }
        }
    }

    private _isTriggerClick: boolean = false;

    private gameOverGoOnBtn(e: egret.TouchEvent = null): void {
        var manager = DeskManager.getInstance();
        var gameWinMj = manager.cGameWin.gamewinMJ;

        if (gameWinMj.gamewin.dwWinFlags.value == 16) {
            SceneManager.getInstance().popScene();
            return;
        }
        if (e) {
            this._isTriggerClick = true;
        }
        else {
            if (DeskManager.getInstance()) {
                this._isTriggerClick = true;
            }
        }
        if (this.nextBtn) {
            this.nextBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.gameOverGoOnBtn, this);
            this.nextBtn.setDisable(false);
            if (gameWinMj.nNewRound.value > 0) {

                this.nextBtn.setDisable(false);
                //最后一局
                if (manager.finallyResultData) {
                    this.createTotalBount();
                }
            } else {
                if (this._isTriggerClick && e) {
                    this.startGame();
                }
                else if (!this._isTriggerClick && e == null) {
                    this.startGame();
                }
            }
        }
    }

    private startGame(): void {
        var sendData: egret.ByteArray = new egret.ByteArray();
        var cGameHuaOver: CGameStartGame = new CGameStartGame();
        cGameHuaOver.nUserID.value = DeskManager.getInstance().firstPerson;

        CSerializable.Serialization(cGameHuaOver, sendData);
        SQGameServer.getInstance().sendCmd(Global.GR_START_GAME, sendData);
    }

    private createTotalBount(): void {
        this.dispatchEventWith("createTotalBount");
    }


    private gameWinCreateCard(cGameWin: CGameWinResult, cGameHuDetails: CGameHU_DETAILS): void {
        var _hCardGroupIndex: number = 0;
        var _hCard: egret.DisplayObjectContainer;
        var _spGroup: egret.DisplayObjectContainer;

        var manager = DeskManager.getInstance();

        //过滤胡的牌添加到最后
        if (cGameWin.gamewinMJ.nHuCard.value > -1) {
            for (var i: number = 0; i < cGameHuDetails.HU_UNIT.getLen(); i++) {
                if (cGameHuDetails.HU_UNIT.getAt(i).dwType.value == 0) continue;

                var _huCardIndex: number = -1;
                //手牌
                if (cGameHuDetails.HU_UNIT.getAt(i).dwFlag.value & Global.MJ_HU) {
                    _huCardIndex = cGameHuDetails.HU_UNIT.getAt(i).aryIndexes.indexOf(CardData.getIndexByCardId(cGameWin.gamewinMJ.nHuCard.value));

                    if (_huCardIndex > -1) {
                        _hCardGroupIndex = i;
                        var tempHuUnit: CGameHU_UNIT = cGameHuDetails.HU_UNIT.getAt(i);
                        tempHuUnit.aryIndexes.splice(_huCardIndex, 1);
                        break;
                    }
                }
            }

            //胡牌所在分组添加到末尾
            var _hCardGroup: CGameHU_UNIT = cGameHuDetails.HU_UNIT.getAt(_hCardGroupIndex);
            var tempHuUnit: CGameHU_UNIT = cGameHuDetails.HU_UNIT.getAt(cGameHuDetails.HU_UNIT.getLen() - 1);
            cGameHuDetails.HU_UNIT.setAt(_hCardGroupIndex, tempHuUnit)
            cGameHuDetails.HU_UNIT.setAt(cGameHuDetails.HU_UNIT.getLen() - 1, _hCardGroup);

            //特殊牌型
            var isSpecialCardType: boolean = false;
            var isZHL: boolean = false;//是不是组合龙
            for (i = 0; i < cGameHuDetails.nHuGains.getLen(); i++) {
                var _huType: number = cGameHuDetails.nHuGains.getAt(i).value;
                if (_huType > 0) {
                    //|| FanData.getFanType(i) == "HU_ZUHELONG"
                    if (FanData.getFanType(i) == "HU_13YAO" || FanData.getFanType(i) == "HU_7XINGBK" || FanData.getFanType(i) == "HU_QUANBUKAO") {
                        isSpecialCardType = true;
                        break;
                    }
                }
            }

            //不是特殊牌型
            if (!isSpecialCardType) {
                for (i = 0; i < cGameHuDetails.HU_UNIT.getLen(); i++) {
                    if (cGameHuDetails.HU_UNIT.getAt(i).dwType.value == 0) continue;

                    //手牌
                    if ((cGameHuDetails.HU_UNIT.getAt(i).dwFlag.value & ~Global.MJ_HU) == 0) {
                        _spGroup = this.createCardGroup(cGameHuDetails.HU_UNIT.getAt(i));
                        _spGroup.x = this.handCards.width;
                        if (this.handCards.numChildren) {
                            _spGroup.x = this.handCards.width + 5
                        }
                        this.handCards.addChild(_spGroup);
                    } else {
                        _spGroup = this.createCardGroup(cGameHuDetails.HU_UNIT.getAt(i), false);
                        _spGroup.x = this.mingCards.width;
                        if (this.mingCards.numChildren) {
                            _spGroup.x = this.mingCards.width + 5
                        }
                        this.mingCards.addChild(_spGroup);
                    }
                }
            } else {
                var _cards: Array<any> = cGameWin.nChairCards.slice(Global.CHAIR_CARDS * manager.huChair, Global.CHAIR_CARDS * (manager.huChair + 1));
                var _cardArr: Array<any> = VectorUtil.vertorToArray(_cards);
                _cardArr = PlayerData.sort(_cardArr);

                _huCardIndex = _cardArr.indexOf(cGameWin.gamewinMJ.nHuCard.value);
                if (_huCardIndex > -1) {
                    _cardArr.splice(_huCardIndex, 1);
                }

                for (i = 0; i < _cardArr.length; i++) {
                    if (_cardArr[i] > -1) {
                        var _card: CardHand = new CardHand(3);
                        _card.scaleX = _card.scaleY = 0.88
                        _card.id = _cardArr[i];
                        _card.frond();
                        if (this.handCards.numChildren) {
                            _card.x = this.handCards.width - 2
                        }
                        this.handCards.addChild(_card);
                    }
                }
                if (isZHL) {
                    for (i = 0; i < cGameHuDetails.HU_UNIT.getLen(); i++) {
                        if (cGameHuDetails.HU_UNIT.getAt(i).dwType.value == 0) continue;

                        //手牌
                        if (cGameHuDetails.HU_UNIT.getAt(i).dwFlag.value != 0) {
                            _spGroup = this.createCardGroup(cGameHuDetails.HU_UNIT.getAt(i));
                            _spGroup.x = this.mingCards.width;
                            if (this.handCards.numChildren) {
                                _spGroup.x = this.mingCards.width + 5
                            }
                            this.handCards.addChild(_spGroup);
                        }
                    }
                }
            }

            _hCard = this.createCard([CardData.getIndexByCardId(cGameWin.gamewinMJ.nHuCard.value)])
            if (_hCard) {
                this.handCards.addChild(_hCard);
                _hCard.x = this.handCards.width + 10;
            }
        }
    }

    private createCard(arr: Array<any>, isHandCard: boolean = true): egret.DisplayObjectContainer {
        var _sp: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
        var _card: CardHand;
        for (var i: number = 0; i < arr.length; i++) {
            _card = new CardHand(3);
            _card.x = _sp.width - 2;
            _card.id = CardData.getCardIdByIndex(arr[i]);

            if (!isHandCard) {
                _card.frond();
            } else {
                _card.stand();
            }
            _card.scaleX = _card.scaleY = 0.6;
            if (_sp.width == 0) {
                _card.x = 0;
            }
            _sp.addChild(_card);
        }
        return _sp;
    }

    private createCardGroup(target: CGameHU_UNIT, isHandCard: boolean = true): egret.DisplayObjectContainer {
        var _cardGroup: Array<any>;
        //顺子
        if (baseUtil.isExitFlag(target.dwType.value, Global.MJ_CT_SHUN)) {
            _cardGroup = VectorUtil.vertorToArray(target.aryIndexes)
            _cardGroup.splice(_cardGroup.length - 1, 1);

            return this.createCard(_cardGroup, isHandCard);
        }

        if (baseUtil.isExitFlag(target.dwType.value, Global.MJ_CT_BUKAOSHUN)) {
            _cardGroup = VectorUtil.vertorToArray(target.aryIndexes)
            _cardGroup.splice(_cardGroup.length - 1, 1);

            return this.createCard(_cardGroup, isHandCard);
        }

        //刻子
        if (baseUtil.isExitFlag(target.dwType.value, Global.MJ_CT_KEZI)) {
            _cardGroup = VectorUtil.vertorToArray(target.aryIndexes)
            _cardGroup.splice(_cardGroup.length - 1, 1);

            return this.createCard(_cardGroup, isHandCard);
        }

        //对子
        if (baseUtil.isExitFlag(target.dwType.value, Global.MJ_CT_DUIZI)) {
            _cardGroup = VectorUtil.vertorToArray(target.aryIndexes)
            _cardGroup.splice(_cardGroup.length - 2, 2);

            return this.createCard(_cardGroup, isHandCard);
        }

        if (baseUtil.isExitFlag(target.dwType.value, Global.MJ_CT_GANG)) {
            _cardGroup = VectorUtil.vertorToArray(target.aryIndexes)

            return this.createCard(_cardGroup, isHandCard);
        }
        return null;
    }

    private gameWinCreateHuFan(cGameWin: CGameWinResult, cGameHuDetails: CGameHU_DETAILS): void {
        var huFanType: FixedArray = cGameHuDetails.nHuGains;
        for (var i: number = 0; i < huFanType.getLen(); i++) {
            if (huFanType.getAt(i).value > 0) {
                var _fanName: string = FanData.getFanName(i);
                var _fanValue: number = huFanType.getAt(i).value;
                var _ui_fan = this.createFanText(_fanName, _fanValue);
                _ui_fan.y = this.fanList.height + 15;
                if (this.fanList.numChildren == 0) {
                    _ui_fan.y = this.fanList.height;
                }
                this.fanList.addChild(_ui_fan);
            }
        }
    }

    public redrawByBrowser(): void {

    }

    public destroy(): void {
        if (this.timer != null) {
            this.timer.removeEventListener(egret.TimerEvent.TIMER, this.timeDown, this);
            this.timer.stop();
            this.timer = null;
        }

        if(this._bg){
            DisplayObjectUtil.removeForParent(this._bg);
            this._bg = null;
        }

        if(this.totalFanText){
            DisplayObjectUtil.removeForParent(this.totalFanText);
            this.totalFanText = null;
        }

        if(this.curWind){
            DisplayObjectUtil.removeForParent(this.curWind);
            this.curWind = null;
        }

        if(this.nextBtn){
            DisplayObjectUtil.removeForParent(this.nextBtn);
            this.nextBtn = null;
        }

        if(this.nextTimeDown){
            DisplayObjectUtil.removeForParent(this.nextTimeDown);
            this.nextTimeDown = null;
        }

        if(this.liuIcon){
            DisplayObjectUtil.removeForParent(this.liuIcon);
            this.liuIcon = null;
        }

        if(this.pendant){
            DisplayObjectUtil.removeForParent(this.pendant);
            this.pendant = null;
        }

        if(this.playerContainer){
            DisplayObjectUtil.removeAllChild(this.playerContainer);
            DisplayObjectUtil.removeForParent(this.playerContainer);
            this.playerContainer = null;
        }

        if(this.fanList){
            DisplayObjectUtil.removeAllChild(this.fanList);
            DisplayObjectUtil.removeForParent(this.fanList);
            this.fanList = null;
        }

        if(this.handCards){
            DisplayObjectUtil.removeAllChild(this.handCards);
            DisplayObjectUtil.removeForParent(this.handCards);
            this.handCards = null;
        }

        if(this.mingCards){
            DisplayObjectUtil.removeAllChild(this.mingCards);
            DisplayObjectUtil.removeForParent(this.mingCards);
            this.mingCards = null;
        }
    }
}