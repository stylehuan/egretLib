/**
 * Created by seethinks@gmail.com on 2015/11/26.
 */
class CreateTable extends SceneBase {
    public constructor() {
        super();
    }

    public mc_create_btn: SQ.Button;
    public txt_room_name: SQ.TextBox;
    public mc_room_type_1: SQ.Radio;
    public mc_room_type_2: SQ.Radio;
    public mc_room_type_3: SQ.Radio;
    public txt_room_pw: SQ.TextBox;


    private _roomName: string;//房间名称
    private _roomPsword: string;


    private _panel: SQ.AppPanel;
    private _panelWidth: number = 460;
    resGroup: string;

    public initial(): void {
        if (this._panel) {
            this.draw();
            this._panel.init(this._panelWidth, 350);
        }
    }

    public setup(): void {
        var title = GUIFactory.getInstance().cAppTitle("app.create_title");
        var closeBtn: SQ.Button = GUIFactory.getInstance().cAppCloseIcon();
        this._panel = new SQ.AppPanel("components.app_bg", title, closeBtn);
        this.addChild(this._panel);


        var mask: egret.Bitmap = GUIFactory.getInstance().createMaskLayer();
        this.addChild(mask);
    }

    public uninstall(): void {
        this.destroy();
        DisplayObjectUtil.removeAllChild(this);
        DisplayObjectUtil.removeForParent(this);
    }

    public mc_room_type_group: SQ.RadioGroup;
    //�����
    public mc_fan_1: SQ.Radio;
    public mc_fan_2: SQ.Radio;
    public mc_fan_3: SQ.Radio;
    public mc_fan_4: SQ.Radio;
    public mc_fan_5: SQ.Radio;
    public mc_fan_group: SQ.RadioGroup;

    //����ʱ��
    public mc_card_1: SQ.Radio;
    public mc_card_2: SQ.Radio;
    public mc_card_3: SQ.Radio;
    public mc_card_4: SQ.Radio;
    public mc_card_group: SQ.RadioGroup;

    public mc_password: SQ.CheckBox;
    public mc_room_iswg: SQ.CheckBox;
    public mc_ys: SQ.CheckBox;

    //public mc_pw_field:UI_mc_pw_field;
    public txt_pw_tips: egret.TextField;

    public destroyByObj(obj: Object): void {
        if (obj != null) {
            DisplayObjectUtil.removeAllChild(obj);
            DisplayObjectUtil.removeForParent(obj);
            obj = null;
        }
    }


    public destroy(): void {
        PCUtil.getInstance().removeKeyEventListener("keypress", this.onEnterHandler, this);
        //window.removeEventListener("keypress", this.onEnterHandler, false);

        this.destroyByObj(this.mc_create_btn);
        this.destroyByObj(this.txt_room_name);
        this.destroyByObj(this.mc_room_type_1);
        this.destroyByObj(this.mc_room_type_2);
        this.destroyByObj(this.mc_room_type_3);
        this.destroyByObj(this.mc_room_type_group);
        //this.destroyByObj(this.mc_pw_field);
        this.destroyByObj(this.mc_room_iswg);
        this.destroyByObj(this.mc_fan_1);
        this.destroyByObj(this.mc_fan_2);
        this.destroyByObj(this.mc_fan_3);
        this.destroyByObj(this.mc_fan_4);
        this.destroyByObj(this.mc_fan_5);
        this.destroyByObj(this.mc_fan_group);

        this.destroyByObj(this.mc_card_1);
        this.destroyByObj(this.mc_card_2);
        this.destroyByObj(this.mc_card_3);
        this.destroyByObj(this.mc_card_4);
        this.destroyByObj(this.mc_card_group);

        this.destroyByObj(this.mc_password);
        this.destroyByObj(this.mc_ys);
        this.destroyByObj(this.txt_pw_tips);

    }

    private draw(): void {
        if (this.mc_create_btn == null) {
            this.mc_create_btn = new SQ.Button("app.create_btn1", "app.create_btn2", "app.create_btn3");
            this.mc_create_btn.x = this._panelWidth * .5 - this.mc_create_btn.width * .5;
            this.mc_create_btn.y = 270;
            this._panel.addChild(this.mc_create_btn);
        }


        if (this.txt_room_name == null) {
            this.txt_room_name = new SQ.TextBox("请输入房间名", "components.input_bg", "", 210);
            this.txt_room_name.setPostion(135, 45);
            this._panel.addChild(this.txt_room_name);
        }

        var size = 28;
        var jiange = 105;

        var roomNameLabel: SQ.STTextField = new SQ.STTextField();
        roomNameLabel.text = "房间名:";
        roomNameLabel.bold = true;
        roomNameLabel.textColor = 0x000000;
        roomNameLabel.x = 74;
        roomNameLabel.y = this.txt_room_name.y + 10;
        this._panel.addChild(roomNameLabel);

        var roomNameType: SQ.STTextField = new SQ.STTextField();
        roomNameType.text = "房间类型:";
        roomNameType.bold = true;
        roomNameType.textColor = 0x000000;
        roomNameType.x = 60;
        roomNameType.y = roomNameLabel.y + roomNameLabel.height + 30;
        this._panel.addChild(roomNameType)

        if (this.mc_room_type_1 == null) {
            this.mc_room_type_1 = new SQ.Radio("16盘", "components.radio_1", "components.radio_2", "components.radio_2");
            this.mc_room_type_1.data["value"] = 16;
            this.mc_room_type_1.setSelect(true);
            this._panel.addChild(this.mc_room_type_1);
            this.mc_room_type_1.setPosition(133, roomNameType.y - 8);
        }
        if (this.mc_room_type_2 == null) {
            this.mc_room_type_2 = new SQ.Radio("8盘", "components.radio_1", "components.radio_2", "components.radio_2");
            this.mc_room_type_2.data["value"] = 8;
            this._panel.addChild(this.mc_room_type_2);
            this.mc_room_type_2.setPosition(this.mc_room_type_1.x + this.mc_room_type_1.width * .5 + 5, roomNameType.y - 8);
        }

        if (this.mc_room_type_3 == null) {
            this.mc_room_type_3 = new SQ.Radio("4盘", "components.radio_1", "components.radio_2", "components.radio_2");
            this.mc_room_type_3.data["value"] = 4;
            this._panel.addChild(this.mc_room_type_3);
            this.mc_room_type_3.setPosition(this.mc_room_type_2.x + this.mc_room_type_2.width * .5 + 5, roomNameType.y - 8);
        }

        if (this.mc_room_type_group == null) {
            this.mc_room_type_group = new SQ.RadioGroup();
            this.mc_room_type_group.appendRadio(this.mc_room_type_1);
            this.mc_room_type_group.appendRadio(this.mc_room_type_2);
            this.mc_room_type_group.appendRadio(this.mc_room_type_3);
        }

        //----------------------
        var roomQiHuLabel: SQ.STTextField = new SQ.STTextField();
        roomQiHuLabel.text = "起和番数:";
        roomQiHuLabel.bold = true;
        roomQiHuLabel.textColor = 0x000000;
        roomQiHuLabel.x = 60;
        roomQiHuLabel.y = roomNameType.y + roomNameType.height + 25;
        this._panel.addChild(roomQiHuLabel)

        if (this.mc_fan_1 == null) {
            this.mc_fan_1 = new SQ.Radio("1番", "components.radio_1", "components.radio_2", "components.radio_2");
            this.mc_fan_1.data["value"] = 1;
            this.mc_fan_1.setSelect(false);
            this._panel.addChild(this.mc_fan_1);
            this.mc_fan_1.setPosition(133, roomQiHuLabel.y - 8);
        }
        if (this.mc_fan_2 == null) {
            this.mc_fan_2 = new SQ.Radio("8番", "components.radio_1", "components.radio_2", "components.radio_2");
            this.mc_fan_2.data["value"] = 8;
            this.mc_fan_2.setSelect(true);
            this._panel.addChild(this.mc_fan_2)
            this.mc_fan_2.setPosition(this.mc_fan_1.x + this.mc_fan_1.width * .5 + 8 + 5, roomQiHuLabel.y - 8);
        }

        // if (this.mc_fan_3 == null) {
        //     this.mc_fan_3 = new SQ.Radio("16番", "components.radio_1", "components.radio_2", "components.radio_2");
        //     this.mc_fan_3.data["value"] = 16;
        //     this._panel.addChild(this.mc_fan_3);
        //     this.mc_fan_3.setPosition(this.mc_fan_2.x + this.mc_fan_2.width*.5, roomQiHuLabel.y - 10);
        // }

        if (this.mc_fan_4 == null) {
            this.mc_fan_4 = new SQ.Radio("24番", "components.radio_1", "components.radio_2", "components.radio_2");
            this.mc_fan_4.data["value"] = 24;
            this._panel.addChild(this.mc_fan_4);
            this.mc_fan_4.setPosition(this.mc_fan_2.x + this.mc_fan_2.width * .5 + 5, roomQiHuLabel.y - 8);
        }

        if (this.mc_fan_5 == null) {
            this.mc_fan_5 = new SQ.Radio("32番", "components.radio_1", "components.radio_2", "components.radio_2");
            this.mc_fan_5.data["value"] = 32;
            this._panel.addChild(this.mc_fan_5);
            this.mc_fan_5.setPosition(this.mc_fan_4.x + this.mc_fan_4.width * .5 + 5, roomQiHuLabel.y - 8);
        }

        if (this.mc_fan_group == null) {
            this.mc_fan_group = new SQ.RadioGroup();
            this.mc_fan_group.appendRadio(this.mc_fan_1);
            this.mc_fan_group.appendRadio(this.mc_fan_2);
            this.mc_fan_group.appendRadio(this.mc_fan_3);
            this.mc_fan_group.appendRadio(this.mc_fan_4);
            this.mc_fan_group.appendRadio(this.mc_fan_5);
        }

        //----------------------

        var roomChuPaiLabel: SQ.STTextField = new SQ.STTextField();
        roomChuPaiLabel.text = "出牌时间:";
        roomChuPaiLabel.bold = true;
        roomChuPaiLabel.textColor = 0x000000;
        roomChuPaiLabel.x = 60;
        roomChuPaiLabel.y = roomQiHuLabel.y + roomQiHuLabel.height + 25;
        this._panel.addChild(roomChuPaiLabel);

        if (this.mc_card_1 == null) {
            this.mc_card_1 = new SQ.Radio("5秒", "components.radio_1", "components.radio_2", "components.radio_2");
            this.mc_card_1.data["value"] = 5;
            this._panel.addChild(this.mc_card_1);
            this.mc_card_1.setPosition(133, roomChuPaiLabel.y - 8);
        }
        if (this.mc_card_2 == null) {
            this.mc_card_2 = new SQ.Radio("8秒", "components.radio_1", "components.radio_2", "components.radio_2");
            this.mc_card_2.data["value"] = 8;
            this._panel.addChild(this.mc_card_2);
            this.mc_card_2.setPosition(this.mc_card_1.x + this.mc_card_1.width * .5 + 8 + 5, roomChuPaiLabel.y - 8);
        }
        if (this.mc_card_3 == null) {
            this.mc_card_3 = new SQ.Radio("10秒", "components.radio_1", "components.radio_2", "components.radio_2");
            this.mc_card_3.data["value"] = 10;
            this._panel.addChild(this.mc_card_3);
            this.mc_card_3.setSelect(true);
            this.mc_card_3.setPosition(this.mc_card_2.x + this.mc_card_2.width * .5 + 5, roomChuPaiLabel.y - 8);
        }

        if (this.mc_card_4 == null) {
            this.mc_card_4 = new SQ.Radio("15秒", "components.radio_1", "components.radio_2", "components.radio_2");
            this.mc_card_4.data["value"] = 15;
            this._panel.addChild(this.mc_card_4);
            this.mc_card_4.setPosition(this.mc_card_3.x + this.mc_card_3.width * .5 + 5, roomChuPaiLabel.y - 8);
        }

        if (this.mc_card_group == null) {
            this.mc_card_group = new SQ.RadioGroup();
            this.mc_card_group.appendRadio(this.mc_card_1);
            this.mc_card_group.appendRadio(this.mc_card_2);
            this.mc_card_group.appendRadio(this.mc_card_3);
            this.mc_card_group.appendRadio(this.mc_card_4);
        }

        //权限
        var roomNameQx: SQ.STTextField = new SQ.STTextField();
        roomNameQx.text = "房间权限:";
        roomNameQx.bold = true;
        roomNameQx.textColor = 0x000000;
        roomNameQx.x = 60;
        roomNameQx.y = roomChuPaiLabel.y + roomChuPaiLabel.height + 25;
        this._panel.addChild(roomNameQx)

        if (this.mc_password == null) {
            this.mc_password = new SQ.CheckBox("需要密码", "components.checkbox_1", "components.checkbox_2", "components.checkbox_2");
            this.mc_password.setPostion(133, roomNameQx.y - 8);
            this.mc_password.setSelect(false);
            this._panel.addChild(this.mc_password)
        }

        if (this.mc_room_iswg == null) {
            this.mc_room_iswg = new SQ.CheckBox("允许围观", "components.checkbox_1", "components.checkbox_2", "components.checkbox_2");
            this.mc_room_iswg.setPostion(this.mc_password.x + this.mc_password.width * .5 + 5, roomNameQx.y - 8);
            this._panel.addChild(this.mc_room_iswg);
        }

        if (this.mc_ys == null) {
            this.mc_ys = new SQ.CheckBox("允许延时", "components.checkbox_1", "components.checkbox_2", "components.checkbox_2");
            this.mc_ys.setPostion(this.mc_room_iswg.x + this.mc_room_iswg.width * .5 + 5, roomNameQx.y - 8);
            this.mc_ys.setSelect(true);
            this._panel.addChild(this.mc_ys);
        }

        if (this.txt_room_pw == null) {
            this.txt_room_pw = new SQ.TextBox("请输入密码", "components.input_bg", "", 140);
            this.txt_room_pw.setPostion(133, this.mc_password.y + this.mc_password.height - 15);
            this._panel.addChild(this.txt_room_pw);
            this.txt_room_pw.visible = false;
        }

        this.initEvent();
    }

    private initEvent(): void {
        this.mc_create_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickCreateRoomHandler, this);
        this.txt_room_name.addEventListener(egret.Event.CHANGE, this.onRoomNameVerifHandler, this);
        this.mc_password.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickQXHandler, this)

        var name = StorageManager.getLocalStorage(StorageManager.FRIEND_ROOM_NAME);
        if (name == undefined || name == "")
            name = SystemCenter.playSystem.selfPlayerInfo.playerName.replace("~", "") + "的房间";
        this.txt_room_name.text = name;

        PCUtil.getInstance().addKeyEventListener("keypress", this.onEnterHandler, this);
    }

    private onEnterHandler(e: any): void {
        if (Object.prototype.toString.call(e) == "[object Array]") {
            if (e[0].keyCode == 13) {
                this.mc_create_btn.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
            }
        }
    }

    private clickCreateRoomHandler(e: egret.TouchEvent): void {
        if (!this.verifRoomName()) return;
        var _roomType = Number(this.mc_room_type_group.getCurSelectedValue());
        this._roomPsword = "";
        if (this.mc_password.isSelect == true) {
            if (!this.verifRoomPassword()) {
                return;
            }
            this._roomPsword = this.txt_room_pw.text;
        }

        //提交
        SocketEvent.addEventListener(Global.LSR_FRIEND_CREATEROOM.toString(), this.createRoomHandler, this);
        StorageManager.addLocalStorage(StorageManager.FRIEND_ROOM_NAME, this._roomName);

        LoadingManager.showLoading();
        var sendData: egret.ByteArray = new egret.ByteArray();
        var _cRoom: CLSFriendCreateRoom = new CLSFriendCreateRoom();
        _cRoom.sRoomName = this._roomName;
        _cRoom.nBoutCount.value = _roomType;
        ;
        _cRoom.sPassWord = this._roomPsword;
        _cRoom.nRoomClassId.value = _roomType;
        _cRoom.nUserID.value = SystemCenter.playSystem.selfPlayerInfo.userID;
        _cRoom.bLookOn = this.mc_room_iswg.isSelect;
        _cRoom.nHuMinLimit.value = Number(this.mc_fan_group.getCurSelectedValue());
        _cRoom.nThrowWait.value = Number(this.mc_card_group.getCurSelectedValue());
        _cRoom.nDelayCount.value = this.mc_ys.isSelect ? 2 : 0;
        CSerializable.Serialization(_cRoom, sendData);
        SQGameServer.getInstance().sendCmd(Global.LSR_FRIEND_CREATEROOM, sendData);
    }

    private onRoomNameVerifHandler(e: Event): void {
        this.verifRoomName();
    }

    private clickQXHandler(e: SQ.GuiEvent): void {
        this.txt_room_pw.visible = this.mc_password.isSelect;
    }

    private createRoomHandler(e: SocketEvent): void {
        LoadingManager.hideLoading();
        if (!e.data.data) return;
        var b: egret.ByteArray = e.data.data;
        SocketEvent.removeEventListener(Global.LSR_FRIEND_CREATEROOM.toString(), this.createRoomHandler, this);
        if (e.data.result == Global.UR_OPERATE_SUCCEEDED) {
            while (b.bytesAvailable) {
                var cgameRoomInfo: CGameRoom = new CGameRoom();
                CSerializable.Deserialization(cgameRoomInfo, b)
            }
            var tableId: number = cgameRoomInfo.nRoomID.value;
            MyTableData.addPw(tableId, this._roomPsword);
            SystemCenter.playSystem.selfPlayerInfo.RoomInfo = cgameRoomInfo;
            this._panel.close();
        }
    }


    private verifRoomName(): boolean {
        this._roomName = this.txt_room_name.text
        //this._roomName = this._roomName.replace(/(^\this.s*)|(\this.s*this.$)/g, "");
        //验证
        var txtTips: egret.TextField;
        //if (this._roomName == "") {
        //    GUIFactory.getInstance().showBubbleBox("房间名称不能为空！");
        //    return false;
        //}
        if (StrUtil.countLetterNum(this._roomName) > 24) {
            GUIFactory.getInstance().showBubbleBox("房间名称请不要超过12个字哦！");
            return false;
        }
        if (this._roomName == "请输入房间名") {
            GUIFactory.getInstance().showBubbleBox("请输入正确房间名！");
            return false;
        }

        //验证特殊字符
        var regEx: RegExp = /^[\w\u4e00-\u9fa5]+$/gi;
        if (regEx.test(this._roomName) == false) {
            GUIFactory.getInstance().showBubbleBox("房间名称不能包含特殊字符！");
            return false;
        }
        return true;
    }

    private verifRoomPassword(): boolean {
        this._roomPsword = this.txt_room_pw.text;
        //this._roomName = this._roomName.replace(/(^\this.s*)|(\this.s*this.$)/g, "");
        //验证
        var txtTips: egret.TextField;
        if (this._roomPsword == "") {
            txtTips = new egret.TextField();
            txtTips.text = "亲，密码不能为空哦!!!";
            var tips: SQ.BubbleBox = new SQ.BubbleBox("game_card.Panel_back", txtTips, true, SQ.BubbleBox.OUT_TYPE_UP_ALPHA);
            tips.setPostion(LayerManager.stage.stageWidth * .5 - txtTips.width * .5, LayerManager.stage.stageHeight * .5 - txtTips.height * .5)
            LayerManager.AlertLayer.addChild(tips);
            return false;
        }

        var regEx: RegExp = /^[\w\u4e00-\u9fa5]+$/gi;
        if (regEx.test(this._roomPsword) == false) {
            txtTips = new egret.TextField();
            txtTips.text = "亲，密码不能包含特殊字符!!!";
            var tips: SQ.BubbleBox = new SQ.BubbleBox("game_card.Panel_back", txtTips, true, SQ.BubbleBox.OUT_TYPE_UP_ALPHA)
            tips.setPostion(LayerManager.stage.stageWidth * .5 - txtTips.width * .5, LayerManager.stage.stageHeight * .5 - txtTips.height * .5)
            LayerManager.AlertLayer.addChild(tips);
            return false;
        }

        if (this._roomPsword == "请输入密码") {
            txtTips = new egret.TextField();
            txtTips.text = "亲，请输入正确密码!!!";
            var tips: SQ.BubbleBox = new SQ.BubbleBox("game_card.Panel_back", txtTips, true, SQ.BubbleBox.OUT_TYPE_UP_ALPHA)
            tips.setPostion(LayerManager.stage.stageWidth * .5 - txtTips.width * .5, LayerManager.stage.stageHeight * .5 - txtTips.height * .5)
            LayerManager.TopLayer.addChild(tips);
            return false;
        }
        return true;
    }

    public clear(): void {
        this.txt_room_name.text = "";
        //this.mc_pw_field.txt_password.text = "";
        //this.mc_pw_field.txt_passwordTips.text = "����������";
        this.mc_room_type_1.setSelect(true)
        this.mc_room_type_2.setSelect(false)
        this.mc_room_type_3.setSelect(false)
        //   this.mc_room_qx_1.setSelect(true)
        //   this.mc_room_qx_2.setSelect(false)
        //this.mc_pw_field.visible = false;
        this.mc_room_iswg.setSelect(false)
    }
}