/**
 * Created by stylehuan on 2016/7/25.
 */
class GUIFactory {

    private static _instance: GUIFactory;

    public static getInstance(): GUIFactory {
        if (!this._instance) {
            this._instance = new GUIFactory();
        }
        return this._instance;
    }

    public createBackBtn(): SQ.Button {
        return new SQ.Button("common.back_btn_1", "common.back_btn_2", "common.back_btn_3");
    }

    public createBackBtn2(): EButton {
        //return new SQ.Button("common.back_btn_1", "common.back_btn_2", "common.back_btn_3");
        return new EButton(this, "back_btn_1", null, "", 24, 1, "common");
        //EButton
    }

    public createBottomLine(): egret.Bitmap {
        var bottomLine = new egret.Bitmap();
        bottomLine.texture = RES.getRes("common.bottom_line");
        return bottomLine;
    }

    public cAppCloseIcon(): SQ.Button {
        return new SQ.Button("components.close_btn1", "components.close_btn2", "components.close_btn3");
    }

    public cAppTitle(titleSkin: string): egret.DisplayObjectContainer {
        var _spr: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
        var _bg: egret.Bitmap = new egret.Bitmap();
        _bg.texture = RES.getRes("components.title");
        _spr.addChild(_bg);

        if (titleSkin) {
            var _title: egret.Bitmap = new egret.Bitmap();
            _title.texture = RES.getRes(titleSkin);
            _spr.addChild(_title);

            _title.x = _spr.width * .5 - _title.width * .5;
            _title.y = 5;

            return _spr;
        }
        return null;
    }

    public createMaskLayer(alpha: number = 0, width: number = LayerManager.stage.stageWidth, height: number = LayerManager.stage.stageHeight): egret.Bitmap {
        var mask = new egret.Bitmap();
        mask.texture = RES.getRes("components.app_bg");
        mask.width = width;
        mask.height = height;
        mask.alpha = alpha;

        return mask;
    }

    public showBubbleBox(str: string): void {
        var txtTips: egret.TextField = new egret.TextField();
        txtTips.text = str;
        var tips: SQ.BubbleBox = new SQ.BubbleBox("game_card.Panel_back", txtTips, true, SQ.BubbleBox.OUT_TYPE_UP_ALPHA);
        tips.setPostion(LayerManager.stage.stageWidth * .5 - txtTips.width * .5, LayerManager.stage.stageHeight * .5 - txtTips.height * .5);
        LayerManager.AlertLayer.addChild(tips);
    }

    public createUserPeronPanel(levelID: number, fourAnimalLabel: number, userId: number, userName: string): egret.DisplayObjectContainer {
        var container: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
        var userHead = new UserHead();
        userHead.userId = userId;
        userHead.levelId = levelID;
        userHead.fourAnimalLabel = fourAnimalLabel;
        userHead.draw();

        container.addChild(userHead);

        if (userHead.getAnimalLabel() == 0) {
            userHead.x -= 15;
            userHead.y -= 10;
        }

        var textStyle: SQ.TextStyleConfig = new SQ.TextStyleConfig();
        textStyle.maxLen = 20;

        var _userNameTextField: SQ.SimplicityTextField;
        _userNameTextField = new SQ.SimplicityTextField(userName, textStyle);

        textStyle.maxLen = 12;
        container.addChild(_userNameTextField);
        _userNameTextField.width = 240;
        _userNameTextField._textField.textAlign = "center";
        _userNameTextField.y = container.height;

        return container;
    }

    /**
     * 显示选手技术统计信息
     */
    public createUserDataInfo(userInfo: CGameUserStatData): egret.DisplayObjectContainer {
        var container: egret.DisplayObjectContainer;
        container = new egret.DisplayObjectContainer();
        var _distriSpr: egret.Sprite = new egret.Sprite();
        var _jstjPanel: JstjPanel = new JstjPanel();
        container.addChild(_jstjPanel);
        container.addChild(_distriSpr);

        // data
        var total: number = userInfo.nFisrtCount.value
            + userInfo.nSecondCount.value
            + userInfo.nThirdCount.value
            + userInfo.nFourthCount.value;

        if (total != 0) {
            _jstjPanel.txt_ywl.text = this.formatLv(userInfo.nFisrtCount.value, total);
            _jstjPanel.txt_ewl.text = this.formatLv(userInfo.nSecondCount.value, total);
            _jstjPanel.txt_swl.text = this.formatLv(userInfo.nThirdCount.value, total);
            _jstjPanel.txt_siwl.text = this.formatLv(userInfo.nFourthCount.value, total);

        } else {
            _jstjPanel.txt_ywl.text = "00.00%";
            _jstjPanel.txt_ewl.text = "00.00%";
            _jstjPanel.txt_swl.text = "00.00%";
            _jstjPanel.txt_siwl.text = "00.00%";
        }
        var levelId: number = userInfo.nLevelID.value;

//        if(LevelInfo.getLevelName(levelId).indexOf("段") == -1)
//        {
//            _personPanel.txt_userScore.text = userInfo.nLevelScore+"/" + LevelInfo.getLevelUpgradeScore(levelId)+ " "+LevelInfo.getLevelName(levelId);
//        }else
//        {
//            if(SystemCenter.playSystem.selfPlayerInfo.fourAnimalLabel !=0)
//            {
//                _personPanel.txt_userScore.text = userInfo.nLevelScore+"/"+ LevelInfo.getLevelUpgradeScore(levelId) + " " +FourAnimalData.getTite(SystemCenter.playSystem.selfPlayerInfo.fourAnimalLabel)+"·"+LevelInfo.getLevelName(levelId);
//                _jstjPanel.txt_lv.text = FourAnimalData.getTite(SystemCenter.playSystem.selfPlayerInfo.fourAnimalLabel)+"."+LevelInfo.getLevelName(userInfo.nLevelID);
//            }else
//            {
//                _personPanel.txt_userScore.text = userInfo.nLevelScore+"/"+LevelInfo.getLevelUpgradeScore(levelId) + " " +LevelInfo.getLevelName(levelId);
//            }
//        }

        if (userInfo.nTotalBoutCount.value != 0) {
            _jstjPanel.txt_fll.text = this.formatLv(userInfo.nFuluCount.value, userInfo.nTotalBoutCount.value);
            _jstjPanel.txt_zdf.text = userInfo.nMaxFan.value + "";
            _jstjPanel.txt_tpl.text = this.formatLv(userInfo.nTingCount.value, userInfo.nTotalBoutCount.value);

            _jstjPanel.txt_chl.text = this.formatLv(userInfo.nCuohuCount.value, userInfo.nTotalBoutCount.value);
            _jstjPanel.txt_hpl.text = this.formatLv(userInfo.nHuCount.value, userInfo.nTotalBoutCount.value);
            _jstjPanel.txt_zml.text = this.formatLv(userInfo.nZimoCount.value, userInfo.nTotalBoutCount.value);
            _jstjPanel.txt_dpl.text = this.formatLv(userInfo.nFangCount.value, userInfo.nTotalBoutCount.value);
        } else {
            _jstjPanel.txt_fll.text = "00.00%";
            _jstjPanel.txt_zdf.text = "0";
            _jstjPanel.txt_tpl.text = "00.00%";

            _jstjPanel.txt_chl.text = "00.00%";
            _jstjPanel.txt_hpl.text = "00.00%";
            _jstjPanel.txt_zml.text = "00.00%";
            _jstjPanel.txt_dpl.text = "00.00%";
        }
        _jstjPanel.txt_totalBouts.text = userInfo.nTotalBoutCount.value + "";

        // five data
        var centerPoint: egret.Point = new egret.Point(_jstjPanel.mc_centerPoint.x, _jstjPanel.mc_centerPoint.y);
        var hpPoint: egret.Point = new egret.Point(_jstjPanel.mc_hpPoint.x, _jstjPanel.mc_hpPoint.y);
        var dpPoint: egret.Point = new egret.Point(_jstjPanel.mc_dpPoint.x, _jstjPanel.mc_dpPoint.y);
        var hfPoint: egret.Point = new egret.Point(_jstjPanel.mc_hfPoint.x, _jstjPanel.mc_hfPoint.y);
        var hxPoint: egret.Point = new egret.Point(_jstjPanel.mc_hxPoint.x, _jstjPanel.mc_hxPoint.y);
        var zmPoint: egret.Point = new egret.Point(_jstjPanel.mc_zmPoint.x, _jstjPanel.mc_zmPoint.y);

        var dpZb: number = FourAnimalData.selfDpZb(SystemCenter.playSystem.selfPlayerInfo);
        var zmZb: number = FourAnimalData.selfZmZb(SystemCenter.playSystem.selfPlayerInfo);
        var hpZb: number = FourAnimalData.selfHpZb(SystemCenter.playSystem.selfPlayerInfo);
        var hxZb: number = FourAnimalData.selfHxZb(SystemCenter.playSystem.selfPlayerInfo);
        var hfZb: number = FourAnimalData.selfHfZb(SystemCenter.playSystem.selfPlayerInfo);

        var tx: number;
        var ty: number;
        _distriSpr.graphics.clear();
        _distriSpr.graphics.beginFill(0xb78e4e, .5);
        _distriSpr.graphics.lineStyle(1, 0, 0);
        // 胡牌
        tx = centerPoint.x + ( hpPoint.x - centerPoint.x) * hpZb;
        ty = centerPoint.y + ( hpPoint.y - centerPoint.y) * hpZb;

        _distriSpr.graphics.moveTo(tx, ty);

        // 自摸
        tx = centerPoint.x + ( zmPoint.x - centerPoint.x) * zmZb;
        ty = centerPoint.y + ( zmPoint.y - centerPoint.y) * zmZb;
        _distriSpr.graphics.lineTo(tx, ty);

        // 和番
        tx = centerPoint.x + ( hfPoint.x - centerPoint.x) * hfZb;
        ty = centerPoint.y + ( hfPoint.y - centerPoint.y) * hfZb;
        _distriSpr.graphics.lineTo(tx, ty);

        // 点炮
        tx = centerPoint.x + ( dpPoint.x - centerPoint.x) * dpZb;
        ty = centerPoint.y + ( dpPoint.y - centerPoint.y) * dpZb;
        _distriSpr.graphics.lineTo(tx, ty);

        // 和巡
        tx = centerPoint.x + ( hxPoint.x - centerPoint.x) * hxZb;
        ty = centerPoint.y + ( hxPoint.y - centerPoint.y) * hxZb;
        _distriSpr.graphics.lineTo(tx, ty);

        _distriSpr.graphics.endFill();

        if (LevelInfo.getLevelName(userInfo.nLevelID.value).indexOf("段") == -1) {
            //_jstjPanel.mc_fourAnimal.gotoAndStop(1);
        } else {
            //_jstjPanel.mc_fourAnimal.gotoAndStop(SystemCenter.playSystem.selfPlayerInfo.fourAnimalLabel +1);
        }
        return container;
    }

    private formatLv(value: number, total: number): string {
        if (total == 0) return "00.00%";
        return (value / total * 100).toFixed(2) + "%";
    }
}