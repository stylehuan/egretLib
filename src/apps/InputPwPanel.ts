/**
 * Created by stylehuan on 2016/8/1.
 */
class InputPwPanel extends SceneBase{
    public constructor() {
        super();
    }

    public mc_create_btn:SQ.Button;
    public txt_pw:SQ.TextBox;

    private _panel:SQ.AppPanel;
    resGroup:string;

    public initial():void {
        if (this._panel) {
            this.draw();
            this._panel.init(430, 240);
        }
    }

    public setup():void {
        var title = GUIFactory.getInstance().cAppTitle("app.pw_title");
        var closeBtn:SQ.Button = GUIFactory.getInstance().cAppCloseIcon();
        this._panel = new SQ.AppPanel("components.app_bg", title, closeBtn);
        this.addChild(this._panel);

        var mask:egret.Bitmap = GUIFactory.getInstance().createMaskLayer();
        this.addChild(mask);
    }

    public uninstall():void {
        this.destroy();
        DisplayObjectUtil.removeAllChild(this);
        DisplayObjectUtil.removeForParent(this);
    }

    //public mc_pw_field:UI_mc_pw_field;
    public txt_pw_tips:egret.TextField;

    public destroyByObj(obj:Object):void {
        if (obj != null) {
            DisplayObjectUtil.removeAllChild(obj);
            DisplayObjectUtil.removeForParent(obj);
            obj = null;
        }
    }


    public destroy():void {
        SocketEvent.removeEventListener(Global.LSR_FRIEND_SITDOWN.toString(), this.getSitDownHandler, this);
        this.destroyByObj(this.mc_create_btn);
        this.destroyByObj(this.txt_pw);
    }

    private draw():void {
        if (this.mc_create_btn == null) {
            this.mc_create_btn = new SQ.Button("app.confirm_btn_1", "app.confirm_btn_2", "app.confirm_btn_3");
            this.mc_create_btn.x = 430*.5 - this.mc_create_btn.width*.5;
            this.mc_create_btn.y = 140;
            this._panel.addChild(this.mc_create_btn);
        }

        if (this.txt_pw == null) {
            this.txt_pw = new SQ.TextBox("请输入密码", "components.input_bg", "", 240);
            this.txt_pw.setPostion(100, 60);
            this._panel.addChild(this.txt_pw);
        }

        this.initEvent();
    }

    private initEvent():void {
        SocketEvent.addEventListener(Global.LSR_FRIEND_SITDOWN.toString(), this.getSitDownHandler, this);
        this.mc_create_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickEnterRoomHandler, this);
        //this.txt_pw.addEventListener(egret.Event.CHANGE, this., this);
        PCUtil.getInstance().addKeyEventListener("keypress", this.onEnterHandler, this);
    }

    private onEnterHandler(e:any):void {
        if (Object.prototype.toString.call(e) == "[object Array]") {
            if (e[0].keyCode == 13) {
                this.mc_create_btn.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
            }
        }
    }

    private _tempPw:string;

    private clickEnterRoomHandler(e:egret.TouchEvent):void {
        var _pw:string = this.txt_pw.text;
        _pw = _pw.replace(/(^\s*)|(\s*$)/g, "");
        _pw = _pw == "请输入密码" ? "" : _pw;
        if (_pw == "") {
            GUIFactory.getInstance().showBubbleBox("密码不能为空！");
            return;
        }


        this._tempPw = _pw;

        if (this.data["type"] == GlobalVar.inputPwSitDown) {
            this.sendSitDown(_pw);
        } else {
            this.sendWg(_pw);
        }
    }

    private sendWg(pw:string) {
        var sendData:egret.ByteArray = new egret.ByteArray();
        var _trackPlayer:CLSTrackPlayer = new CLSTrackPlayer();
        _trackPlayer.nUserID.value = SystemCenter.playSystem.selfPlayerInfo.userID;
        _trackPlayer.nTarget.value = this.data["data"]["targetId"];
        CSerializable.Serialization(_trackPlayer, sendData);
        CSerializable._Serialization(pw, sendData, "string");
        SQGameServer.getInstance().sendCmd(Global.LSR_TRACK_PLAYER, sendData);
    }

    private sendSitDown(pw:string) {
        var sendData:egret.ByteArray = new egret.ByteArray();
        var _cSitDown:LS_FRIEND_SITDOWN = new LS_FRIEND_SITDOWN();
        _cSitDown.nUserID.value = SystemCenter.playSystem.selfPlayerInfo.userID;
        _cSitDown.nRoomID.value = this.data["data"]["tableId"];
        _cSitDown.nChairNO.value = this.data["data"]["chairNo"];
        CSerializable.Serialization(_cSitDown, sendData);
        CSerializable._Serialization(pw, sendData, "string");
        LoadingManager.showLoading();

        SQGameServer.getInstance().sendCmd(Global.LSR_FRIEND_SITDOWN, sendData);
    }

    private getSitDownHandler(e:SocketEvent) {
        LoadingManager.hideLoading();
        if (!e.data.data) return;
        var b:egret.ByteArray = e.data.data;
        b.position = 0;
        if (e.data.positive) {
            if (e.data.result != Global.UR_OPERATE_SUCCEEDED) {
                var str:string = "";
                switch (e.data.result) {
                    case Global.SQR_PASSWORD_MISMATCH:
                        str = SystemMsg.getMsg(Global.SQR_PASSWORD_MISMATCH);
                        break;
                }
                GUIFactory.getInstance().showBubbleBox(str);
            }
        } else {
            var _cSitDown:LS_FRIEND_SITDOWN = new LS_FRIEND_SITDOWN();
            CSerializable.Deserialization(_cSitDown, b);

            if (_cSitDown.nUserID.value == SystemCenter.playSystem.selfPlayerInfo.userID) {
                MyTableData.addPw(_cSitDown.nRoomID.value, this._tempPw);
                this._panel.close();
            }
        }
    }

    private onRoomNameVerifHandler(e:Event):void {
        //this.verifRoomName();
    }

    public clear():void {
        this.txt_pw.text = "";
    }
}