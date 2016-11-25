/**
 * Created by stylehuan on 2016/9/20.
 */
class GameResultTotalPanel extends egret.DisplayObjectContainer {
    public constructor() {
        super();
        this.initial();
    }

    private _bg: egret.Bitmap;
    private pendant: egret.Bitmap;
    private rankContainer: egret.Sprite;
    private backBtn: SQ.Button;
    private cupIcon: egret.Bitmap;

    public initial(): void {
        this.pendant = new egret.Bitmap();
        this.pendant.texture = RES.getRes("game_result.modify");
        this.addChild(this.pendant);

        this._bg = new egret.Bitmap();
        this._bg.texture = RES.getRes("total_bg.png");
        this.addChild(this._bg);
        this._bg.y = -250;

        this.width = this._bg.width;
        this.height = this._bg.height - 250;
        this.backBtn = new SQ.Button("game_result.game_result_back_btn1", "game_result.game_result_back_btn1", "game_result.game_result_back_btn3", "game_result.game_result_back_btn4");
        this.addChild(this.backBtn);
        this.backBtn.x = this.width * .5 - this.backBtn.width * .5;
        this.backBtn.y = this.height - 80;

        this.rankContainer = new egret.Sprite();
        this.addChild(this.rankContainer);
        this.rankContainer.x = 85;
        this.rankContainer.y = 52;

        this.pendant.x = 0;
        this.pendant.y = this.height - this.pendant.height;

        TweenMax.to(this.pendant, 0.5, {delay: 2, x: -100, ease: Bounce.easeOut});

        this.cupIcon = new egret.Bitmap();
        this.cupIcon.texture = RES.getRes("game_result.cup");
        this.addChild(this.cupIcon);
        this.cupIcon.x = 300;
        this.cupIcon.y = -75;
        this.cupIcon.anchorOffsetX = this.cupIcon.width * .5;
        this.cupIcon.anchorOffsetY = this.cupIcon.height * .5;
        this.cupIcon.scaleX = .01;
        this.cupIcon.scaleY = .01;
        TweenMax.to(this.cupIcon, 0.5, {
            delay: 1, scaleX: 1, scaleY: 1, ease: Bounce.easeOut, onComplete: function (): void {
                EcffectFactory.getInstance().createMoreStar();
            }
        });


        var data = DeskManager.getInstance().finallyResultData;

        for (var i: number = 0; i < data.length; i++) {
            var _item: LSR_FINALLY_RESULTS = data[i];

            var rank = _item.nRank.value;
            var nikeName = this.getUIdByName(_item.nUserID.value);
            var total = _item.nScore.value;
            var isMy = false;

            if (_item.nUserID.value == DeskManager.getInstance().firstPerson) {
                isMy = true;
            }

            var uiItem: egret.DisplayObjectContainer = this.createPlayerItem(rank, nikeName, total, isMy);

            uiItem.alpha = 0;

            uiItem.y = this.rankContainer.height + 20;
            if (this.rankContainer.numChildren == 0) {
                uiItem.y = this.rankContainer.height;
            }
            this.rankContainer.addChild(uiItem);
            this.shouList(uiItem);
        }

        // this.rankContainer.graphics.beginFill(0x000000, 1);
        // this.rankContainer.graphics.drawRect(0, 0, this.rankContainer.width, this.rankContainer.height);
        // this.rankContainer.graphics.endFill();

        this.backBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.backRoom, this);
    }

    private shouList(listItem: egret.DisplayObjectContainer): void {
        TweenMax.to(listItem, 0.5, {delay: .5, alpha: 1});
    }

    private getUIdByName(nUid: number = 0): string {
        var manager = DeskManager.getInstance();
        if (manager.playerArr) {
            for (var i: number = 0; i < manager.playerArr.length; i++) {
                var _itemPlayerData: CGamePlayerData = manager.playerArr[i];
                if (nUid == _itemPlayerData.GameData.nUserID.value) {
                    return _itemPlayerData.UserInfo.sNickName;
                }
            }
        }
        return "";
    }

    private backRoom(e: Event): void {
        DeskManager.getInstance().isInGameScene = false;
        SceneManagerExt.backCurrScene();
    }

    private createPlayerItem(rank: number, nikeName: string, total: number, isMask: boolean = false): egret.DisplayObjectContainer {
        var container = new egret.DisplayObjectContainer();
        var rankTextField: SQ.STTextField;
        var nikeNameTextField: SQ.STTextField;
        var totalTextField: SQ.STTextField;
        container.width = 435;

        rankTextField = new SQ.STTextField();
        rankTextField.text = rank + "";
        rankTextField.textColor = 0x4c1d00;
        rankTextField.size = 14;
        rankTextField.bold = true;
        rankTextField.width = 100;
        rankTextField.height = 20;
        rankTextField.textAlign = "center";
        container.addChild(rankTextField);

        nikeNameTextField = new SQ.STTextField();
        nikeNameTextField.bold = true;
        nikeNameTextField.size = 14;
        nikeNameTextField.text = nikeName + "";
        nikeNameTextField.textColor = 0x4c1d00;
        nikeNameTextField.width = 210;
        nikeNameTextField.height = 20;
        nikeNameTextField.textAlign = "center";
        nikeNameTextField.x = rankTextField.x + rankTextField.width;
        container.addChild(nikeNameTextField);

        totalTextField = new SQ.STTextField();
        totalTextField.bold = true;
        totalTextField.text = total + "";
        totalTextField.size = 14;
        totalTextField.textColor = 0x4c1d00;
        totalTextField.width = 58;
        totalTextField.height = 20;
        totalTextField.textAlign = "center";
        totalTextField.x = container.width - 45 - totalTextField.width;
        container.addChild(totalTextField);

        if (isMask) {
            rankTextField.textColor = 0x176f02;
            nikeNameTextField.textColor = 0x176f02;
            totalTextField.textColor = 0x176f02;
        }

        return container;
    }

    public redrawByBrowser(): void {
        this.x = LayerManager.stage.stageWidth * .5 - this.width * .5;
        this.y = LayerManager.stage.stageHeight * .5 - this.height * .5 + 50;
    }

    public destroy(): void {
        if (this._bg) {
            DisplayObjectUtil.removeForParent(this._bg);
            this._bg = null;
        }

        if (this.pendant) {
            TweenMax.killTweensOf(this.pendant, true);
            DisplayObjectUtil.removeForParent(this.pendant);
            this.pendant = null;
        }

        if (this.cupIcon) {
            TweenMax.killTweensOf(this.cupIcon, true);
            DisplayObjectUtil.removeForParent(this.cupIcon);
            this.cupIcon = null;
        }

        if (this.rankContainer) {
            DisplayObjectUtil.removeForParent(this.rankContainer);
            this.rankContainer = null;
        }
        if (this.backBtn) {
            this.backBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.backRoom, this);
            DisplayObjectUtil.removeForParent(this.backBtn);
            this.backBtn = null;
        }
    }
}