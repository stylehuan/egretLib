module SQ {
    export class TextBox extends egret.DisplayObjectContainer {
        public data: Object;
        private _disableSkin: string = "";
        private _txt: eui.EditableText; //文本框
        private _txtBg: egret.Bitmap;//背景图
        private _txtBgDisable: egret.Bitmap;//不可点背景图
        private placeHolder: string = "请输入";
        private _defaultStr: SQ.STTextField;  //默认文本
        /**
         * 具体按钮类构造函数
         */
        public constructor(placeHolder: string, defaultSkin: string, disableSkin?: string, width?: number) {
            super();
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addedToStageHandler, this);
            this.data = new Object();

            this.placeHolder = placeHolder;

            this._txtBg = new egret.Bitmap();
            this._txtBg.texture = RES.getRes(defaultSkin);
            this.addChild(this._txtBg);
            this._txtBg.width = width;

            if (disableSkin != undefined) this._disableSkin = disableSkin;
            if (this._disableSkin != undefined) {
                this._txtBgDisable = new egret.Bitmap();
                this._txtBgDisable.texture = RES.getRes(this._disableSkin);
                this.addChild(this._txtBgDisable);
                this._txtBgDisable.width = width;
            }

            this._defaultStr = new SQ.STTextField;
            this._defaultStr.type = egret.TextFieldType.INPUT;
            this._defaultStr.x = 10;
            this._defaultStr.y = 10;
            this._defaultStr.width = width || 580;
            this._defaultStr.height = 30;
            this._defaultStr.text = placeHolder;
            this._defaultStr.maxChars = 20;
            this._defaultStr.textColor = 0xdedfe0;
            this.addChild(this._defaultStr);
            this._defaultStr.addEventListener(egret.TouchEvent.FOCUS_IN, this.focusinHandler, this);
            this._defaultStr.addEventListener(egret.TouchEvent.FOCUS_OUT, this.focusoutHandler, this);

            this.init();
        }

        public setSize(n: number): void {
            this._defaultStr.size = n;
        }

        private focusinHandler(e: egret.TouchEvent) {
            if (this._defaultStr.text == this.placeHolder) {
                this._defaultStr.text = "";
            }
        }

        private focusoutHandler(e: egret.TouchEvent) {
            if (this._defaultStr.text == "") {
                this._defaultStr.text = this.placeHolder;
            }
        }

        /**
         * 初始化Button显示对象和绘制，绘制元素建立map
         */
        public init(): void {

            this.touchEnabled = true;
            // this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginHandler, this);
        }

        // *****************************************        初始化绘制        *********************


        private removedFromStageHandler(e: Event): void {
            this.destroy();
        }

        private addedToStageHandler(e: Event): void {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addedToStageHandler, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.removedFromStageHandler, this);
        }

        public get text(): string {
            return this._defaultStr.text == this.placeHolder ? "" : this._defaultStr.text;
        }

        public set text(value: string) {
            this._defaultStr.text = value;
        }


        public displayAsPassword(b: boolean) {
            this._defaultStr.displayAsPassword = b;
        }

        /**
         * 设置是否可用
         * @param    b
         */
        public setDisable(b: boolean): void {
            if (!b) {
                this.touchEnabled = false;
                if (this._txtBgDisable != null) {
                    this._txtBgDisable.visible = true;
                    this._txtBg.visible = false;
                }
            } else {
                this.touchEnabled = true;
                if (this._txtBg != null) {
                    this._txtBg.visible = true;
                    this._txtBgDisable.visible = false;
                }
            }
        }

        public setPostion(x: number, y: number) {
            this.x = x;
            this.y = y;
        }

        public destroy(): void {
            if (this.data != null) this.data = null;
            // this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginHandler, this);
        }
    }
}