/**
 * Created by stylehuan on 2016/9/10.
 */
class CardHand extends egret.Sprite implements ICard {
    private _id: number;
    public nDir: number;

    private container: egret.DisplayObjectContainer;

    public constructor(dir) {
        super();

        this.container = new egret.DisplayObjectContainer();
        this.addChild(this.container);

        this.id = -1;
        this.nDir = dir;
        this.setup();

        if (this.nDir == 3 && !WGManager.getInstance().isWgIng()) {
            this.touchEnabled = true;
        }
    }

    private setup(): void {
        if (!this._standBg) {
            this._standBg = new egret.Bitmap();
            this._standBg.texture = RES.getRes(this.getStandRes());
            this.container.addChild(this._standBg);
        }
        if (!this._frondBg) {
            this._frondBg = new egret.Bitmap();
            this._frondBg.texture = RES.getRes(this.getLieFrondRes());
            this.container.addChild(this._frondBg);
        }

        if (!this._backBg) {
            this._backBg = new egret.Bitmap();
            this._backBg.texture = RES.getRes(this.getLieBackRes());
            this._backBg.smoothing = true;
            this.container.addChild(this._backBg);
        }

        if (this.nDir == 3) {
            this.graphics.beginFill(0x336699, 0);
            this.graphics.drawRect(0, 0, this._frondBg.width, this._frondBg.height);
            this.graphics.endFill();
        }
    }

    public up(): void {
        this.container.y = -10;
    }

    public down(): void {
        this.container.y = 0;
    }

    private getStandRes(): string {
        switch (this.nDir) {
            case 1:
                return "card_hand_top_shu";
            case 2:
                return "card_hand_right_shu";
            case 3:
                return "card_hand_down_shu";
            case 4:
                return "card_hand_left_shu";
        }
    }

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

    public get id(): number {
        return this._id;
    }

    private _standBg: egret.Bitmap;
    private _frondBg: egret.Bitmap;
    private _backBg: egret.Bitmap;
    private _cardNum: egret.Bitmap;

    private drawCardNum(): void {
        var _bmdName: string = CardData.getCardName(this._id);
        this._cardNum = new egret.Bitmap();
        this._cardNum.texture = RES.getRes("cards." + _bmdName);

        if (this.nDir == 2 || this.nDir == 4) {
            this._cardNum.width = this.width - 10;
            this._cardNum.scaleX = this._cardNum.scaleY = 0.6;
        } else {
            this._cardNum.scaleX = this._cardNum.scaleY = 0.7;
        }

        this._cardNum.x = this.width * .5;
        this._cardNum.y = this.height * .5;

        this._cardNum.anchorOffsetX = this._cardNum.width * .5;
        this._cardNum.anchorOffsetY = this._cardNum.height * .5;
        this.container.addChild(this._cardNum);

        if (this.nDir == 3) {
            this._cardNum.y += 8;
        }

        if (this.nDir == 2) {
            this._cardNum.y = 11;

        } else if (this.nDir == 4) {
            this._cardNum.y = 11;
        }

        switch (this.nDir) {
            case 2:
                this._cardNum.rotation = -90;
                this._cardNum.skewX = -90;
                this._cardNum.skewY = -100;
                break;
            case 4:
                this._cardNum.rotation = 90;
                this._cardNum.skewX = 90;
                this._cardNum.skewY = 100;
                break;
            case 1:
                this._cardNum.rotation = 180;
                break;
        }

        this.isDrawCardNum = true;
    }

    public stand(): void {
        if (this._frondBg)this._frondBg.visible = false;
        if (this._standBg)this._standBg.visible = true;
        if (this._cardNum)this._cardNum.visible = false;

        if (this.nDir == 3) {
            if (this._cardNum)this._cardNum.visible = true;
            this._cardNum.y = this.height * .5 + 8;


        }
        if (this._backBg)this._backBg.visible = false;
    }

    public frond(): void {
        if (this._frondBg)this._frondBg.visible = true;
        if (this._cardNum)this._cardNum.visible = true;
        if (this._standBg)this._standBg.visible = false;
        if (this._backBg)this._backBg.visible = false;

        if (this._cardNum) {
            if (this.nDir == 1) {
                this._cardNum.y = this.height * .5 - 10;
            } else if (this.nDir == 3) {
                this._cardNum.y = this._cardNum.height * .5 - 12;
            }
        }

        if (this.nDir == 2 || this.nDir == 4) {
        }
    }

    public back(): void {
        if (this._frondBg)this._frondBg.visible = false;
        if (this._cardNum)this._cardNum.visible = false;
        if (this._standBg)this._standBg.visible = false;
        if (this._backBg)this._backBg.visible = true;
    }

    public destroy(): void {
        if (this._standBg) {
            DisplayObjectUtil.removeForParent(this._standBg);
            this._standBg = null;
        }
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