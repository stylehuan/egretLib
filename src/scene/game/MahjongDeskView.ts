/**
 * Created by stylehuan on 2016/8/8.
 */
class MahjongDeskView extends egret.Sprite {
    public constructor() {
        super();
        this.manager = DeskManager.getInstance();
    }

    private static _instance: MahjongDeskView;

    public static getInstance(): MahjongDeskView {
        if (!this._instance) {
            this._instance = new MahjongDeskView();
        }
        return this._instance;
    }

    private manager: DeskManager;
    private windLayer: egret.DisplayObjectContainer;
    private windVane: egret.Sprite;
    private curHighlight_1: egret.Bitmap;
    private curHighlight_2: egret.Bitmap;
    private curHighlight_3: egret.Bitmap;
    private curHighlight_4: egret.Bitmap;
    private curWindLoopSpr: SQ.SimplicityTextField;

    private _bottomLine: egret.DisplayObjectContainer;

    private upPlayerScore: SQ.SimplicityTextField;
    private rightPlayerScore: SQ.SimplicityTextField;
    private downPlayerScore: SQ.SimplicityTextField;
    private leftPlayerScore: SQ.SimplicityTextField;

    private _deskBg: egret.Bitmap;

    private upUserPanel: DeskUserPanel;
    private rightUserPanel: DeskUserPanel;
    private downUserPanel: DeskUserPanel;
    private leftUserPanel: DeskUserPanel;

    public _ownerPlayerView: DeskPlayerView;
    public _leftPlayerView: DeskPlayerView;
    public _topPlayerView: DeskPlayerView;
    public _rightPlayerView: DeskPlayerView;

    public _downPoolContainer: DeskPoolContainer;
    public _topPoolContainer: DeskPoolContainer;
    public _leftPoolContainer: DeskPoolContainer;
    public _rightPoolContainer: DeskPoolContainer;

    private topDoorLineView: CardMountain;
    private rightDoorLineView: CardMountain;
    private bottomDoorLineView: CardMountain;
    private leftDoorLineView: CardMountain;

    private resultPanel: GameResultPanel;
    private moveCardItem: CardHand;
    private exChangePanel: egret.DisplayObjectContainer;
    private _mcCardControl: McCardControl;
    private _timeDownSp: UITimeDown;

    private _txtSurplusCard: SQ.STTextField;

    public setup(): void {
        this.initDeskSpr();
        this.initWind();
    }

    public init(): void {
        SystemEvent.addEventListener(SystemEvent.DESK_Animation_OVER, this.drawGameStart, this);
        PlayerManager.init();
        PlayerManager.createPlayerData();

        if (SystemCenter.playSystem.selfPlayerInfo.GameData.nScene.value == Global.LSSCENE_FRIEND) {
            if (WGManager.getInstance().isWgIng()) {

            }
        }
    }

    public deskDraw(): void {
        this.drawGameStart(null);
    }

    private drawGameStart(e: SystemEvent): void {
        SystemEvent.removeEventListener(SystemEvent.DESK_Animation_OVER, this.drawGameStart, this);

        this._txtSurplusCard = new SQ.STTextField();
        this._txtSurplusCard.size = 14;
        this._txtSurplusCard.textColor = 0x0FA7E9;
        this._txtSurplusCard.x = 275;
        this._txtSurplusCard.y = 210;
        this.addChild(this._txtSurplusCard);

        if (!DeskManager.getInstance().isXw) {
            //不是第一局
            // if (this.manager.nBoutCount < 5 && this.manager.nBoutCount > 1 && !WGManager.getInstance().isCompereIng) {
            //     this.exChangerPosition();
            // } else {
            this.initDice();
            this.see_gameStart();
            // }
        } else {
            this.see_gameStart_dxxw();
        }

        this.initBottomLine();
        this.initBottomControl();

        this.getRoomInfo();
    }

    private dice1: egret.MovieClip;
    private dice2: egret.MovieClip;

    private initDice(): void {
        var data = RES.getRes("shaizi.json");
        var txtr = RES.getRes("shaizi.png");
        var mcFactory: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data, txtr);
        this.dice1 = new egret.MovieClip(mcFactory.generateMovieClipData("dice"));
        this.dice2 = new egret.MovieClip(mcFactory.generateMovieClipData("dice"));
        this.dice1.scaleX = this.dice1.scaleY = .8;
        this.dice2.scaleX = this.dice2.scaleY = .8;
        this.dice1.gotoAndStop(RandomUtil.getRandom(1, 6));
        this.dice2.gotoAndStop(RandomUtil.getRandom(1, 6));
        this.dice1.x = 30;
        this.dice1.y = 28;

        this.dice2.x = 65;
        this.dice2.y = 28;

        this.windVane.addChild(this.dice1);
        this.windVane.addChild(this.dice2);

        //this.windVane.graphics.beginFill(0x336699);
        //this.windVane.graphics.drawRect(0, 0, this.windVane.width, this.windVane.height);
        //this.windVane.graphics.endFill();
    }

    private getRoomInfo(): void {
        var sendData: egret.ByteArray = new egret.ByteArray();
        sendData.endian = egret.Endian.LITTLE_ENDIAN;
        sendData.writeInt(this.manager.soloTable.nRoomID.value);
        SocketEvent.addEventListener(Global.LSR_GET_ONE_ROOMINFO.toString(), this.getRoomInfoHandler, this);
        SQGameServer.getInstance().sendCmd(Global.LSR_GET_ONE_ROOMINFO, sendData);
    }

    private getRoomInfoHandler(e: SocketEvent): void {
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        SocketEvent.removeEventListener(Global.LSR_GET_ONE_ROOMINFO.toString(), this.getRoomInfoHandler, this);
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            var cgameRoomInfo: CGameRoom;
            while (b.bytesAvailable) {
                cgameRoomInfo = new CGameRoom();
                CSerializable.Deserialization(cgameRoomInfo, b);
            }

            if (cgameRoomInfo) {
                this.see_setRoomName(cgameRoomInfo);
            }
        }
    }


    private drawDice(dices: FixedArray): void {
        var count: number = 0;
        var self = this;
        var drawDiceAnimation = function () {
            var _animationItem: number = 0;
            count += 1;
            TweenMax.to(self.dice1, .2, {
                repeat: 5,
                bezier: {
                    values: [{x: 47, y: 30}, {
                        x: 67,
                        y: 25
                    }, {x: 47, y: 18}, {x: 30, y: 25}]
                },
                onUpdate: function (): void {
                    if (self.dice1) {
                        self.dice1.gotoAndStop(RandomUtil.getRandom(1, 7));
                    }
                },
                onComplete: function (): void {
                    var _diceNumber = count == 1 ? dices.getAt(0).value : dices.getAt(2).value;
                    _animationItem += 1;
                    if (self.dice1) {
                        self.dice1.gotoAndStop(_diceNumber);
                    }
                    _repeatFn(_animationItem);
                }, onCompleteParams: [], ease: Linear.easeNone
            });

            TweenMax.to(self.dice2, .2, {
                repeat: 5,
                bezier: {
                    values: [{x: 47, y: 18}, {x: 30, y: 25}, {x: 47, y: 30}, {x: 65, y: 28}]
                },
                onUpdate: function (): void {
                    if (self.dice2) {
                        self.dice2.gotoAndStop(RandomUtil.getRandom(1, 7));
                    }
                },
                onComplete: function (): void {
                    var _diceNumber = count == 1 ? dices.getAt(1).value : dices.getAt(3).value;
                    _animationItem += 1;
                    if (self.dice2) {
                        self.dice2.gotoAndStop(_diceNumber);
                    }
                    _repeatFn(_animationItem);
                }, onCompleteParams: [], ease: Linear.easeNone
            });

        };
        var _repeatFn = function (_v: number) {
            if (_v == 2) {
                if (count == 2) {
                    self.throwDiceOver();
                    return;
                }
                self.manager.tempTimer = egret.setTimeout(function () {
                    drawDiceAnimation();
                }, self, 1000)
            }
        };

        drawDiceAnimation();
    }

    private initDeskSpr(): void {
        this._deskBg = new egret.Bitmap();
        this._deskBg.texture = RES.getRes("game_desk.png");
        this.addChild(this._deskBg);

        // var wg = new egret.Bitmap();
        // wg.texture = RES.getRes("wangge.png");
        // this.addChild(wg);
    }

    private initWind(): void {
        if (!this.windLayer) {
            this.windLayer = new egret.DisplayObjectContainer()
            this.addChild(this.windLayer);
        }

        if (!this.windVane) {
            this.windVane = new egret.Sprite();
            var _bg = new egret.Bitmap();
            _bg.texture = RES.getRes("game.wind");
            this.windVane.addChild(_bg);

            this.curHighlight_1 = new egret.Bitmap();
            this.curHighlight_1.texture = RES.getRes("game.up_highlight");
            this.windVane.addChild(this.curHighlight_1);
            this.curHighlight_1.x = 7;
            this.curHighlight_1.y = 4;

            this.curHighlight_2 = new egret.Bitmap();
            this.curHighlight_2.texture = RES.getRes("game.right_highlight");
            this.windVane.addChild(this.curHighlight_2);
            this.curHighlight_2.x = this.windVane.width - this.curHighlight_2.width - 3;
            this.curHighlight_2.y = 3;

            this.curHighlight_3 = new egret.Bitmap();
            this.curHighlight_3.texture = RES.getRes("game.down_highlight");
            this.windVane.addChild(this.curHighlight_3);
            this.curHighlight_3.x = 5;
            this.curHighlight_3.y = this.windVane.height - this.curHighlight_3.height - 3;

            this.curHighlight_4 = new egret.Bitmap();
            this.curHighlight_4.texture = RES.getRes("game.left_highlight");
            this.windVane.addChild(this.curHighlight_4);
            this.curHighlight_4.x = 3;
            this.curHighlight_4.y = 3;

            this.curHighlight_1.visible = false;
            this.curHighlight_2.visible = false;
            this.curHighlight_3.visible = false;
            this.curHighlight_4.visible = false;


            this.windVane.x = LayerManager.stage.stageWidth * .5 - this.windVane.width * .5;
            this.windVane.y = LayerManager.stage.stageHeight * .5 - this.windVane.height;
            this.windLayer.addChild(this.windVane);

            if (GlobalVar.isTest) {
                this.windVane.touchChildren = true;
                this.windVane.touchEnabled = true;
                this.windVane.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                    var sendData: egret.ByteArray = new egret.ByteArray();
                    var cGameGiveUp: CGameGiveUp = new CGameGiveUp();
                    cGameGiveUp.nUserID.value = SystemCenter.playSystem.selfPlayerInfo.userID;
                    CSerializable.Serialization(cGameGiveUp, sendData);
                    SQGameServer.getInstance().sendCmd(Global.GR_GIVE_UP_GAME, sendData);
                }, this);
            }
        }
    }

    /**
     *初始化牌池
     *
     */
    private initCardPool(): void {
        if (!this._topPoolContainer) {
            this._topPoolContainer = new DeskPoolContainer(1);
            this.addChild(this._topPoolContainer);
        }
        if (!this._rightPoolContainer) {
            this._rightPoolContainer = new DeskPoolContainer(2);
            this.addChild(this._rightPoolContainer);
        }
        if (!this._leftPoolContainer) {
            this._leftPoolContainer = new DeskPoolContainer(4);
            this.addChild(this._leftPoolContainer);
        }

        if (!this._downPoolContainer) {
            this._downPoolContainer = new DeskPoolContainer(3);
            this.addChild(this._downPoolContainer);
        }

        if (this._downPoolContainer) {
            this._downPoolContainer.x = this.windVane.x;
            this._downPoolContainer.y = this.windVane.y + this.windVane.height + 5;
        }
        if (this._topPoolContainer) {
            this._topPoolContainer.x = this.windVane.x + this.windVane.width - 6;
            this._topPoolContainer.y = this.windVane.y - 20;
        }
        if (this._rightPoolContainer) {
            this._rightPoolContainer.x = this.windVane.x + this.windVane.width + 5;
            this._rightPoolContainer.y = this.windVane.y + this.windVane.height - 15;
        }
        if (this._leftPoolContainer) {
            this._leftPoolContainer.x = this.windVane.x - 5;
            this._leftPoolContainer.y = this.windVane.y;
        }
    }

    private _leftDirWind: egret.Bitmap;
    private _rightDirWind: egret.Bitmap;
    private _downDirWind: egret.Bitmap;
    private _upDirWind: egret.Bitmap;

    /*
     * 初始化风位
     * */
    private initWindPosition(): void {
        //获取庄家位置
        var _dir: number = this.getPlayerDeskPosition(this.manager.nBanker);

        if (_dir == 3) {
            this._downDirWind = new egret.Bitmap();
            this._downDirWind.texture = RES.getRes("game.east");

            this._rightDirWind = new egret.Bitmap();
            this._rightDirWind.texture = RES.getRes("game.south");

            this._upDirWind = new egret.Bitmap();
            this._upDirWind.texture = RES.getRes("game.west");

            this._leftDirWind = new egret.Bitmap();
            this._leftDirWind.texture = RES.getRes("game.north");

        }
        else if (_dir == 1) {
            this._upDirWind = new egret.Bitmap();
            this._upDirWind.texture = RES.getRes("game.east");

            this._leftDirWind = new egret.Bitmap();
            this._leftDirWind.texture = RES.getRes("game.south");

            this._downDirWind = new egret.Bitmap();
            this._downDirWind.texture = RES.getRes("game.west");

            this._rightDirWind = new egret.Bitmap();
            this._rightDirWind.texture = RES.getRes("game.north");
        }
        else if (_dir == 2) {
            this._rightDirWind = new egret.Bitmap();
            this._rightDirWind.texture = RES.getRes("game.east");

            this._upDirWind = new egret.Bitmap();
            this._upDirWind.texture = RES.getRes("game.south");

            this._leftDirWind = new egret.Bitmap();
            this._leftDirWind.texture = RES.getRes("game.west");

            this._downDirWind = new egret.Bitmap();
            this._downDirWind.texture = RES.getRes("game.north");
        }
        else if (_dir == 4) {
            this._leftDirWind = new egret.Bitmap();
            this._leftDirWind.texture = RES.getRes("game.east");

            this._downDirWind = new egret.Bitmap();
            this._downDirWind.texture = RES.getRes("game.south");

            this._rightDirWind = new egret.Bitmap();
            this._rightDirWind.texture = RES.getRes("game.west");

            this._upDirWind = new egret.Bitmap();
            this._upDirWind.texture = RES.getRes("game.north");
        }

        this._upDirWind.alpha = this._rightDirWind.alpha = this._downDirWind.alpha = this._leftDirWind.alpha = 1;

        this.windLayer.addChild(this._upDirWind);
        this.windLayer.addChild(this._rightDirWind);
        this.windLayer.addChild(this._downDirWind);
        this.windLayer.addChild(this._leftDirWind);

        this._upDirWind.x = this._downDirWind.x = LayerManager.stage.stageWidth * .5 - this._upDirWind.width * .5;

        this._upDirWind.y = this.windVane.y - 40 - this._upDirWind.height;
        this._downDirWind.y = this.windVane.y + this.windVane.height + 72;

        this._leftDirWind.x = this.windVane.x - 80 - this._rightDirWind.width;
        this._rightDirWind.x = this.windVane.x + this.windVane.width + 80;
        this._rightDirWind.y = this._leftDirWind.y = this.windVane.y;
    }

    private initPlayerScore(isAnimation: boolean = false): void {

        var downScore: string = (this.manager.nBoutCount > 1 ? this.downUserPanel.score + "" : "");
        var upScore: string = (this.manager.nBoutCount > 1 ? this.upUserPanel.score + "" : "");
        var rightScore: string = (this.manager.nBoutCount > 1 ? this.rightUserPanel.score + "" : "");
        var leftScore: string = (this.manager.nBoutCount > 1 ? this.leftUserPanel.score + "" : "");

        var textStyle: SQ.TextStyleConfig = new SQ.TextStyleConfig();
        textStyle.isBold = true;
        textStyle.stroke = 2;
        textStyle.textColor = 0xffffff;
        textStyle.textAlign = "center";
        textStyle.size = 14;
        textStyle.strokeColor = 0x000000;

        this.upPlayerScore = new SQ.SimplicityTextField(upScore, textStyle);
        this.rightPlayerScore = new SQ.SimplicityTextField(rightScore, textStyle);
        this.downPlayerScore = new SQ.SimplicityTextField(downScore, textStyle);
        this.leftPlayerScore = new SQ.SimplicityTextField(leftScore, textStyle);

        this.upPlayerScore.x = this.windVane.width * .5 - this.upPlayerScore.width * .5;
        this.upPlayerScore.y = 4;

        this.downPlayerScore.x = this.windVane.width * .5 - this.downPlayerScore.width * .5;
        this.downPlayerScore.y = this.windVane.height - this.downPlayerScore.height - 5;

        this.leftPlayerScore.rotation = 90;
        this.rightPlayerScore.rotation = -90;

        this.leftPlayerScore.x = 24;
        this.leftPlayerScore.y = this.windVane.height * .5 - this.leftPlayerScore.width * .5;

        this.rightPlayerScore.x = 97;
        this.rightPlayerScore.y = this.windVane.height * .5 + this.rightPlayerScore.width * .5 - 5;
        this.windVane.addChild(this.upPlayerScore);
        this.windVane.addChild(this.rightPlayerScore);
        this.windVane.addChild(this.downPlayerScore);
        this.windVane.addChild(this.leftPlayerScore);

        if (isAnimation) {
            this.upPlayerScore.y += 25;
            this.downPlayerScore.y -= 30;

            this.leftPlayerScore.x += 40;
            this.rightPlayerScore.x -= 40;

            TweenMax.to(this.upPlayerScore, .3, {
                y: this.upPlayerScore.y - 25
            });

            TweenMax.to(this.downPlayerScore, .3, {
                y: this.downPlayerScore.y + 30
            });

            TweenMax.to(this.leftPlayerScore, .3, {
                x: this.leftPlayerScore.x - 40
            });

            TweenMax.to(this.rightPlayerScore, .3, {
                x: this.rightPlayerScore.x + 40
            });
        }

    }

    public rightMouseHandler(): void {
        //可能是吃碰杠之类的 直接发过
        if (this.manager.actChairNo != this.manager.nChairNo && this._currCardThrow) {
            this.sendGuo(this._currCardThrow.vCardID.value);
            this.clearCardMingTip();
        }
    }


    private initCurrWindLoop(isTransition: boolean = false, completeFn: Function = null): void {
        this.curWindLoopSpr = this.createCurWindLoop();
        this.windVane.addChild(this.curWindLoopSpr);
        this.curWindLoopSpr.x = this.windVane.width * .5 - this.curWindLoopSpr.width * .5 + 2;
        this.curWindLoopSpr.y = this.windVane.height * .5 - this.curWindLoopSpr.height * .5 - 4;

        if (isTransition) {
            var basePosition = this.curWindLoopSpr.y;
            this.curWindLoopSpr.alpha = 0;
            this.curWindLoopSpr.y = 0;

            TweenMax.to(this.curWindLoopSpr, .3, {
                y: basePosition,
                alpha: 1,
                ease: Quint.easeOut,
                onComplete: function (): void {
                    completeFn && completeFn();
                }, onCompleteParams: [this.curWindLoopSpr]
            });
        }
    }

    private createCurWindLoop(): SQ.SimplicityTextField {
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
        var _loop: number = Math.ceil(this.manager.nBoutCount / 4);
        var _doorWind: number = this.manager.nBoutCount % 4 == 0 ? 4 : this.manager.nBoutCount % 4;
        fullStr += _getWindStr(_loop) + "风" + _getWindStr(_doorWind);

        var textStyle: SQ.TextStyleConfig = new SQ.TextStyleConfig();
        textStyle.isBold = true;
        textStyle.stroke = 2;
        textStyle.size = 15;
        textStyle.strokeColor = 0x263D21;
        var windTextField: SQ.SimplicityTextField = new SQ.SimplicityTextField(fullStr, textStyle);
        return windTextField;
    }

    /**
     *初始化牌山
     *
     */
    private initCardMount(): void {
        if (!this.topDoorLineView) {
            this.topDoorLineView = new CardMountain(1);
            this.addChild(this.topDoorLineView);
        }

        if (!this.rightDoorLineView) {
            this.rightDoorLineView = new CardMountain(2);
            this.addChild(this.rightDoorLineView);
        }

        if (!this.leftDoorLineView) {
            this.leftDoorLineView = new CardMountain(4);
            this.addChild(this.leftDoorLineView);
        }

        if (!this.bottomDoorLineView) {
            this.bottomDoorLineView = new CardMountain(3);
            this.addChild(this.bottomDoorLineView);
        }
    }

    private initPlayerView(): void {
        if (this.manager.isXw) {
            this.manager.gameStartInfo = this.manager.gameInfoXW.StartData;
        }

        this.drawPlayerView();
    }

    private initCardControl(): void {
        if (!this._mcCardControl) {
            this._mcCardControl = new McCardControl();
            this._mcCardControl.visible = false;
            this.addChild(this._mcCardControl);
        }
    }


    //筛子动画完毕
    private throwDiceOver(): void {
        var catchCardTimer = DeskManager.getInstance().dealerTimer;
        var self = this;

        if (!catchCardTimer) {
            catchCardTimer = new egret.Timer(500, 4);
            catchCardTimer.addEventListener(egret.TimerEvent.TIMER, this.drawDealerAnimation, this);
            catchCardTimer.start();
        }

        var hideDice = function () {
            TweenMax.to(self.dice1, .3, {
                y: self.dice1.y + 10,
                alpha: 0,
                onComplete: function (): void {
                    DisplayObjectUtil.removeForParent(self.dice1);
                    self.dice1 = null;
                }, onCompleteParams: [self.dice1],
                ease: Quint.easeOut
            });

            TweenMax.to(self.dice2, .3, {
                y: self.dice2.y + 10,
                alpha: 0,
                onComplete: function (): void {
                    DisplayObjectUtil.removeForParent(self.dice2);
                    self.dice2 = null;
                }, onCompleteParams: [self.dice2],
                ease: Quint.easeOut
            });
        };

        self.manager.tempTimer = egret.setTimeout(function () {
            hideDice();
            var self = this;
            this.initCurrWindLoop(true, function () {
                self.initPlayerScore(true);
            });
        }, this, 1000);
    }

    private drawDealerAnimation(): void {
        var cards: number = 4;
        var dealerCount: number = this.manager.dealerCount;

        var _myPlayerData: Array<number> = PlayerManager.myPlayer.handArr.concat();
        var _topPlayerData: Array<number> = PlayerManager.upPlayer.handArr.concat();
        var _leftPlayerData: Array<number> = PlayerManager.leftPlayer.handArr.concat();
        var _rightPlayerData: Array<number> = PlayerManager.rightPlayer.handArr.concat();

        var _rightDataItem: Array<number> = _rightPlayerData.slice(dealerCount * cards, (dealerCount + 1) * cards);
        var _leftDataItem: Array<number> = _leftPlayerData.slice(dealerCount * cards, (dealerCount + 1) * cards);
        var _myDataItem: Array<number> = _myPlayerData.slice(dealerCount * cards, (dealerCount + 1) * cards);
        var _topDataItem: Array<number> = _topPlayerData.slice(dealerCount * cards, (dealerCount + 1) * cards);

        if (dealerCount == 3) {
            cards = 1
        }

        for (var i: number = 0; i < cards; i++) {
            for (var j: number = 0; j < GlobalVar.PLAYERCOUNT; j++) {
                this.grabCard(this.manager.catchCardBegin);
                this.addCurrCardMountBegin();
            }

            this._rightPlayerView.drawCards(_rightDataItem[i])
            this._topPlayerView.drawCards(_topDataItem[i])
            this._leftPlayerView.drawCards(_leftDataItem[i])
            this._ownerPlayerView.drawCards(_myDataItem[i])
            this._ownerPlayerView.redrawByBrowser();
        }

        this.manager.dealerCount += 1;
        if (this.manager.dealerCount == 4) {
            this.see_dealCarded();
            return;
        }
    }

    private addCurrCardMountBegin(): void {
        this.manager.catchCardBegin += 1;
        if (this.manager.catchCardBegin > (GlobalVar.CARDCOUNT - 1)) {
            this.manager.catchCardBegin = 0;
        }
    }

    private addFuluAnimation(str: string, dir: number): void {
        var _animationIcon: egret.Bitmap = new egret.Bitmap();
        _animationIcon.texture = RES.getRes("game.UI_desk_ani_" + str);

        var _animationIcon2: egret.Bitmap = new egret.Bitmap();
        _animationIcon2.texture = RES.getRes("game.UI_desk_ani_" + str);
        _animationIcon2.anchorOffsetX = _animationIcon2.width * .5;
        _animationIcon2.anchorOffsetY = _animationIcon2.height * .5;

        switch (dir) {
            case 1:
                _animationIcon.x = LayerManager.stage.stageWidth * .5 - _animationIcon.width * .5;
                _animationIcon.y = 95;

                _animationIcon2.x = LayerManager.stage.stageWidth * .5 - _animationIcon2.width * .5 + _animationIcon2.width * .5;
                _animationIcon2.y = 95 + _animationIcon2.height * .5;
                break;
            case 3:
                _animationIcon.x = LayerManager.stage.stageWidth * .5 - _animationIcon.width * .5;
                _animationIcon.y = LayerManager.stage.height - 240;

                _animationIcon2.x = LayerManager.stage.stageWidth * .5 - _animationIcon2.width * .5 + _animationIcon2.width * .5;
                _animationIcon2.y = LayerManager.stage.height - 240 + _animationIcon2.height * .5;
                break;
            case 2:
                _animationIcon.x = LayerManager.stage.stageWidth - 215;
                _animationIcon.y = LayerManager.stage.height * .5 - _animationIcon.height * .5 - 50;

                _animationIcon2.x = LayerManager.stage.stageWidth - 215 + _animationIcon2.width * .5;
                _animationIcon2.y = LayerManager.stage.height * .5 - _animationIcon.height * .5 + _animationIcon2.height * .5 - 50;
                break;
            case 4:
                _animationIcon.x = 155;
                _animationIcon.y = LayerManager.stage.height * .5 - _animationIcon.height * .5 - 50;

                _animationIcon2.x = 155 + _animationIcon2.width * .5;
                _animationIcon2.y = LayerManager.stage.height * .5 - _animationIcon.height * .5 + _animationIcon2.height * .5 - 50;
                break;
        }
        LayerManager.TopLayer.addChild(_animationIcon);
        LayerManager.TopLayer.addChild(_animationIcon2);

        TweenMax.to(_animationIcon2, 1, {
            alpha: 0, scaleX: 2, scaleY: 2, onComplete: function (): void {
                DisplayObjectUtil.removeForParent(_animationIcon2)
            }
        });

        this.manager.tempTimer = egret.setTimeout(function (): void {
            DisplayObjectUtil.removeForParent(_animationIcon);
        }, this, 1000);
    }


    /**
     * 抓牌
     *
     */
    private grabCard(catchCardBegin: number): void {
        var _beginChairNo: number = (Math.floor(catchCardBegin / (18 * 2)) + 1) % 4;
        var _beginDir: number = this.getPlayerDeskPosition(_beginChairNo);
        var _curMount: CardMountain = this.getCardMount(_beginDir);
        var _position: number = catchCardBegin % 36;

        this.setSurplusCard();

        WGManager.getInstance().wallData[catchCardBegin] = -2;
        _curMount.gripCard(_position);
    }

    private exChangerPosition(): void {
        this.exChangePanel = ExchangePlayerPosition.getInstance().init();
        this.addChild(this.exChangePanel);
        this.exChangePanel.addEventListener("complete", this.exChangeComplete, this)
    }

    private exChangeComplete(e: Event): void {
        this.exChangePanel.removeEventListener("complete", this.exChangeComplete, this);

        ExchangePlayerPosition.getInstance().reset();
        DisplayObjectUtil.removeForParent(this.exChangePanel);
        this.exChangePanel = null;

        this.initDice();
        this.see_gameStart();
    }

    /**
     * 显示玩家
     *
     */
    public see_gameStart(): void {
        PlayerManager.linkePostion(this.manager.nChairNo);

        this.initCardMount();
        this.initCardPool();
        this.initPlayerView();
        this.initWindPosition();

        this.drawDice(this.manager.dice);

        this.initCardControl();
        this.redrawByBrowser();
    }

    public see_gameStart_dxxw(): void {
        //补花流程
        if (baseUtil.isExitFlag(this.manager.gameInfoXW.StartData.dwStatus.value, Global.TS_WAITING_HUA)) {
            GameStatus.status = GameStatus.STATUS_GAME_BUHUA;
        }
        //出牌流程
        else {
            GameStatus.status = GameStatus.STATUS_GAME_PLAYING;
            if (baseUtil.isExitFlag(this.manager.gameInfoXW.StartData.dwStatus.value, Global.TS_WAITING_THROW)) {
                if (this.manager.nChairNo == this.manager.actChairNo) {
                    this.manager.isAllowDaChu = true;
                }
            }
        }
        //
        PlayerManager.linkePostion(this.manager.nChairNo);

        this.initCardMount();
        this.initCardPool();
        this.initPlayerView();

        //设置风向标
        this.initWindPosition();
        this.initCurrWindLoop();
        this.initPlayerScore();

        var _actChairNo: number = this.getPlayerDeskPosition(this.manager.actChairNo);
        this.setActChairNoLight(_actChairNo);

        //绘制手牌
        this.xwDrawCardHand();

        this.xwDrawCardMount();

        //绘制牌池
        this.xwDrawCardPool();

        //初始化倒计时
        this.initTimeDown();

        this.initTaskByPipe();

        //绘制花
        this.xwDrawCardFlower();

        //绘制吃碰杠
        this.xwDrawCardMing();

        this.initCardControl();

        var _huType: number = 0;

        //补花流程
        if (baseUtil.isExitFlag(this.manager.gameInfoXW.StartData.dwStatus.value, Global.TS_WAITING_HUA)) {
            if (baseUtil.isExitFlag(this.manager.gameInfoXW.StartData.dwStatus.value, Global.TS_WAITING_THROW)) {
                if (this.manager.nChairNo == this.manager.gameInfoXW.StartData.nCurrentChair.value) {
                    if (this.manager.isAutoBH) {
                        this.autoBhHandler();
                    } else {
                        this.mcCardControl(this.manager.gameInfoXW.dwCurrentFlags.value);
                    }
                }
            }

            if (this.manager.gameInfoXW.nTimeRemain.value > 0) {
                this.drawTimeDown(Math.ceil(this.manager.gameInfoXW.nTimeRemain.value / 1000));
            }
        }
        else {
            //等待出牌
            if (baseUtil.isExitFlag(this.manager.gameInfoXW.StartData.dwStatus.value, Global.TS_WAITING_THROW)) {
                if (this.manager.nChairNo == this.manager.gameInfoXW.StartData.nCurrentChair.value) {
                    if (this.isExistFlags(this.manager.gameInfoXW.dwCurrentFlags.value)) {
                        this._currCardThrow = new CGameCardsThrow();
                        this._currCardThrow.dwFlags.value = this.manager.gameInfoXW.dwCurrentFlags.value;

                        if (this.manager.gameInfoXW.curThrowCard.value) {
                            this._currCardThrow.vCardID.value = this.manager.gameInfoXW.curThrowCard.value;
                        }


                        //是不是吃碰杠的出牌
                        if (!(baseUtil.isExitFlag(this.manager.gameInfoXW.StartData.dwStatus.value, Global.TS_AFTER_CHI) || baseUtil.isExitFlag(this.manager.gameInfoXW.StartData.dwStatus.value, Global.TS_AFTER_PENG) || baseUtil.isExitFlag(this.manager.gameInfoXW.StartData.dwStatus.value, Global.TS_AFTER_GANG))) {
                            //有补花
                            if (baseUtil.isExitFlag(this.manager.gameInfoXW.dwCurrentFlags.value, Global.MJ_HUA)) {
                                this.manager.isBuhuaDraw = true;
                            }
                        }

                        //有补花
                        if (baseUtil.isExitFlag(this.manager.gameInfoXW.dwCurrentFlags.value, Global.MJ_HUA) && this.manager.isAutoBH) {
                            this.autoBhHandler();
                        }

                        //自摸
                        if (baseUtil.isExitFlag(this.manager.gameInfoXW.dwCurrentFlags.value, Global.MJ_HU)) {
                            this._currCardThrow.vCardID.value = this.manager.gameInfoXW.nLatestCard.value;
                        }
                        this.mcCardControl(this.manager.gameInfoXW.dwCurrentFlags.value, Global.MJ_HU_ZIMO);
                    }
                }

                if (this.manager.gameInfoXW.nTimeRemain.value > 0) {
                    this.drawTimeDown(Math.ceil(this.manager.gameInfoXW.nTimeRemain.value / 1000));
                }
            } else if (baseUtil.isExitFlag(this.manager.gameInfoXW.StartData.dwStatus.value, Global.TS_WAITING_PGCH)) {
                //续完回来是碰杠吃胡，放大之前的牌
                //					drawCardShow(this.manager.actChairNo,manager.gameInfoXW.curThrowCard);
                if (this.manager.nChairNo != this.manager.gameInfoXW.StartData.nCurrentChair.value) {
                    if (this.isExistFlags(this.manager.gameInfoXW.dwCurrentFlags.value)) {
                        this._currCardThrow = new CGameCardsThrow();
                        if (this.manager.gameInfoXW.curThrowCard.value) {
                            this._currCardThrow.vCardID.value = this.manager.gameInfoXW.curThrowCard.value;
                            this._currCardThrow.dwFlags.value = this.manager.gameInfoXW.dwCurrentFlags.value;
                        }
                        //胡
                        if (baseUtil.isExitFlag(this.manager.gameInfoXW.dwCurrentFlags.value, Global.MJ_HU)) {
                            //抢杠胡
                            if (baseUtil.isExitFlag(this.manager.gameInfoXW.StartData.dwStatus.value, Global.TS_AFTER_GANG)) {
                                _huType = Global.MJ_HU_QGNG;
                            }
                            else {
                                _huType = Global.MJ_HU_FANG;
                            }
                        }
                        this.mcCardControl(this.manager.gameInfoXW.dwCurrentFlags.value, _huType);

                        if (this.manager.gameInfoXW.nTimeRemain.value > 0) {
                            this.drawTimeDown(Math.ceil(this.manager.gameInfoXW.nTimeRemain.value / 1000));
                        }
                    }
                }
            }
        }
        this.redrawByBrowser();
    }

    private drawPlayerView(): void {
        for (var i = 0; i < this.manager.playerArr.length; i++) {
            var _playerData = this.manager.playerArr[i];
            if (_playerData.UserInfo.nUserID.value == this.manager.firstPerson) {

                this.downUserPanel = new DeskUserPanel(3);
                this.downUserPanel.userId = this.manager.firstPerson;
                this.downUserPanel.userName = GlobalVar.isTest ? i + "_" + this.getUIdByName(this.manager.firstPerson) : this.getUIdByName(this.manager.firstPerson);
                this.downUserPanel.levelId = _playerData.StatData.nLevelID.value;
                this.downUserPanel.score = _playerData.GameData.nTempScore.value;
                this.downUserPanel.flower = 0;
                this.downUserPanel.fourAnimalLabel = _playerData.StatData.nFourBeast.value;

                if (this.manager.gameInfoXW) {
                    this.downUserPanel.flower = this.manager.gameInfoXW.PlayData.nHuaCount.getAt(this.manager.nChairNo).value;
                }

                //主播切视角
                if (WGManager.getInstance().isCompereIng) {
                    this.downUserPanel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChangeView, this);
                }

                this._ownerPlayerView = new DeskPlayerView(3, this.manager.nChairNo);
                PlayerManager.myPlayer.handArr = this.getPlayerViewData(this.manager.nChairNo);
                this.addChild(this._ownerPlayerView);
                this.addChild(this.downUserPanel);
                this.downUserPanel.draw();

                break;
            }
        }
        for (i = 0; i < this.manager.playerArr.length; i++) {
            _playerData = this.manager.playerArr[i];
            var chairNo = this.getChairNoByUID(this.manager.playerArr[i].UserInfo.nUserID.value);
            var userId = _playerData.UserInfo.nUserID.value;

            if (this.getPlayerDeskPosition(i) == 4) {
                this._leftPlayerView = new DeskPlayerView(4, chairNo);
                PlayerManager.leftPlayer.handArr = this.getPlayerViewData(chairNo);


                this.leftUserPanel = new DeskUserPanel(4);
                this.leftUserPanel.userId = userId;
                this.leftUserPanel.userName = GlobalVar.isTest ? i + "_" + this.getUIdByName(userId) : this.getUIdByName(userId);
                this.leftUserPanel.levelId = _playerData.StatData.nLevelID.value;
                this.leftUserPanel.score = _playerData.GameData.nTempScore.value;
                this.leftUserPanel.flower = 0;
                this.leftUserPanel.fourAnimalLabel = _playerData.StatData.nFourBeast.value;

                //主播切视角
                if (WGManager.getInstance().isCompereIng) {
                    this.leftUserPanel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChangeView, this);
                }

                if (this.manager.gameInfoXW) {
                    this.leftUserPanel.flower = this.manager.gameInfoXW.PlayData.nHuaCount.getAt(chairNo).value;
                }

                this.addChild(this._leftPlayerView);
                this.addChild(this.leftUserPanel);
                this.leftUserPanel.draw();
            } else if (this.getPlayerDeskPosition(i) == 1) {
                this._topPlayerView = new DeskPlayerView(1, chairNo);
                PlayerManager.upPlayer.handArr = this.getPlayerViewData(chairNo);


                this.upUserPanel = new DeskUserPanel(1);
                this.upUserPanel.userId = userId;
                this.upUserPanel.userName = GlobalVar.isTest ? i + "_" + this.getUIdByName(userId) : this.getUIdByName(userId);
                this.upUserPanel.levelId = _playerData.StatData.nLevelID.value;
                this.upUserPanel.score = _playerData.GameData.nTempScore.value;
                this.upUserPanel.flower = 0;
                this.upUserPanel.fourAnimalLabel = _playerData.StatData.nFourBeast.value;

                //主播切视角
                if (WGManager.getInstance().isCompereIng) {
                    this.upUserPanel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChangeView, this);
                }

                if (this.manager.gameInfoXW) {
                    this.upUserPanel.flower = this.manager.gameInfoXW.PlayData.nHuaCount.getAt(chairNo).value;
                }

                this.addChild(this.upUserPanel);
                this.addChild(this._topPlayerView);
                this.upUserPanel.draw();
            } else if (this.getPlayerDeskPosition(i) == 2) {
                this._rightPlayerView = new DeskPlayerView(2, chairNo);
                PlayerManager.rightPlayer.handArr = this.getPlayerViewData(chairNo);

                this.rightUserPanel = new DeskUserPanel(2);
                this.rightUserPanel.userId = userId;
                this.rightUserPanel.userName = GlobalVar.isTest ? i + "_" + this.getUIdByName(userId) : this.getUIdByName(userId);
                this.rightUserPanel.levelId = _playerData.StatData.nLevelID.value;
                this.rightUserPanel.score = _playerData.GameData.nTempScore.value;
                this.rightUserPanel.flower = 0;
                this.rightUserPanel.fourAnimalLabel = _playerData.StatData.nFourBeast.value;

                //主播切视角
                if (WGManager.getInstance().isCompereIng) {
                    this.rightUserPanel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChangeView, this);
                }

                if (this.manager.gameInfoXW) {
                    this.rightUserPanel.flower = this.manager.gameInfoXW.PlayData.nHuaCount.getAt(chairNo).value;
                }
                this.addChild(this._rightPlayerView);
                this.addChild(this.rightUserPanel);
                this.rightUserPanel.draw();
            }
        }
    }

    private setSurplusCard(): void {
        this.manager.surplusCard -= 1;

        this._txtSurplusCard.text = "剩余 " + this.manager.surplusCard + " 张";
    }

    private changeViewRepeat: number = 0;
    private changeViewTimer: number;

    private onChangeView(e: egret.TouchEvent): void {
        if (GameStatus.status != GameStatus.STATUS_GAME_PLAYING) {
            GUIFactory.getInstance().showBubbleBox("补花阶段禁止切换");
            return;
        }

        if (this.changeViewRepeat != 0) return;
        this.changeViewRepeat = 2;

        var _target: DeskUserPanel = <DeskUserPanel>(e.currentTarget);

        WGManager.getInstance().lookerID = _target.userId;
        WGManager.getInstance().chairNo = this.getChairNoByUID(_target.userId);
        SystemEvent.dispatchEvents(new SystemEvent(SystemEvent.ChangeView));

        egret.clearInterval(this.changeViewTimer);
        var self = this;
        this.changeViewTimer = egret.setInterval(function (): void {
            if (self.changeViewRepeat == 0) {
                egret.clearInterval(self.changeViewTimer);
                return;
            }
            self.changeViewRepeat -= 1;
        }, this, 1000);
    }


    private setActChairNoLight(dir: number = 0): void {
        var self = this;
        for (var i: number = 1; i < 5; i++) {
            (function (index: number) {
                TweenMax.killTweensOf(self["curHighlight_" + index], true);
                self["curHighlight_" + index].alpha = 1;
                self["curHighlight_" + index].visible = false;
            })(i);
        }

        for (var i: number = 1; i < 5; i++) {
            if (dir == i) {
                var target = this["curHighlight_" + i];
                target.visible = true;
                TweenMax.to(target, .6, {
                    alpha: .4,
                    repeat: -1,
                    yoyo: true
                });
                break;
            }
        }
    }

    /**
     * 获取玩家的位置方向信息
     */
    public getPlayerDeskPosition(nChairNO: number = -1): number {
        var dir: number = -1;
        if (this._ownerPlayerView == null) return;
        if (nChairNO == -1) return;

        if (this._ownerPlayerView.nChairNO == nChairNO) {
            dir = 3;
        } else {
            if (this._ownerPlayerView.nChairNO == 0) {
                if (nChairNO == 1) {
                    dir = 4
                }
                else if (nChairNO == 2) {
                    dir = 1
                } else if (nChairNO == 3) {
                    dir = 2
                }
            }

            if (this._ownerPlayerView.nChairNO == 1) {
                if (nChairNO == 0) {
                    dir = 2
                }
                else if (nChairNO == 2) {
                    dir = 4
                } else if (nChairNO == 3) {
                    dir = 1
                }
            }

            if (this._ownerPlayerView.nChairNO == 2) {
                if (nChairNO == 0) {
                    dir = 1
                }
                else if (nChairNO == 1) {
                    dir = 2
                } else if (nChairNO == 3) {
                    dir = 4
                }
            }

            if (this._ownerPlayerView.nChairNO == 3) {
                if (nChairNO == 0) {
                    dir = 4;
                }
                else if (nChairNO == 1) {
                    dir = 1;
                } else if (nChairNO == 2) {
                    dir = 2;
                }
            }
        }
        return dir;
    }

    private getCardMount(dir: number): CardMountain {
        switch (dir) {
            case 1:
                return this.topDoorLineView
            case 2:
                return this.rightDoorLineView
            case 3:
                return this.bottomDoorLineView
            case 4:
                return this.leftDoorLineView
        }
        return null;
    }

    /**
     *续玩，绘制手牌
     *
     */
    private xwDrawCardHand(): void {
        var _nChairNO: number = 0;
        var _itemPlayerData: CGamePlayerData;
        var _playerData: Array<any>;
        var _playerDataCopy: Array<any>;
        var _playerView: DeskPlayerView;
        var _dir: number = 0;
        var _isMask: boolean = false;
        var _index: number = 0;
        var _isBankerThrowCard: boolean = false;
        for (var i: number = 0; i < this.manager.playerArr.length; i++) {
            _itemPlayerData = this.manager.playerArr[i];
            _nChairNO = _itemPlayerData.GameData.nChairNO.value;
            _dir = this.getPlayerDeskPosition(_nChairNO);
            _playerView = this.getPlayerHandByDir(_dir);
            _playerView.sortHand();
            _playerData = PlayerManager.getPlayerHandData(_nChairNO);
            _isBankerThrowCard = false;

            var lastCard: number;

            //轮到自己
            if (_nChairNO == this.manager.actChairNo) {
                //非补花流程标记最后摸的牌
                if (!GameStatus.isGameBuHua() && baseUtil.isExitFlag(this.manager.gameInfoXW.StartData.dwStatus.value, Global.TS_WAITING_THROW) && this.manager.gameInfoXW.nLatestCard.value > -1) {
                    if (!baseUtil.isExitFlag(this.manager.gameInfoXW.StartData.dwStatus.value, Global.TS_AFTER_CHI) && !baseUtil.isExitFlag(this.manager.gameInfoXW.StartData.dwStatus.value, Global.TS_AFTER_PENG) && !baseUtil.isExitFlag(this.manager.gameInfoXW.StartData.dwStatus.value, Global.TS_AFTER_GANG)) {
                        _isBankerThrowCard = true;
                        if (!WGManager.getInstance().isWgIng() && _dir != 3) {
                            lastCard = _playerData.splice(0, 1)[0];
                        } else {
                            _index = _playerData.indexOf(this.manager.gameInfoXW.nLatestCard.value);
                            if (_index > -1) {
                                lastCard = _playerData.splice(_index, 1)[0];
                            }
                        }
                    }
                }
                //补花阶段，庄家刷新
                else if (GameStatus.isGameBuHua() && _nChairNO == this.manager.nBanker) {
                    _isBankerThrowCard = true;
                    if (!WGManager.getInstance().isWgIng() && _dir != 3) {
                        lastCard = _playerData.splice(0, 1)[0];
                    } else {
                        _index = _playerData.indexOf(this.manager.gameInfoXW.nLatestCard.value);
                        if (_index > -1) {
                            lastCard = _playerData.splice(_index, 1)[0];
                        }
                    }
                }
            }


            for (var j: number = 0; j < _playerData.length; j++) {
                _isMask = false;
                //续完标记当前活动椅子号 出牌出牌阶段  手里的牌
                if (this.manager.isXw && _nChairNO == this.manager.actChairNo && baseUtil.isExitFlag(this.manager.gameInfoXW.StartData.dwStatus.value, Global.TS_WAITING_THROW) && !baseUtil.isExitFlag(this.manager.gameInfoXW.StartData.dwStatus.value, Global.TS_WAITING_HUA) && j == _playerData.length - 1) {
                    //上一手操作不是吃碰杠
                    if (!baseUtil.isExitFlag(this.manager.gameInfoXW.StartData.dwStatus.value, Global.TS_AFTER_CHI) && !baseUtil.isExitFlag(this.manager.gameInfoXW.StartData.dwStatus.value, Global.TS_AFTER_PENG) && !baseUtil.isExitFlag(this.manager.gameInfoXW.StartData.dwStatus.value, Global.TS_AFTER_GANG)) {
                        _isMask = true;
                    }
                }

                _playerView.drawCards(_playerData[j])
            }
            if (_isBankerThrowCard) {
                PlayerManager.addCardData(_nChairNO, lastCard);
                _playerView.catchCard(this.manager.gameInfoXW.nLatestCard.value)
            }
            if (WGManager.getInstance().isWgIng()) {
                _playerView.sortHand();
                _playerView.resetDrawCard();
            }
            // _playerView.redrawByBrowser();
        }
    }

    /**
     *续玩，绘制牌池
     *
     */
    private xwDrawCardPool(): void {
        var _start: number = Global.MJ_MAX_OUT;
        var _nChairNO: number = 0;
        var _itemPlayerData: CGamePlayerData;
        var _cardData: Array<any>;
        var _cardPool: DeskPoolContainer;
        var _dir: number = 0;
        var _index: number = -1;
        var _isMask: boolean = false;

        for (var i: number = 0; i < this.manager.playerArr.length; i++) {
            _itemPlayerData = this.manager.playerArr[i];
            _nChairNO = _itemPlayerData.GameData.nChairNO.value;
            _cardData = this.manager.gameInfoXW.PlayData.nOutCards.slice(i * _start, (i + 1) * _start);
            _dir = this.getPlayerDeskPosition(_nChairNO);
            _cardPool = this.getCardPool(_dir);
            for (var j: number = 0; j < _cardData.length; j++) {
                _isMask = false;
                if (_cardData[j].value > 0) {
                    //续完回来，别家可以碰杠吃胡的时候，删除牌池中的牌
                    if (this.manager.gameInfoXW.curThrowCard.value == _cardData[j].value) {
                        if (baseUtil.isExitFlag(this.manager.gameInfoXW.StartData.dwStatus.value, Global.TS_WAITING_PGCH) && this.manager.actChairNo == _nChairNO) {
                            _isMask = true;
                            this._preCardPool = _cardPool;
                        }
                    }

                    _cardPool.addCard(_cardData[j].value);
                    _cardPool.showLastCard();
                }
            }
        }
    }

    /**
     *续玩，绘制牌山
     *
     */
    private xwDrawCardMount(): void {
        var _nBanker: number = this.manager.gameInfoXW.StartData.nBanker.value;
        var _nDices: number = this.manager.gameInfoXW.StartData.nDices.getAt(0).value + this.manager.gameInfoXW.StartData.nDices.getAt(1).value;
        var _nBeginNO: number = this.manager.gameInfoXW.StartData.nBeginNO.value;
        var _nCurrentCatch: number = this.manager.gameInfoXW.StartData.nCurrentCatch.value;

        var _poor: number = (GlobalVar.CARDCOUNT - _nBeginNO + _nCurrentCatch) % (GlobalVar.CARDCOUNT);

        for (var i: number = 0; i < _poor; i++) {
            this.grabCard(this.manager.catchCardBegin);
            this.addCurrCardMountBegin();
        }

        //删除补花，杠尾部的牌
        for (i = 0; i < this.manager.gameInfoXW.StartData.nTailTaken.value; i++) {
            if (_nBeginNO == 0) {
                _nBeginNO = GlobalVar.CARDCOUNT;
            }
            _nBeginNO -= 1;

            if (_nBeginNO % 2) {
                this.grabCard(_nBeginNO - 1);
            }
            else {
                this.grabCard(_nBeginNO + 1);
            }
        }
    }

    private initTimeDown(): void {
        if (!this._timeDownSp) {
            this._timeDownSp = new UITimeDown();
            if (WGManager.getInstance().isWgIng()) this._timeDownSp.ys_btn.visible = false;

            this.addChild(this._timeDownSp);
            this._timeDownSp.visible = false;
        }
    }

    private initTaskByPipe(): void {
        var todos = this.manager.todoTaskPipe;
        if (todos) {
            for (var i: number = 0; i < todos.length; i++) {
                var _taskItem: Object = todos[i];

                if (_taskItem["type"] == GlobalVar.msg_hua) {
                    this.drawBuHua(_taskItem["data"]);
                    continue;
                }

                if (_taskItem["type"] == GlobalVar.msg_huaover) {
                    this.drawHuaOver(_taskItem["data"]);
                    continue;
                }

                if (_taskItem["type"] == GlobalVar.msg_throw) {
                    this.drawCardThrow(_taskItem["data"]);
                    continue;
                }

                if (_taskItem["type"] == GlobalVar.msg_caught) {
                    this.drawCardCaught(_taskItem["data"]);
                    continue;
                }
            }
            todos = null;
        }
    }

    private xwDrawCardFlower(): void {
        var _nChairNO: number = 0;
        var _itemPlayerData: CGamePlayerData
        var _nFlower: number = 0;
        var _playerView: DeskPlayerView;
        var _dir: number = 0;

        for (var i: number = 0; i < this.manager.playerArr.length; i++) {
            _itemPlayerData = this.manager.playerArr[i];
            _nChairNO = _itemPlayerData.GameData.nChairNO.value;
            _dir = this.getPlayerDeskPosition(_nChairNO);
            _playerView = this.getPlayerHandByDir(_dir);

            _nFlower = this.manager.gameInfoXW.PlayData.nHuaCount.getAt(_nChairNO).value;

            for (var j: number = 0; j < _nFlower; j++) {
                //TODO增加话
                //_playerView.addHua();
            }
        }
    }


    private xwDrawCardMing(): void {
        var _nChairNO: number = 0;
        var _itemPlayerData: CGamePlayerData
        var _playerView: DeskPlayerView;
        var _dir: number = 0;
        var _start: number = Global.MJ_MAX_PENG;
        var _cardMingDir: number = 0;
        var _fromDir: number = 0;

        for (var i: number = 0; i < this.manager.playerArr.length; i++) {
            _itemPlayerData = this.manager.playerArr[i];
            _nChairNO = _itemPlayerData.GameData.nChairNO.value;
            _dir = this.getPlayerDeskPosition(_nChairNO);
            _playerView = this.getPlayerHandByDir(_dir);

            var _arr: Array<any> = [];

            var _pengDatas: Array<CGameCardsUnit> = this.manager.gameInfoXW.PlayData.PengCards.slice(i * _start, (i + 1) * _start);
            var _chiDatas: Array<CGameCardsUnit> = this.manager.gameInfoXW.PlayData.ChiCards.slice(i * _start, (i + 1) * _start);
            var _aGangDatas: Array<CGameCardsUnit> = this.manager.gameInfoXW.PlayData.AnGangCards.slice(i * _start, (i + 1) * _start);
            var _mGangDatas: Array<CGameCardsUnit> = this.manager.gameInfoXW.PlayData.MnGangCards.slice(i * _start, (i + 1) * _start);
            var _pGangDatas: Array<CGameCardsUnit> = this.manager.gameInfoXW.PlayData.PnGangCards.slice(i * _start, (i + 1) * _start);

            for (var j: number = 0; j < _start; j++) {
                //碰
                if (j < _pengDatas.length && _pengDatas[j].nCardChair.value > -1) {
                    _arr = VectorUtil.vertorToArray(_pengDatas[j].nCardIDs);
                    if (_arr && _arr.length) {
                        _fromDir = this.getPlayerDeskPosition(_pengDatas[j].nCardChair.value);
                        _cardMingDir = this.getPlayerMingByDir(_dir, _fromDir);
                        if (_arr.indexOf(-1) > -1) {
                            _arr.splice(_arr.indexOf(-1), 1);
                        }

                        var endData: any = _arr.splice(_arr.length - 1, 1)[0];

                        _playerView.addCPMgCard(_arr, endData, _cardMingDir);
                        //添加fu数据
                        PlayerManager.getPlayerData(_nChairNO).fuluArr["kz"][CardData.getCardIndex(endData)] = _arr;
                    }
                }

                //吃
                if (_chiDatas[j].nCardChair.value > -1) {
                    _arr = VectorUtil.vertorToArray(_chiDatas[j].nCardIDs);

                    if (_arr && _arr.length) {
                        _fromDir = this.getPlayerDeskPosition(_chiDatas[j].nCardChair.value);
                        _cardMingDir = this.getPlayerMingByDir(_dir, _fromDir);

                        if (_arr.indexOf(-1) > -1) {
                            _arr.splice(_arr.indexOf(-1), 1);
                        }

                        endData = _arr.splice(_arr.length - 1, 1)[0];

                        _playerView.addCPMgCard(_arr, endData, _cardMingDir);
                        PlayerManager.getPlayerData(_nChairNO).fuluArr["sz"].push(_arr);
                    }
                }
                //暗杠
                if (_aGangDatas[j].nCardChair.value > -1) {

                    _arr = VectorUtil.vertorToArray(_aGangDatas[j].nCardIDs);

                    if (_arr && _arr.length) {
                        //添加cardming
                        _playerView.addAnGang(_arr);
                        PlayerManager.getPlayerData(_nChairNO).fuluArr["kz"][CardData.getCardIndex(_arr[1])] = _arr;
                    }
                }

                //明杠
                if (_mGangDatas[j].nCardChair.value > -1) {
                    _arr = VectorUtil.vertorToArray(_mGangDatas[j].nCardIDs);

                    if (_arr && _arr.length) {
                        _fromDir = this.getPlayerDeskPosition(_mGangDatas[j].nCardChair.value);
                        _cardMingDir = this.getPlayerMingByDir(_dir, _fromDir);

                        endData = _arr.splice(_arr.length - 1, 1)[0];
                        //添加cardming
                        _playerView.addCPMgCard(_arr, endData, _cardMingDir)
                        PlayerManager.getPlayerData(_nChairNO).fuluArr["kz"][CardData.getCardIndex(endData)] = _arr;
                    }
                }
            }

            for (j = 0; j < _start; j++) {
                //碰杠
                if (_pGangDatas[j].nCardChair.value > -1) {
                    _arr = VectorUtil.vertorToArray(_pGangDatas[j].nCardIDs);
                    if (_arr && _arr.length) {
                        var _propty: number = CardData.getCardIndex(_arr[0]);
                        if (PlayerManager.getPlayerData(_nChairNO).fuluArr["kz"].hasOwnProperty(_propty)) {

                            //添加cardming
                            _playerView.addPengGang(_arr[0]);
                        }
                    }
                }
            }
        }
    }

    private autoBhHandler(): void {
        this.playerHuaHandler();
    }

    private resetMcCardControl(): void {
        if (this._mcCardControl) {
            this._mcCardControl.removeChildren();
            this._mcCardControl.visible = false;
        }
    }

    private mcCardControl(flags: number, type: number = -1): void {
        this.resetMcCardControl();
        if (this._mcCardControl) {
            this._mcCardControl.visible = true;
            var _flags: number = flags;
            var mcControl: CardControlBtn;


            if (baseUtil.isExitFlag(_flags, Global.MJ_CHI)) {
                mcControl = new CardControlBtn("game.btn_chi_1", "game.btn_chi_2", "game.btn_chi_3");
                mcControl.addEventListener(egret.TouchEvent.TOUCH_TAP, this.playerChiHandler, this);

                if (this._mcCardControl.numChildren) {
                    mcControl.x = this._mcCardControl.width + this._cardControlOffX;
                }

                this._mcCardControl.addChild(mcControl);
            }

            if (baseUtil.isExitFlag(_flags, Global.MJ_PENG)) {
                mcControl = new CardControlBtn("game.btn_peng_1", "game.btn_peng_2", "game.btn_peng_3");
                mcControl.addEventListener(egret.TouchEvent.TOUCH_TAP, this.playerPengHandler, this);

                if (this._mcCardControl.numChildren) {
                    mcControl.x = this._mcCardControl.width + this._cardControlOffX;
                }

                this._mcCardControl.addChild(mcControl);
            }

            if (baseUtil.isExitFlag(_flags, Global.MJ_GANG_MN) || baseUtil.isExitFlag(_flags, Global.MJ_GANG_AN) || baseUtil.isExitFlag(_flags, Global.MJ_GANG_PN)) {
                mcControl = new CardControlBtn("game.btn_gang_1", "game.btn_gang_2", "game.btn_gang_3");
                if (this._mcCardControl.numChildren) {
                    mcControl.x = this._mcCardControl.width + this._cardControlOffX;
                }

                this._mcCardControl.addChild(mcControl);


                if (baseUtil.isExitFlag(_flags, Global.MJ_GANG_MN)) {
                    mcControl.addEventListener(egret.TouchEvent.TOUCH_TAP, this.playerMNGangHandler, this);
                }
                if (baseUtil.isExitFlag(_flags, Global.MJ_GANG_AN)) {
                    mcControl.addEventListener(egret.TouchEvent.TOUCH_TAP, this.playerPengAnGangHandler, this);
                }
                if (baseUtil.isExitFlag(_flags, Global.MJ_GANG_PN)) {
                    mcControl.addEventListener(egret.TouchEvent.TOUCH_TAP, this.playerPengAnGangHandler, this);
                }
            }

            if (baseUtil.isExitFlag(_flags, Global.MJ_HU)) {
                mcControl = new CardControlBtn("game.btn_hu_1", "game.btn_hu_2", "game.btn_hu_3");
                mcControl.addEventListener(egret.TouchEvent.TOUCH_TAP, this.playerHuHandler, this);
                mcControl.type = type;

                if (this._mcCardControl.numChildren) {
                    mcControl.x = this._mcCardControl.width + this._cardControlOffX + 60;
                }
                mcControl.y = -10;

                this._mcCardControl.addChild(mcControl);
            }
            if (baseUtil.isExitFlag(_flags, Global.MJ_HUA)) {
                mcControl = new CardControlBtn("game.btn_hua_1", "game.btn_hua_2", "game.btn_hua_3");
                if (this._mcCardControl.numChildren) {
                    mcControl.x = this._mcCardControl.width + this._cardControlOffX;
                }

                mcControl.addEventListener(egret.TouchEvent.TOUCH_TAP, this.playerHuaHandler, this);
                this._mcCardControl.addChild(mcControl);
            }
            if (baseUtil.isExitFlag(_flags, Global.MJ_GUO)) {
                mcControl = new CardControlBtn("game.btn_guo_1", "game.btn_guo_2", "game.btn_guo_3");
                mcControl.scaleX = mcControl.scaleY = .9;
                mcControl.addEventListener(egret.TouchEvent.TOUCH_TAP, this.playerGuoHandler, this);

                if (this._mcCardControl.numChildren) {
                    mcControl.x = this._mcCardControl.width + 30;
                }
                mcControl.y = 10;

                this._mcCardControl.addChild(mcControl);
            }
            this._mcCardControl.x = LayerManager.stage.stageWidth - this._mcCardControl.width - 110;
            this._mcCardControl.y = LayerManager.stage.stageHeight - 200;
        }
    }

    private drawTimeDown(n: number = 0): void {
        if (this._timeDownSp) {
            this._timeDownSp.ys_btn.visible = false;
            if (!this.manager.isAutoMD) {
                if (this.manager.delayCount > 0) {
                    if (!WGManager.getInstance().isWgIng()) this._timeDownSp.ys_btn.visible = true;
                    this._timeDownSp.ys_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.clickYsHandler, this);
                    this._timeDownSp.ys_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickYsHandler, this);
                }
            }
        }
        this.setTimeDown(n);
        this._TimeDown = new egret.Timer(1000, n + 1)
        this._curTiemDown = n;
        this._TimeDown.addEventListener(egret.TimerEvent.TIMER, this.drawTimeDownHandler, this)
        this._TimeDown.start();
    }

    private setTimeDown(n: number = 0): void {
        var _sp: egret.DisplayObjectContainer = this.drawTextToBitmap(n);
        _sp.x = -8
        if (this._timeDownSp) {
            this._timeDownSp.mc_container.removeChildren();
            this._timeDownSp.draw();
            this._timeDownSp.mc_container.addChild(_sp);
            this._timeDownSp.visible = true;
            this._timeDownSp.y = LayerManager.stage.stageHeight - 200;
            this._timeDownSp.x = 250;
        }
    }

    private _currCardThrow: CGameCardsThrow;
    private _preCardPool: DeskPoolContainer;

    private isExistFlags(flags: number = 0): boolean {
        if (baseUtil.isExitFlag(flags, Global.MJ_PENG)) {
            return true;
        }
        if (baseUtil.isExitFlag(flags, Global.MJ_GANG_MN)) {
            return true;
        }
        if (baseUtil.isExitFlag(flags, Global.MJ_GANG_PN)) {
            return true;
        }
        if (baseUtil.isExitFlag(flags, Global.MJ_GANG_AN)) {
            return true;
        }
        if (baseUtil.isExitFlag(flags, Global.MJ_CHI)) {
            return true;
        }
        if (baseUtil.isExitFlag(flags, Global.MJ_HU)) {
            return true;
        }
        if (baseUtil.isExitFlag(flags, Global.MJ_HUA)) {
            return true;
        }
        if (baseUtil.isExitFlag(flags, Global.MJ_GUO)) {
            return true;
        }
        return false;
    }

    /**
     *根据方向获取玩家手牌
     * @param dir
     * @return
     *
     */
    private getUserPanelByDir(dir: number = -1): DeskUserPanel {
        switch (dir) {
            case 1:
                return this.upUserPanel;
            case 2:
                return this.rightUserPanel;
            case 3:
                return this.downUserPanel;
            case 4:
                return this.leftUserPanel;
        }
        return null;
    }

    /**
     *根据方向获取玩家手牌
     * @param dir
     * @return
     *
     */
    private getPlayerHandByDir(dir: number = 0): DeskPlayerView {
        switch (dir) {
            case 1:
                return this._topPlayerView;
            case 2:
                return this._rightPlayerView;
            case 3:
                return this._ownerPlayerView;
            case 4:
                return this._leftPlayerView;
        }
        return null;
    }

    /**
     *获取牌池
     * @param dir
     * @return
     *
     */
    private getCardPool(dir: number = 0): DeskPoolContainer {
        return this.manager.getCardPoolByDir(dir);
    }

    private drawBuHua(cgameHUACard: CGameThrowCards): void {
        var _chairNo: number = this.getChairNoByUID(cgameHUACard.nUserID.value);
        var _dir: number = this.getPlayerDeskPosition(_chairNo);
        var _playerView: DeskPlayerView = this.getPlayerHandByDir(_dir);
        var _userPanel: DeskUserPanel = this.getUserPanelByDir(_dir);
        var _cardId: number = cgameHUACard.nCardID.value;
        SoundManager.getInstance().playEffect("Snd_buhua_female");
        this.addFuluAnimation("hua", _dir);
        //_playerView.flower += 1;
        if (this.manager.firstPerson == cgameHUACard.nUserID.value) {
            this.resetMcCardControl();
            this.resetTimeDown();
        }
        else {
            if (!WGManager.getInstance().isWgIng()) {
                _cardId = -1;
            }
        }

        _userPanel.addHua();

        PlayerManager.delCardData(_chairNo, _cardId);

        //不是开局自动补花流程
        if (GameStatus.isGamePlaying()) {
            _playerView.buHua(_cardId);

            if (this.manager.isBuhuaDraw || WGManager.getInstance().isWgIng()) {
                this.manager.isBuhuaDraw = false;
                _playerView.sortHand();
                _playerView.resetDrawCard();
            }
        } else if (GameStatus.isGameBuHua()) {
            _playerView.sortHand();
            _playerView.resetDrawCard();
        }
    }

    private drawHuaOver(cgameHuaOver: CGameHuaOver): void {
        var _nChairNo: number = this.getChairNoByUID(cgameHuaOver.nUserID.value);
        var dir: number = this.getPlayerDeskPosition(_nChairNo);
        var _nextDir: number = this.getPlayerDeskPosition(cgameHuaOver.nNextChair.value);
        var playerView: DeskPlayerView = this.getPlayerHandByDir(dir);
        console.log("playerView _nChairNo----:" + _nChairNo)


        this.resetMcCardControl();
        this.resetTimeDown();

        if (WGManager.getInstance().isWgIng()) {
            playerView.sortHand();
            playerView.resetDrawCard();
        }

        //补花结束
        if (cgameHuaOver.nNextChair.value == -1) {
            this.see_buhuaEnd(cgameHuaOver.dwFlags.value);
            return;
        }

        this.setActChairNoLight(_nextDir);
        if (cgameHuaOver.nNextChair.value == this.manager.nChairNo && this.isExistFlags(cgameHuaOver.dwFlags.value)) {
            //手牌补花
            if (this.manager.isAutoBH) {
                this.autoBhHandler();
                return;
            }

            //倒计时
            this.drawTimeDown(this.manager.gameStartInfo.nHuaWait.value);
            this.mcCardControl(cgameHuaOver.dwFlags.value);
        }
    }

    public drawCardThrow(cardsThrow: CGameCardsThrow): void {
        var _chairNo: number = this.getChairNoByUID(cardsThrow.nUserID.value);
        var _dir: number = this.getPlayerDeskPosition(_chairNo);
        var _playerView: DeskPlayerView = this.getPlayerHandByDir(_dir);
        var _cardPoolView: DeskPoolContainer = this.getCardPool(_dir);

        this._currCardThrow = cardsThrow;
        this.manager.actChairNo = _chairNo;

        var _cardId: number = cardsThrow.vCardID.value;

        this.clearAllDaChuMask();

        this._preCardPool = _cardPoolView;
        if (cardsThrow.nUserID.value == this.manager.firstPerson) {
            this.resetTimeDown();
            this.resetMcCardControl();
            this.clearCardMingTip();
            this.manager.isAllowDaChu = false;

        } else {
            //检查手牌是否一致
            // if (!this.checkMyHandCard(this.manager.nChairNo)) return;
        }

        var _handData: Array<any> = PlayerManager.getPlayerHandData(_chairNo);

        _playerView.throwCard(_cardId);
        SoundManager.getInstance().playEffect("Snd_chu");

        if (this.isExistFlags(cardsThrow.dwFlags.value)) {
            //ÓкúÇÒÉèÖÃÁËֻºú×ÔÃþ
            if (baseUtil.isExitFlag(cardsThrow.dwFlags.value, Global.MJ_HU) && this.manager.isOnlyHuZimo) {
                //ÓгÔÅö¸ܴæÔÚ
                if (baseUtil.isExitFlag(cardsThrow.dwFlags.value, Global.MJ_PENG) || baseUtil.isExitFlag(cardsThrow.dwFlags.value, Global.MJ_CHI) || baseUtil.isExitFlag(cardsThrow.dwFlags.value, Global.MJ_GANG_MN)) {
                    cardsThrow.dwFlags.value -= Global.MJ_HU;
                } else {
                    if (!this._currCardThrow) {
                        return;
                    }
                    this.sendGuo(this._currCardThrow.vCardID.value);
                    return;
                }
            }

            if (!baseUtil.isExitFlag(cardsThrow.dwFlags.value, Global.MJ_HU) && baseUtil.isExitFlag(cardsThrow.dwFlags.value, Global.MJ_PENG) || baseUtil.isExitFlag(cardsThrow.dwFlags.value, Global.MJ_CHI) || baseUtil.isExitFlag(cardsThrow.dwFlags.value, Global.MJ_GANG_MN)) {
                if (this.manager.isAutoMD) {
                    if (!this._currCardThrow) {
                        return;
                    }
                    this.sendGuo(this._currCardThrow.vCardID.value);
                    return;
                }
            }

            //不吃
            if (this.manager.isNoChi && baseUtil.isExitFlag(cardsThrow.dwFlags.value, Global.MJ_CHI)) {
                cardsThrow.dwFlags.value &= ~Global.MJ_CHI;

                //碰杠胡不存在，直接过
                if (!baseUtil.isExitFlag(cardsThrow.dwFlags.value, Global.MJ_PENG) && !baseUtil.isExitFlag(cardsThrow.dwFlags.value, Global.MJ_GANG_MN) && !baseUtil.isExitFlag(cardsThrow.dwFlags.value, Global.MJ_HU)) {
                    this.sendGuo(this._currCardThrow.vCardID.value);
                    return;
                }
            }

            //不碰
            if (this.manager.isNoPeng && baseUtil.isExitFlag(cardsThrow.dwFlags.value, Global.MJ_PENG)) {
                cardsThrow.dwFlags.value &= ~Global.MJ_PENG;

                //吃杠胡不存在，直接过
                if (!baseUtil.isExitFlag(cardsThrow.dwFlags.value, Global.MJ_CHI) && !baseUtil.isExitFlag(cardsThrow.dwFlags.value, Global.MJ_GANG_MN) && !baseUtil.isExitFlag(cardsThrow.dwFlags.value, Global.MJ_HU)) {
                    this.sendGuo(this._currCardThrow.vCardID.value);
                    return;
                }
            }
            console.log("this.manager.isNoGang 111:" + this.manager.isNoGang)
            //不杠
            if (this.manager.isNoGang && baseUtil.isExitFlag(cardsThrow.dwFlags.value, Global.MJ_GANG_MN)) {
                cardsThrow.dwFlags.value &= ~Global.MJ_GANG_MN;

                //吃碰胡不存在，直接过
                if (!baseUtil.isExitFlag(cardsThrow.dwFlags.value, Global.MJ_CHI) && !baseUtil.isExitFlag(cardsThrow.dwFlags.value, Global.MJ_PENG) && !baseUtil.isExitFlag(cardsThrow.dwFlags.value, Global.MJ_HU)) {
                    this.sendGuo(this._currCardThrow.vCardID.value);
                    return;
                }
            }
            this.drawTimeDown(this.manager.gameStartInfo.nPGCHWait.value);
            this.mcCardControl(cardsThrow.dwFlags.value, Global.MJ_HU_FANG);
        }
    }

    private drawCardCaught(cardCaught: CGameCardCaught): void {
        var _nChairNo: number = this.getChairNoByUID(cardCaught.nUserID.value);
        var dir: number = this.getPlayerDeskPosition(_nChairNo);
        var playerView: DeskPlayerView = this.getPlayerHandByDir(dir);
        var _prevPlayerView: DeskPlayerView = this.getPrevByChairNo(_nChairNo);
        var _wait: number = this.manager.gameStartInfo.nThrowWait.value;
        var _maskCard: boolean = false;

        this.setActChairNoLight(dir);
        SoundManager.getInstance().playEffect("Snd_caught");

        //添加数据
        PlayerManager.addCardData(_nChairNo, cardCaught.nCardID.value);

        console.log("cardCaught.nCardID.value:" + cardCaught.nCardID.value);
        console.log("PlayerManager.getPlayerHandData(_nChairNo).length:" + PlayerManager.getPlayerHandData(_nChairNo).length);

        this.grabCard(cardCaught.nCardNO.value);


        //在补花流程     &&
        if (GameStatus.isGameBuHua()) {
            if (this.manager.nBanker != _nChairNo) {
                playerView.sortHand();
                playerView.resetDrawCard();
            } else {
                playerView.catchCard(cardCaught.nCardID.value);
            }
        } else {
            playerView.catchCard(cardCaught.nCardID.value);
        }

        if (_nChairNo == this.manager.nChairNo && !WGManager.getInstance().isWgIng()) {
            this._currCardThrow = new CGameCardsThrow();
            this._currCardThrow.vCardID.value = cardCaught.nCardID.value;
            this._currCardThrow.dwFlags.value = cardCaught.dwFlags.value;
            if (GameStatus.isGamePlaying()) {
                this.clearCardMingTip();

                if (baseUtil.isExitFlag(cardCaught.dwFlags.value, Global.MJ_HUA)) {

                    //判断摸得牌是不是花
                    if (CardData.getCardType(cardCaught.nCardID.value) != 4) {
                        this.manager.isBuhuaDraw = true;
                    } else {

                    }

                    if (this.manager.isAutoBH) {
                        this.autoBh();
                        return;
                    }
                }

                this.manager.actChairNo = _nChairNo;

                if (this.manager.isOnlyHuZimo && baseUtil.isExitFlag(cardCaught.dwFlags.value, Global.MJ_HU)) {
                    this.manager.isAllowDaChu = true;
                    this.mcCardControl(cardCaught.dwFlags.value, Global.MJ_HU_ZIMO);

                    this.drawTimeDown(_wait);
                    return;
                }

                if (this.manager.isAutoMD) {
                    if (baseUtil.isExitFlag(cardCaught.dwFlags.value, Global.MJ_HU)) {
                        this.manager.isAllowDaChu = true;
                        this.mcCardControl(cardCaught.dwFlags.value, Global.MJ_HU_ZIMO);
                        //倒计时
                        this.drawTimeDown(_wait);
                        return;
                    }
                    this.autoMd(playerView);
                    return;
                }

                this.manager.isAllowDaChu = true;

                //碰杠胡
                if (this.isExistFlags(cardCaught.dwFlags.value)) {
                    if (baseUtil.isExitFlag(cardCaught.dwFlags.value, Global.MJ_HUA)) {
                        _wait = this.manager.gameStartInfo.nHuaWait.value;
                    }
                    this.mcCardControl(cardCaught.dwFlags.value, Global.MJ_HU_ZIMO);
                }
                this.drawTimeDown(_wait);
            } else {
                if (this.isExistFlags(cardCaught.dwFlags.value)) {
                    //×Զ¯²¹»¨
                    if (this.manager.isAutoBH) {
                        this.autoBh();
                        return;
                    }
                    _wait = this.manager.gameStartInfo.nHuaWait.value;
                    this.mcCardControl(cardCaught.dwFlags.value, Global.MJ_HU_ZIMO);
                    //µ¹¼Æʱ
                    this.drawTimeDown(_wait);
                }
            }
        }
    }

    private drawPengGang(cgamepnGangCard: CGameCombCard): void {
        var _chairNo: number = this.getChairNoByUID(cgamepnGangCard.nUserID.value);
        var _fromChairNo: number = cgamepnGangCard.nCardChair.value;
        var _dir: number = this.getPlayerDeskPosition(_chairNo);
        var _fromDir: number = this.getPlayerDeskPosition(_fromChairNo);
        var _playerView: DeskPlayerView = this.getPlayerHandByDir(_dir);
        var _cardMingDir: number = this.getPlayerMingByDir(_dir, _fromDir);
        var _arr: Array<any> = new Array<any>();

        this.manager.actChairNo = _chairNo;

        for (var i: number = 0; i < cgamepnGangCard.nBaseIDs.getLen(); i++) {
            _arr[i] = cgamepnGangCard.nBaseIDs.getAt(i).value;
        }
        //this.addCPMgCardAnimation("gang", _dir);
        var _propty: number = CardData.getCardIndex(_arr[0]);
        if (PlayerManager.getPlayerData(_chairNo).fuluArr["kz"].hasOwnProperty(_propty)) {
            _playerView.addPengGang(cgamepnGangCard.nCardID.value);
        }

        //删除手牌数据
        if (cgamepnGangCard.nUserID.value == this.manager.firstPerson || WGManager.getInstance().isWgIng()) {
            PlayerManager.delCardData(_chairNo, cgamepnGangCard.nCardID.value);
        }
        else {
            PlayerManager.delCardData(_chairNo, -1);
        }

        //重绘手牌
        _playerView.resetDrawCard();
    }


    private drawTextToBitmap(n: number = 0): egret.DisplayObjectContainer {
        var _container: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
        var tempBmp: egret.Bitmap = new egret.Bitmap();

        if (n >= 10) {
            tempBmp.texture = RES.getRes("game.time_down_" + n.toString().charAt(0));
            _container.addChild(tempBmp);
            tempBmp.x = 10;
            var tempBmp2: egret.Bitmap = new egret.Bitmap();
            tempBmp2.texture = RES.getRes("game.time_down_" + n.toString().charAt(1));
            tempBmp2.x = tempBmp.x + tempBmp.width - 10;
            _container.addChild(tempBmp2)
        } else {
            tempBmp.texture = RES.getRes("game.time_down_" + n);
            tempBmp.x = 18;
            _container.addChild(tempBmp)
        }
        return _container;
    }

    /**
     *碰通知
     * @param cardsThrow
     *
     */
    public see_pengCardInform(cardPeng: CGameCombCard): void {
        var _chairNo: number = this.getChairNoByUID(cardPeng.nUserID.value);
        var _fromChairNo: number = cardPeng.nCardChair.value;
        var _dir: number = this.getPlayerDeskPosition(_chairNo);
        var _fromDir: number = this.getPlayerDeskPosition(_fromChairNo);
        var _fromPlayerView: DeskPlayerView = this.getPlayerHandByDir(_fromDir);
        var _playerView: DeskPlayerView = this.getPlayerHandByDir(_dir);
        var _cardMingDir: number = this.getPlayerMingByDir(_dir, _fromDir);
        var _cardPoolView: DeskPoolContainer = this.getCardPool(_fromDir);
        var _arr: Array<any> = new Array<any>();

        SoundManager.getInstance().playEffect("Snd_peng_female");
        this.addFuluAnimation("peng", _dir);
        this.manager.actChairNo = _chairNo;

        for (var i: number = 0; i < cardPeng.nBaseIDs.getLen(); i++) {
            if (cardPeng.nBaseIDs.getAt(i).value > -1) {
                _arr.push(cardPeng.nBaseIDs.getAt(i).value);
            }
        }

        this.setActChairNoLight(_dir);

        this.resetTimeDown();
        this.resetMcCardControl();
        this.clearCardMingTip();

        if (cardPeng.nUserID.value == this.manager.firstPerson) {
            this.manager.isAllowDaChu = true;
            //倒计时
            this.drawTimeDown(this.manager.gameStartInfo.nThrowWait.value);
        }

        var fuArr: Array<number> = _arr.concat();
        fuArr.push(cardPeng.nCardID.value);

        //添加fu数据
        PlayerManager.getPlayerData(_chairNo).fuluArr["kz"][CardData.getCardIndex(cardPeng.nCardID.value)] = fuArr;

        //删除手牌数据
        for (i = 0; i < _arr.length; i++) {
            if (cardPeng.nUserID.value == this.manager.firstPerson || WGManager.getInstance().isWgIng()) {
                PlayerManager.delCardData(_chairNo, _arr[i]);
            }
            else {
                PlayerManager.delCardData(_chairNo, -1);
            }
        }

        _playerView.addCPMgCard(_arr.concat(), cardPeng.nCardID.value, _cardMingDir);
        _playerView.resetDrawCard();
        _playerView.redrawByBrowser();

        //隐藏上家放大的牌
        this.clearAllDaChuMask();
        _cardPoolView.clearLastCard();
    }

    /**
     *获取玩家鸣牌的来自
     * @return
     *
     */
    private getPlayerMingByDir(dir: number, fromDir: number = 0): number {
        if (dir == 1) {
            if (fromDir == 4) {
                return 0;
            }
            else if (fromDir == 3) {
                return 1
            }
            return 2;
        }
        else if (dir == 2) {
            if (fromDir == 1) {
                return 2;
            }
            else if (fromDir == 4) {
                return 1
            }
            return 0;
        }
        else if (dir == 3) {
            if (fromDir == 4) {
                return 0;
            }
            else if (fromDir == 1) {
                return 1
            }
            return 2;
        }
        else if (dir == 4) {
            if (fromDir == 1) {
                return 0;
            }
            else if (fromDir == 2) {
                return 1
            }
            return 2;
        }
        return 0;
    }

    private playerHuaHandler(e: egret.TouchEvent = null): void {
        var arr: Array<any> = PlayerManager.myPlayer.handArr;
        var __tempArr: Array<any> = [];
        for (var i: number = 0; i < arr.length; i++) {
            if (CardData.getCardType(arr[i]) == 4) {
                __tempArr.push(arr[i]);
            }
        }

        if (__tempArr.length) {
            var cThrowCard: CGameThrowCards = new CGameThrowCards();
            cThrowCard.nUserID.value = this.manager.firstPerson;
            cThrowCard.nCardID.value = __tempArr[0];
            cThrowCard.dwFlags.value = Global.MJ_HUA;

            var sendData: egret.ByteArray = new egret.ByteArray();
            CSerializable.Serialization(cThrowCard, sendData);
            SQGameServer.getInstance().sendCmd(Global.GR_HUA_CARD, sendData);
        }

        this.resetMcCardControl();
        this.resetTimeDown();
    }

    /**
     *根据用户ID获取ChairNo
     * @param id
     * @return
     *
     */
    private getChairNoByUID(id: number = 0): number {
        if (this.manager.playerArr) {
            for (var i: number = 0; i < this.manager.playerArr.length; i++) {
                var _itemPlayerData: CGamePlayerData = this.manager.playerArr[i];
                if (id == _itemPlayerData.GameData.nUserID.value) {
                    return _itemPlayerData.GameData.nChairNO.value;
                }
            }
        }
        return 0;
    }

    /**
     * 根据ChairNo获取用户ID
     * @return
     *
     */
    private getUIdByChair(nChairNo: number = 0): number {
        if (this.manager.playerArr) {
            for (var i: number = 0; i < this.manager.playerArr.length; i++) {
                var _itemPlayerData: CGamePlayerData = this.manager.playerArr[i];
                if (nChairNo == _itemPlayerData.GameData.nChairNO.value) {
                    return _itemPlayerData.GameData.nUserID.value;
                }

            }
        }
        return 0;
    }

    /**
     * 根据用户ID获取用户名
     * @return
     *
     */
    private getUIdByName(nUid: number = 0): string {
        if (this.manager.playerArr) {
            for (var i: number = 0; i < this.manager.playerArr.length; i++) {
                var _itemPlayerData: CGamePlayerData = this.manager.playerArr[i];
                if (nUid == _itemPlayerData.GameData.nUserID.value) {
                    return _itemPlayerData.UserInfo.sNickName;
                }

            }
        }
        return "";
    }

    private getPrevByChairNo(chairNo: number = 0): DeskPlayerView {
        var _nextChair: number = (chairNo + 1) % 4;
        var _dir: number = this.getPlayerDeskPosition(_nextChair);
        return this.getPlayerHandByDir(_dir);
    }

    private _TimeDown: egret.Timer;
    private _curTiemDown: number = 0;

    private resetTimeDown(): void {
        this._curTiemDown = 0;
        if (this._timeDownSp) {
            this._timeDownSp.mc_container.removeChildren();
            this._timeDownSp.visible = false;
        }
        if (this._TimeDown) {
            this._TimeDown.removeEventListener(egret.TimerEvent.TIMER, this.drawTimeDownHandler, this);
            this._TimeDown = null;
        }
    }

    private see_buhuaEnd(flags: number = 0): void {
        var _bankerDir: number = this.getPlayerDeskPosition(this.manager.nBanker);
        var playerView: DeskPlayerView;
        var _dir: number = 0;

        this.setActChairNoLight(_bankerDir);

        GameStatus.status = GameStatus.STATUS_GAME_PLAYING;

        //庄家出牌
        if (this.manager.nChairNo == this.manager.nBanker) {
            this.manager.actChairNo = this.manager.nChairNo;
            this.manager.isAllowDaChu = true;

            _dir = this.getPlayerDeskPosition(this.manager.nChairNo);
            playerView = this.getPlayerHandByDir(_dir);

            if (this.manager.isOnlyHuZimo && baseUtil.isExitFlag(flags, Global.MJ_HU)) {
                this.mcCardControl(flags, Global.MJ_HU_ZIMO);
                //倒计时
                this.drawTimeDown(this.manager.gameStartInfo.nThrowWait.value);
                return;
            }

            //补花前勾选了自动摸打
            if (this.manager.isAutoMD) {
                // playerView.cardSp.getChildAt(playerView.cardSp.numChildren - 1).dispatchEvent(new egret.TouchEvent(egret.TouchEvent.TOUCH_TAP));
                return;
            }

            if (this.isExistFlags(flags)) {
                this.mcCardControl(flags, Global.MJ_HU_ZIMO);
            }

            //倒计时
            this.drawTimeDown(this.manager.gameStartInfo.nFirstThrowWait.value);
        }
    }

    private drawTimeDownHandler(e: egret.TimerEvent = null): void {
        if (this._curTiemDown == 0) {
            this.resetTimeDown();

            //倒计时结束，隐藏操作面板
            this.resetMcCardControl();

            this.manager.timeDownCount += 1;

            //两次超时勾选自动摸打
            if (this.manager.timeDownCount >= GlobalVar.MAX_TIMEOUTNUMS) {
                this.manager.isAutoMD = true;
                if (this.autoMdButton) {
                    this.autoMdButton.setSelect(true);
                }
            }
            return;
        }
        this.setTimeDown(this._curTiemDown - 1);
        this._curTiemDown -= 1;
    }


    private _cardMingTips: egret.DisplayObjectContainer;

    private clearCardMingTip(): void {
        if (this._cardMingTips) {
            DisplayObjectUtil.removeForParent(this._cardMingTips);
            this._cardMingTips = null;
        }
    }

    public clearAllDaChuMask(): void {
        for (var i: number = 0; i < 4; i++) {
            var _cardPoolView: DeskPoolContainer = this.getCardPool(i + 1);
            if (_cardPoolView != null) {
                _cardPoolView.clearDaChuMask();
            }
        }
    }

    private checkMyHandCard(nChairNo: number): boolean {
        //检查手牌是否一致
        var cardLen: number = this.checkHandCard(nChairNo);
        console.log("nChairNo:" + nChairNo + "   cardLen:" + cardLen)
        if (cardLen != 13) {
            this.manager.checkHandCardNum++;
            if (egret.Capabilities.os == "iOS") {
                if (this.manager.checkHandCardNum >= 1) {
                    //var alert:ST.AlertKnow = new ST.AlertKnow(ST.AlertKnow.BTN_YES)
                    //alert.show("亲，你的网络情况不太好哦，建议网络稳定后再试试？", function ():void {
                    //        egret.ExternalInterface.call("doIosReLoadGame", "reLoadGame");
                    //    }
                    //);
                }
            }
            if (this.manager.checkHandCardNum == 5) {
                //var alert:ST.AlertKnow = new ST.AlertKnow(ST.AlertKnow.BTN_YES)
                //alert.show("亲，你的网络情况不太好哦，建议网络稳定后再试试？", function ():void {
                //        this.manager.checkHandCardNum = 0;
                //        alert.hide();
                //        if (GlobalVar.IsBrowh) {
                //            document.location.reload();
                //        } else {
                //            if (egret.Capabilities.os == "Android") {
                //                egret.ExternalInterface.call("doAndroidReLoadGame", "");
                //            }
                //        }
                //
                //    }
                //);
                return;
            }
            this.restGame();
            return false;
        }
        return true;
    }

    /**
     *检查手牌
     *
     */
    private checkHandCard(nChairNo: number): number {
        var _myPlayerData: PlayerData = PlayerManager.getPlayerData(nChairNo);
        if (_myPlayerData == null) return;
        if (_myPlayerData.handArr == null) return;
        if (_myPlayerData.handArr.length == null) return;
        var _handLen: number = _myPlayerData.handArr.length;
        var _kz: any = _myPlayerData.fuluArr["kz"];
        var _sz: Array<any> = _myPlayerData.fuluArr["sz"];
        var _fuLen: number = 0;
        //var _isGang:Boolean=false;
        var _cardLen: number;
        _fuLen = _sz.length;
        for (var k in _kz) {
            if (_kz.hasOwnProperty(k)) {
                _fuLen += 1;
            }
        }
        _cardLen = _fuLen * 3 + _handLen;
        return _cardLen;
    }

    private sendGuo(cardId: number = 0): void {
        this.resetTimeDown();
        var cGameGuoCard: CGameCombCard = new CGameCombCard();
        cGameGuoCard.nUserID.value = this.manager.firstPerson;
        cGameGuoCard.nCardChair.value = this.manager.actChairNo;
        cGameGuoCard.nCardID.value = cardId;
        cGameGuoCard.nBaseIDs.getAt(0).value = -1;
        cGameGuoCard.nBaseIDs.getAt(1).value = -1;
        cGameGuoCard.nBaseIDs.getAt(2).value = -1;
        cGameGuoCard.dwFlags.value = Global.MJ_GUO;

        var sendData: egret.ByteArray = new egret.ByteArray();
        CSerializable.Serialization(cGameGuoCard, sendData)
        SQGameServer.getInstance().sendCmd(Global.GR_GUO_CARD, sendData);
        //        this._ownerPlayerView.cardAllDown();
        //        this._ownerPlayerView.clearHitData();
    }

    private autoBh(): void {
        //倒计时
        this.drawTimeDown(this.manager.gameStartInfo.nHuaWait.value);
        this.autoBhHandler();
    }

    private _autoTimer: number = 0;

    private autoMd(playerView: DeskPlayerView): void {
        //倒计时
        this.drawTimeDown(this.manager.gameStartInfo.nThrowWait.value);
        this._autoTimer = egret.setTimeout(function (): void {
            playerView.autoMd();
        }, this, GlobalVar.autoDelay);
    }

    /**
     * 重启游戏
     */
    public restGame(isShell: boolean = false): void {
        if (isShell) {
            this.manager.checkHandCardNum = 0;
        }

        SQGameServer.getInstance().sendHead();

        // this.destroy();
        if (WGManager.getInstance().isWgIng()) {
            GameManager.getInstance().doEnterGameServer(this.manager.firstPerson);
        } else {
            GameManager.getInstance().doEnterGameServer(SystemCenter.playSystem.selfPlayerInfo.userID);
        }
    }


    public redrawByBrowser(): void {
        if (this.upUserPanel) {
            this.upUserPanel.x = 150;
            this.upUserPanel.y = 0;
        }

        if (this.downUserPanel) {
            this.downUserPanel.x = 10;
            this.downUserPanel.y = LayerManager.stage.stageHeight - this.downUserPanel.height - 40;
        }

        if (this.leftUserPanel) {
            this.leftUserPanel.x = 0;
            // this.leftUserPanel.y = LayerManager.stage.stageHeight * .5 - this.leftUserPanel.height * .5;
            this.leftUserPanel.y = 70;
        }

        if (this.rightUserPanel) {
            this.rightUserPanel.x = LayerManager.stage.stageWidth - this.rightUserPanel.width;
            // this.rightUserPanel.y = LayerManager.stage.stageHeight * .5 - this.rightUserPanel.height * .5;
            this.rightUserPanel.y = 70;
        }

        //手牌
        if (this._ownerPlayerView) {
            this._ownerPlayerView.redrawByBrowser();
        }

        if (this._topPlayerView) {
            this._topPlayerView.redrawByBrowser();
        }

        if (this._leftPlayerView) {
            this._leftPlayerView.redrawByBrowser();
        }

        if (this._rightPlayerView) {
            this._rightPlayerView.redrawByBrowser();
        }
    }

    public clearPoolContainer(): void {
        if (this._rightPoolContainer) {
            //this._rightPoolContainer.destroy();
            DisplayObjectUtil.removeAllChild(this._rightPoolContainer);
            DisplayObjectUtil.removeForParent(this._rightPoolContainer);
            this._rightPoolContainer = null;
        }
        if (this._leftPoolContainer) {
            //this._leftPoolContainer.destroy();
            DisplayObjectUtil.removeAllChild(this._leftPoolContainer);
            DisplayObjectUtil.removeForParent(this._leftPoolContainer);
            this._leftPoolContainer = null;
        }

        if (this._topPoolContainer) {
            //this._topPoolContainer.destroy();
            DisplayObjectUtil.removeAllChild(this._topPoolContainer);
            DisplayObjectUtil.removeForParent(this._topPoolContainer);
            this._topPoolContainer = null;
        }
        if (this._downPoolContainer) {
            //this._downPoolContainer.destroy();
            DisplayObjectUtil.removeAllChild(this._downPoolContainer);
            DisplayObjectUtil.removeForParent(this._downPoolContainer);
            this._downPoolContainer = null;
        }
    }

    //退出围观
    private onExitPGHandler(e: egret.TouchEvent): void {
        WGManager.getInstance().sendExitWG();
    }


    private getPlayerViewData(chairNo: number): Array<number> {
        var cardArr: Array<number> = new Array<number>();
        var _cards: Array<any> = this.manager.gameStartInfo.nChairCards.slice(chairNo * Global.CHAIR_CARDS, (chairNo + 1) * Global.CHAIR_CARDS);

        var _cardsCount: number = this.manager.gameStartInfo.nCardsCount.getAt(chairNo).value;
        for (var i: number = 0; i < _cardsCount; i++) {
            cardArr.push(_cards[i].value);
        }
        return cardArr;
    }

    //请求退出图标
    private setUserAllowResultIcon(dir: number, result: number) {
        //var _parent:UIPlayerContainer;
        //var x:number;
        //var y:number;
        //switch (dir) {
        //    case 1:
        //        _parent = this._desk.mc_player_top;
        //        x = 0;
        //        y = 20;
        //        break;
        //    case 2:
        //        _parent = this._desk.mc_player_right;
        //        x = 0;
        //        y = 20;
        //        break;
        //    case 3:
        //        _parent = this._desk.mc_player_down;
        //        x = 0;
        //        y = 20;
        //        break;
        //    case 4:
        //        _parent = this._desk.mc_player_left;
        //        x = 0;
        //        y = 20;
        //        break;
        //}
        //var _bmClass:string = result ? "live_player.icon_access" : "live_player.icon_refuse";
        //var _tgBitMap:egret.Bitmap = new egret.Bitmap(RES.getRes(_bmClass));
        //_tgBitMap.y = y;
        //_tgBitMap.x = x;
        //_parent.addChild(_tgBitMap);
        //egret.setTimeout(function () {
        //    DisplayObjectUtil.removeForParent(_tgBitMap);
        //    _tgBitMap = null;
        //}, this, 5000);
    }


    private checkNameLen(txt: egret.TextField): void {
        if (txt.text.length > 5) {
            var str: string = txt.text.substr(0, 6) + ".";
            txt.text = str;
        }
    }


    /**
     *摸牌回调
     * @param cardCaught
     *
     */
    public see_cardCaught(cardCaught: CGameCardCaught): void {
    }

    /**
     *自己出牌回调
     * @param cardThrow
     *
     */
    public see_cardThrow(cardThrow: CGameThrowCards): void {
    }

    /**
     *自己碰牌回调
     *
     */
    public see_cardPengBack(): void {
    }

    public see_userLeaveInform(userId: number = 0): void {
        var chairNo: number = this.getChairNoByUID(userId);
        var _dir: number = this.getPlayerDeskPosition(chairNo);
        var _userPanel: DeskUserPanel = this.getUserPanelByDir(_dir);
        _userPanel.die();
    }

    public see_userBackInform(userId: number = 0): void {
        var chairNo: number = this.getChairNoByUID(userId);
        var _dir: number = this.getPlayerDeskPosition(chairNo);
        var _userPanel: DeskUserPanel = this.getUserPanelByDir(_dir);
        _userPanel.rebirth();
    }


    private setUserCuoHuIcon(dir: number): void {
        var cuoHuIcon: egret.Bitmap = new egret.Bitmap();
        cuoHuIcon.texture = RES.getRes("game.icon_big_ch");
        this.addChild(cuoHuIcon);
        cuoHuIcon.anchorOffsetX = cuoHuIcon.width * .5;
        cuoHuIcon.anchorOffsetY = cuoHuIcon.height * .5;

        var cuoHuSmallIcon: egret.Bitmap = new egret.Bitmap();
        cuoHuSmallIcon.texture = RES.getRes("game.icon_ch");
        this.addChild(cuoHuSmallIcon);

        if (!this.tempDisplayArr) {
            this.tempDisplayArr = [];
        }

        this.tempDisplayArr.push(cuoHuSmallIcon);

        var offsetX: number = 0, offsetY: number = 0;
        switch (dir) {
            case 1:
                offsetX = LayerManager.stage.stageWidth * .5 - cuoHuIcon.width * .5;
                offsetY = 95;
                break;
            case 2:
                offsetX = LayerManager.stage.stageHeight - cuoHuIcon.width - 120;
                offsetY = LayerManager.stage.stageHeight * .5 - cuoHuIcon.height * .5;
                break;
            case 3:
                offsetX = LayerManager.stage.stageWidth * .5 - cuoHuIcon.width * .5;
                offsetY = LayerManager.stage.stageHeight - cuoHuIcon.height - 95;
                break;
            case 4:
                offsetX = 120;
                offsetY = LayerManager.stage.stageHeight * .5 - cuoHuIcon.height * .5;
                break;
        }
        cuoHuIcon.x = offsetX + cuoHuIcon.width * .5;
        cuoHuIcon.y = offsetY + cuoHuIcon.height * .5;

        cuoHuSmallIcon.x = cuoHuIcon.x - cuoHuSmallIcon.width * .5;
        cuoHuSmallIcon.y = cuoHuIcon.y - cuoHuSmallIcon.height * .5;
        cuoHuSmallIcon.alpha = 0;

        var moveX: number = 0, moveY: number = 0;
        switch (dir) {
            case 1:
                moveX = this.upUserPanel.x + 100;
                moveY = this.upUserPanel.y + 60;
                break;
            case 2:
                moveX = this.rightUserPanel.x + 20;
                moveY = this.rightUserPanel.y - cuoHuSmallIcon.height;
                break;
            case 3:
                moveX = this.downUserPanel.x + 100;
                moveY = this.downUserPanel.y + 60;
                break;
            case 4:
                moveX = this.leftUserPanel.x + 30;
                moveY = this.leftUserPanel.y - cuoHuSmallIcon.height;
                break;
        }

        TweenMax.to(cuoHuSmallIcon, .6, {delay: 2, alpha: 1});
        TweenMax.to(cuoHuIcon, .6, {
            delay: 2,
            scaleX: .3, scaleY: .3, alpha: 0, ease: Back.easeIn, onComplete: function (): void {
                TweenMax.to(cuoHuSmallIcon, .6, {
                    alpha: 1, x: moveX, y: moveY, onComplete: function (): void {
                    }
                });
            }
        });
    }

    public see_userStatusInform(arr: Array<any>): void {
        for (var i: number = 0; i < arr.length; i++) {
            var _isTg: boolean = false;

            //托管
            if (baseUtil.isExitFlag(arr[i], Global.US_USER_AUTOPLAY)) {
                _isTg = true;
                //勾选自动摸打
                if (i == this.manager.nChairNo) {
                    this.manager.isAutoMD = true;
                    this.autoMdButton.setSelect(this.manager.isAutoMD);
                }
            }

            if (i != this.manager.nChairNo) {
                this.setUserStautsIcon(i, _isTg);
            }

        }
    }

    private setUserStautsIcon(_chairNo: number, isTg: boolean): void {
        var _dir: number = this.getPlayerDeskPosition(_chairNo);
        var _userPanel: DeskUserPanel = this.getUserPanelByDir(_dir);

        isTg ? (_userPanel.die()) : (_userPanel.rebirth());
    }

    public see_setRoomName(roomInfo: CGameRoom): void {
        var _fan: string = "";
        var _text: string = "";

        var _roomName: string = roomInfo.sRoomName;
        var _fanTyep: string = RoomInfo.getNameByCount(roomInfo.nClassID.value);

        //友人房
        if (SystemCenter.playSystem.selfPlayerInfo.GameData.nScene.value == Global.LSSCENE_FRIEND) {
            _fan = roomInfo.nHuMinLimit.value + "番起胡"
        }

        _text = _roomName;

        var txt_room_info: SQ.STTextField = new SQ.STTextField();
        this._bottomLine.addChild(txt_room_info);
        txt_room_info.size = 14;

        txt_room_info.text = _text + _fan;
        txt_room_info.width = txt_room_info.textWidth + 10;
        txt_room_info.height = 16;

        txt_room_info.x = 10;
        txt_room_info.y = 8;
        txt_room_info.textColor = 0xC0C6D9;
    }


    /**
     * 延迟相关的函数
     */
    public see_YSInform(uid: number): void {
        var _userName: string = this.getUIdByName(uid);

        if (SystemCenter.playSystem.selfPlayerInfo.GameData.nScene.value == Global.LS_SCENE_MATCH) {
            _userName = "****";
        }

        if (uid != this.manager.firstPerson) {

            this.showTips("玩家 " + _userName + " 选择了延时，请稍等");
        }
    }


    private showTips(str: string): void {
        GUIFactory.getInstance().showBubbleBox(str);
    }

    public see_askExit(askExit: CLSAskExit) {
        var _userId: number = askExit.nUserID.value;
        if (_userId != SystemCenter.playSystem.selfPlayerInfo.userID) {
            var _nikeName: string = this.getUIdByName(_userId);
        } else {
            //TODO请求退出按钮隐藏
        }
    }

    public see_AllowExit(askExit: CLSALLOW_EXIT) {
        var _chair: number = this.getChairNoByUID(askExit.nUserID.value);
        var _dir: number = this.getPlayerDeskPosition(_chair);
        var _nikeName: string = this.getUIdByName(askExit.nUserID.value);
        var _askName: string = this.getUIdByName(askExit.nAskerID.value);
        this.setUserAllowResultIcon(_dir, askExit.nAllowed.value);
        var _str: string = "";
        var _result: string = askExit.nAllowed.value == 1 ? "同意" : "拒绝";
        if (askExit.nAskerID.value == SystemCenter.playSystem.selfPlayerInfo.userID) {
            _str = "玩家 " + _nikeName + " " + _result + "了您的请求";
            this.showTips(_str);
        }
        else {
            if (askExit.nUserID.value != SystemCenter.playSystem.selfPlayerInfo.userID) {
                _str = "玩家 " + _nikeName + " " + _result + "了 " + _askName + " 的退出请求";
                this.showTips(_str);
            }
        }
    }

    public see_YSBack(): void {
        this.manager.delayCount -= 1;
        //this._timeDownSp.ys_btn.visible = false;
        if (this._TimeDown) {
            this._TimeDown.removeEventListener(egret.TimerEvent.TIMER, this.drawTimeDownHandler, this);
            this._TimeDown.stop();
            this._curTiemDown += this.manager.gameStartInfo.nDelayTime.value;
            this._TimeDown = new egret.Timer(1000, this._curTiemDown + 1)
            this._TimeDown.addEventListener(egret.TimerEvent.TIMER, this.drawTimeDownHandler, this)
            this._TimeDown.start();
            this.showTips("您已选择了延时，剩余 " + this.manager.delayCount + " 次延时机会");
        }
    }

    /**
     *最后结束的总排名
     * @param arr
     *
     */
    public see_FinallyResultInform(arr: Array<LSR_FINALLY_RESULTS>): void {
        var _sortFunc = function (a: LSR_FINALLY_RESULTS, b: LSR_FINALLY_RESULTS): number {
            return a.nRank.value - b.nRank.value;
        };

        if (arr && arr.length) {
            arr.sort(_sortFunc);
        }
        if (this.manager.finallyResultData == null) {
            this.manager.finallyResultData = arr;
        }

        if (!SystemCenter.playSystem.selfPlayerInfo.playerType) {
            //TODO 围观按钮隐藏
        }
    }

    public see_cardGuoInform(cardGuo: CGameCombCard): void {
        var dir: number = this.getPlayerDeskPosition(cardGuo.nCardChair.value);
        var playerView: DeskPlayerView = this.getPlayerHandByDir(dir);
        var cardPoolView: DeskPoolContainer = this.getCardPool(dir);

        this.resetMcCardControl();
        this.resetTimeDown();

        if (baseUtil.isExitFlag(cardGuo.dwFlags.value, Global.MJ_GANG_MN) || baseUtil.isExitFlag(cardGuo.dwFlags.value, Global.MJ_GANG_PN)) return;
    }


    public see_cardChiBack(): void {

    }

    /**
     *吃通知
     * @param cardsThrow
     *
     */
    public see_chiCardInform(cGameChiCard: CGameCombCard): void {
        var _chairNo: number = this.getChairNoByUID(cGameChiCard.nUserID.value);
        var _fromChairNo: number = cGameChiCard.nCardChair.value;
        var _dir: number = this.getPlayerDeskPosition(_chairNo);
        var _fromDir: number = this.getPlayerDeskPosition(_fromChairNo);
        //var _fromPlayerView:DeskPlayerView = this.getPlayerHandByDir(_fromDir)
        var _playerView: DeskPlayerView = this.getPlayerHandByDir(_dir);
        var _cardMingDir: number = this.getPlayerMingByDir(_dir, _fromDir);
        var _cardPoolView: DeskPoolContainer = this.getCardPool(_fromDir);
        var _arr: Array<any> = new Array<any>();

        SoundManager.getInstance().playEffect("Snd_chi_female");
        this.addFuluAnimation("chi", _dir);

        this.manager.actChairNo = _chairNo;

        for (var i: number = 0; i < cGameChiCard.nBaseIDs.getLen(); i++) {
            if (cGameChiCard.nBaseIDs.getAt(i).value > -1) {
                _arr.push(cGameChiCard.nBaseIDs.getAt(i).value);
            }
        }

        if (cGameChiCard.nUserID.value == this.manager.firstPerson) {
            this.manager.isAllowDaChu = true;
            this.resetMcCardControl();
            this.resetTimeDown();
            //倒计时
            this.drawTimeDown(this.manager.gameStartInfo.nThrowWait.value);
        }
        this.setActChairNoLight(_dir);

        //添加fu数据
        PlayerManager.getPlayerData(_chairNo).fuluArr["sz"].push(_arr.concat(cGameChiCard.nCardID.value));

        //删除手牌数据
        for (i = 0; i < _arr.length; i++) {
            if (cGameChiCard.nUserID.value == this.manager.firstPerson || WGManager.getInstance().isWgIng()) {
                PlayerManager.delCardData(_chairNo, _arr[i]);
            } else {
                PlayerManager.delCardData(_chairNo, -1);
            }
        }

        _playerView.addCPMgCard(_arr.concat(), cGameChiCard.nCardID.value, _cardMingDir);

        //重绘手牌
        _playerView.resetDrawCard();
        _playerView.redrawByBrowser();

        //隐藏上家放大的牌
        this.clearAllDaChuMask();
        _cardPoolView.clearLastCard();
    }


    public see_cardMnGangBack(): void {

    }

    public see_mGangcardInform(cgameMnGangCard: CGameCombCard): void {
        LoadingManager.hideLoading();
        if (baseUtil.isExitFlag(cgameMnGangCard.dwFlags2.value, Global.MJ_PGCH_SUCC)) {
            var _chairNo: number = this.getChairNoByUID(cgameMnGangCard.nUserID.value);
            var _fromChairNo: number = cgameMnGangCard.nCardChair.value;
            var _dir: number = this.getPlayerDeskPosition(_chairNo);
            var _fromDir: number = this.getPlayerDeskPosition(_fromChairNo);
            var _fromPlayerView: DeskPlayerView = this.getPlayerHandByDir(_fromDir);
            var _playerView: DeskPlayerView = this.getPlayerHandByDir(_dir);
            var _cardMingDir: number = this.getPlayerMingByDir(_dir, _fromDir);
            var _cardPoolView: DeskPoolContainer = this.getCardPool(_fromDir);
            var _arr: Array<any> = new Array<any>();

            SoundManager.getInstance().playEffect("Snd_gang_female");
            this.addFuluAnimation("gang", _dir);

            this.manager.actChairNo = _chairNo;

            for (var i: number = 0; i < cgameMnGangCard.nBaseIDs.getLen(); i++) {
                if (cgameMnGangCard.nBaseIDs.getAt(i).value > -1) {
                    _arr.push(cgameMnGangCard.nBaseIDs.getAt(i).value);
                }
            }
            var fuArr: Array<any> = _arr.concat();
            fuArr.push(cgameMnGangCard.nCardID.value);

            this.setActChairNoLight(_dir);

            this.clearCardMingTip();

            //添加fu数据
            PlayerManager.getPlayerData(_chairNo).fuluArr["kz"][CardData.getCardIndex(cgameMnGangCard.nCardID.value)] = fuArr;

            //删除手牌数据
            for (i = 0; i < _arr.length; i++) {
                if (cgameMnGangCard.nUserID.value == this.manager.firstPerson || WGManager.getInstance().isWgIng()) {
                    PlayerManager.delCardData(_chairNo, _arr[i]);
                }
                else {
                    PlayerManager.delCardData(_chairNo, -1);
                }
            }

            _playerView.addCPMgCard(_arr.concat(), cgameMnGangCard.nCardID.value, _cardMingDir);
            _playerView.resetDrawCard();
            _playerView.redrawByBrowser();

            this.clearAllDaChuMask();
            _cardPoolView.clearLastCard();
        }
    }


    public see_cardAnGangBack(): void {

    }

    public see_HUAInform(cgameHUACard: CGameThrowCards): void {
        //发牌动画没处理完的时候
        if (GameStatus.isReadying()) {
            this.manager.todoTaskPipe.push({
                type: GlobalVar.msg_hua,
                data: cgameHUACard
            })
            return;
        }

        this.drawBuHua(cgameHUACard);
    }


    public see_HUAOverInform(cgameHuaOver: CGameHuaOver): void {
        if (GameStatus.isReadying()) {
            this.manager.todoTaskPipe.push({
                type: GlobalVar.msg_huaover,
                data: cgameHuaOver
            });
            return;
        }

        this.drawHuaOver(cgameHuaOver);
    }

    public see_pnGangCardInform(cgamepnGangCard: CGameCombCard): void {
        var _chairNo: number = this.getChairNoByUID(cgamepnGangCard.nUserID.value);
        var _dir: number = this.getPlayerDeskPosition(_chairNo);
        this._currCardThrow = new CGameCardsThrow();
        this._currCardThrow.vCardID.value = cgamepnGangCard.nCardID.value;
        this.manager.actChairNo = _chairNo;

        if (baseUtil.isExitFlag(cgamepnGangCard.dwFlags2.value, Global.MJ_PGCH_SUCC)) {
            if (_chairNo == this.manager.nChairNo || WGManager.getInstance().isCompereIng) {
                SoundManager.getInstance().playEffect("Snd_gang_female");
            }
            this.drawPengGang(cgamepnGangCard);
        }
        else {
            if (_chairNo != this.manager.nChairNo) {
                SoundManager.getInstance().playEffect("Snd_gang_female");
            }
            if (this.isExistFlags(cgamepnGangCard.dwFlags.value)) {
                if (this.manager.isOnlyHuZimo) {
                    this.playerGuoHandler();
                    return;
                }
                this.mcCardControl(cgamepnGangCard.dwFlags.value, Global.MJ_HU_QGNG);

                //倒计时
                this.drawTimeDown(this.manager.gameStartInfo.nPGCHWait.value);
            }
        }
    }

    private gameWinNeedClear(): void {
        this.resetMcCardControl();
        this.resetTimeDown();
        this.clearCardMingTip();

        if (this._autoTimer) {
            egret.clearTimeout(this._autoTimer);
        }

        var dealerTimer = DeskManager.getInstance().dealerTimer;
        if (dealerTimer) {
            dealerTimer.stop();
            dealerTimer.removeEventListener(egret.TimerEvent.TIMER, this.drawDealerAnimation, this);
            dealerTimer = null;
        }

        if (this.dice1) {
            TweenMax.killTweensOf(this.dice1, true);
            DisplayObjectUtil.removeForParent(this.dice1);
            this.dice1 = null;
        }
        if (this.dice2) {
            TweenMax.killTweensOf(this.dice2, true);
            DisplayObjectUtil.removeForParent(this.dice2);
            this.dice2 = null;
        }

        egret.clearTimeout(this.manager.tempTimer);
    }


    private gameWinShowPlayerCard(): void {
        var cGameWin = this.manager.cGameWin;
        for (var i: number = 0; i < this.manager.playerArr.length; i++) {
            var _playerData: CGamePlayerData = this.manager.playerArr[i];
            var _chairNo: number = _playerData.GameData.nChairNO.value;
            var _dir: number = this.getPlayerDeskPosition(_chairNo);
            var _playerView: DeskPlayerView = this.getPlayerHandByDir(_dir);
            PlayerManager.getPlayerData(_chairNo).handArr = [];
        }

        for (i = 0; i < this.manager.playerArr.length; i++) {
            var _data: Array<any> = [];
            _playerData = this.manager.playerArr[i];
            _chairNo = _playerData.GameData.nChairNO.value;
            _dir = this.getPlayerDeskPosition(_chairNo);
            _playerView = this.getPlayerHandByDir(_dir);
            var _sourceData: Array<any> = cGameWin.nChairCards.slice(i * Global.CHAIR_CARDS, (i + 1) * Global.CHAIR_CARDS);
            //点炮或者被抢杠的位置
            var _loseDir: number = this.getPlayerDeskPosition(cGameWin.gamewinMJ.nLoseChair.value);

            //非自摸
            if (cGameWin.gamewinMJ.nLoseChair.value > -1 && _loseDir == _dir) {
                var _index: number = _sourceData.indexOf(cGameWin.gamewinMJ.nHuCard);
                if (_index > -1) {
                    _sourceData.splice(_index, 1);
                }
            }

            for (var j: number = 0; j < _sourceData.length; j++) {
                if (_sourceData[j].value > -1) {
                    _data.push(_sourceData[j].value);
                }
            }

            PlayerManager.getPlayerData(_chairNo).handArr = _data;
            PlayerManager.getPlayerData(_chairNo).sortHandData();

            this.showHandCards(_playerView);
        }
    }

    private startWaitTimer: egret.Timer;

    public see_gameWin(cGameWin: CGameWinResult, cGameHuDetails: CGameHU_DETAILS): void {
        GameStatus.status = GameStatus.STATUS_GAME_END;
        this.manager.cGameWin = cGameWin;
        this.manager.cGameHuDetails = cGameHuDetails;

        for (var i: number = 0; i < cGameWin.gamewinMJ.nHuChair.getLen(); i++) {
            if (cGameWin.gamewinMJ.nHuChair.getAt(i).value > 0) {
                this.manager.huChair = i;
                break;
            }
        }


        var repeat: number = this.manager.gameStartInfo.nStartWait.value;
        this.startWaitTimer = new egret.Timer(1000, repeat);
        this.startWaitTimer.addEventListener(egret.TimerEvent.TIMER, this.startWaitTimeDown, this);

        //TODO退出按钮不能点击
        //if (this._askExitBtn) {
        //    this._askExitBtn.setDisable(false);
        //}

        this.gameWinNeedClear();

        this.gameWinShowPlayerCard();
        if (!WGManager.getInstance().isWgIng()) {
            this.gameWinShowPlayerAnGang();
        }

        var targetCard: any;
        var huDir: number;
        var playerView: DeskPlayerView;
        //判断不是流庄，且是自摸
        if (cGameWin.gamewinMJ.nLoseChair.value == -1) {
            if (this.manager.huChair > -1) {
                huDir = this.getPlayerDeskPosition(this.manager.huChair);
                playerView = this.getPlayerHandByDir(huDir);
                targetCard = playerView.getLastCard();

                if (targetCard) {
                    var self = this;
                    var point: egret.Point = targetCard.localToGlobal(0, 0);
                    GameResultTransition.showHeLight(point, ()=> {
                        self.showBigFan();
                    });
                }
            }
            //无效局
            else {
                this.gameWinResult();
            }
        } else {
            if (this._preCardPool) {
                targetCard = this._preCardPool.getLastCard();
                if (targetCard) {
                    var self = this;
                    var point: egret.Point = targetCard.localToGlobal(0, 0);

                    GameResultTransition.showHeLight(point, ()=> {
                        self.moveDpHuCard();
                        self._preCardPool.clearDaChuMask();
                        self._preCardPool.clearLastCard();
                    });
                }
            }
        }

        //TODO其他面板消失
        //AskExitPanel.getInstance().destroy();
        //RespondAskExitPanel.getInstance().destroy();
    }

    private startWaitTimeDown(e: Event): void {
        this.manager.gameStartInfo.nStartWait.value -= 1;
    }

    private moveDpHuCard(): void {
        var dpCard: CardPool;
        var point: egret.Point;
        if (this._preCardPool) {
            dpCard = this._preCardPool.getLastCard();
            if (dpCard) {
                point = dpCard.localToGlobal(0, 0);
            }
        }

        var huDir = this.getPlayerDeskPosition(this.manager.huChair);

        this.moveCardItem = new CardHand(huDir);
        this.moveCardItem.id = this.manager.cGameWin.gamewinMJ.nHuCard.value;
        this.moveCardItem.frond();
        this.addChild(this.moveCardItem);
        this.moveCardItem.x = point.x;
        this.moveCardItem.y = point.y;

        if (huDir == 1) {
            this.moveCardItem.scaleX = this.moveCardItem.scaleY = .6;
        } else if (huDir == 2) {
            this.moveCardItem.scaleX = this.moveCardItem.scaleY = .9;
        } else if (huDir == 4) {
            this.moveCardItem.scaleX = this.moveCardItem.scaleY = 1.2;
        }

        var targetX: number, targetY: number;

        if (huDir == 1) {
            targetX = 400 - this.moveCardItem.width * this.moveCardItem.scaleX - 10;
            targetY = this._topPlayerView.y;
        } else if (huDir == 2) {
            targetX = this._rightPlayerView.x - 20;
            targetY = 70;
        } else if (huDir == 3) {
            targetX = this._ownerPlayerView.x + this._ownerPlayerView.width + 10;
            targetY = this._ownerPlayerView.y;
        } else {
            targetX = 15;
            targetY = 435;
        }

        var self = this;
        TweenMax.to(this.moveCardItem, .6, {
            x: targetX,
            y: targetY,
            onComplete: function (): void {
                var point: egret.Point = self.moveCardItem.localToGlobal(0, 0);
                GameResultTransition.showHuCardMove(point, ()=> {
                    self.showBigFan();
                });
            },
            onCompleteParams: [self.moveCardItem],
            ease: Cubic.easeInOut
        });

    }

    private showBigFan(): void {
        var huFanType: FixedArray = this.manager.cGameHuDetails.nHuGains;
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

        //有大番或者特殊番型
        if (_tempArr.length) {
            var showFan: number = _tempArr[0];
            var fankey: string = FanData.getFanType(showFan);
            var bigFanIcon: egret.DisplayObjectContainer = EcffectFactory.getInstance().createFont(fankey);
            var self = this;
            bigFanIcon.addEventListener("ecffectEnd", function (): void {
                self.gameWinResult();
                DisplayObjectUtil.removeForParent(bigFanIcon);
                bigFanIcon = null;
            }, this);
            LayerManager.TopLayer.addChild(bigFanIcon);
            bigFanIcon.x = LayerManager.TopLayer.width * .5 - bigFanIcon.width * .5;
            bigFanIcon.y = LayerManager.TopLayer.height * .5 - bigFanIcon.height * .5;

            SoundManager.getInstance().playEffect("Snd_bigFan");
        } else {
            this.gameWinResult();
        }
    }

    public gameWinResult(): void {
        //非流局
        if (this.manager.huChair != -1) {
            SoundManager.getInstance().playEffect("Snd_hu_female");
        }

        if (this.startWaitTimer) {
            this.startWaitTimer.removeEventListener(egret.TimerEvent.TIMER, this.startWaitTimeDown, this);
            this.startWaitTimer.stop();
            this.startWaitTimer = null;
        }

        this.resultPanel = new GameResultPanel();
        this.addChild(this.resultPanel);
    }

    private leaveRoomHandler(e: SocketEvent): void {
        LoadingManager.hideLoading();
        SocketEvent.removeEventListener(Global.LSR_MATCH_LEAVEROOM.toString(), this.leaveRoomHandler, this);

        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            SceneManagerExt.backCurrScene();
        } else {
            SceneManagerExt.backCurrScene();
        }
    }

    /**
     * 结束显示暗杠
     */
    private gameWinShowPlayerAnGang(): void {

    }


    private enterRoomHandler(e: SocketEvent): void {
        LoadingManager.hideLoading();
        SocketEvent.removeEventListener(Global.LSR_MATCH_ENTERROOM.toString(), this.enterRoomHandler, this);

        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            this.manager.isPDIng = true;
        }
    }

    private showHandCards(playerView: DeskPlayerView): void {
        if (playerView) {
            //自摸 删除胡的牌
            if (this.manager.cGameWin) {
                if (playerView.nChairNO == this.manager.huChair && this.manager.cGameWin.gamewinMJ.nLoseChair.value == -1) {
                    if (PlayerManager.getPlayerHandData(playerView.nChairNO).indexOf(this.manager.cGameWin.gamewinMJ.nHuCard.value) > -1) {
                        PlayerManager.delCardData(playerView.nChairNO, this.manager.cGameWin.gamewinMJ.nHuCard.value);
                    }
                }
            }

            playerView.toFrond();
            // playerView.redrawByBrowser();

            if (playerView.nChairNO == this.manager.huChair && this.manager.cGameWin.gamewinMJ.nLoseChair.value == -1) {
                playerView.catchCard(this.manager.cGameWin.gamewinMJ.nHuCard.value);
            }
        }
    }

    private _cuoHuTimerArr: Array<any>;
    private tempDisplayArr: Array<any>;

    public see_gameCuoHu(cgameCuoHu: CGameCuoHu): void {
        var _chairNo: number = this.getChairNoByUID(cgameCuoHu.nUserID.value);
        var _dir: number = this.getPlayerDeskPosition(_chairNo);
        var _playerView: DeskPlayerView = this.getPlayerHandByDir(_dir);
        var _data: Array<any> = [];
        var _userPanel: DeskUserPanel = this.getUserPanelByDir(_dir);

        SoundManager.getInstance().playEffect("Snd_hu_female");

        this.manager.makeCuohuCount = 1;
        //_playerView.addCuoHu();
        this.setUserCuoHuIcon(_dir);

        if (this._TimeDown && this._TimeDown.running) {
            this.resetTimeDown();
            //倒计时
            this.drawTimeDown(this.manager.gameStartInfo.nPGCHWait.value);
        }


        if (WGManager.getInstance().isWgIng()) {
            return;
        }

        for (var i: number = 0; i < cgameCuoHu.nCardsCount.value; i++) {
            _data.push(cgameCuoHu.nChairCards.getAt(i).value);
        }

        PlayerManager.getPlayerData(_chairNo).handArr = _data;
        PlayerManager.getPlayerData(_chairNo).sortHandData();

        //重绘手牌
        this.showHandCards(_playerView);

        var _cuoHuTimer: number = egret.setTimeout(() => {
            // PlayerManager.getPlayerData(_chairNo).handArr = PlayerManager.getPlayerData(_chairNo).handArr;
            // PlayerManager.getPlayerData(_chairNo).sortHandData();

            if (WGManager.getInstance().isWgIng() && _chairNo == this.manager.nChairNo) {
                PlayerManager.getPlayerData(_chairNo).sortHandData();
            }
            _playerView.toStand();

            if (_chairNo == this.manager.nChairNo && this.manager.actChairNo == this.manager.nChairNo && this.manager.isAllowDaChu) {
                //倒计时
                if (!this._TimeDown) {
                    this.drawTimeDown(this.manager.gameStartInfo.nThrowWait.value - GlobalVar.cuoHuTimeDown - 2);
                }
            }
        }, this, GlobalVar.cuoHuTimeDown * 1000);

        if (!this._cuoHuTimerArr) {
            this._cuoHuTimerArr = [];
        }
        this._cuoHuTimerArr.push(_cuoHuTimer);
    }

    public see_aGangCardInform(cgameAnGangCard: CGameCombCard): void {
        LoadingManager.hideLoading();
        if (baseUtil.isExitFlag(cgameAnGangCard.dwFlags2.value, Global.MJ_PGCH_SUCC)) {
            var _chairNo: number = this.getChairNoByUID(cgameAnGangCard.nUserID.value);
            var _fromChairNo: number = cgameAnGangCard.nCardChair.value;
            var _dir: number = this.getPlayerDeskPosition(_chairNo);
            //var _fromDir:number = this.getPlayerDeskPosition(_fromChairNo);
            var _playerView: DeskPlayerView = this.getPlayerHandByDir(_dir);
            //var _cardMingDir:number = this.getPlayerMingByDir(_dir, _fromDir);
            var _arr: Array<any> = new Array<any>();

            this.manager.actChairNo = _chairNo;

            SoundManager.getInstance().playEffect("Snd_gang_female");

            for (var i: number = 0; i < cgameAnGangCard.nBaseIDs.getLen(); i++) {
                _arr[i] = cgameAnGangCard.nBaseIDs.getAt(i).value;
            }
            _arr.push(cgameAnGangCard.nCardID.value);

            var fuArr: Array<any> = _arr.concat();

            //添加fu数据
            if (cgameAnGangCard.nUserID.value == this.manager.firstPerson) {
                PlayerManager.getPlayerData(_chairNo).fuluArr["kz"][CardData.getCardIndex(cgameAnGangCard.nCardID.value)] = fuArr;
            } else {
                if (!WGManager.getInstance().isWgIng()) {
                    fuArr = [1, 1, 1, 1]
                    PlayerManager.getPlayerData(_chairNo).fuluArr["kz"][Math.random().toString(36).slice(2)] = fuArr;
                }
                else {
                    PlayerManager.getPlayerData(_chairNo).fuluArr["kz"][CardData.getCardIndex(cgameAnGangCard.nCardID.value)] = fuArr;
                }
            }

            for (i = 0; i < fuArr.length; i++) {
                if (cgameAnGangCard.nUserID.value == this.manager.firstPerson || WGManager.getInstance().isWgIng()) {
                    PlayerManager.delCardData(_chairNo, fuArr[i]);
                } else {
                    PlayerManager.delCardData(_chairNo, -1);
                }
            }

            _playerView.addAnGang(_arr.concat());
            //重绘手牌
            _playerView.resetDrawCard();
            _playerView.redrawByBrowser();
        }
    }


    /**
     *出牌通知
     * @param cardsThrow
     *
     */
    public see_cardThrowInform(cardsThrow: CGameCardsThrow): void {
        LoadingManager.hideLoading();
        if (GameStatus.isGameEnd()) return;

        if (GameStatus.isReadying()) {
            this.manager.todoTaskPipe.push({
                type: GlobalVar.msg_throw,
                data: cardsThrow
            });
            return;
        }

        if (GameStatus.isGamePlaying()) {
            this.drawCardThrow(cardsThrow);
        }
    }

    private curInfo: Object;

    public checkIsHu(b: Boolean): void {
        if (this.curInfo) {
            if (b != this.curInfo["isHu"]) {
                //this.writeLog(this.curInfo["type"], this.curInfo["cardsID"], this.curInfo["dwFlags"]);
            }
        }
    }

    private checkIsAGang(): boolean {
        return this.filterAnGang().length == 1;
    }

    private checkIsPGang(): boolean {
        return this.filterPengGang().length == 1;
    }

    private checkIsChi(cardId: number): boolean {
        return this.checkChi(cardId).length > 0;
    }

    private checkIsPeng(cardId: number): boolean {
        return this.checkPeng(cardId).length == 2;
    }

    private checkIsMGang(cardId: number): boolean {
        return this.checkMGang(cardId).length == 3;
    }

    private checkPeng(cardId: number): Array<number> {
        var _checkArr: Array<number> = [];
        var arr: Array<number> = PlayerManager.myPlayer.handArr;
        for (var i: number = 0; i < arr.length; i++) {
            if (CardData.getCardIndex(arr[i]) == CardData.getCardIndex(cardId)) {
                if (_checkArr.length == 2) break;
                _checkArr.push(arr[i]);
            }
        }
        return _checkArr;
    }

    private checkMGang(cardId: number): Array<number> {
        var _tempArr: Array<number> = [];
        var arr: Array<number> = PlayerManager.myPlayer.handArr;
        for (var i: number = 0; i < arr.length; i++) {
            if (CardData.getCardIndex(arr[i]) == CardData.getCardIndex(cardId)) {
                _tempArr.push(arr[i]);
            }
        }
        return _tempArr;
    }

    private checkChi(cardId: number): Array<any> {
        var arr: Array<any> = PlayerManager.myPlayer.handArr;
        var _tempArr: Array<any> = new Array<any>();
        var cardType: number = CardData.getCardType(cardId);
        var _arr: Array<any> = [];

        if (cardId >= 108) return [];

        for (var i: number = 0; i < arr.length; i++) {
            if (CardData.getCardType(arr[i]) == cardType) {
                _tempArr[i] = CardData.getCardIndex(arr[i]);
            }
        }

        var _index1: number = _tempArr.indexOf(CardData.getCardIndex(cardId) + 1);
        var _index2: number = _tempArr.indexOf(CardData.getCardIndex(cardId) + 2);
        if (_index1 > -1 && _index2 > -1) {
            var chiObj: Array<any> = new Array<any>();
            chiObj[0] = cardId;
            chiObj[1] = arr[_index1];
            chiObj[2] = arr[_index2];
            _arr.push({
                type: 1,
                cards: chiObj
            });
        }


        _index2 = _tempArr.indexOf(CardData.getCardIndex(cardId) - 1);
        if (_index1 > -1 && _index2 > -1) {
            chiObj = new Array<any>();
            chiObj[0] = cardId;
            chiObj[1] = arr[_index1];
            chiObj[2] = arr[_index2];
            _arr.push({
                type: 1,
                cards: chiObj
            });
        }

        _index1 = _tempArr.indexOf(CardData.getCardIndex(cardId) - 2);
        if (_index1 > -1 && _index2 > -1) {
            chiObj = new Array<any>();
            chiObj[0] = cardId;
            chiObj[1] = arr[_index1];
            chiObj[2] = arr[_index2];
            _arr.push({
                type: 1,
                cards: chiObj
            });
        }

        return _arr;
    }

    /**
     * 摸牌通知
     */
    public see_cardCaughtInform(cardCaught: CGameCardCaught): void {
        if (GameStatus.isReadying()) {
            this.manager.todoTaskPipe.push({
                type: GlobalVar.msg_caught,
                data: cardCaught
            });
            return;
        }

        this.drawCardCaught(cardCaught);
    }


    /**
     *发起抓牌请求
     *
     */
    private grNextCard(nChairNO: number = 0): void {
        var uid: number = this.getUIdByChair(nChairNO);

        var cCatchCard: CGameCatchCard = new CGameCatchCard();
        cCatchCard.nUserID.value = uid;
        var sendData: egret.ByteArray = new egret.ByteArray();
        CSerializable.Serialization(cCatchCard, sendData);
        SQGameServer.getInstance().sendCmd(Global.GR_CATCH_CARD, sendData);
    }

    //    private getCardMingByDir(dir:number = 0):CardMingView{
    //        switch (dir){
    //            case 1:
    //                return  this._topCardMing;
    //            case 2:
    //                return  this._rightCardMing;
    //            case 3:
    //                return  this._ownerCardMing;
    //            case 4:
    //                return  this._leftCardMing;
    //        }
    //        return null;
    //    }


    private _cardControlOffX: number = 10;

    private _filterMarry: Array<any>;

    private playerChiHandler(e: egret.TouchEvent): void {
        var cardId: number = -1;
        if (this._currCardThrow) {
            cardId = this._currCardThrow.vCardID.value;
        }
        if (cardId == -1) return;

        this._filterMarry = this.checkChi(cardId);

        if (this._filterMarry && this._filterMarry.length) {
            if (this._filterMarry.length > 1) {
                this.createCardMingTip(this._filterMarry.reverse());
            } else if (this._filterMarry.length == 1) {
                var _temp: Array<any> = [];
                var len: number = this._filterMarry[0].cards.length;
                for (var i = 0; i < len; i++) {
                    if (this._filterMarry[0].cards[i] != cardId) {
                        _temp.push(this._filterMarry[0].cards[i]);
                    }
                }
                if (_temp.length == 2) {
                    this.sendChiHandler(_temp);
                }
                this.resetTimeDown();
            }
        }
        this.resetMcCardControl();
    }

    private sendChiHandler(arr: Array<any>): void {
        this.resetTimeDown();
        var cChiCard: CGameCombCard = new CGameCombCard();
        cChiCard.nUserID.value = this.manager.firstPerson;
        cChiCard.nCardChair.value = this.manager.actChairNo;
        cChiCard.nCardID.value = this._currCardThrow.vCardID.value;
        cChiCard.nBaseIDs.getAt(0).value = arr[0];
        cChiCard.nBaseIDs.getAt(1).value = arr[1];
        cChiCard.nBaseIDs.getAt(2).value = -1;
        cChiCard.dwFlags.value = Global.MJ_CHI;

        var sendData: egret.ByteArray = new egret.ByteArray();
        CSerializable.Serialization(cChiCard, sendData);
        this._filterMarry[0] = arr[0];
        this._filterMarry[1] = arr[1];

        SQGameServer.getInstance().sendCmd(Global.GR_PRECHI_CARD, sendData);
    }

    private sendHuaOver(): void {
        var sendData: egret.ByteArray;
        var cGameHuaOver: CGameHuaOver = new CGameHuaOver();
        cGameHuaOver.nUserID.value = this.manager.firstPerson;
        cGameHuaOver.nNextChair.value = -1;
        cGameHuaOver.dwFlags.value = Global.MJ_HUA;

        sendData = new egret.ByteArray();
        CSerializable.Serialization(cGameHuaOver, sendData)
        SQGameServer.getInstance().sendCmd(Global.GR_OVER_HUA, sendData);
    }

    private sendAnGang(arr: Array<any>): void {
        this.resetTimeDown();
        var cMnGangCard: CGameCombCard = new CGameCombCard();
        cMnGangCard.nUserID.value = this.manager.firstPerson;
        cMnGangCard.nCardChair.value = this.manager.actChairNo;
        cMnGangCard.nCardID.value = arr[3];
        cMnGangCard.nBaseIDs.getAt(0).value = arr[0];
        cMnGangCard.nBaseIDs.getAt(1).value = arr[1];
        cMnGangCard.nBaseIDs.getAt(2).value = arr[2];
        cMnGangCard.dwFlags.value = Global.MJ_GANG_AN;

        var sendData: egret.ByteArray = new egret.ByteArray();
        CSerializable.Serialization(cMnGangCard, sendData)
        SQGameServer.getInstance().sendCmd(Global.GR_AN_GANG_CARD, sendData);
    }

    private sendPnGang(cards: Array<any>): void {
        if (cards.length) {
            this.resetTimeDown();
            var cMnGangCard: CGameCombCard = new CGameCombCard();
            cMnGangCard.nUserID.value = this.manager.firstPerson;
            cMnGangCard.nCardChair.value = this.manager.actChairNo;
            cMnGangCard.nCardID.value = cards[3];
            cMnGangCard.nBaseIDs.getAt(0).value = cards[0];
            cMnGangCard.nBaseIDs.getAt(1).value = cards[1];
            cMnGangCard.nBaseIDs.getAt(2).value = cards[2];
            cMnGangCard.dwFlags.value = Global.MJ_GANG_PN;

            var sendData: egret.ByteArray = new egret.ByteArray();
            CSerializable.Serialization(cMnGangCard, sendData)
            SQGameServer.getInstance().sendCmd(Global.GR_PN_GANG_CARD, sendData);
        }
        else {
            //GameManager.getInstance().checkResultMessage(0, 0, "碰杠失败，没有找打可以碰杠的牌,cardId:" + cards[3]);
        }

        this.resetMcCardControl();
        this.resetTimeDown();
    }


    private playerPengHandler(e: egret.TouchEvent): void {
        var cardId: number = -1;
        if (this._currCardThrow) {
            cardId = this._currCardThrow.vCardID.value;
        }
        if (cardId == -1) return;
        this._filterMarry = this.checkPeng(cardId);

        if (this._filterMarry.length == 2) {
            var cPengCard: CGameCombCard = new CGameCombCard();
            cPengCard.nUserID.value = this.manager.firstPerson;
            cPengCard.nCardChair.value = this.manager.actChairNo;
            cPengCard.nCardID.value = cardId;
            cPengCard.nBaseIDs.getAt(0).value = this._filterMarry[0];
            cPengCard.nBaseIDs.getAt(1).value = this._filterMarry[1];
            cPengCard.nBaseIDs.getAt(2).value = -1;
            cPengCard.dwFlags.value = Global.MJ_PENG;

            var sendData: egret.ByteArray = new egret.ByteArray();
            CSerializable.Serialization(cPengCard, sendData)
            SQGameServer.getInstance().sendCmd(Global.GR_PREPENG_CARD, sendData);
        }

        this.resetMcCardControl();
        this.resetTimeDown();
    }

    private playerMNGangHandler(e: egret.TouchEvent): void {
        var cardId: number = -1;

        if (this._currCardThrow) {
            cardId = this._currCardThrow.vCardID.value;
        }
        if (cardId == -1) return;
        this._filterMarry = this.checkMGang(cardId);

        if (this._filterMarry.length == 3) {
            var cMnGangCard: CGameCombCard = new CGameCombCard();
            cMnGangCard.nUserID.value = this.manager.firstPerson;
            cMnGangCard.nCardChair.value = this.manager.actChairNo;
            cMnGangCard.nCardID.value = cardId;
            cMnGangCard.nBaseIDs.getAt(0).value = this._filterMarry[0];
            cMnGangCard.nBaseIDs.getAt(1).value = this._filterMarry[1];
            cMnGangCard.nBaseIDs.getAt(2).value = this._filterMarry[2];
            cMnGangCard.dwFlags.value = Global.MJ_GANG_MN;

            var sendData: egret.ByteArray = new egret.ByteArray();
            CSerializable.Serialization(cMnGangCard, sendData)
            SQGameServer.getInstance().sendCmd(Global.GR_PREMN_GANG_CARD, sendData);
        }

        this.resetMcCardControl();
        this.resetTimeDown();
    }


    private playerPengAnGangHandler(e: egret.TouchEvent): void {
        var _anGang: Array<any> = this.filterAnGang();
        var _pengGang: Array<any> = this.filterPengGang();
        var _arr: Array<any> = _anGang.concat(_pengGang);

        if (_arr.length > 1) {
            this.createCardMingTip(_arr);
        }
        else if (_anGang.length == 1) {
            this.sendAnGang(_anGang[0].cards)
        }
        else if (_pengGang.length == 1) {
            this.sendPnGang(_pengGang[0].cards)
        }

        //考虑到抢杠胡
        this.manager.isAllowDaChu = false;

        this.resetMcCardControl();
    }

    private filterAnGang(): Array<any> {
        var arr: Array<any> = PlayerManager.myPlayer.handArr;
        var __tempArr: Array<any> = [];
        var _resultArr: Array<any> = [];

        var n: number = 0;

        for (var i: number = 0; i < arr.length; i++) {
            if (CardData.getCardIndex(arr[i]) != CardData.getCardIndex(arr[i + 1])) {
                __tempArr.push(arr.slice(n, i + 1))
                n = i + 1;
            }
        }

        for (i = 0; i < __tempArr.length; i++) {
            if (__tempArr[i].length == 4) {
                _resultArr.push({
                    cards: __tempArr[i],
                    type: 2
                });
            }
        }

        return _resultArr.concat();
    }

    private filterPengGang(): Array<any> {
        var arr: Array<any> = PlayerManager.myPlayer.handArr;
        var fu: any = PlayerManager.myPlayer.fuluArr["kz"];
        var cardId: number = -1;
        var __tempArr: Array<any> = [];
        var _resultArr: Array<any> = [];

        for (var i: number = 0; i < arr.length; i++) {
            for (var k in fu) {
                if (fu.hasOwnProperty(k)) {
                    if (CardData.getCardIndex(arr[i]) == parseInt(k)) {
                        __tempArr = fu[k].concat();
                        __tempArr.push(arr[i])
                        _resultArr.push({
                            cards: __tempArr,
                            type: 3
                        })
                    }
                }
            }
        }
        return _resultArr;
    }

    private playerHuHandler(e: egret.TouchEvent): void {
        var _target: CardControlBtn = <CardControlBtn>(e.currentTarget);
        var cardId: number = -1;
        var huType: number = 0;
        if (this._currCardThrow) {
            cardId = this._currCardThrow.vCardID.value;
        }
        if (cardId == -1) return;

        huType = Global.GR_PREHU_CARD;
        if (_target.type == Global.MJ_HU_ZIMO) {
            huType = Global.GR_HU_CARD;
        }

        var cMnGangCard: CGameCombCard = new CGameCombCard();
        cMnGangCard.nUserID.value = this.manager.firstPerson;
        cMnGangCard.nCardChair.value = this.manager.actChairNo;
        cMnGangCard.nCardID.value = cardId;
        cMnGangCard.nBaseIDs.getAt(0).value = -1;
        cMnGangCard.nBaseIDs.getAt(1).value = -1;
        cMnGangCard.nBaseIDs.getAt(2).value = -1;
        cMnGangCard.dwFlags.value = _target.type;//胡自摸、胡抢杠、胡放冲

        var sendData: egret.ByteArray = new egret.ByteArray();
        CSerializable.Serialization(cMnGangCard, sendData)
        SQGameServer.getInstance().sendCmd(huType, sendData);

        this.resetMcCardControl();
        this.resetTimeDown();
    }


    private createCardMingTip(data: Array<any>): void {
        this._cardMingTips = new egret.DisplayObjectContainer();
        var _sp: CardMingTipContainer;
        var _bg: egret.Shape;
        var _cardWrap: egret.DisplayObjectContainer;
        var _index: number = -1;
        var createShp = function (width, height): egret.Shape {
            var shp: egret.Shape = new egret.Shape();
            shp.graphics.beginFill(0x000000, .8);
            shp.graphics.drawRect(0, 0, width + 10, height + 10);
            shp.graphics.endFill();
            return shp;
        };


        for (var i: number = 0; i < data.length; i++) {
            _sp = new CardMingTipContainer();
            _cardWrap = new egret.DisplayObjectContainer();
            _sp.cards = [];
            _sp.type = data[i].type;

            //排序
            var __data: Array<any> = data[i].cards.concat();

            //吃
            if (_sp.type == 1) {
                __data.sort(this.soreMingTipsCard)
            }

            if (_sp.type != 1) {
                _sp.cards = __data.concat();

                if (_sp.type == 3) {
                    __data.splice(0, 3);
                }
            }

            for (var j: number = 0; j < __data.length; j++) {
                var card: CardHand = new CardHand(3);
                card.id = __data[j];
                card.stand();
                card.scaleX = card.scaleY = .7;
                card.x = _cardWrap.width - 4;

                if (_cardWrap.width == 0) {
                    card.x = 0;
                }

                if (_sp.type == 1) {
                    if (__data[j] != this._currCardThrow.vCardID.value) {
                        _sp.cards.push(__data[j]);
                    }
                }
                _cardWrap.addChild(card);
            }
            _bg = createShp(_cardWrap.width, _cardWrap.height);
            _sp.addChild(_bg);

            _cardWrap.x = 5;
            _cardWrap.y = 5;

            _sp.addChild(_cardWrap);

            _sp.x = this._cardMingTips.width;
            if (this._cardMingTips.numChildren) {
                _sp.x = this._cardMingTips.width + 10;
            }
            this._cardMingTips.addChild(_sp);

            _sp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.doSelectedCardTips, this);
        }

        this._cardMingTips.x = LayerManager.stage.stageWidth - 160 - this._cardMingTips.width;
        this._cardMingTips.y = LayerManager.stage.stageHeight - 180;

        var cancelBtn: SQ.Button = new SQ.Button("game.cardMing_cancel_1", "game.cardMing_cancel_2", "game.cardMing_cancel_3");
        this._cardMingTips.addChild(cancelBtn);
        cancelBtn.x = this._cardMingTips.width;
        cancelBtn.y = this._cardMingTips.height * .5 - cancelBtn.height * .5;
        cancelBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.cancelHandler, this);

        this.addChild(this._cardMingTips);
    }

    private soreMingTipsCard(a: number, b: number = 0): number {
        var pxnum: number = CardData.getCardIndex(a) > CardData.getCardIndex(b) ? 1 : -1;
        return pxnum;
    }


    private cancelHandler(e: egret.TouchEvent): void {
        e.currentTarget.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.cancelHandler, this)
        //多个杠
        if (this.manager.actChairNo == this.manager.nChairNo) {
            this.clearCardMingTip();
            this.manager.isAllowDaChu = true;
        }
        else {
            this.resetTimeDown();
            this.clearCardMingTip();

            if (!this._currCardThrow) return;
            this.sendGuo(this._currCardThrow.vCardID.value);
        }
    }


    private doSelectedCardTips(e: egret.TouchEvent): void {
        var _sp: CardMingTipContainer = <CardMingTipContainer>(e.currentTarget);
        var cards: Array<any> = _sp.cards;
        var _type: number = _sp.type;

        if (_type == 1) {
            this.sendChiHandler(cards);
        }
        else if (_type == 2) {
            this.sendAnGang(cards);
        }
        else if (_type == 3) {
            this.sendPnGang(cards);
        }
        this.clearCardMingTip();
    }

    private overSelectingCardTips(e: egret.TouchEvent): void {
        //var _sp:CardMingTipContainer = <CardMingTipContainer>(e.currentTarget);
        //var cards:Array<any> = _sp.cards;
        //
        //for (var i:number = 0; i < cards.length; i++) {
        //    this._ownerPlayerView.cardUp(cards[i]);
        //}
    }

    private outSelectingCardTips(e: egret.TouchEvent): void {
        //var _sp:CardMingTipContainer = <CardMingTipContainer>(e.currentTarget);
        //var cards:Array<any> = _sp.cards;
        //
        //for (var i:number = 0; i < cards.length; i++) {
        //    this._ownerPlayerView.cardDown(cards[i]);
        //}
    }

    /**
     *过牌
     * @param e
     *
     */
    private playerGuoHandler(e: egret.TouchEvent = null): void {
        var sendData: egret.ByteArray;
        this.resetMcCardControl();
        var cardId: number = -1;
        if (this._currCardThrow) {
            cardId = this._currCardThrow.vCardID.value;
        }

        //开局非庄家补花
        if (cardId == -1 && this._currCardThrow == null && GameStatus.isGameBuHua()) {
            this.sendHuaOver();
        }
        //开局庄家先摸牌，然后补花
        else if ((this._currCardThrow.dwFlags.value & Global.MJ_HUA) == Global.MJ_HUA) {
            this.sendHuaOver();
        }
        else {
            this.sendGuo(cardId);
        }
    }

    private clickYsHandler(e: MouseEvent): void {
        var sendData: egret.ByteArray = new egret.ByteArray();
        sendData.endian = egret.Endian.LITTLE_ENDIAN;
        sendData.writeInt(this.manager.firstPerson);

        SQGameServer.getInstance().sendCmd(Global.LSR_DELAY_TIME, sendData);
    }

    private _tempArr: Array<any>;

    /**
     *发牌完成
     *
     */
    private see_dealCarded(): void {
        GameStatus.status = GameStatus.STATUS_GAME_BUHUA;
        this.initTimeDown();

        if (WGManager.getInstance().isWgIng()) {
            this._topPlayerView.sortHand();
            this._topPlayerView.resetDrawCard();
            this._leftPlayerView.sortHand();
            this._leftPlayerView.resetDrawCard();
            this._rightPlayerView.sortHand();
            this._rightPlayerView.resetDrawCard();
        }

        this._ownerPlayerView.toLieBack();
        this._ownerPlayerView.sortHand();

        var self = this;
        this.manager.tempTimer = egret.setTimeout(function () {
            self._ownerPlayerView.resetDrawCard();
            this.initTaskByPipe();
        }, this, 500);
    }

    public showBg(): void {
        //			if(!this._deskBg){
        //				this._deskBg = new UI_DeskBg();
        //				this.addChild(this._deskBg);
        //			}
    }


    public playerDaChu(): void {
        //if (this._mcCardControl && this._mcCardControl.visible) {
        //    this.resetMcCardControl();
        //}
        this.resetTimeDown();
        egret.clearTimeout(this._autoTimer);
    }

    private noChiButton: SQ.CheckBox;
    private noPengButton: SQ.CheckBox;
    private noGangButton: SQ.CheckBox;
    private autoMdButton: SQ.CheckBox;
    private autoBhButton: SQ.CheckBox;
    private onlyZmButton: SQ.CheckBox;

    private isShowPlayerHand: SQ.CheckBox;
    private isShowCardMount: SQ.CheckBox;

    private initBottomLine(): void {
        if (this._bottomLine) return;
        this._bottomLine = new egret.DisplayObjectContainer();
        var _bg = GUIFactory.getInstance().createBottomLine();
        this._bottomLine.addChild(_bg);
        this.addChild(this._bottomLine);

        this._bottomLine.y = LayerManager.stage.stageHeight - this._bottomLine.height;

        var basePosition = 510;
        if (!WGManager.getInstance().isWgIng()) {
            this.noChiButton = new SQ.CheckBox("不吃", "game.checkbox_1", "game.checkbox_2", "game.checkbox_3");
            this.noPengButton = new SQ.CheckBox("不碰", "game.checkbox_1", "game.checkbox_2", "game.checkbox_3");
            this.noGangButton = new SQ.CheckBox("不杠", "game.checkbox_1", "game.checkbox_2", "game.checkbox_3");
            this.autoMdButton = new SQ.CheckBox("自动摸打", "game.checkbox_1", "game.checkbox_2", "game.checkbox_3");
            this.autoBhButton = new SQ.CheckBox("自动补花", "game.checkbox_1", "game.checkbox_2", "game.checkbox_3");
            this.onlyZmButton = new SQ.CheckBox("只和自摸", "game.checkbox_1", "game.checkbox_2", "game.checkbox_3");

            this._bottomLine.addChild(this.noChiButton);
            this._bottomLine.addChild(this.noPengButton);
            this._bottomLine.addChild(this.noGangButton);
            this._bottomLine.addChild(this.autoMdButton);
            this._bottomLine.addChild(this.autoBhButton);
            this._bottomLine.addChild(this.onlyZmButton);

            this.noChiButton.x = LayerManager.stage.stageWidth;
            this.noChiButton.y = 14;
            this.noPengButton.x = LayerManager.stage.stageWidth;
            this.noPengButton.y = 14;
            this.noGangButton.x = LayerManager.stage.stageWidth;
            this.noGangButton.y = 14;
            this.autoMdButton.x = LayerManager.stage.stageWidth;
            this.autoMdButton.y = 14;
            this.autoBhButton.x = LayerManager.stage.stageWidth;
            this.autoBhButton.y = 14;
            this.onlyZmButton.x = LayerManager.stage.stageWidth;
            this.onlyZmButton.y = 14;
            //
            //
            this.noChiButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onNoChiHandler, this);
            this.noPengButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onNoPengHandler, this);
            this.noGangButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onNoGangHandler, this);
            this.autoMdButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAutoMdHandler, this);
            this.autoBhButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAutoBhHandler, this);
            this.onlyZmButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onOnlyZmHandler, this);

            this.showMenuIcon(this.noChiButton, basePosition);
            this.showMenuIcon(this.noPengButton, basePosition + 60);
            this.showMenuIcon(this.noGangButton, basePosition + 125);
            this.showMenuIcon(this.autoMdButton, basePosition + 195);
            this.showMenuIcon(this.autoBhButton, basePosition + 280);
            this.showMenuIcon(this.onlyZmButton, basePosition + 363);
        } else {
            this.isShowPlayerHand = new SQ.CheckBox("显示手牌", "game.checkbox_1", "game.checkbox_2", "game.checkbox_3");
            this.isShowPlayerHand.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowPlayerHand, this);
            this.isShowPlayerHand.x = LayerManager.stage.stageWidth - this.isShowPlayerHand.width;
            this.isShowPlayerHand.y = 14;

            this.isShowCardMount = new SQ.CheckBox("显示牌山", "game.checkbox_1", "game.checkbox_2", "game.checkbox_3");
            this.isShowCardMount.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowMountHand, this);
            this.isShowCardMount.x = this.isShowPlayerHand.x - this.isShowCardMount.width - 10;
            this.isShowCardMount.y = 14;

            this._bottomLine.addChild(this.isShowPlayerHand);
            this._bottomLine.addChild(this.isShowCardMount);
        }
    }

    private initBottomControl(): void {
        if (!WGManager.getInstance().isWgIng()) {
            this.noChiButton.setSelect(this.manager.isNoChi);
            this.noPengButton.setSelect(this.manager.isNoPeng);
            this.noGangButton.setSelect(this.manager.isNoGang);
            this.autoMdButton.setSelect(this.manager.isAutoMD);
            this.autoBhButton.setSelect(this.manager.isAutoBH);
            this.onlyZmButton.setSelect(this.manager.isOnlyHuZimo);
        } else {
            this.isShowPlayerHand.setSelect(WGManager.getInstance().isShowOtherCardHand);
            this.isShowCardMount.setSelect(WGManager.getInstance().isShowCardMount);
        }
    }

    private showMenuIcon(icon: SQ.CheckBox, targetX: number, nextFunc: Function = null): void {
        TweenMax.to(icon, .5, {
            x: targetX, onComplete: function (): void {
                nextFunc && nextFunc();
            }, ease: Back.easeOut
        });
    }

    private onNoChiHandler(): void {
        this.manager.isNoChi = this.noChiButton.isSelect
    }

    private onNoPengHandler(): void {
        this.manager.isNoPeng = this.noPengButton.isSelect
    }

    private onNoGangHandler(): void {
        this.manager.isNoGang = this.noGangButton.isSelect
    }

    private onAutoMdHandler(): void {
        this.manager.isAutoMD = this.autoMdButton.isSelect;

        if (!this.manager.isAutoMD) {
            this.manager.timeDownCount = 0;
        }
    }

    private onAutoBhHandler(): void {
        this.manager.isAutoBH = this.autoBhButton.isSelect
    }

    private onOnlyZmHandler(): void {
        this.manager.isOnlyHuZimo = this.onlyZmButton.isSelect
    }

    private onShowPlayerHand(): void {
        var isOpen: boolean = WGManager.getInstance().isShowOtherCardHand = this.isShowPlayerHand.isSelect;

        this._topPlayerView.isOpen = isOpen;
        this._leftPlayerView.isOpen = isOpen;
        this._rightPlayerView.isOpen = isOpen;
        this._ownerPlayerView.isOpen = isOpen;

        this._topPlayerView.resetDrawCard();
        this._leftPlayerView.resetDrawCard();
        this._rightPlayerView.resetDrawCard();
        this._ownerPlayerView.resetDrawCard();
    }

    private onShowMountHand(): void {
        WGManager.getInstance().isShowCardMount = this.isShowCardMount.isSelect;

        var _b = WGManager.getInstance().isShowCardMount;
        this.topDoorLineView.chooseStyle(_b);
        this.rightDoorLineView.chooseStyle(_b);
        this.bottomDoorLineView.chooseStyle(_b);
        this.leftDoorLineView.chooseStyle(_b);
    }

    //清空桌子
    public clearEmpty(): void {
        this.changeViewRepeat = 0;

        if (this.startWaitTimer) {
            this.startWaitTimer.removeEventListener(egret.TimerEvent.TIMER, this.startWaitTimeDown, this);
            this.startWaitTimer.stop();
            this.startWaitTimer = null;
        }

        if (this._txtSurplusCard) {
            DisplayObjectUtil.removeForParent(this._txtSurplusCard);
            this._txtSurplusCard = null;
        }


        if (this.exChangePanel) {
            DisplayObjectUtil.removeForParent(this.exChangePanel);
            this.exChangePanel = null;
        }

        GameStatus.reset();
        this.manager.reset();

        if (this.moveCardItem) {
            DisplayObjectUtil.removeForParent(this.moveCardItem);
            this.moveCardItem = null;
        }

        if (this.resultPanel) {
            this.resultPanel.destroy();
            DisplayObjectUtil.removeForParent(this.resultPanel);
            this.resultPanel = null;
        }

        if (this._TimeDown != null) {
            this._curTiemDown = 0;
            this._TimeDown.removeEventListener(egret.TimerEvent.TIMER, this.drawTimeDownHandler, this);
            this._TimeDown = null;
        }

        egret.clearTimeout(this._autoTimer);
        PlayerManager.clearPlayerData();

        if (this._cuoHuTimerArr) {
            for (var i: number = 0; i < this._cuoHuTimerArr.length; i++) {
                if (this._cuoHuTimerArr[i] > 0) {
                    egret.clearTimeout(this._cuoHuTimerArr[i]);
                }
            }
        }

        if (this.tempDisplayArr) {
            for (var i: number = 0; i < this.tempDisplayArr.length; i++) {
                DisplayObjectUtil.removeAllChild(this.tempDisplayArr[i]);
                DisplayObjectUtil.removeForParent(this.tempDisplayArr[i]);
            }
            this.tempDisplayArr = null;
        }

        if (this._timeDownSp) {
            DisplayObjectUtil.removeForParent(this._timeDownSp);
            this._timeDownSp = null;
        }

        if (this._mcCardControl) {
            DisplayObjectUtil.removeForParent(this._mcCardControl);
            this._mcCardControl = null;
        }

        this.clearPoolContainer();

        if (this._preCardPool) {
            DisplayObjectUtil.removeAllChild(this._preCardPool);
            DisplayObjectUtil.removeForParent(this._preCardPool);
            this._preCardPool = null;
        }

        if (this._tempArr) {
            this._tempArr = null;
        }

        if (this._filterMarry) {
            this._filterMarry = null;
        }
        if (this._ownerPlayerView != null) {
            this._ownerPlayerView.destroy();
            DisplayObjectUtil.removeAllChild(this._ownerPlayerView);
            DisplayObjectUtil.removeForParent(this._ownerPlayerView);
            this._ownerPlayerView = null;
        }
        if (this._topPlayerView) {
            this._topPlayerView.destroy();
            DisplayObjectUtil.removeAllChild(this._topPlayerView);
            DisplayObjectUtil.removeForParent(this._topPlayerView);
            this._topPlayerView = null;
        }
        if (this._leftPlayerView) {
            this._leftPlayerView.destroy();
            DisplayObjectUtil.removeAllChild(this._leftPlayerView);
            DisplayObjectUtil.removeForParent(this._leftPlayerView);
            this._leftPlayerView = null;
        }
        if (this._rightPlayerView) {
            this._rightPlayerView.destroy();
            DisplayObjectUtil.removeAllChild(this._rightPlayerView);
            DisplayObjectUtil.removeForParent(this._rightPlayerView);
            this._rightPlayerView = null;
        }

        if (this.upUserPanel) {
            this.upUserPanel.destroy();
            DisplayObjectUtil.removeAllChild(this.upUserPanel);
            DisplayObjectUtil.removeForParent(this.upUserPanel);
            this.upUserPanel = null;
        }
        if (this.downUserPanel) {
            this.downUserPanel.destroy();
            DisplayObjectUtil.removeAllChild(this.downUserPanel);
            DisplayObjectUtil.removeForParent(this.downUserPanel);
            this.downUserPanel = null;
        }
        if (this.leftUserPanel) {
            this.leftUserPanel.destroy();
            DisplayObjectUtil.removeAllChild(this.leftUserPanel);
            DisplayObjectUtil.removeForParent(this.leftUserPanel);
            this.leftUserPanel = null;
        }
        if (this.rightUserPanel) {
            this.rightUserPanel.destroy();
            DisplayObjectUtil.removeAllChild(this.rightUserPanel);
            DisplayObjectUtil.removeForParent(this.rightUserPanel);
            this.rightUserPanel = null;
        }
        if (this.topDoorLineView) {
            this.topDoorLineView.destroy();
            DisplayObjectUtil.removeAllChild(this.topDoorLineView);
            DisplayObjectUtil.removeForParent(this.topDoorLineView);
            this.topDoorLineView = null;
        }
        if (this.leftDoorLineView) {
            this.leftDoorLineView.destroy();
            DisplayObjectUtil.removeAllChild(this.leftDoorLineView);
            DisplayObjectUtil.removeForParent(this.leftDoorLineView);
            this.leftDoorLineView = null;
        }
        if (this.rightDoorLineView) {
            this.rightDoorLineView.destroy();
            DisplayObjectUtil.removeAllChild(this.rightDoorLineView);
            DisplayObjectUtil.removeForParent(this.rightDoorLineView);
            this.rightDoorLineView = null;
        }
        if (this.bottomDoorLineView) {
            this.bottomDoorLineView.destroy();
            DisplayObjectUtil.removeAllChild(this.bottomDoorLineView);
            DisplayObjectUtil.removeForParent(this.bottomDoorLineView);
            this.bottomDoorLineView = null;
        }

        if (this._cardMingTips) {
            DisplayObjectUtil.removeAllChild(this._cardMingTips);
            DisplayObjectUtil.removeForParent(this._cardMingTips);
            this._cardMingTips = null;
        }
        if (this._currCardThrow) {
            this._currCardThrow = null;
        }

        if (this._leftDirWind) {
            DisplayObjectUtil.removeForParent(this._leftDirWind);
            this._leftDirWind = null;
        }
        if (this._rightDirWind) {
            DisplayObjectUtil.removeForParent(this._rightDirWind);
            this._rightDirWind = null;
        }
        if (this._upDirWind) {
            DisplayObjectUtil.removeForParent(this._upDirWind);
            this._upDirWind = null;
        }
        if (this._downDirWind) {
            DisplayObjectUtil.removeForParent(this._downDirWind);
            this._downDirWind = null;
        }

        if (this.curWindLoopSpr) {
            DisplayObjectUtil.removeForParent(this.curWindLoopSpr);
            this.curWindLoopSpr = null;
        }

        if (this.upPlayerScore) {
            DisplayObjectUtil.removeForParent(this.upPlayerScore);
            this.upPlayerScore = null;
        }

        if (this.rightPlayerScore) {
            DisplayObjectUtil.removeForParent(this.rightPlayerScore);
            this.rightPlayerScore = null;
        }

        if (this.downPlayerScore) {
            DisplayObjectUtil.removeForParent(this.downPlayerScore);
            this.downPlayerScore = null;
        }

        if (this.leftPlayerScore) {
            DisplayObjectUtil.removeForParent(this.leftPlayerScore);
            this.leftPlayerScore = null;
        }

        if (this.curHighlight_1) {
            this.curHighlight_1.visible = false;
        }
        if (this.curHighlight_2) {
            this.curHighlight_2.visible = false;
        }
        if (this.curHighlight_3) {
            this.curHighlight_3.visible = false;
        }
        if (this.curHighlight_4) {
            this.curHighlight_4.visible = false;
        }
    }

    public destroy(): void {
        this.clearEmpty();

        if (this.curHighlight_1) {
            DisplayObjectUtil.removeForParent(this.curHighlight_1);
            this.curHighlight_1 = null;
        }
        if (this.curHighlight_2) {
            DisplayObjectUtil.removeForParent(this.curHighlight_2);
            this.curHighlight_2 = null;
        }
        if (this.curHighlight_3) {
            DisplayObjectUtil.removeForParent(this.curHighlight_3);
            this.curHighlight_3 = null;
        }
        if (this.curHighlight_4) {
            DisplayObjectUtil.removeForParent(this.curHighlight_4);
            this.curHighlight_4 = null;
        }

        if (this.windVane) {
            DisplayObjectUtil.removeAllChild(this.windVane);
            DisplayObjectUtil.removeForParent(this.windVane);
            this.windVane = null;
        }

        if (this.windLayer) {
            DisplayObjectUtil.removeForParent(this.windLayer);
            this.windLayer = null;
        }

        if (this._bottomLine) {
            DisplayObjectUtil.removeAllChild(this._bottomLine);
            DisplayObjectUtil.removeForParent(this._bottomLine);
            this._bottomLine = null;
        }

        if (this._deskBg) {
            DisplayObjectUtil.removeForParent(this._deskBg);
            this._deskBg = null;
        }
    }
}