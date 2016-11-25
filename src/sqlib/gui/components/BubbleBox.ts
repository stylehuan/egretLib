module SQ {
    export class BubbleBox extends egret.DisplayObjectContainer {
        static OUT_TYPE_ALPHA:string = "out_type_alpha";
        static OUT_TYPE_UP_ALPHA:string = "out_type_up_alpha";
        static OUT_TYPE_MARQUEE:string = "out_type_marquee";
        private DealyTimer:number = 2500;
        public _defaultSpr:egret.Bitmap;
        private _spr:egret.DisplayObject;
        private _showYoyo:boolean = true;
        private _outType:string = BubbleBox.OUT_TYPE_ALPHA;
        private _offX:number;
        private _offY:number;

        private _timer:egret.Timer;


        /**
         * 具体按钮类构造函数
         * bgSkin - 皮肤背景 (支持九宫格)
         * closeSpr - 关闭按钮
         */
        public constructor(bgSkin:string, spr:egret.DisplayObject, showYoyo?:boolean, outType?:string, dealyTimer?:number) {
            super();
            this._spr = spr;
            if (showYoyo != undefined) this._showYoyo = showYoyo;
            if (outType != undefined) this._outType = outType;
            if (dealyTimer != undefined) this.DealyTimer = dealyTimer;
            if (this._defaultSpr == null) {
                this._defaultSpr = new egret.Bitmap();
                this._defaultSpr.scale9Grid = new egret.Rectangle(12, 12, 82, 76);
                this._defaultSpr.texture = RES.getRes(bgSkin);
                this.addChild(this._defaultSpr);
            }
            this.addChild(this._spr);
            this.init();
        }

        /**
         * 初始化Button显示对象和绘制，绘制元素建立map
         */
        public init():void {
            this._defaultSpr.width = this._spr.width + 50;
            this._defaultSpr.height = this._spr.height * 2;
            this._defaultSpr.anchorOffsetX = this._defaultSpr.width * .5;
            this._defaultSpr.anchorOffsetY = this._defaultSpr.height * .5;

            this._spr.anchorOffsetX = this._spr.width * .5;
            this._spr.anchorOffsetY = this._spr.height * .5;

            this._offX = this._defaultSpr.width * .5;
            this._offY = this._defaultSpr.height * .5;
            //AlignTool.spr_To_spr2_Center(this._spr,this._defaultSpr)

            if (this._showYoyo) {
                this.scaleX = this.scaleY = 1.2;
                TweenMax.to(this, .6, {
                    scaleX: 1, scaleY: 1, ease: Bounce.easeOut, onComplete: function ():void {
                    }
                });
            }
            this._timer = new egret.Timer(this.DealyTimer)
            this._timer.addEventListener(egret.TimerEvent.TIMER, this.closePanelHandler, this)
            this._timer.start();
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addedToStageHandler, this);
        }

        // *****************************************        初始化绘制        *********************

        private closePanelHandler(e:egret.TimerEvent):void {
            if (this._outType == BubbleBox.OUT_TYPE_ALPHA) {
                DisplayObjectUtil.removeAllChild(this);
                DisplayObjectUtil.removeForParent(this);
            } else if (this._outType == BubbleBox.OUT_TYPE_UP_ALPHA) {
                DisplayObjectUtil.removeAllChild(this);
                DisplayObjectUtil.removeForParent(this);
            } else if (this._outType == BubbleBox.OUT_TYPE_MARQUEE) {
                DisplayObjectUtil.removeAllChild(this);
                DisplayObjectUtil.removeForParent(this);
            }
        }

        public setPostion(x:number, y:number) {
            this.x = x + this._offX;
            this.y = y + this._offY;
        }

        private removedFromStageHandler(e:Event):void {
            this.destroy();
        }

        private addedToStageHandler(e:Event):void {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addedToStageHandler, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.removedFromStageHandler, this);
        }


        public destroy():void {
            if (this._timer) {
                this._timer.removeEventListener(egret.TimerEvent.TIMER, this.closePanelHandler, this)
                this._timer = null;
            }
            if (this._defaultSpr) {
                DisplayObjectUtil.removeAllChild(this._defaultSpr);
                DisplayObjectUtil.removeForParent(this._defaultSpr);
                this._defaultSpr = null;
            }
        }
    }
}