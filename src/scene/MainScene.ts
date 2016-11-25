/**
 * Created by stylehuan on 2016/7/21.
 */
class MainScene extends SceneBase {
    public constructor() {
        super();
    }

    public resGroup: string = "mainScene";

    private _bg: egret.Bitmap;
    private _leagueSprite: egret.Sprite;
    private _leftNeon: egret.Bitmap;
    private _rightNeon: egret.Bitmap;

    private _friendContainer: egret.Sprite;
    private _friendBg: egret.Bitmap;
    private _friendLeftDoor: egret.Bitmap;
    private _friendRightDoor: egret.Bitmap;

    public initial(): void {
        console.log("main initial");
        this.initLeagueIcon();
        this.initLeftNeon();
        this.initRightNeon();
        this.initFriend();
        this.initBg();
        this.initUserPanel();
        this.initMenuPanel();
    }

    private initBg(): void {
        this._bg = new egret.Bitmap();
        this._bg.texture = RES.getRes("main_bg.png");
        this.addChild(this._bg);
    }

    private initLeagueIcon(): void {
        var _Icon = new egret.Bitmap();
        _Icon.texture = RES.getRes("mainSprite.league_icon");
        _Icon.x = -_Icon.width * .5;
        _Icon.y = -_Icon.height * .5;

        this._leagueSprite = new egret.Sprite();
        this._leagueSprite.x = 425 + _Icon.width * .5;
        this._leagueSprite.y = 205 + _Icon.height * .5;
        this._leagueSprite.touchEnabled = true;
        this._leagueSprite.addChild(_Icon);
        this.addChild(this._leagueSprite);

        TweenMax.to(this._leagueSprite, 3, {
            rotation: 360, repeat: -1,
            ease: Linear.easeNone
        });

//        this.buleStar = ParticleFactory.getInstance().createStarBlue();
//        LayerManager.TopLayer.addChild(this.buleStar);
//
//        this.buleStarTimer=new egret.Timer(20);
//        this.buleStarTimer.addEventListener(egret.TimerEvent.TIMER,this.timerHandler,this);
//        this.buleStarTimer.start()

        //this._leagueSprite.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.onOverLeagueDoor, this);
        //this._leagueSprite.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.onOutLeagueDoor, this);
        this._leagueSprite.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchLeagueDoorTap, this);

    }

//    private angle:number=0;
//    private buleStarTimer:egret.Timer;
//    private  buleStar:particle.ParticleSystem;
//    private timerHandler(event:egret.TimerEvent):void{
//        this.angle+=3;
//        this.buleStar.emitterX=476+Math.sin(this.angle/180*Math.PI)*50;
//        this.buleStar.emitterY=270-Math.cos(this.angle/180*Math.PI)*50;
//    }

    private onTouchLeagueDoorTap(e: egret.TouchEvent): void {
        // this.doSceneId = 16;

        PopUpManager.alert("提示", "敬请期待");

        return;
        SceneManagerExt.goMatchScene();
    }

    private leagueSlow(): void {

    }

    private doSceneId: number;

    private entryScene(): void {
        SocketEvent.addEventListener(Global.LSR_ENTER_SCENE.toString(), this.enterLevelSceneHandler, this);

        var sendData: egret.ByteArray = new egret.ByteArray();
        var cEnterLSScene: LS_ENTER_SCENE = new LS_ENTER_SCENE();
        cEnterLSScene.nUserID.value = SystemCenter.playSystem.selfPlayerInfo.userID;
        cEnterLSScene.nScene.value = this.doSceneId;
        CSerializable.Serialization(cEnterLSScene, sendData);
        SQGameServer.getInstance().sendCmd(Global.LSR_ENTER_SCENE, sendData);
        LoadingManager.showLoading();
    }

    private enterLevelSceneHandler(e: SocketEvent): void {
        LoadingManager.hideLoading();
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        SocketEvent.removeEventListener(Global.LSR_ENTER_SCENE.toString(), this.enterLevelSceneHandler, this);
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            SystemCenter.playSystem.selfPlayerInfo.gameStatus = (SystemCenter.playSystem.selfPlayerInfo.gameStatus | Global.LSPLAYER_STATUS_INSCENE);
            SystemCenter.playSystem.selfPlayerInfo.GameData.nScene.value = this.doSceneId;

            if (this.doSceneId == Global.LSSCENE_FRIEND) {
                SceneManagerExt.goFriendScene();
            } else if (this.doSceneId == Global.LS_SCENE_MATCH) {

            } else if (this.doSceneId == Global.LS_SCENE_MATCH_NEW) {
                SceneManagerExt.goMatchScene();
            }

        }
        else {
        }
    }


    private _userPanel: egret.Sprite;
    //private _menuPanel:egret.Sprite;

    private initUserPanel(): void {
        this._userPanel = new egret.Sprite();

        this._userPanel.x = 0;
        this.addChild(this._userPanel);

        var _bg: egret.Bitmap = new egret.Bitmap();
        _bg.texture = RES.getRes("mainSprite.head_bg");
        this._userPanel.addChild(_bg);
        this._userPanel.touchEnabled = true;

        var _userText: egret.TextField = DisplayObjectUtil.createTextFile(SystemCenter.playSystem.selfPlayerInfo.playerName, 0xfffdf1, 16, 0x5B096F, true, 2);
        _userText.width = 210;
        _userText.textAlign = "left";
        _userText.x = 50;
        _userText.y = 10;
        this._userPanel.addChild(_userText);

        var userHead = new UserHead();
        userHead.userId = SystemCenter.playSystem.selfPlayerInfo.userID;
        userHead.levelId = SystemCenter.playSystem.selfPlayerInfo.gameUserInfo.nLevelID.value;
        userHead.fourAnimalLabel = SystemCenter.playSystem.selfPlayerInfo.fourAnimalLabel;
        userHead.draw();
        this._userPanel.addChild(userHead);
        userHead.x = -45;
        userHead.y = -5;

        if (UIAdapter.getInstance().isPC) {
            console.log("打开个人中心网页")
        } else {

        }
        if (GlobalVar.isDebug) {
            TipsSprTapManager.addTips(this._userPanel, GUIFactory.getInstance().createUserDataInfo(SystemCenter.playSystem.selfPlayerInfo.gameUserInfo), 3);
        }

        var _yzText: egret.TextField = DisplayObjectUtil.createTextFile("银子", 0x7ffffa, 15, 0x000000, true, 1);

        _yzText.x = 50;
        _yzText.y = _userText.y + _userText.height + 5;
        this._userPanel.addChild(_yzText);

        var _yzBg: egret.Bitmap = new egret.Bitmap();
        _yzBg.texture = RES.getRes("mainSprite.yz_bg");
        this._userPanel.addChild(_yzBg);
        _yzBg.x = 50 + _yzText.width + 5;
        _yzBg.y = _yzText.y;

        var btn = new SQ.Button("mainSprite.pay_d", "mainSprite.pay_h", "mainSprite.pay_p");
        this._userPanel.addChild(btn);
        btn.x = _yzBg.x + _yzBg.width;
        btn.y = _yzBg.y;

        var _levelText: egret.TextField = DisplayObjectUtil.createTextFile("等级", 0x7ffffa, 15, 0x000000, true, 1);
        _levelText.x = 50;
        _levelText.y = _yzText.y + _yzText.height + 5;
        this._userPanel.addChild(_levelText);


        var _levelBg: egret.Bitmap = new egret.Bitmap();
        _levelBg.texture = RES.getRes("mainSprite.ex_bg");
        this._userPanel.addChild(_levelBg);
        _levelBg.x = 50 + _levelText.width + 5;
        _levelBg.y = _levelText.y;

        var curLevelScore = SystemCenter.playSystem.selfPlayerInfo.gameUserInfo.nLevelScore.value;
        var totleScore = LevelInfo.getLevelUpgradeScore(SystemCenter.playSystem.selfPlayerInfo.gameUserInfo.nLevelID.value);

        var _levelProgressBg: egret.Bitmap = new egret.Bitmap();
        _levelProgressBg.texture = RES.getRes("mainSprite.ex_pan");
        this._userPanel.addChild(_levelProgressBg);
        _levelProgressBg.x = _levelBg.x + 1;
        _levelProgressBg.y = _levelBg.y + 1;


        var shp = function (width, height): egret.Shape {
            var shp: egret.Shape = new egret.Shape();
            shp.graphics.lineStyle(2, 0x311b52);
            shp.graphics.moveTo(0, 0);
            shp.graphics.beginFill(0x311b52);
            shp.graphics.curveTo(height * .5, height * .5, 0, height);

            shp.graphics.curveTo(width, height, width, height);
            shp.graphics.curveTo(width + height * .5, height * .5, width, 0);

            shp.graphics.curveTo(0, 0, 0, 0);
            shp.graphics.endFill();

            return shp;
        };

        var divide = _levelProgressBg.width / 10;
        var curDivide = Math.ceil(curLevelScore / totleScore * 10);
        var _tempShp = shp(_levelProgressBg.width - curDivide * divide, 12);
        _tempShp.x = _levelProgressBg.x + _levelProgressBg.width - _tempShp.width + 4;
        _tempShp.y = _levelProgressBg.y + 2;
        this._userPanel.addChild(_tempShp);

        var _levelProgressText: egret.TextField = DisplayObjectUtil.createTextFile(curLevelScore + "/" + totleScore, 0xFFFDF1, 15, 0x000000, true, 1);
        _levelProgressText.width = _levelBg.width;
        _levelProgressText.textAlign = egret.HorizontalAlign.CENTER;
        _levelProgressText.x = _levelBg.x;
        _levelProgressText.y = _levelBg.y;
        this._userPanel.addChild(_levelProgressText);


        this._userPanel.y = LayerManager.stage.stageHeight - this._userPanel.height - 8;
        this._userPanel.x = -this._userPanel.width;
        TweenMax.to(this._userPanel, .8, {
            x: 60, ease: Back.easeOut
        });
    }

    private initMenuPanel(): void {
        //this._menuPanel = new egret.Sprite();
        //this.addChild(this._menuPanel);

        // var _rankBtn = new SQ.Button("mainSprite.rank_1", "mainSprite.rank_2", "mainSprite.rank_3");
        // this.addChild(_rankBtn);
        // _rankBtn.x = LayerManager.stage.stageWidth;
        // _rankBtn.y = LayerManager.stage.stageHeight - _rankBtn.height - 10;
        // _rankBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
        //     // _rankBtn.setDisable(false);
        // }, this);


        // var _actBtn = new SQ.Button("mainSprite.act_1", "mainSprite.act_2", "mainSprite.act_3");
        // this.addChild(_actBtn);
        // _actBtn.x = LayerManager.stage.stageWidth;
        // _actBtn.y = LayerManager.stage.stageHeight - _actBtn.height - 10;

        var _awardBtn = new SQ.Button("mainSprite.award_1", "mainSprite.award_2", "mainSprite.award_3");
        this.addChild(_awardBtn);
        _awardBtn.x = LayerManager.stage.stageWidth;
        _awardBtn.y = LayerManager.stage.stageHeight - _awardBtn.height - 10;

        _awardBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onDhBtn, this);

        var _settingBtn = new SQ.Button("mainSprite.setting_1", "mainSprite.setting_2", "mainSprite.setting_3");
        this.addChild(_settingBtn);
        _settingBtn.x = LayerManager.stage.stageWidth;
        _settingBtn.y = LayerManager.stage.stageHeight - _settingBtn.height - 10;

        _settingBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSettingBtn, this);

        //this._menuPanel.x = LayerManager.stage.stageWidth -  this._menuPanel.width - 10;
        //this._menuPanel.y = LayerManager.stage.stageHeight -  this._menuPanel.height - 10;
        //var _sourceX = LayerManager.stage.stageWidth -  this._menuPanel.width - 10;

        var _self = this;
        // this.showMenuIcon(_rankBtn, LayerManager.stage.stageWidth - 4 * 72, function () {
        // _self.showMenuIcon(_actBtn, LayerManager.stage.stageWidth - 3 * 72, function () {
        _self.showMenuIcon(_awardBtn, LayerManager.stage.stageWidth - 2 * 72, function () {
            _self.showMenuIcon(_settingBtn, LayerManager.stage.stageWidth - 1 * 72);
        });
        // });
        // });
    }

    private showMenuIcon(icon: SQ.Button, targetX: number, nextFunc: Function = null): void {
        TweenMax.to(icon, .3, {
            x: targetX, onComplete: function (): void {
                nextFunc && nextFunc();
            }, ease: Back.easeOut
        });
    }

    private initLeftNeon(): void {
        this._leftNeon = new egret.Bitmap();
        this._leftNeon.texture = RES.getRes("mainSprite.left_neon");
        this._leftNeon.x = 97;
        this._leftNeon.y = 72;
        this.addChild(this._leftNeon);
    }

    private initRightNeon(): void {
        this._rightNeon = new egret.Bitmap();
        this._rightNeon.texture = RES.getRes("mainSprite.right_neon");
        this._rightNeon.x = 645;
        this._rightNeon.y = 68;
        this.addChild(this._rightNeon);
    }

    private initFriend(): void {
        this._friendContainer = new egret.Sprite();
        this._friendContainer.x = 145;
        this._friendContainer.y = 330;
        this.addChild(this._friendContainer);


        var _friendBg = new egret.Bitmap();
        _friendBg.texture = RES.getRes("mainSprite.friend_bg");
        this._friendContainer.addChild(_friendBg);

        this._friendRightDoor = new egret.Bitmap();
        this._friendRightDoor.texture = RES.getRes("mainSprite.menyou");
        this._friendRightDoor.x = 50;
        this._friendRightDoor.y = 0;
        this._friendContainer.addChild(this._friendRightDoor);

        this._friendLeftDoor = new egret.Bitmap();
        this._friendLeftDoor.texture = RES.getRes("mainSprite.menzuo");
        this._friendLeftDoor.x = 0;
        this._friendLeftDoor.y = 0;
        this._friendContainer.addChild(this._friendLeftDoor);
        this._friendContainer.touchEnabled = true;
        this._friendContainer.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.onOverFriendDoor, this);
        this._friendContainer.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.onOutFriendDoor, this);
        this._friendContainer.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
    }

    private onTouchTap(e: egret.TouchEvent): void {
        this.doSceneId = 2;
        this.entryScene();
    }

    private onSettingBtn(e: egret.TouchEvent): void {
        SceneManager.getInstance().pushScene(SettingPanel);
    }

    private onDhBtn(e: egret.TouchEvent): void {
        SceneManager.getInstance().pushScene(ExchangePanel);
    }

    private onOverFriendDoor(e: egret.TouchEvent): void {
        TweenMax.to(this._friendLeftDoor, GlobalVar.TweenMax_Normal_Speed, {
            x: -10,
            y: 1
        });
        TweenMax.to(this._friendRightDoor, GlobalVar.TweenMax_Normal_Speed, {
            x: 65,
            y: -2
        });
    }

    private onOutFriendDoor(e: egret.TouchEvent): void {
        TweenMax.to(this._friendLeftDoor, GlobalVar.TweenMax_Normal_Speed, {
            x: 0,
            y: 0
        });
        TweenMax.to(this._friendRightDoor, GlobalVar.TweenMax_Normal_Speed, {
            x: 50,
            y: 0
        });
    }

    public setup(): void {
        console.log("main");
    }

    public uninstall(): void {
//        var self = this;
//        TweenMax.to(this, 1, {
//            alpha: 0,
//            onComplete: function ():void {
//                self.destroy();
//            }, onCompleteParams: [this], ease: Cubic.easeInOut
//        });
        TransitionManager.getInstance().doTransi(this, TransitionManager.FALL_RIGH_DOWN, true);
//        this.destroy();
    }

    public destroy(): void {
//        if (this.buleStar) {
//            DisplayObjectUtil.removeForParent(this.buleStar);
//            this.buleStar = null;
//        }
//        this.buleStarTimer.stop();
//        this.buleStarTimer.removeEventListener(egret.TimerEvent.TIMER,this.timerHandler,this);
//        this.buleStarTimer = null;
        if (this._bg) {
            DisplayObjectUtil.removeForParent(this._bg);
            this._bg = null;
        }
        if (this._leagueSprite) {
            DisplayObjectUtil.removeForParent(this._leagueSprite);
            this._leagueSprite = null;
        }
        if (this._leftNeon) {
            DisplayObjectUtil.removeForParent(this._leftNeon);
            this._leftNeon = null;
        }
        if (this._rightNeon) {
            DisplayObjectUtil.removeForParent(this._rightNeon);
            this._rightNeon = null;
        }
        if (this._friendContainer) {
            this._friendContainer.removeEventListener(mouse.MouseEvent.MOUSE_OVER, this.onOverFriendDoor, this);
            this._friendContainer.removeEventListener(mouse.MouseEvent.MOUSE_OUT, this.onOutFriendDoor, this);
            this._friendContainer.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
            DisplayObjectUtil.removeForParent(this._friendContainer);
            this._friendContainer = null;
        }
        if (this._friendBg) {
            DisplayObjectUtil.removeForParent(this._friendBg);
            this._friendBg = null;
        }
        if (this._friendLeftDoor) {
            DisplayObjectUtil.removeForParent(this._friendLeftDoor);
            this._friendLeftDoor = null;
        }
        if (this._friendRightDoor) {
            DisplayObjectUtil.removeForParent(this._friendRightDoor);
            this._friendRightDoor = null;
        }
        DisplayObjectUtil.removeForParent(this);
    }
}