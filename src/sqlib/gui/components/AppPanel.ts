/**
 * Created by stylehuan on 2016/7/27.
 */
module SQ {
    export class AppPanel extends egret.DisplayObjectContainer {
        public data: Object;
        private _defaultSpr: egret.Bitmap;
        public _closeSpr: Button;
        private _title: egret.DisplayObjectContainer;
        private _showYoYo: boolean = true;
        private _mask: egret.Bitmap;
        private _offX: number;
        private _offY: number;

        /**
         * ���尴ť�๹�캯��
         * bgSkin - Ƥ������ (֧�־Ź���)
         * closeSpr - �رհ�ť
         */
        public constructor(bgSkin: string, title?: egret.DisplayObjectContainer, closeSpr?: Button, showYoyo?: boolean) {
            super();
            this.data = new Object();

            this._closeSpr = closeSpr;
            if (closeSpr != undefined) this._closeSpr = closeSpr;
            if (showYoyo != undefined) this._showYoYo = showYoyo;
            if (this._defaultSpr == null) {
                this._defaultSpr = new egret.Bitmap();
                this._defaultSpr.scale9Grid = new egret.Rectangle(60, 54, 300, 174);
                this._defaultSpr.texture = RES.getRes(bgSkin);
                this.addChild(this._defaultSpr);
            }

            if (!this._title && title) {
                this._title = title;
                this.addChild(this._title);
            }

            if (this._closeSpr != null) this.addChild(this._closeSpr);
        }

        public initTitle(title: egret.DisplayObjectContainer): void {
            if (title) {
                this.addChild(title);
            }
        }

        /**
         * ��ʼ��Button��ʾ����ͻ��ƣ�����Ԫ�ؽ���map
         */
        public init(width: number, height: number): void {
            this.touchEnabled = true;
            this.setSize(width, height);
            this.setPostion();
            if (this._showYoYo) {
                this.scaleX = this.scaleY = 0;
                TweenMax.to(this, .8, {
                    scaleX: 1, scaleY: 1, ease: Bounce.easeOut, onComplete: function (): void {
                    }
                });
            }
            if (this._closeSpr != null) this._closeSpr.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closePanelHandler, this)
        }

        // *****************************************        ��ʼ������        *********************

        private closePanelHandler(e: egret.TouchEvent): void {
            this.doClose();
        }

        private doClose(): void {
            console.log("cse");
            AppEvent.dispatchEvents(new AppEvent(AppEvent.APP_CLOSE));
        }

        public close(): void {
            this.doClose();
        }

        public setSize(w: number, h: number): void {
            this._defaultSpr.width = w;
            this._defaultSpr.height = h;

            this.anchorOffsetX = this._defaultSpr.width * .5;
            this.anchorOffsetY = this._defaultSpr.height * .5;

            this._offX = this._defaultSpr.width * .5;
            this._offY = this._defaultSpr.height * .5;

            if (this._closeSpr != null) {
                this._closeSpr.x = this._defaultSpr.width - this._closeSpr.width * .5 - 10;
                this._closeSpr.y = -this._closeSpr.height * .5 + 5;
            }

            if (this._title) {
                this._title.x = this._defaultSpr.width * .5 - this._title.width * .5;
                this._title.y = -this._title.height * .5;
            }
        }

        public setPostion() {
            this.x = 0;
            this.y = 0;
            this.x = LayerManager.stage.stageWidth * .5;
            this.y = LayerManager.stage.stageHeight * .5;
        }

        public destroy(): void {
            if (this._closeSpr != null) this._closeSpr.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.closePanelHandler, this)
            if (this._defaultSpr != null) {
                DisplayObjectUtil.removeAllChild(this._defaultSpr)
                DisplayObjectUtil.removeForParent(this._defaultSpr)
                this._defaultSpr = null;
            }
            if (this.data != null) this.data = null;
        }
    }
}