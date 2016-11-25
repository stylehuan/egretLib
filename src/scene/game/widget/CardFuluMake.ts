/**
 * Created by stylehuan on 2016/9/11.
 */
class CardFuluMake extends egret.DisplayObjectContainer {
    private _id: number;
    public nDir: number;
    private targetDir: number;

    public constructor(dir, targetDir: number, cardId: number) {
        super();

        this._id = cardId;
        this.targetDir = targetDir;
        this.nDir = dir;
        this.setup();
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.removeToStageHandler, this);
    }

    private setup(): void {
        this.drawCardBg();
        this.drawCardNum();
    }

    private _frondBg: egret.Bitmap;
    private _cardNum: egret.Bitmap;

    private drawCardBg(): void {
        if (!this._frondBg) {
            this._frondBg = new egret.Bitmap();
            this._frondBg.texture = RES.getRes(this.getLieFrondRes());
            this.addChild(this._frondBg);
        }
    }

    private getLieFrondRes(): string {
        switch (this.nDir) {
            case 1:
                return "card_fulu_down_frond_make";
            case 2:
                return "card_fulu_right_frond_make";
            case 3:
                return "card_fulu_down_frond_make";
            case 4:
                return "card_fulu_left_frond_make";
        }
    }

    private drawCardNum(): void {
        var _bmdName: string = CardData.getCardName(this._id);
        this._cardNum = new egret.Bitmap();
        this._cardNum.texture = RES.getRes("cards." + _bmdName);

        this._cardNum.scaleX = this._cardNum.scaleY = 0.48;
        if (this.nDir == 2 || this.nDir == 4) {
            this._cardNum.width = this._cardNum.width + 12;
            this._cardNum.scaleX = this._cardNum.scaleY = .45;
        } else {
            this._cardNum.width = this._cardNum.width - 5;
        }

        this._cardNum.anchorOffsetX = this._cardNum.width * .5;
        this._cardNum.anchorOffsetY = this._cardNum.height * .5;
        this._cardNum.x = this._cardNum.width * .5;
        this._cardNum.y = this._cardNum.height * .5;
        this.addChild(this._cardNum);

        if (this.nDir == 3 || this.nDir == 1) {
            this._cardNum.x -= 7;
            this._cardNum.y -= 32;
        } else if (this.nDir == 2) {
            this._cardNum.y = 18;
            this._cardNum.x = this._cardNum.x - 13;
        } else if (this.nDir == 4) {
            this._cardNum.x -= 13;
            this._cardNum.y -= 25;
        }

        if (this.nDir == 1) {
            if (this.targetDir == 0 || this.targetDir == 1) {
                this._cardNum.rotation = -90;
                // this._cardNum.skewX = 90;
                // this._cardNum.skewY = 90;
            } else {
                this._cardNum.rotation = 90;
            }
        } else if (this.nDir == 2) {
            if (this.targetDir == 0 || this.targetDir == 1) {
                this._cardNum.skewX = -14;
                this._cardNum.rotation = 180;
            } else {
                this._cardNum.skewX = -14;
                // this._cardNum.rotation = -90;
            }
        } else if (this.nDir == 3) {
            if (this.targetDir == 0 || this.targetDir == 1) {
                this._cardNum.rotation = -90;
                this._cardNum.skewY = -90;
            } else {
                this._cardNum.rotation = 90;
                this._cardNum.skewY = 90;
            }
        } else {
            if (this.targetDir == 0 || this.targetDir == 1) {
                this._cardNum.skewX = 12;
            } else {
                this._cardNum.rotation = 180;
                this._cardNum.skewX = 192;
            }
        }
    }

    private removeToStageHandler(e: Event): void {
        this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.removeToStageHandler, this);
        this.destroy();
    }

    public destroy(): void {
        if (this._frondBg) {
            DisplayObjectUtil.removeForParent(this._frondBg);
            this._frondBg = null;
        }
        if (this._cardNum) {
            DisplayObjectUtil.removeForParent(this._cardNum);
            this._cardNum = null;
        }
    }
}