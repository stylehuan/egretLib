class CardMountain extends egret.Sprite {
    private nDir: number = 0;
    private _container: egret.DisplayObjectContainer;
    private _width: number = 0;
    private _height: number = 0;
    public curBegin: number = 0;

    public constructor(dire: number = 0) {
        super();
        this.nDir = dire;
        this.arrCard = new Object();

        this.drawCard();

        if (WGManager.getInstance().isCompereIng && WGManager.getInstance().isShowCardMount) {
            this.isShowCard = true;
            this.showCards();
        }
        this.redrawByBrowser();
    }

    private isShowCard: boolean = false;

    public chooseStyle(b: boolean): void {
        if (this.isShowCard == b) return;
        this.isShowCard = b;
        b ? this.showCards() : this.hideCards();
    }

    //显示牌山
    private showCards(): void {
        if (this.arrCard) {
            for (var key in this.arrCard) {
                if (this.arrCard.hasOwnProperty(key)) {
                    var cardItem: CardMount = <CardMount>(this.arrCard[key]);
                    if (cardItem) {
                        cardItem.frond();
                    }

                    var index: number;
                    var _t: number = 0;
                    if (this.nDir == 2 || this.nDir == 4) {
                        _t = 1;
                    }


                    if (parseInt(key) % 2 == _t) {
                        if (this.nDir == 1) {
                            cardItem.y += cardItem.height * cardItem.scaleX;
                        } else if (this.nDir == 2) {
                            cardItem.x += (cardItem.width- 14) * cardItem.scaleX;
                            cardItem.y -= (cardItem.height - 24) * cardItem.scaleY;
                        } else if (this.nDir == 3) {
                            index = this._container.getChildIndex(cardItem);
                            cardItem.y -= cardItem.height * cardItem.scaleX - 30;
                            if (index > -1) {
                                index = (this._container.numChildren - 1) - index;
                                this._container.setChildIndex(cardItem, index);
                            }
                        } else {
                            cardItem.x -= (cardItem.width - 14) * cardItem.scaleX;
                            cardItem.y -= (cardItem.height - 21) * cardItem.scaleY;
                        }
                    }
                }
            }
        }
    }

    private hideCards(): void {
        if (this.arrCard) {
            var make: number = 0;

            for (var k in this.arrCard) {
                if (this.arrCard.hasOwnProperty(k)) {
                    var cardItem: CardMount = <CardMount>(this.arrCard[k]);
                    var len: number = this._container.numChildren;

                    if (cardItem) {
                        cardItem.back();
                    }

                    var index: number;
                    var _t: number = 0;
                    if (this.nDir == 2 || this.nDir == 4) {
                        _t = 1;
                    }

                    if (parseInt(k) % 2 == _t) {
                        if (this.nDir == 1) {
                            cardItem.y -= cardItem.height * cardItem.scaleX;
                        } else if (this.nDir == 2) {
                            cardItem.x -= (cardItem.width- 14) * cardItem.scaleX;
                            cardItem.y += (cardItem.height - 24) * cardItem.scaleY;
                        } else if (this.nDir == 3) {
                            index = this._container.getChildIndex(cardItem);
                            cardItem.y += cardItem.height * cardItem.scaleX - 30;
                            if (index > -1) {
                                this._container.setChildIndex(cardItem, (len - 1) - make);
                                make += 1;
                            }
                        } else {
                            cardItem.x += (cardItem.width - 14) * cardItem.scaleX;
                            cardItem.y += (cardItem.height - 21) * cardItem.scaleY;
                        }
                    }
                }
            }
        }
    }


    public arrCard: any;

    public init(): void {

    }


    /** 析构 */
    public destroy(): void {
    }


    private drawCard(): void {
        var card: CardMount;
        var _index: number = 0;
        var _cardH: number = 16;
        var _line = 0;
        var _dataIndex = 0;
        var _skewIndex = 8;
        var _skewTotal = 10;

        var data: Array<any> = this.getCardMountData();
        var len: number = data.length;

        // if (this.nDir == 3 || this.nDir == 4) {
        //     data.reverse();
        // }
        this._container = new egret.DisplayObjectContainer();

        for (var i: number = 0; i < len; i++) {
            _index = i % 18;
            if (i % 18 == 0) {
                _line += 1;
            }
            card = new CardMount(this.nDir);

            if (this.nDir == 1 || this.nDir == 3) {
                card.x = _index * 41;
                card.y = 14;

                //if (this.nDir == 1) {
                //    _skewTotal = 8;
                //}

                card.skewX = _skewIndex * (_skewTotal / 8);
                card.scaleX = card.scaleY = .82;

                if (_index > 9) {
                    card.skewX = -_skewIndex * (_skewTotal / 8);
                }

                if (this.nDir == 1) {
                    card.x = _index * 31;
                    card.y = 12;
                    card.scaleX = card.scaleY = .62;
                    _dataIndex = (_index * 2) + 1;
                    if (_line == 2) {
                        card.y = 0;
                        _dataIndex = _index * 2;
                    }
                } else {
                    _dataIndex = (len - 1) - (_index * 2);
                    if (_line == 2) {
                        _dataIndex = (len - 1) - (_index * 2) - 1;
                        card.y = 0;
                    }
                }

                if (_index < 8) {
                    _skewIndex -= 1;
                } else {
                    if (_index == 7 || _index == 8) {
                        _skewIndex = 0;
                    } else {
                        _skewIndex += 1;
                    }
                }
            } else {
                card.scaleX = card.scaleY = 0.9 + _index / 100;
                card.x = _index * 3.4 * card.scaleX;
                card.y = _index * (_cardH + card.scaleX + _index / 10);

                if (this.nDir == 2) {
                    _dataIndex = (_index * 2) + 1;
                    if (_line == 2) {
                        _dataIndex = _index * 2;
                        card.y = _index * (_cardH + card.scaleX + _index / 10) - 18;
                    }
                } else {
                    card.x = -_index * 3.3 * card.scaleX;
                    _dataIndex = (len - 1) - (_index * 2);

                    if (_line == 2) {
                        _dataIndex = (len - 1) - (_index * 2) - 1;
                        card.y = _index * (_cardH + card.scaleX + _index / 10) - 18;
                    }
                }
            }
            this.arrCard[_dataIndex] = card;
            card.id = data[_dataIndex].value;
            card.back();
            this._container.addChild(card);
        }

        this.addChild(this._container);
    }

    private getIndex(): number {
        var _curChairNo: number = this.getChairNo(this.nDir);
        return (_curChairNo + 3) % 4;
    }

    private getCardMountData(): Array<any> {
        var _index: number = this.getIndex();
        return WGManager.getInstance().wallData.slice(_index * 36, (_index + 1) * 36);
    }

    private getChairNo(Dir: number): number {
        var chairNo: number = DeskManager.getInstance().nChairNo;

        if (Dir == 3) {
            return chairNo;
        } else {
            if (chairNo == 0) {
                if (Dir == 1) {
                    return 2;
                }
                else if (Dir == 2) {
                    return 3;
                } else if (Dir == 4) {
                    return 1;
                }
            }

            if (chairNo == 1) {
                if (Dir == 1) {
                    return 3;
                }
                else if (Dir == 2) {
                    return 0;
                } else if (Dir == 4) {
                    return 2;
                }
            }

            if (chairNo == 2) {
                if (Dir == 1) {
                    return 0;
                }
                else if (Dir == 2) {
                    return 1;
                } else if (Dir == 4) {
                    return 3;
                }
            }

            if (chairNo == 3) {
                if (Dir == 1) {
                    return 1;
                }
                else if (Dir == 2) {
                    return 2;
                } else if (Dir == 4) {
                    return 0;
                }
            }
        }
        return -1;
    }

    public gripCard(position: number = -1): void {
        //删除显像对象
        if (this.arrCard[position]) {
            DisplayObjectUtil.removeForParent(this.arrCard[position]);
        }
    }

    public get dire(): number {
        return this.nDir;
    }

    public set dire(value: number) {
        this.nDir = value;
    }

    /** 根据浏览器宽高重绘 **/
    public redrawByBrowser(): void {
        var base = 70;
        if (this.nDir == 1) {
            this.x = LayerManager.stage.stageWidth * .5 - this.width * .5;
            this.y = base;
        }
        else if (this.nDir == 2) {
            this.x = LayerManager.stage.stageWidth - this.width - 115;
            this.y = base + 60;
        }
        else if (this.nDir == 3) {
            this.x = LayerManager.stage.stageWidth * .5 - this.width * .5 + 10;
            this.y = base + 400;
        }
        else {
            this.x = 185;
            this.y = base + 60;
        }
    }
}