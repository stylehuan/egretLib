/**
 * Created by stylehuan on 2016/9/10.
 */
class CardMount extends egret.DisplayObjectContainer implements ICard {
    private _id: number;
    public nDir: number;

    public constructor(dir) {
        super();

        this._id = -1;
        this.nDir = dir;
        this.setup();
    }

    private setup(): void {
        if (!this._frondBg) {
            this._frondBg = new egret.Bitmap();
            this._frondBg.texture = RES.getRes(this.getLieFrondRes());
            this.addChild(this._frondBg);
        }

        if (!this._backBg) {
            this._backBg = new egret.Bitmap();
            this._backBg.texture = RES.getRes(this.getLieBackRes());
            this._backBg.smoothing = true;
            this.addChild(this._backBg);
        }
    }

    private txt: egret.TextField;

    private getLieFrondRes(): string {
        switch (this.nDir) {
            case 1:
                return "card_hand_down_frond";
            case 2:
                return "card_fulu_right_frond";
            case 3:
                return "card_hand_down_frond";
            case 4:
                return "card_fulu_left_frond";
        }
    }

    private getLieBackRes(): string {
        switch (this.nDir) {
            case 1:
                return "card_hand_down_back";
            case 2:
                return "card_fulu_right_back";
            case 3:
                return "card_hand_down_back";
            case 4:
                return "card_fulu_left_back";
        }
    }

    private isDrawCardNum: boolean = false;

    public set id(value: number) {
        this._id = value;

        if (value > -1 && !this.isDrawCardNum) {
            this.drawCardNum();
        }
    }

    private _frondBg: egret.Bitmap;
    private _backBg: egret.Bitmap;
    private _cardNum: egret.Bitmap;

    private drawCardNum(): void {
        var _bmdName: string = CardData.getCardName(this._id);
        this._cardNum = new egret.Bitmap();
        this._cardNum.texture = RES.getRes("cards." + _bmdName);

        this._cardNum.scaleX = this._cardNum.scaleY = 0.76;
        if (this.nDir == 2 || this.nDir == 4) {
            this._cardNum.scaleX = this._cardNum.scaleY = 0.65;
            this._cardNum.width = this.width - 4;
        }

        this._cardNum.x = this.width * .5;
        this._cardNum.y = this.height * .5;
        this._cardNum.anchorOffsetX = this._cardNum.width * .5;
        this._cardNum.anchorOffsetY = this._cardNum.height * .5;
        this.addChild(this._cardNum);

        if (this.nDir == 3) {
            this._cardNum.y = this._cardNum.height * .5;
        }

        if (this.nDir == 2) {
            this._cardNum.y = 5;
            this._cardNum.x = this._cardNum.x - 2;
        } else if (this.nDir == 4) {
            this._cardNum.y = 14;
        }


        switch (this.nDir) {
            case 2:
                this._cardNum.rotation = -90;
                this._cardNum.skewX = -90;
                this._cardNum.skewY = -100;
                this._cardNum.width = this._cardNum.width * .7;
                break;
            case 4:
                this._cardNum.rotation = 90;
                this._cardNum.skewX = 90;
                this._cardNum.skewY = 100;
                this._cardNum.width = this._cardNum.width * .7;
                break;
            case 1:
                this._cardNum.rotation = 180;
                break;
        }

        this.isDrawCardNum = true;
    }

    public frond(): void {
        if (this._frondBg)this._frondBg.visible = true;
        if (this._cardNum)this._cardNum.visible = true;
        if (this._backBg)this._backBg.visible = false;

        if (this._cardNum) {
            if (this.nDir == 3 || this.nDir == 1) {
                this._cardNum.y = this._cardNum.height * .5 - 12;
            } else if (this.nDir == 4) {
            }
        }
    }

    public back(): void {
        if (this._frondBg)this._frondBg.visible = false;
        if (this._cardNum)this._cardNum.visible = false;
        if (this._backBg)this._backBg.visible = true;
    }

    public destroy(): void {
        if (this._frondBg) {
            DisplayObjectUtil.removeForParent(this._frondBg);
            this._frondBg = null;
        }

        if (this._backBg) {
            DisplayObjectUtil.removeForParent(this._backBg);
            this._backBg = null;
        }
        if (this._cardNum) {
            DisplayObjectUtil.removeForParent(this._cardNum);
            this._cardNum = null;
        }
    }
}