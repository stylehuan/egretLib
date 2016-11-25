/**
 * Created by stylehuan on 2016/7/29.
 */
class DeskUserView extends egret.Sprite {
    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addedToStageHandler, this);

        this._headContainer = new egret.Sprite();
        this.addChild(this._headContainer);

        mouse.setButtonMode(this, true);

        var head_bg = new egret.Bitmap();
        head_bg.texture = RES.getRes("friend.head_bg");
        this._headContainer.addChild(head_bg);
        head_bg.alpha = .4;

        this._stoolIcon = new egret.Bitmap();
        this._stoolIcon.texture = RES.getRes("friend.stool");
        this.addChild(this._stoolIcon);
        this._stoolIcon.x = -4;
        this._stoolIcon.y = -4;
    }

    private data: Object;
    private _userName: string;
    private _userId: number;
    private _userHead: string;
    private _isReady: boolean = false;
    private _readyIcon: egret.Bitmap;
    private _stoolIcon: egret.Bitmap;
    private _headContainer: egret.Sprite;
    private _headIconSpr: egret.Sprite;
    private headIcon: egret.Bitmap;
    private _txtName: egret.TextField;
    private _chairNo: number;
    private maskSprite: egret.Shape;

    public draw(): void {
        this._headIconSpr = new egret.Sprite();
        this._headContainer.addChild(this._headIconSpr);

        this.headIcon = new egret.Bitmap();
        this.headIcon.texture = RES.getRes("common.default_head");
        this._headIconSpr.addChild(this.headIcon);

        this.maskSprite = new egret.Shape();
        this.maskSprite.graphics.beginFill(0x0000ff);
        this.maskSprite.graphics.drawCircle(18, 18, 18);
        this.maskSprite.graphics.endFill();
        this._headContainer.addChild(this.maskSprite);
        this._headIconSpr.mask = this.maskSprite;

        this._readyIcon = new egret.Bitmap();
        this._readyIcon.texture = RES.getRes("friend.ready");
        this.addChild(this._readyIcon);
        this._readyIcon.x = -4;
        this._readyIcon.y = -4;

        this._txtName = new egret.TextField();
        this._txtName.text = this._userName;
        this._txtName.size = 14;
        this._txtName.bold = true;
        this._txtName.width = this._txtName.textWidth;
        this._txtName.x = this.width * .5 - this._txtName.width * .5;
        this._txtName.y = -this._txtName.height - 7;

        if (this._userId == SystemCenter.playSystem.selfPlayerInfo.userID) {
            this._txtName.textColor = 0x6EF949;
        }

        this.addChild(this._txtName);

        this._readyIcon.visible = this._isReady;

        // var selfInfo = SystemCenter.playSystem.getPlayerInfo(this._userId);
        // if (selfInfo && selfInfo.headIcon) {
        //     this.drawUserHead(selfInfo.headIcon);
        // } else {
        //     var newPlayerInfo = new PlayerInfo();
        //     newPlayerInfo.userID = this._userId;
        //     this.getUserHead();
        // }
        //this.addEventListener()
    }

    private getUserHead(): void {

        var self = this;
        var paramObj = new Object();
        paramObj["userid"] = this._userId;
        var _request = new HttpRequest();
        var _requestConfig = new RequestConfig();
        _requestConfig.url = URLDefine.mainApi + URLDefine.getUserFace;
        _requestConfig.params = paramObj;
        _requestConfig.success = function (data) {
            console.log(data);
            //&& _data.UserFace.indexOf("Clothes") == -1
            if (data["UserFace"]) {
                if (!GlobalVar.isLocal) {
                    var loader: egret.URLLoader = new egret.URLLoader();
                    loader.dataFormat = egret.URLLoaderDataFormat.TEXTURE;
                    var urlReq: egret.URLRequest = new egret.URLRequest();
                    // urlReq.url = URLDefine.mainDoMain + URLDefine.faceAgency + "?url=" + data["UserFace"];
                    urlReq.url = URLDefine.doMain + "/home/imageagent?url=" + data["UserFace"];
                    loader.load(urlReq);
                    loader.addEventListener(egret.Event.COMPLETE, (e: egret.Event)=> {

                        var selfInfo = SystemCenter.playSystem.getPlayerInfo(self._userId);
                        selfInfo.headIcon = loader.data;

                        self.drawUserHead(loader.data);
                    }, this);
                }
            }
        };
        _requestConfig.error = function () {

        };

        _request.openHttpRequest(_requestConfig);
    }

    private drawUserHead(headIconTexture: egret.Texture): void {
        if (this.headIcon) {
            this.headIcon.texture = headIconTexture;
            this.headIcon.scaleX = this.headIcon.scaleY = .6;
        }
    }

    public clearStool(): void {
        this._userId = -1;
        this._userName = "";
        this.data = null;
        this._isReady = false;
        if (this._headIconSpr) {
            DisplayObjectUtil.removeForParent(this._headIconSpr);
            this._headIconSpr = null;
        }
        if (this.maskSprite) {
            DisplayObjectUtil.removeForParent(this.maskSprite);
            this.maskSprite = null;
        }


        if (this._readyIcon) {
            DisplayObjectUtil.removeForParent(this._readyIcon);
            this._readyIcon = null;
        }

        if (this.headIcon) {
            DisplayObjectUtil.removeForParent(this.headIcon);
            this.headIcon = null;
        }

        if (this._txtName) {
            DisplayObjectUtil.removeForParent(this._txtName);
            this._txtName = null;
        }
    }

    private addedToStageHandler(e: Event): void {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addedToStageHandler, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.removedFromStageHandler, this);
    }

    private removedFromStageHandler(e: Event): void {
        this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.removedFromStageHandler, this);
        this.destroy();
    }

    public set isReady(value: boolean) {
        this._isReady = value;
        if (this._readyIcon) {
            this._readyIcon.visible = this._isReady;
        }
    }

    public get isReady(): boolean {
        return this._isReady;
    }

    public set userName(value: string) {
        this._userName = value;
    }

    public get userName(): string {
        return this._userName;
    }

    public set userId(value: number) {
        this._userId = value;
    }

    public get userId(): number {
        return this._userId;
    }

    public set chairNo(value: number) {
        this._chairNo = value;
    }

    public get chairNo(): number {
        return this._chairNo;
    }

    public set userHead(value: string) {
        this._userHead = value;
    }

    public get userHead(): string {
        return this._userHead;
    }

    public destroy(): void {
        if (this.data != null) this.data = null;
        this.clearStool();

        if (this._stoolIcon) {
            DisplayObjectUtil.removeForParent(this._stoolIcon);
            this._stoolIcon = null;
        }

        if (this.maskSprite) {
            DisplayObjectUtil.removeForParent(this.maskSprite);
            this.maskSprite = null;
        }

        if (this._headIconSpr) {
            DisplayObjectUtil.removeForParent(this._headIconSpr);
            this._headIconSpr = null;
        }

        if (this._headContainer) {
            DisplayObjectUtil.removeAllChild(this._headContainer);
            DisplayObjectUtil.removeForParent(this._headContainer);
            this._headContainer = null;
        }
    }
}