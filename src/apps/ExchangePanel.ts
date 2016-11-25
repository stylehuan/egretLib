/**
 * Created by stylehuan on 2016/11/16.
 */
class ExchangePanel extends SceneBase {
    public constructor() {
        super();
    }

    private _panel: SQ.AppPanel;
    resGroup: string;
    private _panelWidth: number = 430;
    private _panelHeight: number = 280;

    public initial(): void {
        if (this._panel) {
            this.draw();
            this._panel.init(this._panelWidth, this._panelHeight);
        }
    }

    public setup(): void {
        var title = GUIFactory.getInstance().cAppTitle("app.dh_title");
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


    public hf_type_1: SQ.Radio;
    public hf_type_2: SQ.Radio;
    public hf_type_3: SQ.Radio;
    public hf_type_4: SQ.Radio;
    public hf_type_group: SQ.RadioGroup;
    public btn_tjdh: SQ.Button;

    private txt_my_sq: SQ.STTextField;
    private txt_dh_tips: SQ.STTextField;
    private text1: SQ.TextBox;

    private _selectCoin: number = 10;
    private _phone: number;

    public draw(): void {
        if (this.txt_my_sq == null) {
            this.txt_my_sq = new SQ.STTextField();
            this.txt_my_sq.textFlow = <Array<egret.ITextElement>>[
                {text: "我剩余:", style: {"textColor": 0x4C2814}},
                {text: SystemCenter.playSystem.selfPlayerInfo.SaiquCoin + "", style: {"textColor": 0xff0000}},
                {text: " 赛券", style: {"textColor": 0x4C2814}}
            ];
            this.txt_my_sq.x = 80;
            this.txt_my_sq.y = 40;
            this._panel.addChild(this.txt_my_sq);
        }
        if (this.txt_dh_tips == null) {
            this.txt_dh_tips = new SQ.STTextField();
            this.txt_dh_tips.textFlow = <Array<egret.ITextElement>>[
                {text: "可兑换 ", style: {"textColor": 0x4C2814}},
                {text: SystemCenter.playSystem.selfPlayerInfo.SaiquCoin + "", style: {"textColor": 0xff0000}},
                {text: " 元话费", style: {"textColor": 0x4C2814}}
            ];
            this.txt_dh_tips.textColor = 0x4C2814;
            this.txt_dh_tips.x = this.txt_my_sq.x + this.txt_my_sq.width + 20;
            this.txt_dh_tips.y = this.txt_my_sq.y;
            this._panel.addChild(this.txt_dh_tips)
        }

        if (this.hf_type_1 == null) {
            this.hf_type_1 = new SQ.Radio("10元", "components.radio_1", "components.radio_2", "components.radio_2");
            this.hf_type_1.data["value"] = 1;
            this.hf_type_1.setSelect(true);
            this._panel.addChild(this.hf_type_1);
            this.hf_type_1.setPosition(this.txt_my_sq.x, 71);
        }
        if (this.hf_type_2 == null) {
            this.hf_type_2 = new SQ.Radio("20元", "components.radio_1", "components.radio_2", "components.radio_2");
            this.hf_type_2.data["value"] = 1;
            this.hf_type_2.setSelect(false);
            this._panel.addChild(this.hf_type_2);
            this.hf_type_2.setPosition(this.hf_type_1.x + this.hf_type_1.width * .5 + 5, 71);
        }
        if (this.hf_type_3 == null) {
            this.hf_type_3 = new SQ.Radio("50元", "components.radio_1", "components.radio_2", "components.radio_2");
            this.hf_type_3.data["value"] = 1;
            this.hf_type_3.setSelect(false);
            this._panel.addChild(this.hf_type_3);
            this.hf_type_3.setPosition(this.hf_type_2.x + this.hf_type_2.width * .5 + 5, 71);
        }
        if (this.hf_type_4 == null) {
            this.hf_type_4 = new SQ.Radio("100元", "components.radio_1", "components.radio_2", "components.radio_2");
            this.hf_type_4.data["value"] = 1;
            this.hf_type_4.setSelect(false);
            this._panel.addChild(this.hf_type_4);
            this.hf_type_4.setPosition(this.hf_type_3.x + this.hf_type_3.width * .5 + 5, 71);
        }
        if (this.hf_type_group == null) {
            this.hf_type_group = new SQ.RadioGroup();
            this.hf_type_group.appendRadio(this.hf_type_1);
            this.hf_type_group.appendRadio(this.hf_type_2);
            this.hf_type_group.appendRadio(this.hf_type_3);
            this.hf_type_group.appendRadio(this.hf_type_4);
        }

        if (this.btn_tjdh == null) {
            this.btn_tjdh = new SQ.Button("app.dh_btn_1", "app.dh_btn_2", "app.dh_btn_3");
            this.btn_tjdh.x = this._panelWidth * .5 - this.btn_tjdh.width * .5;
            this.btn_tjdh.y = 170;
            this.btn_tjdh.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickSendHandler, this);
            this._panel.addChild(this.btn_tjdh);
        }

        var phoneLabel: SQ.STTextField = new SQ.STTextField();
        phoneLabel.text = "手机号:";
        phoneLabel.textColor = 0x4C2814;
        phoneLabel.x = this.txt_my_sq.x;
        phoneLabel.y = 120;
        this._panel.addChild(phoneLabel);

        if (this.text1 == null) {
            this.text1 = new SQ.TextBox("请输入手机号码", "components.input_bg", "", 210);
            // this.text1.type = egret.TextFieldType.INPUT;
            // this.text1.borderColor = 0x1c404c;
            // this.text1.border = true;
            // this.text1.size = 40;
            // this.text1.background = true;
            // this.text1.width = 500;
            // this.text1.height = 80;
            // this.text1.maxChars = 11;
            // this.text1.backgroundColor = 0x0f3039

            this.text1.x = phoneLabel.x + phoneLabel.width + 5;
            this.text1.y = phoneLabel.y - 10;
            this._panel.addChild(this.text1);
        }
        var czTips: SQ.STTextField = new SQ.STTextField();
        czTips.text = "充值会在24小时内到账，请耐心等待";
        czTips.textColor = 0x4C2814;
        czTips.x = this._panelWidth * .5 - czTips.width * .5;
        czTips.y = this._panelHeight - 35 - czTips.height;
        this._panel.addChild(czTips)
    }

    private checkPhone(): Boolean {
        var str: String = this.text1.text;
        if (str == "") {
            GUIFactory.getInstance().showBubbleBox("请输入手机号码！");
            return false;
        }
        if (str.search(/^(1)[3|5|8][0-9]{9}$/g) < 0) {
            GUIFactory.getInstance().showBubbleBox("手机号码格式不正确！");
            return false;
        }
        return true;
    }

    private clickSendHandler(e: egret.TouchEvent): void {
        if (this.checkPhone()) {
            if (this.checkDh()) {
                this.checkAll();
            }
        }
    }

    private checkAll(): void {
        var _limit: boolean = true;
        var str: string = this.text1.text;
        if (this._selectCoin > SystemCenter.playSystem.selfPlayerInfo.SaiquCoin) {
            _limit = false;
        }

        if (str == "") {
            _limit = false
        } else if (str.search(/^(1)[3|5|8][0-9]{9}$/g) < 0) {
            _limit = false
        }

        if (_limit) {
            this.btn_tjdh.setDisable(true);
            this._phone = <any>(str);
            var param: Object = {
                sign: SystemCenter.playSystem.selfPlayerInfo.sign,
                coin: this._selectCoin,
                mobile: this._phone,
                nocache: +new Date()
            };
            var _request = new HttpRequest();
            var _requestConfig = new RequestConfig();
            _requestConfig.url = URLDefine.mainApi + URLDefine.ExChangeTeleFee;
            _requestConfig.params = param;
            _requestConfig.success = this.exChangeTeleFeeHandler;
            _requestConfig.error = function (msg) {
                GUIFactory.getInstance().showBubbleBox("失败:" + msg);
            };
            _request.openHttpRequest(_requestConfig);
        }
    }

    private exChangeTeleFeeHandler(data): void {
        GUIFactory.getInstance().showBubbleBox("恭喜你，话费已兑换成功。24小时内到账，请注意查收！！");
        SystemCenter.playSystem.selfPlayerInfo.SaiquCoin -= this._selectCoin;
        this.txt_my_sq.text = "我的赛券:" + SystemCenter.playSystem.selfPlayerInfo.SaiquCoin + "";
        this.txt_dh_tips.text = "可兑换 " + SystemCenter.playSystem.selfPlayerInfo.SaiquCoin + " 元话费";
        SystemEvent.dispatchEvents(new SystemEvent(SystemEvent.UPDATA_PLAYERDATA));
    }

    private checkDh(): boolean {
        if (this._selectCoin > SystemCenter.playSystem.selfPlayerInfo.SaiquCoin) {
            GUIFactory.getInstance().showBubbleBox("您最多只能兑换" + SystemCenter.playSystem.selfPlayerInfo.SaiquCoin + "元话费");
            return false;
        }
        return true;
    }

    public destroy(): void {

    }
}