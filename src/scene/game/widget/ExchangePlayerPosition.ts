/**
 * Created by stylehuan on 2016/9/21.
 */
class ExchangePlayerPosition {
    private static _instance: ExchangePlayerPosition;

    public static getInstance(): ExchangePlayerPosition {
        if (!this._instance) {
            this._instance = new ExchangePlayerPosition();
        }
        return this._instance;
    }

    private _panel: egret.DisplayObjectContainer;
    private _container: egret.DisplayObjectContainer;
    private _wind: egret.Bitmap;
    private usersHead: Array<UserHead>;

    public init(): egret.DisplayObjectContainer {
        this._panel = new egret.DisplayObjectContainer();
        var _mask = new egret.Sprite();
        _mask.graphics.beginFill(0x336699);
        _mask.graphics.drawRect(0, 0, LayerManager.stage.stageWidth, LayerManager.stage.stageHeight);
        _mask.graphics.endFill();

        this._container = new egret.DisplayObjectContainer();

        this._panel.addChild(_mask);
        this._panel.addChild(this._container);

        this._wind = new egret.Bitmap();
        this._wind.texture = RES.getRes("game.change_wind");
        this._wind.x = LayerManager.stage.stageWidth * .5 - this._wind.width * .5;
        this._wind.y = LayerManager.stage.stageHeight * .5 - this._wind.height * .5;
        this._container.addChild(this._wind);

        if (!this.usersHead) {
            this.usersHead = [];
            var _tempArr: Array<UserHead> = [];
            var playerArr = DeskManager.getInstance().playerArr;
            for (var i: number = 0; i < playerArr.length; i++) {
                var userHead: UserHead = new UserHead();
                userHead.userId = playerArr[i].UserInfo.nUserID.value;
                userHead.levelId = playerArr[i].StatData.nLevelID.value;
                userHead.fourAnimalLabel = playerArr[i].StatData.nFourBeast.value;
                userHead.draw();

                var _t: egret.TextField = new egret.TextField();
                _t.text = i + "";
                _t.size = 16;
                _t.textColor = 0xffffff;
                userHead.addChild(_t);

                _tempArr.push(userHead);
            }

            this.usersHead[0] = _tempArr[0];
            this.usersHead[1] = _tempArr[3];
            this.usersHead[2] = _tempArr[2];
            this.usersHead[3] = _tempArr[1];
        }

        this.drawUserHead();
        return this._panel;
    }

    private drawUserHead(): void {
        if (this.usersHead && this.usersHead.length) {
            for (var i: number = 0; i < this.usersHead.length; i++) {
                this._container.addChild(this.usersHead[i]);
            }
        }

        //南风南
        if (DeskManager.getInstance().nBoutCount == 2) {
            this.usersHead[0].x = this._wind.x + this._wind.width + 10;
            this.usersHead[0].y = LayerManager.stage.stageHeight * .5 - this.usersHead[0].height * .5;

            this.usersHead[1].x = LayerManager.stage.stageWidth * .5 - this.usersHead[1].width * .5;
            this.usersHead[1].y = this._wind.y - 80;

            this.usersHead[2].x = this._wind.x - this.usersHead[2].width - 10;
            this.usersHead[2].y = LayerManager.stage.stageHeight * .5 - this.usersHead[2].height * .5;

            this.usersHead[3].x = LayerManager.stage.stageWidth * .5 - this.usersHead[3].width * .5;
            this.usersHead[3].y = this._wind.y + this._wind.height + 10;
        }

        if (DeskManager.getInstance().nBoutCount == 2 || DeskManager.getInstance().nBoutCount == 3 || DeskManager.getInstance().nBoutCount == 4) {
            var self = this;
            egret.setTimeout(()=> {
                self.changePosition();
            }, this, 2000);
        }
    }

    private changePosition(): void {
        if (DeskManager.getInstance().nBoutCount == 2) {
            this.eastLoop();
        } else if (DeskManager.getInstance().nBoutCount == 3) {
            this.westLoop();
        } else {
            this.northLoop();
        }
    }

    private northLoop(): void {
        var temp0X: number = this.usersHead[0].x;
        var temp0Y: number = this.usersHead[0].y;
        var temp1X: number = this.usersHead[1].x;
        var temp1Y: number = this.usersHead[1].y;

        var temp2X: number = this.usersHead[2].x;
        var temp2Y: number = this.usersHead[2].y;

        var temp3X: number = this.usersHead[3].x;
        var temp3Y: number = this.usersHead[3].y;

        var self = this;

        TweenMax.to(this.usersHead[0], .6, {
            x: temp1X,
            y: temp1Y,
            onComplete: function (): void {
                self.listenMask();
            },
            onCompleteParams: [this.usersHead[0]],
            ease: Cubic.easeInOut
        });

        TweenMax.to(this.usersHead[1], .6, {
            x: temp0X,
            y: temp0Y,
            onComplete: function (): void {
                self.listenMask();
            },
            onCompleteParams: [this.usersHead[0]],
            ease: Cubic.easeInOut
        });

        TweenMax.to(this.usersHead[2], .6, {
            x: temp3X,
            y: temp3Y,
            onComplete: function (): void {
                self.listenMask();
            },
            onCompleteParams: [this.usersHead[2]],
            ease: Cubic.easeInOut
        });

        TweenMax.to(this.usersHead[3], .6, {
            x: temp2X,
            y: temp2Y,
            onComplete: function (): void {
                self.listenMask();
            },
            onCompleteParams: [this.usersHead[3]],
            ease: Cubic.easeInOut
        });
    }

    //西凤泉
    private westLoop(): void {
        var temp0X: number = this.usersHead[0].x;
        var temp0Y: number = this.usersHead[0].y;
        var temp1X: number = this.usersHead[1].x;
        var temp1Y: number = this.usersHead[1].y;

        var temp2X: number = this.usersHead[2].x;
        var temp2Y: number = this.usersHead[2].y;

        var temp3X: number = this.usersHead[3].x;
        var temp3Y: number = this.usersHead[3].y;

        var self = this;

        TweenMax.to(this.usersHead[0], .6, {
            x: temp2X,
            y: temp2Y,
            onComplete: function (): void {
                self.listenMask();
            },
            onCompleteParams: [this.usersHead[0]],
            ease: Cubic.easeInOut
        });

        TweenMax.to(this.usersHead[1], .6, {
            x: temp3X,
            y: temp3Y,
            onComplete: function (): void {
                self.listenMask();
            },
            onCompleteParams: [this.usersHead[0]],
            ease: Cubic.easeInOut
        });

        TweenMax.to(this.usersHead[2], .6, {
            x: temp1X,
            y: temp1Y,
            onComplete: function (): void {
                self.listenMask();
            },
            onCompleteParams: [this.usersHead[2]],
            ease: Cubic.easeInOut
        });

        TweenMax.to(this.usersHead[3], .6, {
            x: temp0X,
            y: temp0Y,
            onComplete: function (): void {
                self.listenMask();
            },
            onCompleteParams: [this.usersHead[3]],
            ease: Cubic.easeInOut
        });
    }

    //南风圈
    private eastLoop(): void {
        var temp0X: number = this.usersHead[0].x;
        var temp0Y: number = this.usersHead[0].y;
        var temp2X: number = this.usersHead[2].x;
        var temp2Y: number = this.usersHead[2].y;

        var self = this;

        TweenMax.to(this.usersHead[0], .6, {
            x: this.usersHead[1].x,
            y: this.usersHead[1].y,
            onComplete: function (): void {
                self.listenMask();
            },
            onCompleteParams: [this.usersHead[0]],
            ease: Cubic.easeInOut
        });

        TweenMax.to(this.usersHead[1], .6, {
            x: temp0X,
            y: temp0Y,
            onComplete: function (): void {
                self.listenMask();
            },
            onCompleteParams: [this.usersHead[0]],
            ease: Cubic.easeInOut
        });

        TweenMax.to(this.usersHead[2], .6, {
            x: this.usersHead[3].x,
            y: this.usersHead[3].y,
            onComplete: function (): void {
                self.listenMask();
            },
            onCompleteParams: [this.usersHead[2]],
            ease: Cubic.easeInOut
        });

        TweenMax.to(this.usersHead[3], .6, {
            x: temp2X,
            y: temp2Y,
            onComplete: function (): void {
                self.listenMask();
            },
            onCompleteParams: [this.usersHead[3]],
            ease: Cubic.easeInOut
        });
    }

    private _numberMask: number = 0;

    private listenMask(): void {
        this._numberMask += 1;

        if (this._numberMask == 4) {
            this._panel.dispatchEventWith("complete");
        }
    }

    public reset(): void {
        this._numberMask = 0;

        for (var i: number = 0; i < this.usersHead.length; i++) {
            DisplayObjectUtil.removeForParent(this.usersHead[i]);
            this.usersHead[i] = null;
        }

        this.usersHead = null;

        if (this._container) {
            DisplayObjectUtil.removeForParent(this._container);
            this._container = null;
        }

        if (this._wind) {
            DisplayObjectUtil.removeForParent(this._wind);
            this._wind = null;
        }

        if (this._panel) {
            DisplayObjectUtil.removeForParent(this._panel);
            this._panel = null;
        }
    }

    public destroy(): void {

    }
}