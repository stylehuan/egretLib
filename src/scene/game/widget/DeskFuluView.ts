/**
 * Created by stylehuan on 2016/8/17.
 */
class DeskFuluView extends egret.Sprite {
    private nDir: number;

    public constructor(nDir) {
        super();
        this.nDir = nDir;

        this.makeLen = 12;
        if (this.nDir != 2) {
            this.makeLen = 0;
        }

    }

    private makeLen: number;//

    private adaptiveGroup(groupSpr: egret.DisplayObjectContainer, cardItem: any, curIndex: number, makeIndex: number): void {
        if (this.nDir == 1 || this.nDir == 3) {
            cardItem.x = 0;
            if (groupSpr.numChildren) {
                cardItem.x = groupSpr.width;
            }

            if (curIndex == makeIndex) {
                cardItem.y = 0;
                if (this.nDir == 3) {
                    cardItem.y = 15;
                }
            }
        } else {
            if (this.nDir == 2) {
                if (curIndex == makeIndex) {
                    cardItem.x = this.makeLen * cardItem.scaleX * 6 + 16 - (12 - this.makeLen) * cardItem.scaleX;
                    cardItem.y = -groupSpr.height - cardItem.height + 25 * cardItem.scaleY;
                } else {
                    cardItem.x = this.makeLen * cardItem.scaleX * 6;
                    cardItem.y = -groupSpr.height - cardItem.height + 18 * cardItem.scaleY;
                    if (makeIndex != 0) {
                        cardItem.y = -groupSpr.height - cardItem.height + 20 * cardItem.scaleY;
                    }
                }

                if (groupSpr.height == 0) {
                    cardItem.y = -cardItem.height;
                }
            } else {
                cardItem.y = groupSpr.height;

                if (curIndex == makeIndex) {
                    if (this.makeLen == 0) {
                        cardItem.x = 6
                    } else {
                        // cardItem.x = -this.makeLen * cardItem.scaleX * 4 - 6 + this.makeLen * cardItem.scaleX;
                        cardItem.x = -this.makeLen * cardItem.scaleX * 6;
                    }

                    // if (makeIndex == 0) {
                    //     cardItem.x -= 4 * cardItem.scaleX;
                    // }
                } else {
                    cardItem.x = -this.makeLen * cardItem.scaleX * 5;
                }

                if (groupSpr.height != 0) {

                    cardItem.y = groupSpr.height - 20 * cardItem.scaleY;
                }
            }
        }
        groupSpr.addChild(cardItem);

        if (groupSpr.numChildren && this.nDir == 2) {
            groupSpr.setChildIndex(cardItem, 0);
        }
    }

    private adaptiveCardItem(card: any, curIndex: number, makeIndex: number): any {
        var scaleBase = 0.8;
        if (this.nDir == 1 || this.nDir == 3) {
            if (this.nDir == 1) {
                card.scaleX = card.scaleY = scaleBase;
            }
        } else {
            if (this.nDir == 2) {
                card.scaleX = card.scaleY = 0.88 + this.makeLen / 100;
                if (curIndex == makeIndex) {
                    card.width -= 15;
                    // card.scaleX = card.scaleY = (scaleBase - 0.1) + this.makeLen / 100;
                    card.scaleX = card.scaleY = (scaleBase) + this.makeLen / 100;
                }
            } else {
                card.scaleX = card.scaleY = scaleBase + this.makeLen / 100;
                if (curIndex == makeIndex) {
                    card.width -= 15;
                    card.scaleX = card.scaleY = (scaleBase - 0.1) + this.makeLen / 100;
                }
            }
        }


        if (this.nDir != 2) {
            this.makeLen += 1;
        } else {
            this.makeLen -= 1;
        }

        return card;
    }

    private sortHandler(arr: Array<number>): Array<number> {
        return arr.sort((n1, n2) => CardData.getCardIndex(n1) - CardData.getCardIndex(n2));
    }

    public addCPMgCard(arrCards: Array<number>, cardId: number, fromDir: number): void {
        var cardData = this.sortCard(arrCards, cardId, fromDir);
        var card: any;
        var _groupSpr: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();

        var makeIndex: number = cardData.indexOf(cardId);

        for (var i = 0; i < cardData.length; i++) {
            if (i == makeIndex) {
                card = new CardFuluMake(this.nDir, i, cardId);
            } else {
                card = new CardFulu(this.nDir);
                card.id = cardData[i];
                card.frond();
            }

            //适配单牌
            card = this.adaptiveCardItem(card, i, makeIndex);

            //适配单组
            this.adaptiveGroup(_groupSpr, card, i, makeIndex);
        }

        this.adaptView(_groupSpr);

        //碰杠需要
        _groupSpr.name = CardData.getCardIndex(cardId) + "_" + fromDir;
    }

    public addAnGang(arrCards: Array<number>): void {
        var card: CardFulu;
        var _groupSpr: egret.Sprite = new egret.Sprite();
        var _isShow: boolean = WGManager.getInstance().isWgIng();
        for (var i = 0; i < arrCards.length; i++) {
            card = new CardFulu(this.nDir);

            if (_isShow || (this.nDir == 3 && (i == 0 || i == 3))) {
                card.id = arrCards[i];
                card.frond();
            } else {
                card.back();
            }

            //适配单牌
            card = this.adaptiveCardItem(card, 0, -1);

            //适配单组
            this.adaptiveGroup(_groupSpr, card, 0, -1);
        }

        _groupSpr.name = "anGang";

        this.adaptView(_groupSpr);
    }

    public addPengGang(cardId: number): void {
        var name: string = CardData.getCardIndex(cardId) + "";
        var child: egret.Sprite;
        var from: string;
        var card: any;

        for (var i: number = 0; i < this.numChildren; i++) {
            var groupItem: egret.Sprite = <egret.Sprite>(this.getChildAt(i));
            var _propty: string = groupItem.name.split("_")[0];

            if (_propty == name) {
                child = groupItem;
                from = groupItem.name.split("_")[1];
                break;
            }
        }

        if (!child) return;
        card = new CardFuluMake(this.nDir, parseInt(from), cardId);
        var tIndex: number = parseInt(from);

        if (this.nDir == 2) {
            tIndex = 2 - tIndex;
        }

        var fromCard: CardFuluMake = <CardFuluMake>(child.getChildAt(tIndex));
        //适配单牌
        card.x = fromCard.x;
        card.y = fromCard.y;
        card.scaleX = fromCard.scaleX;
        card.scaleY = fromCard.scaleY;

        if (this.nDir == 1 || this.nDir == 3) {
            card.y = (fromCard.height - 17) * fromCard.scaleX;
            if (this.nDir == 3) {
                card.y = -8;
            }
        } else {
            if (this.nDir == 2) {
                card.x -= card.width * card.scaleX - 10;
            } else {
                card.x += card.width * card.scaleX - 10;
            }
        }
        child.addChild(card);

        if (child.numChildren) {
            if (this.nDir == 2) {
                child.setChildIndex(card, tIndex + 1);
            } else if (this.nDir == 3) {
                child.setChildIndex(card, 0);
            }else if(this.nDir == 4){
                child.setChildIndex(card, tIndex + 1);
            }
        }
    }

    private adaptView(groupSpr: egret.DisplayObjectContainer): void {
        var space = 5;

        if (this.nDir == 3) {
            groupSpr.x = this.width + space;
            if (this.width == 0) {
                groupSpr.x = this.width;
            }
        } else if (this.nDir == 1) {
            groupSpr.x = -this.width - groupSpr.width - space;
            if (this.width == 0) {
                groupSpr.x = -groupSpr.width;
            }
        } else if (this.nDir == 2) {
            groupSpr.y = -this.height + 15;
            if (this.height == 0) {
                groupSpr.y = 0;
            }
        } else {
            groupSpr.y = this.height - 15;
            if (this.height == 0) {
                groupSpr.y = 0;
            }
        }

        // groupSpr.graphics.beginFill(0x336699);
        // groupSpr.graphics.drawRect(0, 0, groupSpr.width, groupSpr.height);
        // groupSpr.graphics.endFill();

        this.addChild(groupSpr);

        if (this.numChildren && this.nDir == 2) {
            this.setChildIndex(groupSpr, 0);
        }
    }

    public showAnGang(arr: Array<number>): void {
        var len: number = arr.length;
        var _groups: Array<egret.Sprite> = this.findGroupByName("anGang");

        for (var i = 0; i < len; i++) {
            //没有组了
            if (arr[i] < 0) break;

            if (_groups && _groups[i]) {
                // for (var j = 0; j < _groups[i].numChildren; j++) {
                //     var card = <CardFulu>(_groups[i][j]);
                //     card.id = arr[i];
                //     card.frond();
                // }
            }
        }
    }

    private findGroupByName(name: string): Array<egret.Sprite> {
        var _arr: Array<egret.Sprite> = [];

        for (var i: number = 0; i < this.numChildren; i++) {
            var _groupItem = <egret.Sprite>(this.getChildAt(i));

            if (_groupItem.name == name) {
                _arr.push(_groupItem);
            }
        }

        return _arr;
    }

    private sortCard(arr: Array<number>, curCardId: number, fromDir: number): Array<number> {
        arr = this.sortHandler(arr);

        //顶部和下家的牌鸣要倒序
        if (this.nDir == 1) {
            arr.reverse()
        }

        if (fromDir == 0) {
            arr.unshift(curCardId);
        }
        else if (fromDir == 1) {
            arr.splice(1, 0, curCardId);
        }
        else if (fromDir == 2) {
            arr.push(curCardId);
        }
        return arr;
    }
}