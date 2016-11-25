/**
 * Created by stylehuan on 2016/7/22.
 */
class FriendScene extends SceneBase {
    public constructor() {
        super();
    }

    public resGroup: string = "friendScene";
    private _bg: egret.Bitmap;
    private _backBtn: SQ.Button;
    private _bottomLine: egret.Sprite;
    private _deskContainer: egret.Sprite;

    private _createBtn: SQ.Button;
    private _compereBtn: SQ.Button;

    private _gameRoomPanel: GameRoomPanel;
    private _liveRoomPanel: LiveRoomPanel;

    public initial(): void {
        this._bg = new egret.Bitmap();
        this._bg.texture = RES.getRes("friend_bg.png");
        this.addChild(this._bg);
        this._bg.touchEnabled = true;

        this._deskContainer = new egret.Sprite();
        this.addChild(this._deskContainer);

        this._backBtn = GUIFactory.getInstance().createBackBtn();
        this._backBtn.x = LayerManager.stage.stageWidth - this._backBtn.width;
        this._backBtn.y = -this._backBtn.height;
        this.addChild(this._backBtn);

        this._backBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBackHandler, this);

        this._bottomLine = new egret.Sprite();
        var _bg = GUIFactory.getInstance().createBottomLine();
        this._bottomLine.addChild(_bg);
        this._bottomLine.y = LayerManager.stage.stageHeight;
        this.addChild(this._bottomLine);

        this._createBtn = new SQ.Button("friend.create_btn_1", "friend.create_btn_2", "friend.create_btn_3");
        this._bottomLine.addChild(this._createBtn);
        this._createBtn.x = this._bottomLine.width - this._createBtn.width - 20;
        this._createBtn.y = 3;
        this._createBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.createTableHandler, this);

        TweenMax.to(this._bottomLine, .5, {
            y: LayerManager.stage.stageHeight - this._bottomLine.height, ease: Cubic.easeInOut
        });
        TweenMax.to(this._backBtn, .5, {
            y: 0, ease: Cubic.easeInOut
        });


        this.initGameRoom();

        if (WGManager.getInstance().isCompere) {
            this._compereBtn = new SQ.Button("friend.compere_btn_1", "friend.compere_btn_1", "friend.compere_btn_1");
            this._bottomLine.addChild(this._compereBtn);
            this._compereBtn.x = this._createBtn.x - this._compereBtn.width - 20;
            this._compereBtn.y = 3;
            this._compereBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCompereHandler, this);
        }

    }

    public setup(): void {
        console.log("entryTransition");
    }

    private onSelfHashTable(e: Event): void {
        this._createBtn.visible = e["data"];

        if (WGManager.getInstance().isCompere) {
            this._compereBtn.visible = e["data"];
        }
    }

    public uninstall(): void {
        TransitionManager.getInstance().doTransi(this, TransitionManager.FALL_RIGH_DOWN, true);
    }


    private onBackHandler(e: egret.TouchEvent): void {
        if (!this._gameRoomPanel && this._liveRoomPanel) {
            this.clearLiveRoom();
            this.initGameRoom();
            this._compereBtn.visible = true;
            this._createBtn.visible = true;
            return;
        }

        var _scene: number = SystemCenter.playSystem.selfPlayerInfo.GameData.nScene.value;
        SocketEvent.addEventListener(Global.LSR_LEAVE_SCENE.toString(), this.leaveSceneHandler, this);

        var sendData: egret.ByteArray = new egret.ByteArray();
        var cLeaveLSScene: LS_LEAVE_SCENE = new LS_LEAVE_SCENE();
        cLeaveLSScene.nUserID.value = SystemCenter.playSystem.selfPlayerInfo.userID;
        cLeaveLSScene.nScene.value = _scene;
        CSerializable.Serialization(cLeaveLSScene, sendData);
        SQGameServer.getInstance().sendCmd(Global.LSR_LEAVE_SCENE, sendData);

    }

    private leaveSceneHandler(e: SocketEvent): void {
        LoadingManager.hideLoading();
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        SocketEvent.removeEventListener(Global.LSR_LEAVE_SCENE.toString(), this.leaveSceneHandler, this);
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            MyTableData.reset();
            SceneManager.getInstance().popScene();
            SceneManager.getInstance().pushScene(MainScene, TransitionManager.FADE_IN);
        }
    }

    private createTableHandler(e: egret.TouchEvent): void {
        SceneManager.getInstance().pushScene(CreateTable);
    }

    private initLiveRoom(): void {
        if (!this._liveRoomPanel) {
            this._liveRoomPanel = new LiveRoomPanel();
            this._deskContainer.addChild(this._liveRoomPanel);
        }
    }

    private clearLiveRoom(): void {
        if (this._liveRoomPanel) {
            this._liveRoomPanel.destroy();
            this._liveRoomPanel = null;
        }
    }

    private initGameRoom(): void {
        if (!this._gameRoomPanel) {
            this._gameRoomPanel = new GameRoomPanel();
            this._deskContainer.addChild(this._gameRoomPanel);

            this._gameRoomPanel.addEventListener(MyTableData.isShowCreateBtn, this.onSelfHashTable, this);
        }
    }

    private clearGameRoom(): void {
        if (this._gameRoomPanel) {
            this._gameRoomPanel.removeEventListener(MyTableData.isShowCreateBtn, this.onSelfHashTable, this);
            this._gameRoomPanel.destroy();
            this._gameRoomPanel = null;
        }
    }


    private onCompereHandler(e: egret.TouchEvent): void {
        this.clearGameRoom();
        this._compereBtn.visible = false;
        this._createBtn.visible = false;

        this.initLiveRoom();
    }

    public destroy(): void {

        this.clearLiveRoom();
        this.clearGameRoom();
        if (this._bg) {
            DisplayObjectUtil.removeForParent(this._bg);
            this._bg = null;
        }
        if (this._backBtn) {
            this._backBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBackHandler, this);
            DisplayObjectUtil.removeForParent(this._backBtn);
            this._backBtn = null;
        }
        if (this._bottomLine) {
            DisplayObjectUtil.removeForParent(this._bottomLine);
            this._bottomLine = null;
        }
        if (this._deskContainer) {
            DisplayObjectUtil.removeForParent(this._deskContainer);
            this._deskContainer = null;
        }


        if (this._createBtn) {
            DisplayObjectUtil.removeForParent(this._createBtn);
            this._createBtn = null;
        }

        if (this._gameRoomPanel) {
            this._gameRoomPanel.removeEventListener(MyTableData.isShowCreateBtn, this.onSelfHashTable, this);
            this._gameRoomPanel.destroy();
            this._gameRoomPanel = null;
        }

        DisplayObjectUtil.removeForParent(this);
    }
}