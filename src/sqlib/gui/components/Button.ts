module SQ {
    export class Button extends AdaptiveMouse {
        public data: Object;
        private _anchorContainer: egret.Sprite;
        private _defaultSpr: egret.Bitmap;
        private _hoverSpr: egret.Bitmap;
        private _pressSpr: egret.Bitmap;
        private _disableSpr: egret.Bitmap;
        private _disableSkin: string = "";
        private _showYoyo: boolean = true;
        private _offX: number;
        private _offY: number;

        private isEnabled: boolean = true;

        /**
         * 具体按钮类构造函数
         */
        public constructor(defaultSkin: string, hoverSkin: string, pressSkin: string, disableSkin?: string, showYoyo?: boolean) {
            super();
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addedToStageHandler, this);
            this._anchorContainer = new egret.Sprite();
            this.addChild(this._anchorContainer);
            this.data = new Object();
            if (disableSkin != undefined) this._disableSkin = disableSkin;
            if (showYoyo != undefined) this._showYoyo = showYoyo;
            if (this._defaultSpr == null) {
                this._defaultSpr = new egret.Bitmap();
                this._defaultSpr.texture = RES.getRes(defaultSkin);
                this._anchorContainer.addChild(this._defaultSpr);
            }

            if (!this._hoverSpr) {
                this._hoverSpr = new egret.Bitmap();
                this._hoverSpr.texture = RES.getRes(hoverSkin);
                this._hoverSpr.visible = false;
                this._anchorContainer.addChild(this._hoverSpr);
            }

            if (this._pressSpr == null) {
                this._pressSpr = new egret.Bitmap();
                this._pressSpr.texture = RES.getRes(pressSkin);
                this._pressSpr.visible = false;
                this._anchorContainer.addChild(this._pressSpr);
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
            this._anchorContainer.x = this._defaultSpr.width * .5;
            this._anchorContainer.y = this._defaultSpr.height * .5;
            this._anchorContainer.anchorOffsetX = this._defaultSpr.width * .5;
            this._anchorContainer.anchorOffsetY = this._defaultSpr.height * .5;
            this.init();
        }

        /**
         * 初始化Button显示对象和绘制，绘制元素建立map
         */
        public init(): void {
            this._offX = this._defaultSpr.width * .5;
            this._offY = this._defaultSpr.height * .5;

            this.touchEnabled = true;
            mouse.setButtonMode(this, true);

            this.bindEvent();
        }

        // *****************************************        初始化绘制        *********************

        private touchTapPHandler(e: egret.TouchEvent): void {
        }

        public onOverFriendDoor(e: egret.TouchEvent): void {
            this._defaultSpr.visible = false;
            this._pressSpr.visible = false;
            if (this._disableSpr) {
                this._disableSpr.visible = false;
            }

            this._hoverSpr.visible = true;
        }

        public onOutFriendDoor(e: egret.TouchEvent): void {
            if (!this.touchEnabled) return;
            this._defaultSpr.visible = true;
            this._pressSpr.visible = false;
            this._hoverSpr.visible = false;
            if (this._disableSpr) {
                this._disableSpr.visible = false;
            }
        }

        public touchBeginHandler(e: egret.TouchEvent): void {
            this._defaultSpr.visible = false;
            this._pressSpr.visible = true;
            if (this._showYoyo) {
                this._anchorContainer.scaleX = this._anchorContainer.scaleY = 1.2;
                TweenMax.to(this._anchorContainer, .6, {
                    scaleX: 1, scaleY: 1, ease: Bounce.easeOut, onComplete: function (): void {
                    }
                });
            }
        }

        public touchEndHandler(e: egret.TouchEvent): void {
            SoundManager.getInstance().playEffect("Snd_button");
            this._defaultSpr.visible = true;
            this._pressSpr.visible = false;
        }

        private removedFromStageHandler(e: Event): void {
            this.destroy();
        }

        private addedToStageHandler(e: Event): void {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addedToStageHandler, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.removedFromStageHandler, this);
        }

        /**
         * 设置是否可用
         * @param    b
         */
        public setDisable(b: boolean): void {
            this.isEnabled = b;
            if (!b) {
                if (this._disableSpr != null) {
                    this._disableSpr.visible = true;
                    this._defaultSpr.visible = false;
                    this._hoverSpr.visible = false;
                    this._pressSpr.visible = false;
                }

                this.unBindEvent();
            } else {
                this._defaultSpr.visible = true;
                this._pressSpr.visible = false;
                if (this._disableSkin != "") {
                    this._disableSpr.visible = false;
                }
                this.bindEvent();
            }
        }

        private bindEvent(): void {
            if (UIAdapter.getInstance().isPC) {
                this.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.onOverFriendDoor, this);
                this.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.onOutFriendDoor, this);
            }

            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginHandler, this);
            this.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEndHandler, this);
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTapPHandler, this);
        }

        private unBindEvent(): void {
            if (UIAdapter.getInstance().isPC) {
                this.removeEventListener(mouse.MouseEvent.MOUSE_OVER, this.onOverFriendDoor, this);
                this.removeEventListener(mouse.MouseEvent.MOUSE_OUT, this.onOutFriendDoor, this);
            }

            this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginHandler, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchEndHandler, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTapPHandler, this);
        }

        public setPostion(x: number, y: number) {
            this.x = x + this._offX;
            this.y = y + this._offY;
        }

        public getY(): number {
            return this.y - this._offY;

        }

        public getX(): number {
            return this.x - this._offX;
        }

        public destroy(): void {
            this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginHandler, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchEndHandler, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.touchEndHandler, this);
            if (this.data != null) this.data = null;
        }

        public changeSkin(defaultSkin: string, pressSkin: string, disableSkin?: string): void {
            if (this._defaultSpr != undefined)
                this._defaultSpr.texture = RES.getRes(defaultSkin);
            if (this._pressSpr != undefined)
                this._pressSpr.texture = RES.getRes(pressSkin);
            if (disableSkin != undefined)
                this._disableSkin = disableSkin;
        }
    }
}