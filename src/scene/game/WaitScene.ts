/**
 * Created by seethinks@gmail.com on 2016/8/25.
 */
class WaitScene extends SceneBase {
    private _bg: egret.Bitmap;
    private _backBtn: EButton;
    public resGroup: string = "waitScene";

    public isHaiXuan: boolean = false;

    private _infoPanel: egret.DisplayObjectContainer;
    private _infoTxt: egret.TextField;

    private _cGamePlayerData: Array<CGamePlayerData>;

    public constructor() {
        super();
    }

    public setup(): void {
    }

    public initial(): void {
        this.isHaiXuan = GlobalVar.CurMatchInfo["isHaiXuan"];

        this.initBg();
        this.drawInfoPanel();

        if (this.isHaiXuan) {
            this.drawSelfHead();
            SocketEvent.addEventListener(Global.GBMJR_BROADCAST_PLAYERCOUNT.toString(), this.upDatePlayerCount, this);
        } else {
            if (WGManager.getInstance().isCompereIng) {
                this.drawSelfHead();
            } else {
                this.drawSelfHead();
            }
        }
    }

    private initPlayers(): void {
        var deskBg = new egret.Bitmap();
        deskBg.texture = RES.getRes("common.desk");
        this.addChild(deskBg);

        deskBg.x = LayerManager.stage.stageWidth * .5 - deskBg.width * .5;
        deskBg.y = LayerManager.stage.stageHeight * .5 - deskBg.height * .5;

        var manager = DeskManager.getInstance();

        for (var i = 0; i < manager.playerArr.length; i++) {
            var _playerData = manager.playerArr[i];
            var userHead = new UserHead();
            userHead.userId = _playerData.UserInfo.nUserID.value;
            userHead.levelId = _playerData.StatData.nLevelID.value;
            userHead.fourAnimalLabel = _playerData.StatData.nFourBeast.value;
            userHead.draw();
            this.addChild(userHead);

            switch (i) {
                case 0:
                    userHead.x = deskBg.x + deskBg.width + 10;
                    userHead.y = LayerManager.stage.stageHeight * .5 - userHead.height * .5;
                    break;
                case 1:
                    userHead.x = LayerManager.stage.stageWidth * .5 - userHead.width * .5;
                    userHead.y = deskBg.y - 10 - userHead.height;
                    break;
                case 2:
                    userHead.x = deskBg.x - deskBg.width - 10;
                    userHead.y = LayerManager.stage.stageHeight * .5 - userHead.height * .5;
                    break;
                case 3:
                    userHead.x = LayerManager.stage.stageWidth * .5 - userHead.width * .5;
                    userHead.y = deskBg.y + 10 + deskBg.height;
                    break;
            }

            if (userHead.getAnimalLabel() == 0) {
                userHead.x -= 12;
                userHead.y -= 15;
            } else if (userHead.getAnimalLabel() == 4) {
                userHead.x -= 10;
            }

            switch (i) {
                case 0:
                    userHead.x += 100;
                    break;
                case 1:
                    userHead.y -= 100;
                    break;
                case 2:
                    userHead.x -= 100;
                    break;
                case 3:
                    userHead.y += 100;
                    break;
            }

            (function (index) {
                var o = new Object();
                o["x"] = userHead.x;
                o["y"] = userHead.y;
                o["ease"] = Back.easeInOut;

                switch (index) {
                    case 0:
                        o["x"] -= 100;
                        break;
                    case 1:
                        o["y"] += 100;
                        break;
                    case 2:
                        o["x"] += 100;
                        break;
                    case 3:
                        o["y"] -= 100;
                        break;
                }

                TweenMax.to(userHead, .6, o);
            })(i);
        }
    }

    /**
     * 更新房间最新的人数信息
     */
    private upDatePlayerCount(e: SocketEvent = null): void {
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            b.position = 0;
            b.endian = egret.Endian.LITTLE_ENDIAN;
            if (b.bytesAvailable) {
                var ttt: number = b.readInt();
                while (b.bytesAvailable)   // 两个int，一个roomid，一个人数
                {
                    var roomid: number = b.readInt();
                    var count: number = b.readInt();
                    var i: number = 0;
                    if (GlobalVar.CurMatchInfo["roomId"] == roomid) {
                        if (this.isHaiXuan) {
                            this._infoTxt.text = count + " 名玩家正在参赛，等待配桌中..."
                        } else {
                            this._infoTxt.text = "距离比赛开始还有"
                        }
                    }
                }
            }
        }
    }

    private timeDown: number = 0;
    private timer: egret.Timer;

    private drawInfoPanel(): void {
        if (this._infoPanel == null) {
            this._infoPanel = new egret.DisplayObjectContainer();
            this.addChild(this._infoPanel)
        }
        // var bg: egret.Bitmap = new egret.Bitmap();
        // if (this.isHaiXuan) {
        //     bg.texture = RES.getRes("match.haixuan");
        // } else {
        //     bg.texture = RES.getRes("match.hongdi");
        // }
        // this._infoPanel.addChild(bg);

        if (this._infoTxt == null) {
            this._infoTxt = new egret.TextField();
            if (this.isHaiXuan) {
                this._infoTxt.text = GlobalVar.CurMatchInfo["playerCount"] + " 名玩家正在参赛，游戏配桌中请稍等..."
            } else {
                if (WGManager.getInstance().isCompereIng) {
                    this._infoTxt.text = "游戏等待中，请稍等！";
                } else {
                    if (DeskManager.getInstance().waitIngDJS) {
                        this.timeDown = Math.ceil(DeskManager.getInstance().waitIngDJS / 1000);
                    }

                    this.setTimeTxt();

                    if (this.timeDown > 0) {
                        this.timer = new egret.Timer(1000);
                        this.timer.addEventListener(egret.TimerEvent.TIMER, this.timerHandler, this);
                        this.timer.start();
                    }
                }
            }

            this._infoTxt.size = UIAdapter.getInstance().isPC ? 16 : 24;
            this._infoTxt.width = this._infoTxt.textWidth + 5;
            this._infoTxt.y = 5;
            this._infoTxt.textAlign = "center";
            this._infoPanel.addChild(this._infoTxt);
        }

        this._infoPanel.x = LayerManager.stage.stageWidth * .5 - this._infoPanel.width * .5;
        this._infoPanel.y = LayerManager.stage.stageHeight - 150;

        if (this.isHaiXuan || WGManager.getInstance().isCompereIng) {
            this._infoPanel.y = LayerManager.stage.stageHeight - 250;
        }
    }

    private setTimeTxt(): void {
        var _value: string = this.timeDown > 9 ? this.timeDown + "" : "0" + this.timeDown;

        this._infoTxt.textFlow = (new egret.HtmlTextParser).parser(
            '距离游戏开始大约还有 ' +
            '<font color="#ff0000">' + _value + '</font>' +
            ' 秒'
        );
    }

    private timerHandler(e: Event): void {
        this.timeDown -= 1;
        if (this.timeDown < 0) {
            this.timer.stop();
            this.timer.removeEventListener(egret.TimerEvent.TIMER, this.timerHandler, this);
            this.timer = null;
            return;
        }
        this.setTimeTxt();
    }

    private drawSelfHead(): void {
        var userFourAnimalIcon: egret.DisplayObjectContainer = GUIFactory.getInstance().createUserPeronPanel(SystemCenter.playSystem.selfPlayerInfo.levelID,
            SystemCenter.playSystem.selfPlayerInfo.fourAnimalLabel, SystemCenter.playSystem.selfPlayerInfo.userID, SystemCenter.playSystem.selfPlayerInfo.playerName);

        this.addChild(userFourAnimalIcon);

        userFourAnimalIcon.x = LayerManager.stage.stageWidth * .5 - userFourAnimalIcon.width * .5;
        userFourAnimalIcon.y = 0;

        TweenMax.to(userFourAnimalIcon, .6, {
            y: LayerManager.stage.stageHeight * .5 - userFourAnimalIcon.height * .5,
            ease: Back.easeInOut
        });
    }

    public uninstall(): void {
        this.destroy();
    }

    private initBg(): void {
        this._bg = new egret.Bitmap();
        this._bg.texture = RES.getRes("loadingBg");
        this.addChild(this._bg);

        this._backBtn = GUIFactory.getInstance().createBackBtn2();
        this._backBtn.x = LayerManager.stage.stageWidth - this._backBtn.width;
        this._backBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBackHandler, this);
        this._backBtn.y = -this._backBtn.height;
        this.addChild(this._backBtn);

        TweenMax.to(this._backBtn, .5, {
            y: 0, ease: Cubic.easeInOut
        });
    }

    private onBackHandler(e: egret.TouchEvent): void {
        if (this.isHaiXuan) {
            SocketEvent.addEventListener(Global.GBMJR_MATCHNEW_LEAVEROOM.toString(), this.leaveSceneHandler, this);
            var sendData: egret.ByteArray = new egret.ByteArray();
            var cameLeaveRoom: CGameLeaveRoom = new CGameLeaveRoom();
            cameLeaveRoom.nUserID.value = SystemCenter.playSystem.selfPlayerInfo.userID;
            cameLeaveRoom.nRoomID.value = SystemCenter.playSystem.selfPlayerInfo.MatchRoomId;
            CSerializable.Serialization(cameLeaveRoom, sendData);
            SQGameServer.getInstance().sendCmd(Global.GBMJR_MATCHNEW_LEAVEROOM, sendData);
            LoadingManager.showLoading();
        } else {
            SceneManagerExt.goMatchScene();
        }

    }

    private leaveSceneHandler(e: SocketEvent): void {
        LoadingManager.hideLoading();
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        SocketEvent.removeEventListener(Global.GBMJR_MATCHNEW_LEAVEROOM.toString(), this.leaveSceneHandler, this);
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            SceneManagerExt.goMatchScene();
        }
    }

    public destroy(): void {
        if (this._bg) {
            DisplayObjectUtil.removeForParent(this._bg);
            this._bg = null;
        }
        if (this._backBtn) {
            this._backBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBackHandler, this);
            DisplayObjectUtil.removeForParent(this._backBtn);
            this._backBtn = null;
        }
        if (this._infoPanel) {
            DisplayObjectUtil.removeForParent(this._infoPanel);
            this._infoPanel = null;
        }
        if (this._cGamePlayerData) {
            DisplayObjectUtil.removeForParent(this._cGamePlayerData);
            this._cGamePlayerData = null;
        }
    }
}