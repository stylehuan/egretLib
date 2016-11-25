/**
 * Created by stylehuan on 2016/11/18.
 */
class PhoneRegisterPanel extends egret.DisplayObjectContainer {
    public constructor() {
        super();
        this.init();
    }

    //手机号登录
    private _phone: SQ.TextBox;
    private _phone_pw: SQ.TextBox;
    private _phone_yzm: SQ.TextBox;
    private _phone_getYzm: SQ.Button;
    private _regBtn: SQ.Button;

    private _goLoginBtn: SQ.STTextField;
    private _getCodeString: SQ.STTextField;
    private _quickRegBtn: SQ.STTextField;

    private init(): void {
        this._phone = new SQ.TextBox("请输入手机号", "login.text_bg", "login.text_bg", 450);
        this._phone_pw = new SQ.TextBox("请输入密码", "login.text_bg", "login.text_bg", 450);
        this._phone_yzm = new SQ.TextBox("请再输入验证码", "login.text_bg", "login.text_bg", 450);


        this._phone_yzm.y = this._phone.y + this._phone.height + 20;
        this._phone_pw.y = this._phone_yzm.y + this._phone_yzm.height + 20;

        this.addChild(this._phone);
        this.addChild(this._phone_pw);
        this.addChild(this._phone_yzm);

        this._phone_getYzm = new SQ.Button("login.phone_yzm_btn_1", "login.phone_yzm_btn_2", "login.phone_yzm_btn_2");
        this.addChild(this._phone_getYzm);
        this._phone_getYzm.x = this._phone_yzm.x + this._phone_yzm.width - this._phone_getYzm.width - 12;
        this._phone_getYzm.y = this._phone_yzm.y + 2;
        this._phone_getYzm.addEventListener(egret.TouchEvent.TOUCH_TAP, this.getCodeHandler, this);

        //获取验证码文本
        this._getCodeString = new egret.TextField();
        this._getCodeString.text = "获取验证码";
        this._getCodeString.size = 30;
        this._getCodeString.x = this._phone_getYzm.x + 20;
        this._getCodeString.y = this._phone_getYzm.y + 15;
        this.addChild(this._getCodeString);

        this._regBtn = new SQ.Button("login.register_btn_1", "login.register_btn_1", "login.register_btn_2");
        this._regBtn.y = this.height + 50;
        this._regBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.submitRegHandler, this);

        this._goLoginBtn = new SQ.STTextField();
        this._goLoginBtn.text = "登录";
        this._goLoginBtn.size = 24;
        this._goLoginBtn.bold = true;
        this.addChild(this._goLoginBtn);
        this._goLoginBtn.x = this._regBtn.x + this._regBtn.width - this._goLoginBtn.width - 90;
        this._goLoginBtn.y = this._regBtn.y + 15 + this._regBtn.height;
        this._goLoginBtn.touchEnabled = true;
        this._goLoginBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLoginerHandler, this);

        this._quickRegBtn = new SQ.STTextField();
        this._quickRegBtn.text = "一键注册";
        this._quickRegBtn.size = 24;
        this._quickRegBtn.x = this._regBtn.x + 65;
        this._quickRegBtn.y = this._goLoginBtn.y;
        this._quickRegBtn.touchEnabled = true;
        this._quickRegBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.submitQuickRegHandler, this);

        this.addChild(this._quickRegBtn);
        this.addChild(this._regBtn);


        SystemEvent.addEventListener(SystemEvent.getYzmSuccess, this.sendYzmSuccessHandler, this);
    }

    private onLoginerHandler(e: egret.TouchEvent): void {
        SystemEvent.dispatchEvents(new SystemEvent(SystemEvent.trigger_login));
    }

    private submitQuickRegHandler(e: egret.TouchEvent):void{
        LoginManager.getInstance().sendQuickRegHandler();
    }

    private getCodeHandler(): void {
        var mobile: string = this._phone.text.trim();
        if (mobile == "") {
            GUIFactory.getInstance().showBubbleBox("请填写手机号码");
            return;
        }
        LoginManager.getInstance().getCodeHandler(mobile);
    }

    private getCodeTimer: egret.Timer;
    private leftSeconds: number;

    private sendYzmSuccessHandler(e: SystemEvent): void {
        SystemEvent.dispatchEvents(new SystemEvent(SystemEvent.getYzmSuccess));
        //等60秒才可点击第二次
        this._phone_getYzm.setDisable(false);
        this.getCodeTimer = new egret.Timer(1000, 30);
        this.leftSeconds = 60;
        this.getCodeTimer.addEventListener(egret.TimerEvent.TIMER, this.onTimeUpdate, this);
        this.getCodeTimer.start();
    }

    private onTimeUpdate(): void {
        this.leftSeconds--;
        this._getCodeString.text = "获取验证码(" + this.leftSeconds + ")";
        if (this.leftSeconds <= 0 && this.getCodeTimer != null) {
            this.getCodeTimer.stop();
            this.getCodeTimer.removeEventListener(egret.TimerEvent.TIMER, this.onTimeUpdate, this);
            this.getCodeTimer = null;

            this._getCodeString.text = "获取验证码";
            this._phone_getYzm.setDisable(true);
        }
    }

    private submitRegHandler(e: egret.TouchEvent): void {
        var phone: string = this._phone.text.trim();
        var pwd: string = this._phone_pw.text;
        var yzmCode: string = this._phone_yzm.text;
        LoginManager.getInstance().sendRegByPhone(phone, pwd, yzmCode)
    }
}