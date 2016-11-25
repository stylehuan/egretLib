import Bitmap = egret.Bitmap;
/**
 * Created by stylehuan on 2016/9/18.
 */
class UserHead extends egret.Sprite {
    private _userId: number;
    private _levelId: number;
    private _fourAnimalLabel: number;

    private userHeadSpr: egret.DisplayObjectContainer;
    private userFourAnimalIcon: egret.MovieClip;
    private maskSprite: egret.Shape;

    private headIcon: egret.Bitmap;

    public getAnimalLabel(): number {
        return this._fourAnimalLabel;
    }

    public constructor() {
        super();
    }

    public set userId(value: number) {
        this._userId = value;
    }

    public set levelId(value: number) {
        this._levelId = value;
    }

    public set fourAnimalLabel(value: number) {
        this._fourAnimalLabel = value;
    }

    public draw(): void {
        this.userHeadSpr = new egret.DisplayObjectContainer();
        this.addChild(this.userHeadSpr);

        this.headIcon = new egret.Bitmap();
        this.userHeadSpr.addChild(this.headIcon);

        this.maskSprite = new egret.Shape();
        this.maskSprite.graphics.beginFill(0x0000ff);
        this.maskSprite.graphics.drawCircle(50, 44, 30);
        this.maskSprite.graphics.endFill();
        this.addChild(this.maskSprite);
        this.userHeadSpr.mask = this.maskSprite;

        var selfInfo = SystemCenter.playSystem.getPlayerInfo(this._userId);
        if (selfInfo && selfInfo.headIcon) {
            this.drawUserHead(selfInfo.headIcon);
        } else {
            var newPlayerInfo = new PlayerInfo();
            newPlayerInfo.userID = this._userId;
            this.getUserHead();
        }

        this.userFourAnimalIcon = this.createUserHead();
        this.addChild(this.userFourAnimalIcon);
    }

    private getUserHead(): void {
        var self = this;
        self.drawUserHead(RES.getRes("common.default_head"));
        return;

        var paramObj = new Object();
        paramObj["userid"] = this._userId;
        var _request = new HttpRequest();
        var _requestConfig = new RequestConfig();
        _requestConfig.url = URLDefine.mainApi + URLDefine.getUserFace;
        _requestConfig.params = paramObj;
        _requestConfig.success = function (data) {
            if (data["UserFace"]) {
                if (!GlobalVar.isLocal) {
                    if (data["UserFace"].indexOf("Clothes") != -1) {
                        self.drawUserHead(RES.getRes("common.default_head"));
                        return;
                    }

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

                } else {
                    self.drawUserHead(RES.getRes("common.default_head"));
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
            this.headIcon.x = 20;
            this.headIcon.y = 12;
        }
    }

    private createUserHead(): egret.MovieClip {
        var data = RES.getRes("four_animal.json");
        var txtr = RES.getRes("four_animal.png");
        var mcFactory: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data, txtr);
        var _mc: egret.MovieClip = new egret.MovieClip(mcFactory.generateMovieClipData("four_animal"));

        if (LevelInfo.getLevelName(this._levelId).indexOf("段") == -1) {
            _mc.gotoAndStop(1);
        } else {
            if (this._fourAnimalLabel != 0) {
                _mc.gotoAndStop(this._fourAnimalLabel + 1);
            }
        }

        return _mc;
    }
}