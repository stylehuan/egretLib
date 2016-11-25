class LoadingUI extends egret.Sprite {
    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addedToStageHandler, this);
        this.createView();
    }

    private container:egret.Sprite;
    private rect:egret.Sprite;
    private loadBg:egret.Bitmap;
    private loadbg2:egret.Bitmap;
    private mcLoading:egret.MovieClip;
    private txtProgress:egret.TextField;
    private txtTips:egret.TextField;
    private loadingCard:egret.MovieClip;
    private carsContainer:egret.Sprite;

    private addedToStageHandler(e:Event):void {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addedToStageHandler, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.removedFromStageHandler, this);
    }

    private removedFromStageHandler(e:Event):void {
        this.destroy();
    }

    private _cards:Array<CardAnimation>;

    private randomArr:Array<any>;

    private createView():void {
        //var b:egret.Sprite = new egret.Sprite();
        //b.graphics.beginFill(0xffffff);
        //b.graphics.drawRect(0, 0, 100, 100);
        //b.graphics.endFill();
        //b.x = 0;
        //b.y = 0;
        //
        //var a:egret.Sprite = new egret.Sprite();
        //a.graphics.beginFill(0x0000ff);
        //a.graphics.drawRect(0, 0, 50, 50);
        //a.graphics.endFill();
        //a.x = 10;
        //a.y = 10;
        //
        //this.addChild(a);
        //this.addChild(b);
        //
        //b.addChild(a);
        //return;
        this.randomArr = [];
        this.randomArr[0] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 132];
        this.randomArr[1] = [36, 37, 38, 39, 40, 41, 41, 43, 44, 45];
        this.randomArr[2] = [72, 73, 74, 75, 76, 77, 78, 79, 80, 81];
        this.randomArr[3] = [108, 109, 110, 111, 112, 113, 114, 115, 116, 117];
        this.randomArr[4] = [135, 136, 137, 138, 139, 140, 141, 142, 143, 144];


        this.loadBg = new egret.Bitmap();
        this.loadBg.texture = RES.getRes("loadingBg");
        this.addChild(this.loadBg);

        this.container = new egret.Sprite();
        this.container.width = 300;
        this.addChild(this.container);

        this.txtProgress = new egret.TextField();
        this.txtProgress.textColor = 0x8ce523;
        this.txtProgress.height = 30;
        this.txtProgress.text = "100%";
        this.txtProgress.size = 28;
        this.txtProgress.textAlign = "right";

        //设置描边属性
        this.txtProgress.strokeColor = 0x000000;
        this.txtProgress.stroke = 2;
        this.container.addChild(this.txtProgress);


        this.carsContainer = new egret.Sprite();
        this.carsContainer.x = this.txtProgress.x + this.txtProgress.width + 10;
        this.container.addChild(this.carsContainer);

        //data = RES.getRes("loadingCard.json");
        //txtr = RES.getRes("loadingCard.png");
        //mcFactory = new egret.MovieClipDataFactory(data, txtr);
        //this.loadingCard = new egret.MovieClip(mcFactory.generateMovieClipData("loading_card"));
        //this.loadingCard.play(-1);
        //this.container.addChild(this.loadingCard);

        var randomFn = function (min:number, max:number):number {
            return Math.floor(Math.random() * (max - min) + min);
        };

        this._cards = [];
        var _index:number = randomFn(0, 4);
        for (var i = 0; i < this.randomArr[_index].length; i++) {
            var id:number = this.randomArr[_index][i];
            var cardItem:CardAnimation = new CardAnimation(id);
            if (this.carsContainer.numChildren) {
                cardItem.x = this.carsContainer.width - 3;
            }
            this.carsContainer.addChild(cardItem);
            this._cards.push(cardItem);
        }

        var data = RES.getRes("runRole.json");
        var txtr = RES.getRes("runRole.png");
        var mcFactory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data, txtr);
        this.mcLoading = new egret.MovieClip(mcFactory.generateMovieClipData("run"));
        this.mcLoading.x = this._defaultLoadingX = this.carsContainer.x - this.mcLoading.width * .5;
        this.mcLoading.y = -this.mcLoading.height - 2;
        this.mcLoading.play(-1);
        this.container.addChild(this.mcLoading);

        this.container.x = LayerManager.stage.stageWidth * .5 - this.container.width * .5;
        this.container.y = LayerManager.stage.stageHeight * .5;

        this.txtTips = new egret.TextField();
        this.addChild(this.txtTips);
        this.txtTips.y = this.container.y + 40;
        this.txtTips.width = LayerManager.stage.stageWidth - 18;
        this.txtTips.text = "提示：最新的文件正在向你奔来，马上就好唷!";
        this.txtTips.textAlign = "center";
        this.txtTips.size = 16;

        this._cards[0].running();
    }

    private loadComplete():void {
        this.mcLoading.gotoAndStop(1);
        var self = this;
        TweenMax.to(this.mcLoading, 1, {
            bezier: {
                values: [{x: this.mcLoading.x + 100, y: this.mcLoading.y - 100}, {
                    x: this.mcLoading.x + 250,
                    y: this.mcLoading.y + 300
                }]
            }, onComplete: function ():void {
                self.mcLoading.play(-1);

                TweenMax.to(self.mcLoading, 1, {
                    x: self.mcLoading.x + 160,
                    onComplete: function ():void {
                        SystemEvent.dispatchEvents(new SystemEvent(SystemEvent.SHOW_MAIN));
                    }, onCompleteParams: [self.mcLoading], ease: Cubic.easeInOut
                });
            }, onCompleteParams: [this.mcLoading], ease: Cubic.easeInOut
        });
    }

    private curIndex = 0;

    public setProgress(current, total):void {
        var _temp = Math.floor(current / total * 10);
        var _progress = Number(current / total * 100).toFixed(0);
        this.txtProgress.text = _progress + "%";
        if (this.curIndex == _temp || this.curIndex == 10) return;

        for (var i:number = 0; i < _temp - this.curIndex; i++) {
            this._cards[this.curIndex + i].open();
        }

        this.curIndex = _temp;
        this.setRunPeoplePos();
        if (this.curIndex >= 10) {
            this.loadComplete();
            return;
        }

        this._cards[_temp].running();
    }

    private _defaultLoadingX:number;

    private setRunPeoplePos():void {
        if (this.mcLoading) {
            var _move = this.curIndex * 18;
            this.mcLoading.x = this._defaultLoadingX + _move;
        }
    }

    public destroy():void {
        this._cards = null;
        if (this.loadbg2 != null) {
            DisplayObjectUtil.removeAllChild(this.loadbg2)
            DisplayObjectUtil.removeForParent(this.loadbg2)
            this.loadbg2 = null;
        }
        if (this.rect != null) {
            DisplayObjectUtil.removeAllChild(this.rect);
            DisplayObjectUtil.removeForParent(this.rect);
            this.rect = null;
        }
        if (this.txtTips != null) {
            DisplayObjectUtil.removeAllChild(this.txtTips)
            DisplayObjectUtil.removeForParent(this.txtTips)
            this.txtTips = null;
        }
    }
}
