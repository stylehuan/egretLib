/**
 * Created by stylehuan on 2016/8/4.
 */
class DeskPoolContainer extends egret.Sprite {
    public constructor(nDir: number) {
        super();
        this.nDir = nDir;
        this.setup();
    }

    private nDir: number;
    private cardSpr: egret.DisplayObjectContainer;

    private setup(): void {
        this.cardSpr = new egret.DisplayObjectContainer();
        this.addChild(this.cardSpr);

        if (this.nDir == 3) {
            this._skewTotal = 2;
        } else if (this.nDir == 1) {
            this._skewTotal = -2;
        }
    }

    private _skewTotal: number = 1;


    private daChuMask: egret.DisplayObjectContainer;

    public addNewCard(cardId: number): void {
        this.addCard(cardId);

        this.createDachuMask();
    }

    private createDachuMask(): void {
        this.daChuMask = new egret.DisplayObjectContainer();
        var maskBg: egret.Bitmap = new egret.Bitmap();
        maskBg.texture = RES.getRes("game.pool_mask");
        maskBg.alpha = .8;
        this.daChuMask.addChild(maskBg);

        TweenMax.to(maskBg, .4, {
            y: 7, yoyo: true, repeat: -1
        });

        this.addChild(this.daChuMask);

        var lastCard = this.getLastCard();
        this.daChuMask.x = lastCard.x + (lastCard.width * .5 - this.daChuMask.width * .5);
        this.daChuMask.y = lastCard.y - lastCard.height * .5;

        if (this.nDir == 1 || this.nDir == 3) {
            this.daChuMask.y = lastCard.y - (lastCard.height * .5 - 10);
        }

        this.daChuMask.visible = false;
    }

    public clearDaChuMask(): void {
        if (this.daChuMask) {
            DisplayObjectUtil.removeForParent(this.daChuMask);
            this.daChuMask = null;
        }
    }


    public addCard(cardId: number): void {
        var card: CardPool = new CardPool(this.nDir);
        var _cell: number = this.cardSpr.numChildren % 6;
        var _line: number = Math.floor(this.cardSpr.numChildren / 6);
        card.id = cardId;
        card.frond();

        if (_cell < 0) _cell = 0;

        if (this.nDir == 1 || this.nDir == 3) {
            if (this.nDir == 3) {
                card.scaleX = card.scaleY = 1 + _line * 0.01;

                card.x = (card.width * card.scaleX) * _cell - _line * 1;
                card.y = ((card.height - 18) * card.scaleY) * _line;

                //注意：偏移设置后会改变宽度属性
                card.skewX = this._skewTotal - _cell;
            } else {
                _cell += 1;
                _line += 1;

                card.scaleX = card.scaleY = 0.9 - _line * 0.01;

                if (_cell == 1) {
                    card.x = -card.width * card.scaleX;
                } else {
                    card.x = -(card.width * card.scaleX - 1) * _cell;
                }

                card.y = -((card.height - 18) * card.scaleY) * _line;

                //注意：偏移设置后会改变宽度属性
                card.skewX = this._skewTotal + _cell - 1;
            }
        } else {
            if (this.nDir == 2) {
                _cell += 1;

                card.scaleX = card.scaleY = 1 - (_cell - 1) * 0.01;

                card.x = ((card.width - 6) * card.scaleX) * _line - _cell * 1;

                card.y = -((card.height - 20) * card.scaleY) * _cell;
            } else {
                _line += 1;

                card.scaleX = card.scaleY = 1 + _cell * 0.01;

                card.x = -((card.width - 6) * card.scaleX) * _line - _cell * 1;
                card.y = ((card.height - 20) * card.scaleY) * _cell;
            }
        }
        if (card) {
            this.cardSpr.addChild(card);
            if (this.nDir == 1 || this.nDir == 2) {
                if (this.cardSpr.numChildren) {
                    this.cardSpr.setChildIndex(card, 0);
                }
            }
            if (this.nDir == 4) {
                this.cardSpr.setChildIndex(card, (this.cardSpr.numChildren - 1) % 6);
            }

            card.visible = false;
            this._lastCard = card;
        }
    }

    private _lastCard: CardPool;

    public showLastCard(): void {
        if (this._lastCard) {
            this._lastCard.visible = true;
        }

        if (this.daChuMask) {
            this.daChuMask.visible = true;
        }
    }

    public clearLastCard(): void {
        var lastCard: CardPool = this.getLastCard();

        if (lastCard) {
            DisplayObjectUtil.removeForParent(lastCard);
            lastCard = null;
        }
    }

    public getLastCard(): CardPool {
        return this._lastCard;
    }
}