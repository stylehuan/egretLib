class DeskPlayerView extends egret.Sprite {

    private nDir: number;
    public nChairNO: number;
    public userId: number;

    private cardSpr: egret.DisplayObjectContainer;
    private fuLuSpr: DeskFuluView;

    private _horizontalSpace: number = 10;//标示水平上新摸牌的空间
    private _verticalSpace: number = 10;//标示垂直上新摸牌的空间

    public isOpen: boolean;

    public constructor(dir: number, chairNo: number) {
        super();
        this.nDir = dir;
        this.nChairNO = chairNo;
        //this.userId = userId;

        this.isOpen = WGManager.getInstance().isWgIng();

        this.cardSpr = new egret.DisplayObjectContainer();
        this.fuLuSpr = new DeskFuluView(this.nDir);

        this.addChild(this.fuLuSpr);
        this.addChild(this.cardSpr);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.removeFromStageHandler, this);

        if (this.nDir == 3 && !WGManager.getInstance().isWgIng()) {
            this.cardSpr.touchChildren = true;
            this.cardSpr.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onDoThrowCardHandler, this);
            this.cardSpr.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.onOverCard, this);
            this.cardSpr.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.onOutCard, this);
        }


        this.redrawByBrowser();
    }

    private onOverCard(e: egret.TouchEvent): void {
        var CardHand: CardHand = <CardHand>(e.target);
        CardHand.up();
    }

    private onOutCard(e: egret.TouchEvent): void {
        var CardHand: CardHand = <CardHand>(e.target);

        CardHand.down();
    }

    private onDoThrowCardHandler(e: egret.TouchEvent): void {
        var CardHand: CardHand = <CardHand>(e.target);

        //不是游戏中
        if (!GameStatus.isGamePlaying()) return;

        //没轮到自己
        if (DeskManager.getInstance().actChairNo != DeskManager.getInstance().nChairNo) return;

        //是否锁定状态
        if (!DeskManager.getInstance().isAllowDaChu) return;
        DeskManager.getInstance().isAllowDaChu = false;

        this.sendCard(CardHand);
    }

    public sendCard(CardHand: CardHand): void {
        var cThrowCard: CGameThrowCards = new CGameThrowCards();
        cThrowCard.nUserID.value = SystemCenter.playSystem.selfPlayerInfo.userID;
        cThrowCard.nCardID.value = CardHand.id;
        cThrowCard.dwFlags.value = 0;

        var sendData: egret.ByteArray = new egret.ByteArray();
        CSerializable.Serialization(cThrowCard, sendData);

        if (CardHand) {
            this.throwCardHandler(CardHand, CardHand.id);
        }
        SQGameServer.getInstance().sendCmd(Global.GR_THROW_CARDS, sendData);
    }

    public autoMd(): void {
        var card: CardHand = this.getLastCard();
        if (card) {
            this.sendCard(card);
        }
    }

    private removeCardItem(cardId: number = -1): void {
        var _card: CardHand;
        if (cardId > -1) {
            for (var i: number = 0; i < this.cardSpr.numChildren; i++) {
                _card = <CardHand>(this.cardSpr.getChildAt(i));

                if (_card) {
                    if (cardId == _card.id) {
                        DisplayObjectUtil.removeAllChild(_card);
                        DisplayObjectUtil.removeForParent(_card);
                        break;
                    }
                }
            }
        } else {
            var _len = this.cardSpr.numChildren;
            var _random = RandomUtil.getRandom(0, _len);

            _card = <CardHand>(this.cardSpr.getChildAt(_random));
            if (_card) {
                DisplayObjectUtil.removeAllChild(_card);
                DisplayObjectUtil.removeForParent(_card);
            }

        }
    }

    private createNewCard(cardId: number): CardHand {
        var _card = new CardHand(this.nDir);
        if (cardId > -1) {
            _card.id = cardId;
        } else {
            this.isOpen = false;
        }

        if (this.nDir == 1) {
            _card.scaleX = _card.scaleY = .6
        }

        if (this.isOpen) {
            _card.frond();
        } else {
            _card.stand();
        }

        return _card;
    }

    private addCard(CardHand: CardHand): void {
        if (!CardHand) return;

        this.cardSpr.addChild(CardHand);
        if (this.nDir == 2) {
            this.cardSpr.setChildIndex(CardHand, 0);
        }
    }

    private isCatchCard: boolean = false;
    //摸牌
    public catchCard(cardId: number): void {
        var _card = this.createNewCard(cardId);

        this.isCatchCard = true;
        this.setCardStyle(_card);

        var _offsetX: number = 0, _offsetY: number = 0;
        switch (this.nDir) {
            case 1:
                _offsetX = _card.x - this._horizontalSpace;
                break;
            case 2:
                _offsetX = _card.x;
                _offsetY = _card.y - this._verticalSpace;
                break;
            case 3:
                _offsetX = _card.x + this._horizontalSpace;
                break;
            case 4:
                _offsetX = _card.x - 2;
                _offsetY = _card.y + this._verticalSpace;
                break;
        }

        _card.x = _offsetX;
        _card.y = _offsetY;
        this.addCard(_card);
    }

    /*
     * 1、获取打出牌的索引
     * 2、删除打出的牌
     * 3、排序
     * 4、获取最后最后一项的索引
     * 5、移动
     * */
    public throwCard(cardId: number): void {
        //获取打出牌的index
        var _handData: Array<any> = PlayerManager.getPlayerHandData(this.nChairNO);
        var dataLength = _handData.length;

        var _delCardIndex: number = _handData.indexOf(cardId);
        var cardHand: CardHand;
        var isMq: boolean = false;//是否是摸切

        if (this.nDir == 3 || (WGManager.getInstance().isWgIng() && WGManager.getInstance().isShowOtherCardHand)) {
            var _lastCardId: number = _handData[_handData.length - 1];

            if (_lastCardId == cardId) {
                isMq = true;
            }
        }

        if (this.nDir != 3) {
            //不是围观，或者围观下没有显示手牌
            if (!WGManager.getInstance().isWgIng() || !WGManager.getInstance().isShowOtherCardHand) {
                PlayerManager.delCardData(this.nChairNO, -1);
            } else {
                PlayerManager.delCardData(this.nChairNO, cardId);
            }
        } else {
            PlayerManager.delCardData(this.nChairNO, cardId);
        }

        dataLength = PlayerManager.getPlayerHandData(this.nChairNO).length;

        //非围观下的其他视角
        if (_delCardIndex == -1) {
            //随机删除
            _delCardIndex = RandomUtil.getRandom(0, dataLength);
            // _delCardIndex = 5;
            if (this.nDir == 2) {
                _delCardIndex = dataLength - _delCardIndex;
            }
            cardHand = this.getCardByIndex(_delCardIndex);
        } else {
            cardHand = this.getCard(cardId);

            if (this.nDir == 2) {
                // _delCardIndex = (len - 1) - _delCardIndex;
                _delCardIndex = dataLength - _delCardIndex;
            }
        }

        console.log("_delCardIndex-----------" + _delCardIndex);

        this.throwCardHandler(cardHand, cardId);
        this.doMoveCards(_delCardIndex, isMq);
        this.isCatchCard = false;
    }

    private doMoveCards(delCardIndex: number, isMq: boolean): void {
        var _handData = PlayerManager.getPlayerHandData(this.nChairNO);
        var len = _handData.length;
        var _insetIndex: number;
        //判断是否是摸牌后出牌
        if (this.isCatchCard) {
            var _lastCardId: number = _handData[_handData.length - 1];

            if (_lastCardId != -1) {
                PlayerManager.getPlayerData(this.nChairNO).sortHandData();

                //排序后重新获取
                _handData = PlayerManager.getPlayerHandData(this.nChairNO);
                _insetIndex = _handData.indexOf(_lastCardId);
            }
            //其他玩家 随机
            else {
                _insetIndex = RandomUtil.getRandom(0, len);
            }

            if (this.nDir == 2) {
                _insetIndex = len - 1 - _insetIndex;
                // _insetIndex = 12;
            }

            console.log("delCardIndex--------->:" + delCardIndex);
            console.log("_insetIndex--------->:" + _insetIndex);

            if (isMq) return;
            this.moveCards(delCardIndex, _insetIndex);
            this.insetCard(_insetIndex);
        } else {
            this.flBeforeMoveCards(delCardIndex);
        }
    }

    private throwCardHandler(cardHand: CardHand, cardId: number): void {
        if (cardHand) {
            this.daChuToPool(cardId);
            cardHand.id = cardId;
            this.showThrowAnimation(cardHand);
        }
    }

    private daChuToPool(cardId: number): void {
        var pool = DeskManager.getInstance().getCardPoolByDir(this.nDir);
        pool.addNewCard(cardId)
    }

    private showThrowAnimation(CardHand: CardHand): void {
        var _targetPoint: egret.Point;
        var _sourcePoint: egret.Point = CardHand.localToGlobal(0, 0);
        CardHand.frond();
        LayerManager.GameLayer.addChild(CardHand);
        CardHand.x = _sourcePoint.x;
        CardHand.y = _sourcePoint.y;

        var poolSpr: DeskPoolContainer = DeskManager.getInstance().getCardPoolByDir(this.nDir)
        var lastCard: CardPool = poolSpr.getLastCard();

        if (lastCard) {
            _targetPoint = lastCard.localToGlobal(0, 0);
        }
        TweenMax.to(CardHand, .4, {
            //x: _targetPoint.x,
            //y: _targetPoint.y,
            scaleX: 0.7,
            scaleY: 0.7,
            bezier: {
                values: [
                    {
                        x: CardHand.x + (_targetPoint.x - CardHand.x) * .5,
                        y: CardHand.y + (_targetPoint.y - CardHand.y) * .5 - 120
                    },
                    {x: _targetPoint.x, y: _targetPoint.y}
                ]
            },
            onComplete: function (): void {
                poolSpr.showLastCard();
                DisplayObjectUtil.removeForParent(CardHand);
            },
            onCompleteParams: [CardHand],
            ease: Cubic.easeInOut
        });
    }

    /*绘制单个手牌
     * */
    public drawCards(cardId: number): void {
        var _card = this.createNewCard(cardId);
        this.isCatchCard = false;

        if (this.nDir == 2) {
            this.cardSpr.x = 4;
            if (this.isOpen) {
                this.cardSpr.x = -16;
            }
        }

        this.setCardStyle(_card);
        this.addCard(_card);
    }

    private setCardStyle(CardHand: CardHand): void {
        if (!CardHand) return;
        var len = this.cardSpr.numChildren;
        var dataLen = PlayerManager.getPlayerHandData(this.nChairNO).length;
        var index = len;
        var total = 13;

        if (this.isCatchCard) {
            total = 14;
        }

        if (this.nDir == 1) {
            index = (dataLen - 1) - len;
        } else if (this.nDir == 2) {
            index = (dataLen - 1) - len;
        } else if (this.nDir == 4) {
            // index = dataLen - dataLen + len;
            index = total - dataLen + len;
        }

        //如果是摸牌
        if (this.isCatchCard) {
            if (this.nDir == 1 || this.nDir == 2) {
                index = -1;
            }
        }
        var cardStyle: Object = this.cardStyleFactory(index, CardHand);
        for (var key in cardStyle) {
            if (cardStyle.hasOwnProperty(key)) {
                if (cardStyle[key]) {
                    CardHand[key] = cardStyle[key];
                }
            }
        }
    }

    private cardStyleFactory(index: number, CardHand: CardHand): Object {
        var offsetX: number = 0, offsetY: number = 0, scale: number = 0;
        var _o: Object = new Object();

        if (this.nDir == 1 || this.nDir == 3) {
            offsetX = index * CardHand.scaleX * (CardHand.width - 4);
        } else {
            var baseY: number = 22;
            var _baseVal: number = 6;
            CardHand.scaleX = CardHand.scaleY = 0.86 + index / 100;
            if (this.isOpen) {
                baseY = 20;
                _baseVal = 5.6;
                CardHand.scaleX = CardHand.scaleY = 1 + index / 100;
            }

            if (this.nDir == 2) {
                offsetX = index * _baseVal;
            } else {
                offsetX = -index * _baseVal;
            }

            offsetY = index * (baseY + CardHand.scaleX + index / 10);
        }

        _o["x"] = offsetX ? offsetX : null;
        _o["y"] = offsetY ? offsetY : null;

        return _o;
    }

    //吃碰明杠
    public addCPMgCard(arrCards: Array<number>, cardId: number, fromDir: number): void {
        this.fuLuSpr.addCPMgCard(arrCards, cardId, fromDir);
    }

    public addAnGang(arr: Array<number>): void {
        this.fuLuSpr.addAnGang(arr);
    }

    public addPengGang(cardId: number): void {
        this.fuLuSpr.addPengGang(cardId);
    }

    public flBeforeMoveCards(delCardIndex: number): void {
        var dataLength = PlayerManager.getPlayerHandData(this.nChairNO).length;
        var _anmition = function (_card, o) {
            TweenMax.to(_card, 1, o);
        };

        if (this.nDir == 4 || this.nDir == 1) {
            for (var i: number = 0; i < delCardIndex; i++) {
                var _card: CardHand = <CardHand>(this.cardSpr.getChildAt(i));
                var _index = 13 - dataLength + i;
                if (this.nDir == 1) {
                    _index = (13 - (13 - dataLength) - 1) - i;
                }

                var obj = this.cardStyleFactory(_index, _card);
                _anmition(_card, obj)
            }
        } else {
            for (var i: number = delCardIndex; i < dataLength; i++) {
                var _card: CardHand = <CardHand>(this.cardSpr.getChildAt(i));

                var _index = i;

                if (this.nDir == 1) {
                    _index = dataLength - _index;
                } else if (this.nDir == 4) {
                    _index = 13 - dataLength + _index;
                }
                var obj = this.cardStyleFactory(_index, _card);
                _anmition(_card, obj)
            }
        }
    }

    public moveCards(delCardIndex: number, insetIndex: number): void {
        if (delCardIndex == -1) return;
        if (insetIndex == -1) return;

        if (this.nDir == 2) {
            insetIndex += 1;
        }

        var dataLength = PlayerManager.getPlayerHandData(this.nChairNO).length;
        var min: number = Math.min(delCardIndex, insetIndex);
        var max: number = Math.max(delCardIndex, insetIndex);
        var _anmition = function (_card, o) {
            TweenMax.to(_card, .5, o);
        };

        for (var i: number = min; i < max; i++) {
            var _card: CardHand = <CardHand>(this.cardSpr.getChildAt(i));

            //已经删掉了，索引自动+1
            var _index = i + 1;
            if (delCardIndex < insetIndex) {
                _index = _index - 1;
            }

            if (this.nDir == 1) {
                _index = (dataLength - 1) - _index;
            } else if (this.nDir == 2) {
                _index -= 1;
            } else if (this.nDir == 4) {
                // _index = dataLength - dataLength + _index;
                _index = 13 - dataLength + _index;
            }

            var obj = this.cardStyleFactory(_index, _card);

            _anmition(_card, obj)
        }
    }

    private insetCard(index: number): void {
        var CardHand: CardHand;
        var dataLength = PlayerManager.getPlayerHandData(this.nChairNO).length;
        var cardIndex: number = 0;
        var self = this;
        var transitionIndex = index;
        var _config = new Object();
        var isDirectMove = false;

        if (this.nDir == 2) {
            if (index == 0) {
                isDirectMove = true;
            }
        } else if (index == dataLength - 1) {
            isDirectMove = true;
        }

        if (dataLength == 0) return;

        //取最后一个
        if (this.nDir != 2) {
            cardIndex = dataLength - 1;
        }

        CardHand = <CardHand>(this.cardSpr.getChildAt(cardIndex));

        if (this.nDir == 1) {
            transitionIndex = (dataLength - 1) - index;
        }
        // else if (this.nDir == 2) {
        //     transitionIndex -= 1;
        // }
        else if (this.nDir == 4) {
            transitionIndex = 13 - dataLength + index;
        }

        if (CardHand) {
            var obj = this.cardStyleFactory(transitionIndex, CardHand);

            if (self.nDir == 3) {
                self.cardSpr.setChildIndex(CardHand, transitionIndex);
            }

            var step1 = function () {
                _config = new Object();
                _config["y"] = CardHand.y - CardHand.height * CardHand.scaleX;
                _config["onComplete"] = function (): void {
                    if (self.cardSpr) {
                        if (self.nDir == 1) {
                            self.cardSpr.setChildIndex(CardHand, (dataLength - 1) - transitionIndex);
                        } else if (self.nDir == 2) {
                            self.cardSpr.setChildIndex(CardHand, transitionIndex);
                        }
                    }
                    step2();
                };
                _config["ease"] = Back.easeOut;
                TweenMax.to(CardHand, .5, _config);
            };

            var step2 = function () {
                _config = new Object();
                _config["x"] = obj["x"];
                if (self.nDir == 2) {
                    _config["y"] = obj["y"] - CardHand.scaleX * CardHand.width;
                } else if (self.nDir == 4) {
                    _config["y"] = obj["y"] - CardHand.scaleX * CardHand.width;
                }

                _config["onComplete"] = function (): void {
                    if (self.nDir == 4) {
                        if (CardHand.parent) {
                            self.cardSpr.setChildIndex(CardHand, index);
                        }
                    }
                    step3();
                };
                TweenMax.to(CardHand, .5, _config);
            };
            var step3 = function () {
                _config = new Object();
                _config["y"] = 0;
                if (self.nDir == 2 || self.nDir == 4) {
                    _config["y"] = obj["y"];
                }
                _config["onComplete"] = function (): void {

                };
                TweenMax.to(CardHand, .5, _config);
            };
            var move = function () {
                _config = new Object();
                _config["x"] = obj["x"];
                _config["y"] = 0;
                if (self.nDir == 2 || self.nDir == 4) {
                    _config["y"] = obj["y"];
                }

                _config["onComplete"] = function (): void {
                    if (self.cardSpr) {
                        if (self.nDir == 1) {
                            self.cardSpr.setChildIndex(CardHand, (dataLength - 1) - transitionIndex);
                        } else if (self.nDir == 2) {
                            self.cardSpr.setChildIndex(CardHand, transitionIndex);
                        } else if (self.nDir == 4) {
                            self.cardSpr.setChildIndex(CardHand, index);
                        }
                    }
                };
                TweenMax.to(CardHand, .5, _config);
            };

            if (!isDirectMove) {
                step1();
            } else {
                move();
            }
        }
    }

    public buHua(cardId: number): void {
        if (this.cardSpr && this.cardSpr.numChildren) {
            if (cardId != -1) {
                this.removeCardItem(cardId);
            } else {
                //如果没有，取最后一张
                var _childAt: number = this.cardSpr.numChildren - 1;
                if (this.nDir == 2) {
                    _childAt = 0;
                }
                var CardHand: CardHand = <CardHand>(this.cardSpr.getChildAt(_childAt));
                DisplayObjectUtil.removeForParent(CardHand);
            }
        }
    }

    public cardUp(id: number): void {
        for (var i: number = 0; i < this.cardSpr.numChildren; i++) {
            var CardHand: CardHand = <CardHand>(this.cardSpr.getChildAt(i));

            if (CardHand.id == id) {
                CardHand.y -= 10;
            }
        }
    }

    public toLieBack(): void {
        for (var i = 0; i < this.cardSpr.numChildren; i++) {
            var CardHand = <CardHand>(this.cardSpr.getChildAt(i));
            CardHand.back();
        }
    }

    public toStand(): void {
        this.isOpen = false;
        this.resetDrawCard();

        if (this.nDir == 2) {
            this.cardSpr.x = 4;
        }

        // for (var i = 0; i < this.cardSpr.numChildren; i++) {
        //     var CardHand = <CardHand>(this.cardSpr.getChildAt(i));
        //     CardHand.stand();
        // }
    }

    public toFrond(): void {
        var handData: Array<any> = PlayerManager.getPlayerHandData(this.nChairNO);
        // if (this.nDir == 2) {
        //     handData.reverse();
        // }

        this.isOpen = true;
        this.resetDrawCard();

        if (this.nDir == 2) {
            this.cardSpr.x = -16;
        }

        // for (var i = 0; i < this.cardSpr.numChildren; i++) {
        //     var CardHand = <CardHand>(this.cardSpr.getChildAt(i));
        //     CardHand.id = handData[i];
        //     CardHand.frond();
        // }
    }

    private getCard(cardId: number): CardHand {
        for (var i = 0; i < this.cardSpr.numChildren; i++) {
            var CardHand = <CardHand>(this.cardSpr.getChildAt(i));
            if (CardHand.id == cardId) {
                return CardHand
            }
        }
        return null;
    }

    private getCardByIndex(index: number): CardHand {
        return <CardHand>(this.cardSpr.getChildAt(index));
    }

    public getLastCard(): CardHand {
        var len = this.cardSpr.numChildren;

        if (this.nDir != 2) {
            return <CardHand>(this.cardSpr.getChildAt(len - 1));
        }
        return <CardHand>(this.cardSpr.getChildAt(0));
    }

    public sortHand(): void {
        PlayerManager.getPlayerData(this.nChairNO).sortHandData();
    }

    public resetDrawCard(): void {
        var data: Array<number> = PlayerManager.getPlayerHandData(this.nChairNO).concat();
        console.log("data:" + data.length);
        if (GameStatus.isGameEnd() && !this.isOpen) return;


        // if (this.nDir == 1 || this.nDir == 2) {
        //     data.reverse();
        // }

        if (this.cardSpr) {
            this.cardSpr.removeChildren();
        }

        for (var i: number = 0; i < data.length; i++) {
            this.drawCards(data[i]);
        }
        //
        // this.graphics.beginFill(0x336699);
        // this.graphics.drawRect(0, 0, this.width, this.height);
        // this.graphics.endFill();
    }

    private removeFromStageHandler(e: egret.Event): void {
        this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.removeFromStageHandler, this);
        this.destroy();
    }

    public redrawByBrowser(): void {
        if (this.nDir == 3) {
            this.x = 210;
            this.y = LayerManager.stage.stageHeight - 35 - this.height;
            this.fuLuSpr.y = 28;
            this.cardSpr.x = this.fuLuSpr.width + 5;
        } else if (this.nDir == 1) {
            this.y = 20;
            this.cardSpr.x = 400;
            // this.fuLuSpr.x = this.cardSpr.x + this.cardSpr.width;
            this.fuLuSpr.x = LayerManager.stage.stageWidth - 110;
            this.fuLuSpr.y = 10;
        } else if (this.nDir == 2) {
            this.x = LayerManager.stage.stageWidth - 130;
            // this.fuLuSpr.y = this.cardSpr.x + this.cardSpr.height;
            this.fuLuSpr.x = 10;
            this.fuLuSpr.y = LayerManager.stage.stageHeight - 110;
            this.cardSpr.x = 4;
            this.cardSpr.y = 110;

            if (this.nDir == 2) {
                if (this.isOpen) {
                    this.cardSpr.x = -16;
                }
            }
        } else {
            this.x = 100;
            this.cardSpr.y = 110;
            this.cardSpr.x = -10;

            this.fuLuSpr.x = 15;
            this.fuLuSpr.y = 50;
        }
    }

    public destroy(): void {
        TweenMax.killChildTweensOf(this, true);
        if (this.cardSpr) {
            DisplayObjectUtil.removeAllChild(this.cardSpr);
            DisplayObjectUtil.removeForParent(this.cardSpr);
            this.cardSpr = null;
        }
        if (this.fuLuSpr) {
            DisplayObjectUtil.removeAllChild(this.fuLuSpr);
            DisplayObjectUtil.removeForParent(this.fuLuSpr);
            this.fuLuSpr = null;
        }
    }
}