module SQ {
    export class CheckBox extends egret.DisplayObjectContainer {
        public data:Object;
        private _defaultSpr:egret.Bitmap;
        private _pressSpr:egret.Bitmap;
        private _disableSpr:egret.Bitmap;
        private _selectSpr:egret.Bitmap;
        private _disableSkin:string = "";
        private _showYoyo:boolean = true;
        private _isSelect:boolean = false;

        private _anchorContainer:egret.Sprite;
        private _textField:SQ.STTextField;

        /**
         * 具体按钮类构造函数
         * defaultSkin - 未选择状态
         * pressSkin - 按下状态
         * selectSkin - 选择后状态
         */
        public constructor(text:string, defaultSkin:string, pressSkin:string, selectSkin:string, disableSkin?:string, showYoyo?:boolean) {
            super();
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addedToStageHandler, this);
            this.data = new Object();

            this._anchorContainer = new egret.Sprite();
            this.addChild(this._anchorContainer);

            if (disableSkin != undefined) this._disableSkin = disableSkin;
            if (showYoyo != undefined) this._showYoyo = showYoyo;
            if (this._defaultSpr == null) {
                this._defaultSpr = new egret.Bitmap();
                this._defaultSpr.texture = RES.getRes(defaultSkin);
                this._anchorContainer.addChild(this._defaultSpr);
            }
            if (this._pressSpr == null) {
                this._pressSpr = new egret.Bitmap();
                this._pressSpr.texture = RES.getRes(pressSkin);
                this._pressSpr.visible = false;
                this._anchorContainer.addChild(this._pressSpr);
            }
            if (this._selectSpr == null) {
                this._selectSpr = new egret.Bitmap();
                this._selectSpr.texture = RES.getRes(selectSkin);
                this._selectSpr.visible = false;
                this._anchorContainer.addChild(this._selectSpr);
            }
            if (this._disableSkin != undefined) {
                if (this._disableSkin != "") {
                    if (this._disableSpr == null) {
                        this._disableSpr = new egret.Bitmap();
                        this._disableSpr.texture = RES.getRes(disableSkin);
                        this._disableSpr.visible = false;
                        this._anchorContainer.addChild(this._disableSpr);
                    }
                }
            }

            this._textField = new SQ.STTextField();
            this._textField.text = text;
            this._textField.bold = true;
            this._textField.textColor = 0x4C2814;
            this._textField.x = this._anchorContainer.width + 2;
            this._textField.y = this._anchorContainer.height * .5 - this._textField.height * .5;
            this._anchorContainer.addChild(this._textField);

            this._anchorContainer.anchorOffsetX = this._anchorContainer.width * .5;
            this._anchorContainer.anchorOffsetY = this._anchorContainer.height * .5;

            this.init();
        }

        /**
         * 初始化Button显示对象和绘制，绘制元素建立map
         */
        public init():void {
            this.touchEnabled = true;
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginHandler, this);
            this.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEndHandler, this);
        }

        // *****************************************        初始化绘制        *********************

        private touchBeginHandler(e:egret.TouchEvent):void {
            if (this._showYoyo) {
                this._anchorContainer.scaleX = this._anchorContainer.scaleY = 1.2;
            }
        }

        private touchEndHandler(e:egret.TouchEvent):void{
            SoundManager.getInstance().playEffect("Snd_button");
            if (!this._isSelect) {
                this._defaultSpr.visible = false;
                this._pressSpr.visible = false;
                this._selectSpr.visible = true;
                this._isSelect = true;
            } else {
                this._isSelect = false;
                this._defaultSpr.visible = true;
                this._pressSpr.visible = false;
                this._selectSpr.visible = false;
            }
            if (this._showYoyo) {
                TweenMax.to(this._anchorContainer, .6, {
                    scaleX: 1, scaleY: 1, ease: Bounce.easeOut, onComplete: function ():void {
                    }
                });
            }
        }

        private removedFromStageHandler(e:Event):void {
            this.destroy();
        }

        private addedToStageHandler(e:Event):void {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addedToStageHandler, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.removedFromStageHandler, this);
        }

        public setPostion(x:number, y:number) {
            this.x = x + this._anchorContainer.width * .5;
            this.y = y + this._anchorContainer.height * .5;
        }

        /**
         * 设置是否可用
         * @param    b
         */
        public setDisable(b:boolean):void {
            if (b == false) {
                this.touchEnabled = false;
                if (this._disableSpr != null) {
                    this._disableSpr.visible = true;
                    this._defaultSpr.visible = false;
                    this._pressSpr.visible = false;
                    this._selectSpr.visible = false;
                }
            } else {
                this.touchEnabled = true;
                this._defaultSpr.visible = true;
                this._pressSpr.visible = false;
                this._selectSpr.visible = false;
                if (this._disableSkin != "") {
                    this._disableSpr.visible = false;
                }
            }
        }

        public set isSelect(value:boolean) {
            this._isSelect = value;
        }

        public get isSelect():boolean {
            return this._isSelect;
        }

        public setSelect(b:boolean):void {
            if (!b) {
                this._defaultSpr.visible = true;
                this._pressSpr.visible = false;
                this._selectSpr.visible = false;
                this._isSelect = false;
            } else {
                this._isSelect = true;
                this._defaultSpr.visible = false;
                this._pressSpr.visible = false;
                this._selectSpr.visible = true;
            }
        }

        public destroy():void {
            if (this.data != null) this.data = null;
            this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginHandler, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchEndHandler, this);
        }
    }
}